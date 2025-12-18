
import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import HealthInputForm from './components/HealthInputForm';
import RiskAssessment from './components/RiskAssessment';
import RecordsTable from './components/RecordsTable';
import { dataService } from './services/dataService';
import { geminiService } from './services/geminiService';
import { mlPredictor } from './services/mlService';
import { AuthState, CardioHealthData, AnalysisResult } from './types';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({ user: null, isAuthenticated: false });
  const [records, setRecords] = useState<CardioHealthData[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Auth Form State
  const [isRegistering, setIsRegistering] = useState(false);
  const [authForm, setAuthForm] = useState({ username: '', password: '', age: 25, gender: 'male' as const });
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const user = dataService.getCurrentUser();
    if (user) {
      setAuth({ user, isAuthenticated: true });
      setRecords(dataService.getRecords(user.id));
    }
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    let user;
    if (isRegistering) {
      user = dataService.register(authForm.username, authForm.password, authForm.age, authForm.gender);
      if (!user) setAuthError('Username already exists.');
    } else {
      user = dataService.login(authForm.username, authForm.password);
      if (!user) setAuthError('Invalid credentials.');
    }

    if (user) {
      setAuth({ user, isAuthenticated: true });
      setRecords(dataService.getRecords(user.id));
    }
  };

  const handleLogout = () => {
    dataService.logout();
    setAuth({ user: null, isAuthenticated: false });
    setRecords([]);
    setAnalysis(null);
  };

  const handleNewReading = useCallback(async (data: { age: number; gender: 'male' | 'female' | 'other'; hr: number; sbp: number; dbp: number }) => {
    if (!auth.user) return;
    
    setIsAnalyzing(true);
    
    // 1. Instant ML Prediction (Local Model Logic)
    const localRisk = mlPredictor.predict(data);

    const newRecord = dataService.addRecord({
      userId: auth.user.id,
      age: data.age,
      gender: data.gender,
      heartRate: data.hr,
      systolicBp: data.sbp,
      diastolicBp: data.dbp,
      timestamp: Date.now()
    });

    try {
      // 2. AI Augmentation (Gemini API)
      const result = await geminiService.analyzeHealthData(newRecord);
      // Ensure the AI risk level aligns with our ML categorization if possible, or use AI as superior
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      // Fallback to local prediction result if AI fails
      setAnalysis({
        riskLevel: localRisk,
        summary: "Analyzed via Local Random Forest model thresholds.",
        recommendations: ["Ensure your device has internet for full AI insights.", "Consult a doctor for abnormal readings."],
        anomalies: localRisk > 0 ? ["Elevated vitals detected by local baseline"] : []
      });
    } finally {
      setRecords(dataService.getRecords(auth.user.id));
      setIsAnalyzing(false);
    }
  }, [auth.user]);

  if (!auth.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-red-600 p-8 text-white text-center">
            <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
            <h1 className="text-3xl font-bold uppercase tracking-widest">CardioIntelli</h1>
            <p className="mt-2 opacity-80 font-medium">{isRegistering ? 'Research Enrollment' : 'Academic Portal Access'}</p>
          </div>
          <form onSubmit={handleAuth} className="p-8 space-y-4">
            {authError && <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">{authError}</div>}
            
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Username</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                placeholder="Unique Identifier"
                value={authForm.username}
                onChange={(e) => setAuthForm({...authForm, username: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                placeholder="Security Key"
                value={authForm.password}
                onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                required
              />
            </div>

            {isRegistering && (
              <div className="grid grid-cols-2 gap-4 animate-fadeIn">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Age</label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    value={authForm.age}
                    onChange={(e) => setAuthForm({...authForm, age: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Gender</label>
                  <select
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    value={authForm.gender}
                    onChange={(e) => setAuthForm({...authForm, gender: e.target.value as any})}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-red-700 transition-all shadow-lg shadow-red-200 mt-4"
            >
              {isRegistering ? 'Complete Registration' : 'Log In to System'}
            </button>
            
            <div className="text-center pt-2">
              <button 
                type="button" 
                onClick={() => { setIsRegistering(!isRegistering); setAuthError(''); }}
                className="text-sm font-medium text-red-600 hover:underline"
              >
                {isRegistering ? 'Already have an account? Login' : 'Need an account? Register for the study'}
              </button>
            </div>

            <p className="text-center text-[10px] text-gray-400 font-medium uppercase mt-4">
              Academic Project • Gemini AI & Machine Learning Integration
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar username={auth.user?.username} onLogout={handleLogout} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <header className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Heart Health Insights</h2>
              <p className="text-gray-500 mt-1 uppercase text-xs font-bold tracking-widest">Research ID: {auth.user?.id}</p>
            </div>
            <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-600">
               Status: <span className="text-green-600 font-bold">● System Active</span>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <Dashboard records={records} />
            <RecordsTable records={records} />
          </div>

          <div className="lg:col-span-4 space-y-8">
            <HealthInputForm onSubmit={handleNewReading} isAnalyzing={isAnalyzing} />
            <RiskAssessment result={analysis} />
          </div>
        </div>
      </main>

      <footer className="mt-12 py-8 border-t border-gray-200 text-center text-gray-400 text-sm">
        <p>&copy; 2024 Intelligent Cardio Monitoring Project. Built for educational purposes.</p>
      </footer>
    </div>
  );
};

export default App;
