
import React, { useState } from 'react';
import type { UserInfo } from '../types';

interface UserInfoFormProps {
  onComplete: (data: UserInfo) => void;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({ onComplete }) => {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ageNum = parseInt(age, 10);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (isNaN(ageNum) || isNaN(weightNum) || isNaN(heightNum) || ageNum <= 0 || weightNum <= 0 || heightNum <= 0) {
      setError('Por favor, insira valores válidos para todos os campos.');
      return;
    }
    setError('');
    onComplete({ age: ageNum, weight: weightNum, height: heightNum });
  };

  const InputField = ({ label, value, onChange, placeholder, type = 'number' }: { label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder: string, type?: string }) => (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
        min="1"
      />
    </div>
  );

  return (
    <div className="bg-slate-800/50 p-6 md:p-8 rounded-2xl shadow-lg border border-slate-700 animate-fade-in">
      <h2 className="text-2xl font-semibold text-center mb-1">Primeiros Passos</h2>
      <p className="text-center text-slate-400 mb-6">Precisamos de algumas informações para começar.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField label="Sua Idade" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Ex: 25" />
        <InputField label="Seu Peso (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Ex: 70.5" />
        <InputField label="Sua Altura (cm)" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="Ex: 175" />
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"
        >
          Continuar
        </button>
      </form>
    </div>
  );
};

export default UserInfoForm;
