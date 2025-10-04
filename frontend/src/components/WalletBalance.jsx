import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, TrendingUp, Eye, Sparkles, Zap } from 'lucide-react';

const WalletBalance = ({ wallet, transactionCount }) => {
  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [previousBalance, setPreviousBalance] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!wallet) return;

      setIsLoading(true);
      setError('');

      try {
        const balanceWei = await wallet.getBalance();
        const balanceEther = ethers.utils.formatEther(balanceWei);
        const formattedBalance = parseFloat(balanceEther).toFixed(4);
        
        if (balance !== null) {
          setPreviousBalance(balance);
        }
        setBalance(formattedBalance);
      } catch (err) {
        console.error("Error fetching balance:", err);
        setError('Could not fetch balance. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, [wallet, transactionCount]);

  const balanceChanged = previousBalance !== null && previousBalance !== balance;
  const balanceIncreased = balanceChanged && parseFloat(balance) > parseFloat(previousBalance);

  const renderContent = () => {
    if (isLoading) {
      return (
        <motion.div 
          className="flex items-center justify-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="relative"
          >
            <Loader2 className="w-8 h-8" style={{ color: '#00B49F' }} />
            <motion.div
              className="absolute inset-0 w-8 h-8 border-2 border-transparent border-t-[#00A48B] rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
          <motion.span 
            className="text-lg ml-3"
            style={{ color: '#00B49F' }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Fetching balance...
          </motion.span>
        </motion.div>
      );
    }

    if (error) {
      return (
        <motion.div 
          className="flex items-center justify-center py-8"
          style={{ color: '#00B49F' }}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 0.5 }}
          >
            <AlertCircle className="w-6 h-6 mr-3" />
          </motion.div>
          <span className="text-lg">{error}</span>
        </motion.div>
      );
    }

    return (
      <motion.div 
        className="text-center py-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
      >
        <div className="relative">
          <motion.div
            className="text-5xl font-bold text-teal-600 mb-2 relative"
            animate={balanceChanged ? { 
              scale: [1, 1.15, 1],
              textShadow: [
                "0 0 0px rgba(147,51,234,0.5)",
                "0 0 20px rgba(147,51,234,0.8)",
                "0 0 0px rgba(147,51,234,0.5)"
              ]
            } : {}}
            transition={{ duration: 0.8, type: "spring" }}
          >
            {/* Sparkle effects */}
            <AnimatePresence>
              {balanceChanged && (
                <>
                  <motion.div
                    className="absolute -top-2 -left-2"
                    initial={{ opacity: 0, scale: 0, rotate: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0], 
                      scale: [0, 1.2, 0],
                      rotate: [0, 180, 360]
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                  >
                    <Sparkles className="w-6 h-6 text-teal-300" />
                  </motion.div>
                  <motion.div
                    className="absolute -bottom-2 -right-2"
                    initial={{ opacity: 0, scale: 0, rotate: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0], 
                      scale: [0, 1, 0],
                      rotate: [0, -180, -360]
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                  >
                    <Zap className="w-5 h-5 text-teal-400" />
                  </motion.div>
                </>
              )}
            </AnimatePresence>
            
            <motion.span
              animate={balanceChanged ? {
                background: [
                  "linear-gradient(45deg, #0A1A16, #0A1A16)",
                  "linear-gradient(45deg, #00B49F, #00A48B)",
                  "linear-gradient(45deg, #0A1A16, #0A1A16)"
                ]
              } : {}}
              transition={{ duration: 1 }}
              style={{ backgroundClip: "text", WebkitBackgroundClip: "text" }}
            >
              {balance}
            </motion.span>
            
            <motion.span 
              className="text-2xl font-medium text-teal-400 ml-2"
              initial={{ opacity: 0.7 }}
              animate={{ 
                opacity: [0.7, 1, 0.7],
                color: balanceChanged ? ["#6BCFB0", "#00B49F", "#6BCFB0"] : "#6BCFB0"
              }}
              transition={{ 
                opacity: { duration: 2, repeat: Infinity },
                color: { duration: 1 }
              }}
            >
              tBDAG
            </motion.span>
          </motion.div>
          
          <AnimatePresence>
            {balanceChanged && (
              <motion.div
                className={`flex items-center justify-center text-sm font-medium ${
                  balanceIncreased ? 'text-green-400' : 'text-orange-400'
                }`}
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <motion.div
                  animate={{ 
                    rotate: balanceIncreased ? [0, 360] : [0, 180, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 0.6 }}
                >
                  <TrendingUp className={`w-4 h-4 mr-1 ${balanceIncreased ? '' : 'rotate-180'}`} />
                </motion.div>
                <motion.span
                  animate={{ 
                    textShadow: [
                      "0 0 0px currentColor",
                      "0 0 10px currentColor",
                      "0 0 0px currentColor"
                    ]
                  }}
                  transition={{ duration: 1, repeat: 2 }}
                >
                  Balance updated
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Balance Info */}
        <motion.div 
          className="mt-6 grid grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, staggerChildren: 0.1 }}
        >
          <motion.div 
            className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 relative overflow-hidden group"
            whileHover={{ 
              scale: 1.05,
              borderColor: "rgba(147,51,234,0.4)",
              boxShadow: "0 0 20px rgba(147,51,234,0.2)"
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />
            <div className="flex items-center justify-center mb-2 relative z-10">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Eye className="w-4 h-4 text-accent-light mr-2" />
              </motion.div>
              <span className="text-xs text-accent-light uppercase tracking-wide">Current Balance</span>
            </div>
            <motion.div 
              className="text-lg font-semibold text-accent relative z-10"
              whileHover={{ scale: 1.1 }}
            >
              {balance} tBDAG
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 relative overflow-hidden group"
            whileHover={{ 
              scale: 1.05,
              borderColor: "rgba(34,197,94,0.4)",
              boxShadow: "0 0 20px rgba(34,197,94,0.2)"
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />
            <div className="flex items-center justify-center mb-2 relative z-10">
              <motion.span 
                className="w-2 h-2 bg-green-400 rounded-full mr-2"
                animate={{ 
                  scale: [1, 1.3, 1],
                  boxShadow: [
                    "0 0 0 0 rgba(34,197,94,0.4)",
                    "0 0 0 6px rgba(34,197,94,0)",
                    "0 0 0 0 rgba(34,197,94,0.4)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-xs text-accent-light uppercase tracking-wide">Network</span>
            </div>
            <motion.div 
              className="text-lg font-semibold text-accent relative z-10"
              whileHover={{ scale: 1.1 }}
            >
              Testnet
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Balance Actions */}
        <motion.div 
          className="mt-6 flex justify-center space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            className="px-4 py-2 rounded-xl font-medium shadow-lg relative overflow-hidden group bg-gradient-to-r from-teal-600 to-teal-700 text-white"
            style={{ boxShadow: '0 2px 8px #00B49F' }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />
            <span className="relative z-10">Refresh Balance</span>
          </motion.button>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <motion.div
      className="max-w-xl mx-auto p-6"
      style={{ background: 'linear-gradient(180deg, #E8FFF5 0%, #C2F3E0 100%)', color: '#0A1A16', borderRadius: '1.5rem' }}
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
    >
      {/* Card Box */}
      <motion.div 
        className="glass rounded-2xl p-8 border border-white/10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
      >
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WalletBalance;
