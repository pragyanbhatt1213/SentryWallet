import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, ExternalLink, Trash2, Activity } from 'lucide-react';
import { 
  getTransactionHistory, 
  clearTransactionHistory, 
  formatTransactionHash, 
  getExplorerUrl, 
  formatTimestamp 
} from '../utils/history';

const TransactionHistory = ({ transactionCount = 0 }) => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Reusable function to load transaction history
  const loadHistory = () => {
    setIsLoading(true);
    try {
      const history = getTransactionHistory();
      setTransactions(history);
      console.log('Transaction history loaded:', history.length, 'transactions');
    } catch (error) {
      console.error('Error loading transaction history:', error);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load transaction history on component mount and when transactionCount changes
  useEffect(() => {
    loadHistory();
  }, [transactionCount]); // Refresh when transactionCount changes

  // Set up interval to refresh history every 30 seconds
  useEffect(() => {
    const interval = setInterval(loadHistory, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleClearHistory = () => {
    clearTransactionHistory();
    setTransactions([]);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
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

  if (isLoading) {
    return (
      <motion.div 
        className="glass rounded-2xl p-6 border border-white/10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex items-center justify-center">
          <motion.div
            className="w-6 h-6 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mr-3"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-300">Loading transaction history...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="glass rounded-2xl p-6 border border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <motion.h2 
          className="text-2xl font-bold text-white flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Activity className="w-6 h-6 mr-3 text-purple-400" />
          Recent Activity
        </motion.h2>
        
        {transactions.length > 0 && (
          <motion.button
            onClick={handleClearHistory}
            className="text-gray-400 hover:text-red-400 transition-colors duration-200 p-2 rounded-lg hover:bg-red-500/10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Clear history"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      {/* Transaction List */}
      {transactions.length === 0 ? (
        <motion.div 
          className="text-center py-8"
          variants={itemVariants}
        >
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-300 text-lg">No recent transactions</p>
          <p className="text-gray-400 text-sm mt-2">
            Your transaction history will appear here as you use the wallet.
          </p>
        </motion.div>
      ) : (
        <motion.div 
          className="space-y-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {transactions.map((transaction, index) => (
            <motion.div
              key={transaction.id || `${transaction.hash}_${index}`}
              className="flex items-center justify-between p-4 glass rounded-xl border border-white/10 hover:bg-white/5 transition-colors duration-200"
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              {/* Transaction Info */}
              <div className="flex items-center flex-1">
                <motion.div 
                  className="w-10 h-10 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full flex items-center justify-center mr-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {transaction.type.includes('Send') ? (
                    <motion.div
                      className="w-5 h-5 text-purple-400"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      ↗
                    </motion.div>
                  ) : (
                    <motion.div
                      className="w-5 h-5 text-blue-400"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      👥
                    </motion.div>
                  )}
                </motion.div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{transaction.type}</span>
                    <span className="text-gray-400 text-sm">
                      {formatTimestamp(transaction.timestamp)}
                    </span>
                  </div>
                  <div className="flex items-center mt-1">
                    <code className="text-sm text-gray-300 font-mono bg-white/5 rounded px-2 py-1">
                      {formatTransactionHash(transaction.hash)}
                    </code>
                  </div>
                </div>
              </div>

              {/* Explorer Link */}
              <motion.a
                href={getExplorerUrl(transaction.hash)}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-4 p-2 text-purple-400 hover:text-purple-300 transition-colors duration-200 rounded-lg hover:bg-purple-500/10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="View on BlockDAG Explorer"
              >
                <ExternalLink className="w-4 h-4" />
              </motion.a>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Footer Info */}
      {transactions.length > 0 && (
        <motion.div 
          className="mt-6 pt-4 border-t border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-gray-400 text-sm text-center">
            Showing {transactions.length} recent transaction{transactions.length !== 1 ? 's' : ''} 
            • History is stored locally for this session
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TransactionHistory;