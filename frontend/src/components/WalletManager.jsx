import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
import { Loader2, Key, Eye, EyeOff, Shield, ArrowLeft } from 'lucide-react';
import { 
  createAndSaveWallet, 
  loadAndDecryptWallet, 
  getEncryptedWalletFromSupabase 
} from '../utils/wallet';
import WalletDashboard from './WalletDashboard';

const WalletManager = ({ user, onBack, initialSection }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasWallet, setHasWallet] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [decryptedWallet, setDecryptedWallet] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const checkWalletExists = async () => {
      if (!user) return;
      
      setIsLoading(true);
      setError('');
      
      try {
        const encryptedWallet = await getEncryptedWalletFromSupabase(user.id);
        setHasWallet(!!encryptedWallet);
      } catch (err) {
        setError('Could not check wallet status. Please try again.');
        setHasWallet(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkWalletExists();
  }, [user]);

  const handleCreateWallet = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const wallet = await createAndSaveWallet(password, user.id);
      setDecryptedWallet(wallet);
    } catch (err) {
      setError(err.message || 'Failed to create wallet.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlockWallet = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const wallet = await loadAndDecryptWallet(password, user.id);
      setDecryptedWallet(wallet);
    } catch (err) {
      setError('Incorrect password or failed to decrypt wallet.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    setDecryptedWallet(null);
    setPassword('');
    setConfirmPassword('');
    setError('');
    onBack();
  };

  // Render Loading State
  if (isLoading && hasWallet === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-lg text-white">Loading Wallet...</p>
        </motion.div>
      </div>
    );
  }

  // Render Success State
  if (decryptedWallet) {
    const provider = new ethers.providers.JsonRpcProvider("https://rpc.primordial.bdagscan.com");
    const connectedWallet = decryptedWallet.connect(provider);
    return (
      <WalletDashboard 
        wallet={connectedWallet} 
        onBack={handleBackToDashboard}
        user={user}
      />
    );
  }

  // Common Form Styling
  const inputGroupClass = "relative mb-4";
  const inputClass = "w-full pl-4 pr-10 py-3 border border-white/20 bg-white/10 backdrop-blur-lg text-white placeholder-gray-400 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200";
  const buttonClass = `w-full flex items-center justify-center px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg'}`;

  // Render Create or Unlock Form
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8">
          {/* Back Button */}
          <motion.button
            onClick={onBack}
            className="flex items-center text-gray-300 hover:text-white transition-colors mb-6 group"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:text-purple-400 transition-colors" />
            Back to Dashboard
          </motion.button>

          <div className="text-center mb-8">
            <motion.div 
              className="w-20 h-20 mx-auto mb-6 bg-purple-500/20 rounded-3xl flex items-center justify-center border border-purple-400/30"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Key className="w-10 h-10 text-purple-400" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {hasWallet ? 'Unlock Your Wallet' : 'Create a Wallet Password'}
            </h1>
            <p className="text-gray-300">
              {hasWallet 
                ? 'Enter your password to decrypt and access your wallet.'
                : 'This password will encrypt your wallet. Store it safely.'
              }
            </p>
          </div>

          {error && (
            <motion.div
              className="bg-red-500/20 border border-red-400/30 text-red-300 px-4 py-3 rounded-lg mb-6 backdrop-blur-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={hasWallet ? handleUnlockWallet : handleCreateWallet}>
            <div className={inputGroupClass}>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 mt-3 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {!hasWallet && (
              <div className={inputGroupClass}>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                  placeholder="Confirm your password"
                  required
                />
              </div>
            )}

            <motion.button
              type="submit"
              className={buttonClass}
              disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.02, y: -2 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Shield className="w-5 h-5 mr-2" />
                  {hasWallet ? 'Unlock Wallet' : 'Create Wallet'}
                </>
              )}
            </motion.button>
          </form>
        
        </div>
      </motion.div>
    </div>
  );
};

export default WalletManager;
