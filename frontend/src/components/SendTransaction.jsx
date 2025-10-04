
import React, { useState } from 'react';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, Send, CheckCircle } from 'lucide-react';
import SentryInheritance from '../contracts/SentryInheritance.json';
import { addLocalTransaction } from '../utils/localHistory';
import { supabase } from '../utils/wallet';

const contractAddress = process.env.REACT_APP_INHERITANCE_CONTRACT_ADDRESS;

const SendTransaction = ({ wallet, onTransactionSuccess }) => {
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [txHash, setTxHash] = useState('');

  const getContract = (signer) => {
    return new ethers.Contract(contractAddress, SentryInheritance, signer);
  };

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
      const receipt = await transaction.wait();

      // Create a log object with details from the transaction
      const txLog = {
        type: 'Sent tBDAG',
        date: new Date().toISOString(),
        details: `Sent ${amount} tBDAG to ${toAddress}`,
        txHash: receipt.transactionHash,
      };

      // Save the log to localStorage with user ID
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        addLocalTransaction(txLog, user.id);
      }



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

  const inputClass = "w-full px-4 py-3 border rounded-2xl focus:ring-2 outline-none transition-all duration-200";
  const inputStyle = { border: '1px solid rgba(255, 255, 255, 0.4)', background: 'rgba(255, 255, 255, 0.25)', color: '#0A1A16', backdropFilter: 'blur(10px)' };
  const buttonClass = `w-full flex items-center justify-center px-6 py-4 rounded-xl font-semibold transition-all duration-300`;
  const buttonStyle = isLoading
  ? { background: 'rgba(255, 255, 255, 0.25)', color: '#1B2E29', cursor: 'not-allowed', opacity: 0.7 }
  : { background: 'linear-gradient(90deg, #00C1A0 0%, #00A48B 100%)', color: '#fff', boxShadow: '0 2px 8px #00B49F' };

  return (
    <motion.div
      className="max-w-xl mx-auto p-6"
      style={{ background: 'linear-gradient(180deg, #E8FFF5 0%, #C2F3E0 100%)', color: '#0A1A16', borderRadius: '1.5rem' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      {/* Header */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div 
          className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(0, 180, 159, 0.2)', borderRadius: '1.5rem', border: '1px solid rgba(0, 180, 159, 0.3)' }}
          whileHover={{ scale: 1.1, rotateY: 15 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Send className="w-8 h-8" style={{ color: '#00B49F' }} />
        </motion.div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#0A1A16' }}>Send tBDAG</h2>
        <p style={{ color: '#1B2E29' }}>Transfer tokens to another address</p>
      </motion.div>

      {/* Card Box */}
      <motion.div 
        className="glass rounded-2xl p-8 border border-white/10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#00B49F' }}>
              Recipient Address
            </label>
            <input
              type="text"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              className={inputClass}
              style={inputStyle}
              placeholder="0x..."
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#00B49F' }}>
              Amount (tBDAG)
            </label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={inputClass}
              style={inputStyle}
              placeholder="0.0"
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <motion.div
              className="glass border border-red-400/30 text-red-300 px-4 py-3 rounded-xl flex items-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {txHash && (
            <motion.div
              className="glass border border-green-400/30 text-green-400 px-4 py-3 rounded-xl flex items-start"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span className="break-all text-sm">{txHash}</span>
            </motion.div>
          )}

          <motion.button
            type="submit"
            className={buttonClass + ' mt-4'}
            style={buttonStyle}
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
    </motion.div>
  );
};

export default SendTransaction;

