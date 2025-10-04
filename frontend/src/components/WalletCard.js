import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Copy, 
  Send, 
  ExternalLink, 
  Loader2, 
  Check,
  Wallet,
  AlertCircle 
} from 'lucide-react';
import { isValidAddress } from '../utils/blockdag';

const WalletCard = ({ 
  wallet, 
  balance, 
  isActive, 
  onSend, 
  latestTxHash,
  isLoading,
  onSetActive 
}) => {
  const [showSendForm, setShowSendForm] = useState(false);
  const [sendForm, setSendForm] = useState({
    to: '',
    amount: ''
  });
  const [sendLoading, setSendLoading] = useState(false);
  const [sendError, setSendError] = useState('');
  const [copied, setCopied] = useState('');

  const handleCopy = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(''), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleSendFormSubmit = async (e) => {
    e.preventDefault();
    setSendLoading(true);
    setSendError('');

    try {
      // Validate inputs
      if (!sendForm.to || !sendForm.amount) {
        throw new Error('Please fill in all fields');
      }

      if (!isValidAddress(sendForm.to)) {
        throw new Error('Invalid recipient address');
      }

      if (isNaN(parseFloat(sendForm.amount)) || parseFloat(sendForm.amount) <= 0) {
        throw new Error('Please enter a valid amount greater than 0');
      }

      if (parseFloat(sendForm.amount) > parseFloat(balance)) {
        throw new Error(`Insufficient balance. Available: ${parseFloat(balance).toFixed(4)} BDAG`);
      }

      // Call the send function
      await onSend({
        from: wallet.address,
        to: sendForm.to,
        amount: sendForm.amount
      });

      // Reset form on success
      setSendForm({ to: '', amount: '' });
      setShowSendForm(false);
    } catch (error) {
      setSendError(error.message);
    } finally {
      setSendLoading(false);
    }
  };

  const cardVariants = {
    initial: { scale: 0.95, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: { 
      scale: 1.02,
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <motion.div
      className={`rounded-3xl p-6 ${isActive ? 'ring-2 shadow-xl' : ''} cursor-pointer`}
      style={{ background: isActive ? 'linear-gradient(180deg, #C2F3E0 0%, #A5F0D8 100%)' : 'linear-gradient(180deg, #E8FFF5 0%, #C2F3E0 100%)', color: '#0A1A16', borderColor: isActive ? '#00B49F' : '#A5F0D8' }}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      onClick={() => onSetActive(wallet.id)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: isActive ? 'rgba(0, 180, 159, 0.3)' : 'rgba(0, 180, 159, 0.2)' }}>
            <Wallet className="w-6 h-6" style={{ color: isActive ? '#00A48B' : '#00B49F' }} />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-bold" style={{ color: '#00B49F' }}>
              {wallet.name || 'Wallet'}
            </h3>
            <p className="text-sm" style={{ color: '#1B2E29' }}>
              {formatAddress(wallet.address)}
            </p>
          </div>
        </div>
        {isActive && (
          <div className="px-3 py-1 text-xs font-medium rounded-full" style={{ background: 'rgba(0, 180, 159, 0.3)', color: '#0A1A16' }}>
            Active
          </div>
        )}
      </div>

      {/* Address */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" style={{ color: '#00B49F' }}>
          Wallet Address
        </label>
        <div className="flex items-center justify-between rounded-xl p-3" style={{ background: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(10px)' }}>
          <span className="text-sm font-mono" style={{ color: '#0A1A16' }}>
            {formatAddress(wallet.address)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopy(wallet.address, 'address');
            }}
            style={{ color: '#00B49F' }}
            title="Copy address"
          >
            {copied === 'address' ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Balance */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2" style={{ color: '#00B49F' }}>
          Balance
        </label>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold" style={{ color: '#00B49F' }}>
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-6 h-6 border-2 border-[#00B49F] border-t-transparent rounded-full animate-spin mr-2"></div>
                Loading...
              </div>
            ) : (
              `${parseFloat(balance).toFixed(4)} BDAG`
            )}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowSendForm(!showSendForm);
            }}
            className="flex items-center px-4 py-2 rounded-xl"
            style={{ background: 'linear-gradient(90deg, #00C1A0 0%, #00A48B 100%)', color: '#fff' }}
            disabled={isLoading || parseFloat(balance) <= 0}
          >
            <Send className="w-4 h-4 mr-2" />
            Send
          </button>
        </div>
      </div>

      {/* Send Form */}
      {showSendForm && (
        <motion.div
          className="border-t pt-4"
          style={{ borderColor: 'rgba(255, 255, 255, 0.4)' }}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <form onSubmit={handleSendFormSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#00B49F' }}>
                Recipient Address
              </label>
              <input
                type="text"
                value={sendForm.to}
                onChange={(e) => setSendForm({ ...sendForm, to: e.target.value })}
                className="w-full px-4 py-3 rounded-xl focus:ring-2 outline-none"
                style={{ border: '1px solid rgba(255, 255, 255, 0.4)', background: 'rgba(255, 255, 255, 0.25)', color: '#0A1A16', backdropFilter: 'blur(10px)' }}
                placeholder="0x..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#00B49F' }}>
                Amount (BDAG)
              </label>
              <input
                type="number"
                step="0.0001"
                value={sendForm.amount}
                onChange={(e) => setSendForm({ ...sendForm, amount: e.target.value })}
                className="w-full px-4 py-3 rounded-xl focus:ring-2 outline-none"
                style={{ border: '1px solid rgba(255, 255, 255, 0.4)', background: 'rgba(255, 255, 255, 0.25)', color: '#0A1A16', backdropFilter: 'blur(10px)' }}
                placeholder="0.0000"
                max={balance}
                required
              />
              <p className="text-xs mt-1" style={{ color: '#00B49F' }}>
                Available: {parseFloat(balance).toFixed(4)} BDAG
              </p>
            </div>
            {sendError && (
              <div className="flex items-center text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-2" />
                {sendError}
              </div>
            )}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowSendForm(false);
                  setSendForm({ to: '', amount: '' });
                  setSendError('');
                }}
                className="flex-1 px-4 py-3 border rounded-xl"
                style={{ border: '1px solid rgba(255, 255, 255, 0.4)', color: '#0A1A16', background: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(10px)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={sendLoading}
                className="flex-1 flex items-center justify-center px-4 py-3 rounded-xl"
                style={{ background: 'linear-gradient(90deg, #00C1A0 0%, #00A48B 100%)', color: '#fff', opacity: sendLoading ? 0.5 : 1 }}
              >
                {sendLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send BDAG
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Latest Transaction */}
      {latestTxHash && (
        <div className="mt-4 pt-4 border-t">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Latest Transaction
          </label>
          <div className="flex items-center justify-between bg-green-50 rounded-xl p-3">
            <span className="text-sm text-green-800 font-mono">
              {formatAddress(latestTxHash)}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(latestTxHash, 'tx');
                }}
                className="text-green-600 hover:text-green-800 transition-colors"
                title="Copy transaction hash"
              >
                {copied === 'tx' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <a
                href={`https://testnet-explorer.blockdag.network/tx/${latestTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-800 transition-colors"
                title="View on explorer"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default WalletCard;