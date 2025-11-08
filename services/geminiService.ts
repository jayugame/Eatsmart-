import { GoogleGenAI, Type } from "@google/genai";
import { UserPreferences, MealPlan, FoodAnalysis } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING, description: "A unique ID for the recipe, can be a slug of the name." },
    name: { type: Type.STRING },
    description: { type: Type.STRING },
    ingredients: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    instructions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    calories: { type: Type.NUMBER },
    protein: { type: Type.NUMBER },
    carbs: { type: Type.NUMBER },
    fat: { type: Type.NUMBER },
    imageUrl: { type: Type.STRING, description: "A placeholder image URL from picsum.photos." },
  },
  required: ["id", "name", "description", "ingredients", "instructions", "calories", "protein", "carbs", "fat", "imageUrl"],
};

const mealPlanSchema = {
  type: Type.OBJECT,
  properties: {
    dailyPlan: {
      type: Type.OBJECT,
      properties: {
        breakfast: recipeSchema,
        lunch: recipeSchema,
        dinner: recipeSchema,
        snacks: recipeSchema,
      },
      required: ["breakfast", "lunch", "dinner", "snacks"],
    },
    totalCalories: {
      type: Type.NUMBER,
      description: "The sum of calories from all recipes in the plan."
    },
  },
  required: ["dailyPlan", "totalCalories"],
};

const foodAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "The name of the food item identified." },
        calories: { type: Type.NUMBER, description: "Estimated calories for the serving size." },
        protein: { type: Type.NUMBER, description: "Estimated protein in grams." },
        carbs: { type: Type.NUMBER, description: "Estimated carbohydrates in grams." },
        fat: { type: Type.NUMBER, description: "Estimated fat in grams." },
        servingSize: { type: Type.STRING, description: "The estimated serving size shown in the image (e.g., '100g', '1 slice', '1 bowl')." }
    },
    required: ["name", "calories", "protein", "carbs", "fat", "servingSize"],
};


export const generateMealPlan = async (preferences: UserPreferences): Promise<MealPlan> => {
  const { dietType, calorieGoal, preference } = preferences;

  const prompt = `
    You are an expert nutritionist and chef creating a personalized daily meal plan.
    User Preferences:
    - Diet Type: ${dietType}
    - Daily Calorie Goal: Approximately ${calorieGoal} calories
    - General Preference: ${preference}

    Please generate a complete one-day meal plan with a unique recipe for breakfast, lunch, dinner, and a snack.
    For each recipe:
    - Create a unique, appealing name.
    - Write a short, enticing description.
    - List ingredients with precise quantities.
    - Provide clear, step-by-step instructions.
    - Calculate nutritional information: calories, protein (g), carbs (g), and fat (g).
    - Generate a placeholder image URL using the format: \`https://picsum.photos/seed/RECIPE_NAME_SLUG/500/300\`, where RECIPE_NAME_SLUG is a URL-friendly version of the recipe name (e.g., 'avocado-toast-with-egg').
    - Generate a unique ID for the recipe based on its name.

    The total calories for all meals combined must be as close as possible to the user's ${calorieGoal} calorie goal.
    Return the entire plan in the specified JSON format. Do not include any markdown formatting.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: mealPlanSchema,
      },
    });

    const jsonText = response.text.trim();
    const mealPlanData = JSON.parse(jsonText);

    // Validate the structure slightly
    if (!mealPlanData.dailyPlan || !mealPlanData.totalCalories) {
        throw new Error("Invalid meal plan structure received from API.");
    }
    
    return mealPlanData as MealPlan;
  } catch (error) {
    console.error("Error generating meal plan:", error);
    throw new Error("Failed to generate meal plan. The model may be overloaded. Please try again later.");
  }
};

const parseDataUrl = (dataUrl: string) => {
    const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
    if (!match) {
        throw new Error("Invalid data URL");
    }
    return { mimeType: match[1], data: match[2] };
};

export const analyzeFoodImage = async (imageDataUrl: string): Promise<FoodAnalysis> => {
    const { mimeType, data } = parseDataUrl(imageDataUrl);

    const prompt = `
        Analyze the food item in this image.
        Identify the food and provide an estimated nutritional breakdown for the serving size shown.
        Return the result in the specified JSON format.
    `;
    
    const imagePart = {
        inlineData: {
            mimeType,
            data,
        },
    };
    
    const textPart = {
        text: prompt,
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [textPart, imagePart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: foodAnalysisSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const analysisData = JSON.parse(jsonText);
        
        return analysisData as FoodAnalysis;
    } catch (error) {
        console.error("Error analyzing food image:", error);
        throw new Error("Failed to analyze the image. The model might be busy or the image could not be processed. Please try again.");
    }
};
