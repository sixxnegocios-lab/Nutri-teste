
import React, { useState } from 'react';
import type { UserInfo } from './types';
import UserInfoForm from './components/UserInfoForm';
import CalorieCounter from './components/CalorieCounter';

function App() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const handleUserInfoSubmit = (data: UserInfo) => {
    setUserInfo(data);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-4">
      <header className="w-full max-w-2xl text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
          NutriScan AI
        </h1>
        <p className="text-slate-400 mt-2">
          Sua calculadora de nutrientes inteligente
        </p>
      </header>
      <main className="w-full max-w-2xl">
        {!userInfo ? (
          <UserInfoForm onComplete={handleUserInfoSubmit} />
        ) : (
          <CalorieCounter userInfo={userInfo} />
        )}
      </main>
    </div>
  );
}

export default App;
