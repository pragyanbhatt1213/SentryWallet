import React, { useState } from 'react';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, Send, CheckCircle } from 'lucide-react';
import { getContract } from '../utils/ethersUtils';

const SendTransaction = ({ wallet, onTransactionSuccess }) => {
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [txHash, setTxHash] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!toAddress || !amount) {
      setError('Please fill in both fields.');
      return;
    }
    if (!ethers.utils.isAddress(toAddress)) {
      setError('Invalid recipient address.');
      return;
    }

    setIsLoading(true);
    setError('');
    setTxHash('');

    try {
      const tx = {
        to: toAddress,
        value: ethers.utils.parseEther(amount),
        gasLimit: 21000, // Fixed gas limit for simple transfers
      };

      const transaction = await wallet.sendTransaction(tx);
      setTxHash(`Transaction sent! Hash: ${transaction.hash}`);
      
      // Wait for transaction confirmation
      await transaction.wait();

      // Try to update contract activity, but don't fail the whole process if this fails
      try {
        const contract = getContract(wallet);
        await contract.updateActivity();
      } catch (contractError) {
        console.log('Contract update failed (non-critical):', contractError);
        // Don't show error to user since main transaction succeeded
      }

      // Notify parent component of success
      if (onTransactionSuccess) {
        onTransactionSuccess();
      }

      // Reset form
      setToAddress('');
      setAmount('');

    } catch (err) {
      console.error("Transaction failed:", err);
      // Only show error if the main transaction actually failed
      if (!txHash) {
        setError('Transaction failed. Please check your balance and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 border border-white/20 bg-white/10 backdrop-blur-lg text-white placeholder-gray-400 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200";
  const buttonClass = `w-full flex items-center justify-center px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg'}`;

  return (
    <motion.div
      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="text-center mb-8">
        <motion.div 
          className="w-16 h-16 mx-auto mb-4 bg-purple-500/20 rounded-2xl flex items-center justify-center border border-purple-400/30"
          whileHover={{ scale: 1.05, rotate: 5 }}
        >
          <Send className="w-8 h-8 text-purple-400" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">Send tBDAG</h2>
        <p className="text-gray-300">Transfer tokens to another address</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Recipient Address
          </label>
          <input
            type="text"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            className={inputClass}
            placeholder="0x..."
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Amount (tBDAG)
          </label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={inputClass}
            placeholder="0.0"
            required
            disabled={isLoading}
          />
        </div>

        {error && (
          <motion.div
            className="bg-red-500/20 border border-red-400/30 text-red-300 px-4 py-3 rounded-lg backdrop-blur-lg flex items-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
        
        {txHash && (
          <motion.div
            className="bg-green-500/20 border border-green-400/30 text-green-300 px-4 py-3 rounded-lg backdrop-blur-lg flex items-start"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <span className="break-all text-sm">{txHash}</span>
          </motion.div>
        )}

        <motion.button
          type="submit"
          className={buttonClass}
          disabled={isLoading}
          whileHover={!isLoading ? { scale: 1.02, y: -2 } : {}}
          whileTap={!isLoading ? { scale: 0.98 } : {}}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Sending Transaction...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Send tBDAG
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default SendTransaction;
