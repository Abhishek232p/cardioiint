
import React from 'react';
import { CardioHealthData } from '../types';

interface RecordsTableProps {
  records: CardioHealthData[];
}

const RecordsTable: React.FC<RecordsTableProps> = ({ records }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Historical Records</h3>
        <button className="text-blue-600 text-sm font-medium hover:underline">Export PDF (Mock)</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-bold">
            <tr>
              <th className="px-6 py-3">Timestamp</th>
              <th className="px-6 py-3">HR (BPM)</th>
              <th className="px-6 py-3">BP (mmHg)</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {records.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(r.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                </td>
                <td className="px-6 py-4">
                  <span className={`font-bold ${r.heartRate > 100 || r.heartRate < 60 ? 'text-red-600' : 'text-gray-900'}`}>
                    {r.heartRate}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {r.systolicBp}/{r.diastolicBp}
                </td>
                <td className="px-6 py-4">
                    {r.systolicBp >= 140 || r.diastolicBp >= 90 ? (
                        <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Hyper</span>
                    ) : (
                        <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Normal</span>
                    )}
                </td>
              </tr>
            ))}
            {records.length === 0 && (
                <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400 italic text-sm">No data entries yet.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecordsTable;
