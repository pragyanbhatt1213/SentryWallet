import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, DollarSign, Send, UserPlus, ArrowLeft, Shield } from 'lucide-react';
import WalletBalance from './WalletBalance';
import SendTransaction from './SendTransaction';
import NomineeManager from './NomineeManager';
import { supabase } from '../utils/wallet';

const WalletDashboard = ({ wallet, onBack, user }) => {
  const [transactionCount, setTransactionCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(user || null);

  useEffect(() => {
    const getUser = async () => {
      if (!currentUser) {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);
      }
    };
    getUser();
  }, [currentUser]);

  if (!wallet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-xl">No wallet found. Please go back and try again.</p>
          <button
            onClick={onBack}
            className="mt-4 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleTransactionSuccess = () => {
    setTransactionCount(prev => prev + 1);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <motion.header 
        className="border-b border-white/10 bg-white/10 backdrop-blur-lg sticky top-0 z-40"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <motion.button
            onClick={onBack}
            className="flex items-center text-gray-300 hover:text-white transition-colors group"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:text-purple-400 transition-colors" />
            Back to Dashboard
          </motion.button>
          
          <div className="flex items-center">
            <Shield className="w-6 h-6 text-purple-400 mr-2" />
            <span className="text-xl font-bold text-white">Wallet Dashboard</span>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Welcome Section */}
          <motion.div 
            className="text-center mb-12"
            variants={itemVariants}
          >
            <motion.div 
              className="w-20 h-20 mx-auto mb-6 bg-white/10 backdrop-blur-lg rounded-3xl flex items-center justify-center border border-white/20"
              whileHover={{ scale: 1.1, rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Wallet className="w-10 h-10 text-purple-400" />
            </motion.div>
            
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome to Your{" "}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Wallet Dashboard
              </span>
            </h1>
            
            <motion.p 
              className="text-gray-300 text-sm font-mono bg-white/10 backdrop-blur-lg rounded-lg p-3 max-w-2xl mx-auto border border-white/20"
              whileHover={{ scale: 1.02 }}
            >
              {wallet.address}
            </motion.p>
          </motion.div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Wallet Operations */}
            <motion.div 
              className="space-y-8"
              variants={itemVariants}
            >
              {/* Balance Card */}
              <motion.div
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-lg relative overflow-hidden group"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                />
                
                <div className="flex items-center mb-6 relative z-10">
                  <motion.div
                    className="w-12 h-12 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-2xl flex items-center justify-center mr-4"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <DollarSign className="w-6 h-6 text-green-400" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white group-hover:text-green-200 transition-colors">
                    Wallet Balance
                  </h2>
                </div>
                
                <div className="relative z-10">
                  <WalletBalance wallet={wallet} transactionCount={transactionCount} />
                </div>
              </motion.div>

              {/* Send Transaction Card */}
              <motion.div
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-lg relative overflow-hidden group"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                />
                
                <div className="flex items-center mb-6 relative z-10">
                  <motion.div
                    className="w-12 h-12 bg-gradient-to-br from-purple-500/30 to-violet-500/30 rounded-2xl flex items-center justify-center mr-4"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Send className="w-6 h-6 text-purple-400" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white group-hover:text-purple-200 transition-colors">
                    Send Transaction
                  </h2>
                </div>
                
                <div className="relative z-10">
                  <SendTransaction wallet={wallet} onTransactionSuccess={handleTransactionSuccess} />
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column: Nominee Manager */}
            <motion.div
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-lg relative overflow-hidden group"
              variants={itemVariants}
              whileHover={{ scale: 1.01, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
              />
              
              <div className="flex items-center mb-6 relative z-10">
                <motion.div
                  className="w-12 h-12 bg-gradient-to-br from-orange-500/30 to-amber-500/30 rounded-2xl flex items-center justify-center mr-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <UserPlus className="w-6 h-6 text-orange-400" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white group-hover:text-orange-200 transition-colors">
                  Nominee Manager
                </h2>
              </div>
              
              <div className="relative z-10">
                <NomineeManager user={currentUser} />
              </div>
            </motion.div>
          </div>

          {/* Network Status */}
          <motion.div
            className="mt-12 text-center py-8 bg-white/10 backdrop-blur-lg border border-purple-400/20 rounded-3xl relative overflow-hidden"
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5"
              animate={{ 
                background: [
                  "linear-gradient(45deg, rgba(147,51,234,0.05) 0%, rgba(59,130,246,0.05) 100%)",
                  "linear-gradient(135deg, rgba(147,51,234,0.05) 0%, rgba(59,130,246,0.05) 100%)",
                  "linear-gradient(225deg, rgba(147,51,234,0.05) 0%, rgba(59,130,246,0.05) 100%)",
                  "linear-gradient(315deg, rgba(147,51,234,0.05) 0%, rgba(59,130,246,0.05) 100%)",
                  "linear-gradient(45deg, rgba(147,51,234,0.05) 0%, rgba(59,130,246,0.05) 100%)"
                ]
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-4">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="w-3 h-3 bg-green-400 rounded-full mr-3"></span>
                </motion.div>
                <h3 className="text-xl font-bold text-white">
                  Connected to{" "}
                  <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    BlockDAG Testnet
                  </span>
                </h3>
              </div>
              
              <p className="text-gray-300 max-w-2xl mx-auto">
                Your wallet is securely connected to the BlockDAG testnet. 
                All transactions are processed with enterprise-grade security.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default WalletDashboard;
