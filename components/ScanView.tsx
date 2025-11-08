import React, { useState, useRef } from 'react';
import { CameraIcon, UploadIcon, ScanIcon } from './Icons';
import { analyzeFoodImage } from '../services/geminiService';
import { FoodAnalysis } from '../types';

const ScanView: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const takePhotoRef = useRef<HTMLInputElement>(null);
  const uploadPhotoRef = useRef<HTMLInputElement>(null);

  const handleImageAnalysis = async (imageDataUrl: string) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    try {
        const result = await analyzeFoodImage(imageDataUrl);
        setAnalysisResult(result);
    } catch (e: any) {
        setError(e.message || "An unknown error occurred.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result as string;
        setImagePreview(imageDataUrl);
        handleImageAnalysis(imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetScan = () => {
    setImagePreview(null);
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
    if (takePhotoRef.current) takePhotoRef.current.value = '';
    if (uploadPhotoRef.current) uploadPhotoRef.current.value = '';
  };

  return (
    <div className="w-full bg-slate-900 p-6 flex flex-col items-center">
      {!imagePreview ? (
        <>
            <h1 className="text-3xl font-bold text-slate-100 mb-2">Scan Your Food</h1>
            <p className="text-slate-400 mb-8 text-center">Take a photo or upload an image of a food item to get its nutritional details.</p>
            <div className="w-full max-w-sm space-y-4">
                <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    ref={takePhotoRef}
                    onChange={handleFileChange}
                    className="hidden"
                />
                <button
                    onClick={() => takePhotoRef.current?.click()}
                    className="w-full flex items-center justify-center gap-3 bg-teal-500 text-slate-900 font-bold py-4 px-6 rounded-full shadow-lg hover:bg-teal-600 transition-all duration-300 transform hover:scale-105"
                >
                <CameraIcon className="w-6 h-6" />
                <span>Take Photo</span>
                </button>

                <input
                    type="file"
                    accept="image/*"
                    ref={uploadPhotoRef}
                    onChange={handleFileChange}
                    className="hidden"
                />
                <button
                    onClick={() => uploadPhotoRef.current?.click()}
                    className="w-full flex items-center justify-center gap-3 bg-slate-700 text-slate-200 font-bold py-4 px-6 rounded-full shadow-lg border border-slate-600 hover:bg-slate-600 transition-all duration-300 transform hover:scale-105"
                >
                <UploadIcon className="w-6 h-6" />
                <span>Upload Photo</span>
                </button>
            </div>
        </>
      ) : (
        <div className="w-full max-w-md flex flex-col items-center">
            <div className="w-full max-w-md mb-8">
                <img src={imagePreview} alt="Selected food" className="rounded-2xl shadow-lg w-full h-auto" />
            </div>

            {isLoading && (
                <div className="text-center p-8">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
                    <p className="mt-4 text-slate-400 font-semibold">Analyzing your food...</p>
                </div>
            )}

            {error && (
                <div className="w-full max-w-md text-center p-4 my-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg">
                    <h3 className="font-bold">Analysis Failed</h3>
                    <p>{error}</p>
                </div>
            )}

            {analysisResult && (
                <div className="w-full max-w-md bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700 animate-fade-in-up">
                    <h3 className="text-2xl font-bold text-slate-100 mb-1 text-center">{analysisResult.name}</h3>
                    <p className="text-slate-400 text-sm mb-4 text-center">Serving Size: {analysisResult.servingSize}</p>
                    <div className="grid grid-cols-2 gap-4 text-center mb-4">
                        <div className="bg-teal-900/60 p-3 rounded-lg">
                            <p className="text-xl font-bold text-teal-300">{Math.round(analysisResult.calories)}</p>
                            <p className="text-sm text-slate-400">Calories</p>
                        </div>
                        <div className="bg-sky-900/60 p-3 rounded-lg">
                            <p className="text-xl font-bold text-sky-300">{Math.round(analysisResult.protein)}g</p>
                            <p className="text-sm text-slate-400">Protein</p>
                        </div>
                        <div className="bg-orange-900/60 p-3 rounded-lg">
                            <p className="text-xl font-bold text-orange-300">{Math.round(analysisResult.carbs)}g</p>
                            <p className="text-sm text-slate-400">Carbs</p>
                        </div>
                        <div className="bg-rose-900/60 p-3 rounded-lg">
                            <p className="text-xl font-bold text-rose-300">{Math.round(analysisResult.fat)}g</p>
                            <p className="text-sm text-slate-400">Fat</p>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 text-center italic">Nutritional information is an estimate.</p>
                </div>
            )}

            {imagePreview && !isLoading && (
                <div className="w-full max-w-sm mt-8">
                    <button
                        onClick={resetScan}
                        className="w-full flex items-center justify-center gap-3 bg-teal-500 text-slate-900 font-bold py-4 px-6 rounded-full shadow-lg hover:bg-teal-600 transition-all duration-300"
                    >
                        <ScanIcon className="w-6 h-6" />
                        <span>Scan Another Item</span>
                    </button>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default ScanView;