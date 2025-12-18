
import React, { useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area
} from 'recharts';
import { CardioHealthData } from '../types';

interface DashboardProps {
  records: CardioHealthData[];
}

const Dashboard: React.FC<DashboardProps> = ({ records }) => {
  const chartData = useMemo(() => {
    return records.slice().reverse().map(r => ({
      time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      hr: r.heartRate,
      sbp: r.systolicBp,
      dbp: r.diastolicBp,
    }));
  }, [records]);

  const stats = useMemo(() => {
    if (records.length === 0) return null;
    const hrValues = records.map(r => r.heartRate);
    return {
      avgHr: Math.round(hrValues.reduce((a, b) => a + b, 0) / hrValues.length),
      maxHr: Math.max(...hrValues),
      minHr: Math.min(...hrValues),
      latestBp: `${records[0].systolicBp}/${records[0].diastolicBp}`
    };
  }, [records]);

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <p className="text-gray-500">No data records found. Start by adding your first reading.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Avg Heart Rate" value={`${stats?.avgHr} BPM`} color="text-blue-600" />
        <StatCard title="Max Heart Rate" value={`${stats?.maxHr} BPM`} color="text-red-600" />
        <StatCard title="Min Heart Rate" value={`${stats?.minHr} BPM`} color="text-green-600" />
        <StatCard title="Latest BP" value={stats?.latestBp || 'N/A'} color="text-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heart Rate Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Heart Rate Trend (BPM)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" />
                <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip />
                <Area type="monotone" dataKey="hr" stroke="#ef4444" fillOpacity={1} fill="url(#colorHr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Blood Pressure Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Blood Pressure Trend (mmHg)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sbp" name="Systolic" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="dbp" name="Diastolic" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string; color: string }> = ({ title, value, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
    <p className={`text-2xl font-bold mt-2 ${color}`}>{value}</p>
  </div>
);

export default Dashboard;
