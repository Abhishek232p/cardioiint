
import React, { useState } from 'react';

interface HealthInputFormProps {
  onSubmit: (data: { age: number; gender: 'male' | 'female' | 'other'; hr: number; sbp: number; dbp: number }) => void;
  isAnalyzing: boolean;
}

const HealthInputForm: React.FC<HealthInputFormProps> = ({ onSubmit, isAnalyzing }) => {
  const [formData, setFormData] = useState({
    age: 25,
    gender: 'male' as const,
    hr: 75,
    sbp: 120,
    dbp: 80
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'gender' ? value : Number(value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold mb-6 text-gray-800">New Health Reading</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate (BPM)</label>
            <input
              type="range"
              min="40"
              max="200"
              name="hr"
              value={formData.hr}
              onChange={handleChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>40 BPM</span>
              <span className="font-bold text-red-600">{formData.hr} BPM</span>
              <span>200 BPM</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Systolic BP</label>
              <input
                type="number"
                name="sbp"
                value={formData.sbp}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diastolic BP</label>
              <input
                type="number"
                name="dbp"
                value={formData.dbp}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isAnalyzing}
          className={`w-full py-3 px-4 rounded-lg text-white font-bold transition-all ${
            isAnalyzing ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200'
          }`}
        >
          {isAnalyzing ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              AI Analyzing...
            </span>
          ) : 'Save & Analyze Vitals'}
        </button>
      </form>
    </div>
  );
};

export default HealthInputForm;
