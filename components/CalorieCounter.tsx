
import React, { useState, useRef } from 'react';
import type { UserInfo, NutritionalInfo } from '../types';
import { getNutritionalInfo } from '../services/geminiService';
import Spinner from './Spinner';
import CameraIcon from './icons/CameraIcon';

interface CalorieCounterProps {
  userInfo: UserInfo;
}

const CalorieCounter: React.FC<CalorieCounterProps> = ({ userInfo }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [nutritionalInfo, setNutritionalInfo] = useState<NutritionalInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setNutritionalInfo(null);
    setError(null);
    setLoading(true);

    try {
      const result = await getNutritionalInfo(file, userInfo);
      setNutritionalInfo(result);
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro desconhecido.");
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const InfoCard = ({ label, value, unit }: { label: string, value: number | string, unit: string }) => (
    <div className="bg-slate-800 p-4 rounded-lg text-center flex-1 min-w-[120px]">
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-2xl font-bold text-green-400">
        {typeof value === 'number' ? value.toFixed(1) : value} <span className="text-base text-slate-300">{unit}</span>
      </p>
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      <div className="w-full bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700 flex flex-col items-center gap-4">
        {imagePreview ? (
          <img src={imagePreview} alt="Pré-visualização do alimento" className="rounded-lg max-h-64 w-auto object-cover" />
        ) : (
          <div className="w-full h-48 border-2 border-dashed border-slate-600 rounded-lg flex flex-col justify-center items-center text-slate-400">
            <CameraIcon className="w-12 h-12 mb-2" />
            <span>Aguardando uma foto...</span>
          </div>
        )}
        <button
          onClick={triggerFileInput}
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed"
        >
          {imagePreview ? 'Tirar Outra Foto' : 'Tirar Foto ou Escolher Imagem'}
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center gap-2 text-slate-300">
          <Spinner />
          <p>Analisando imagem... Isso pode levar alguns segundos.</p>
        </div>
      )}

      {error && (
        <div className="w-full bg-red-900/50 border border-red-700 p-4 rounded-lg text-center text-red-300">
          <p><strong>Erro:</strong> {error}</p>
        </div>
      )}

      {nutritionalInfo && !loading && (
        <div className="w-full bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700 animate-fade-in">
          <h2 className="text-2xl font-bold text-center mb-4 text-green-400">{nutritionalInfo.foodName}</h2>
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <InfoCard label="Calorias" value={nutritionalInfo.calories} unit="kcal" />
            <InfoCard label="Proteínas" value={nutritionalInfo.protein} unit="g" />
            <InfoCard label="Carbs" value={nutritionalInfo.carbohydrates} unit="g" />
            <InfoCard label="Peso" value={nutritionalInfo.grams} unit="g" />
          </div>
          <div className="bg-slate-800 p-4 rounded-lg">
            <h3 className="font-semibold text-slate-300 mb-1">Feedback da IA:</h3>
            <p className="text-slate-400">{nutritionalInfo.feedback}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalorieCounter;
