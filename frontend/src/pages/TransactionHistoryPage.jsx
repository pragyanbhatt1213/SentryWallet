// In src/pages/TransactionHistoryPage.jsx
import React, { useState, useEffect } from 'react';
import { getLocalHistory } from '../utils/localHistory';
import { supabase } from '../utils/wallet'; // Adjust path if needed
import { ArrowLeft, Clock, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TransactionHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllHistory = async () => {
      setLoading(true);

      // 1. Get current user and sent transactions from localStorage
      const { data: { user } } = await supabase.auth.getUser();
      const localTxs = user ? getLocalHistory(user.id) : [];

      // 2. Get nominee data from Supabase as a form of history
      let nomineeHistory = [];

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('nominee_data')
          .eq('id', user.id)
          .single();

        if (profile && profile.nominee_data) {
          nomineeHistory = profile.nominee_data.map(nominee => ({
            type: 'Nominee Added',
            date: new Date().toISOString(), // Using current date as a placeholder
            details: `Nominee with email ${nominee.email} was added.`,
            txHash: 'N/A - Supabase',
          }));
        }
      }

      // 3. Combine both histories
      const combinedHistory = [...localTxs, ...nomineeHistory];

      // 4. Sort by date, newest first
      combinedHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

      setHistory(combinedHistory);
      setLoading(false);
    };

    fetchAllHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-teal-900 text-white p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center gap-2 text-teal-300 hover:text-teal-100 transition-colors"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
        <h1 className="text-xl font-semibold text-gray-300">Transaction History</h1>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center gap-4 mb-6">
            <Clock className="text-teal-300" size={32} />
            <h2 className="text-2xl font-bold">Recent Activity</h2>
          </div>

          {loading ? (
            <p className="text-center text-gray-400">Loading history...</p>
          ) : history.length > 0 ? (
            <ul className="space-y-4">
              {history.map((item, index) => (
                <li 
                  key={index} 
                  className="bg-black/20 p-4 rounded-lg border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                >
                  <div>
                    <p className="font-bold text-teal-300">{item.type}</p>
                    <p className="text-sm text-gray-300">{item.details}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Date: {new Date(item.date).toLocaleString()}
                    </p>
                  </div>
                  <a 
                    href={`https://testnet.blockdag.network/tx/${item.txHash}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs text-blue-400 hover:underline whitespace-nowrap"
                  >
                    {item.txHash.startsWith('0x') ? `${item.txHash.substring(0, 10)}...` : item.txHash}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <Info size={48} className="mx-auto text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold">No Activity Found</h3>
              <p className="text-gray-400 mt-2">
                Your history will appear here once you send tBDAG or add a nominee.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistoryPage;