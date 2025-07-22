
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, DollarSign, Send, UserPlus } from 'lucide-react';
import WalletBalance from './WalletBalance';
import SendTransaction from './SendTransaction';
import NomineeManager from './NomineeManager';
import { supabase } from '../utils/wallet';

const WalletDashboard = ({ wallet }) => {
  const [transactionCount, setTransactionCount] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  if (!wallet) {
    return null;
  }

  const handleTransactionSuccess = () => {
    setTransactionCount(prev => prev + 1);
  };

  return (
    <div className="px-6 py-10 bg-gray-50 min-h-screen w-full mx-auto max-w-7xl">
      <div className="mb-6">
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200 ease-in-out flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          Back to Dashboard
        </button>
      </div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Welcome to Your Wallet Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Wallet */}
        <div className="relative bg-white rounded-xl shadow-md p-6 space-y-6 transition-all duration-200 ease-in-out hover:shadow-lg">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-100 to-blue-200 flex items-center justify-center animate-pulse mx-auto mb-4">
              <Wallet className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Your Wallet</h1>
            <p className="text-gray-500 text-sm font-mono truncate bg-gray-100 rounded-lg p-2 max-w-[400px] mx-auto">
              {wallet.address}
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                Balance
              </h2>
              <WalletBalance wallet={wallet} transactionCount={transactionCount} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                <Send className="w-5 h-5 mr-2 text-purple-600" />
                Send Transaction
              </h2>
              <SendTransaction wallet={wallet} onTransactionSuccess={handleTransactionSuccess} />
            </div>
          </div>
        </div>

        {/* Right Column: Nominee Manager */}
        <div className="relative bg-white rounded-xl shadow-md p-6 space-y-4 transition-all duration-200 ease-in-out hover:shadow-lg">
          <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
            <UserPlus className="w-5 h-5 mr-2 text-orange-600" />
            Nominee Manager
          </h2>
          <NomineeManager user={user} />
        </div>
      </div>
    </div>
  );
};

export default WalletDashboard;
