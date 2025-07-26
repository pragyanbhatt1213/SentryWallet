import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, Wallet, Percent, Save, CheckCircle, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../utils/wallet';

const NomineeManager = ({ user }) => {
  const [nomineeEmail, setNomineeEmail] = useState('');
  const [nomineeAddress, setNomineeAddress] = useState('');
  const [sharePercentage, setSharePercentage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [nomineeData, setNomineeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const cardVariants = {
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

  // Fetch nominee data on mount and after save
  useEffect(() => {
    const fetchNominee = async () => {
      setIsLoading(true);
      if (!user) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('nominee_data')
        .eq('id', user.id)
        .single();
      if (!error && data && Array.isArray(data.nominee_data)) {
        setNomineeData(data.nominee_data);
      } else if (!error && data && data.nominee_data) {
        // If it's a single object (legacy), convert to array
        setNomineeData([data.nominee_data]);
      } else {
        setNomineeData([]);
      }
      setIsLoading(false);
    };
    fetchNominee();
  }, [user, showModal]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    // Basic validation
    if (!nomineeEmail || !nomineeAddress || !sharePercentage) {
      setError('All fields are required.');
      setIsSaving(false);
      return;
    }
    const share = parseInt(sharePercentage);
    if (isNaN(share) || share <= 0 || share > 100) {
      setError('Share percentage must be a number between 1 and 100.');
      setIsSaving(false);
      return;
    }

    // Validate total share
    const currentTotalShare = nomineeData.reduce((total, nominee) => {
      return total + (nominee.share || nominee.shareAmount || 0);
    }, 0);

    if (currentTotalShare + share > 100) {
      setError('Total share cannot exceed 100%.');
      setIsSaving(false);
      return;
    }

    try {
      // Get current nominees
      let currentNominees = Array.isArray(nomineeData) ? [...nomineeData] : [];
      // Add new nominee
      currentNominees.push({
        email: nomineeEmail,
        address: nomineeAddress,
        share: share,
      });
      const { error: supabaseError } = await supabase
        .from('profiles')
        .update({ nominee_data: currentNominees })
        .eq('id', user.id);
      if (supabaseError) {
        throw supabaseError;
      }
      setShowModal(true);
      setNomineeEmail('');
      setNomineeAddress('');
      setSharePercentage('');
    } catch (err) {
      setError('Failed to save nominee. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveNominee = async (indexToRemove) => {
    try {
      const updatedNominees = nomineeData.filter((_, index) => index !== indexToRemove);
      const { error: supabaseError } = await supabase
        .from('profiles')
        .update({ nominee_data: updatedNominees })
        .eq('id', user.id);
      if (supabaseError) {
        throw supabaseError;
      }
      setNomineeData(updatedNominees);
    } catch (err) {
      setError('Failed to remove nominee. Please try again.');
    }
  };

  const getTotalShare = () => {
    return nomineeData.reduce((total, nominee) => {
      return total + (nominee.share || nominee.shareAmount || 0);
    }, 0);
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div 
        className="text-center mb-12"
        variants={itemVariants}
      >
        <motion.div 
          className="w-20 h-20 mx-auto mb-6 glass rounded-3xl flex items-center justify-center"
          whileHover={{ scale: 1.1, rotateY: 15 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl"
          />
          <Users className="w-10 h-10 text-purple-400 relative z-10" />
        </motion.div>
        <h1 className="text-4xl font-bold text-white mb-4">
          Nominee Manager
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Set up trusted nominees who can inherit your digital assets. Configure their shares and contact information securely.
        </p>
      </motion.div>

      {/* Current Nominees Display */}
      <motion.div 
        className="mb-8"
        variants={itemVariants}
      >
        {isLoading ? (
          <motion.div 
            className="glass rounded-2xl p-6 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div
              className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-gray-300">Loading nominee details...</p>
          </motion.div>
        ) : nomineeData && nomineeData.length > 0 ? (
          <motion.div 
            className="glass rounded-2xl p-6 border border-white/10"
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Users className="w-6 h-6 mr-3 text-purple-400" />
                Your Nominees
              </h2>
              <motion.div 
                className="glass rounded-xl px-4 py-2 border border-white/10"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-sm text-gray-300">Total Share: </span>
                <span className="text-lg font-bold text-white">{getTotalShare()}%</span>
              </motion.div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                      <Wallet className="w-4 h-4 inline mr-2" />
                      Wallet Address
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                      <Percent className="w-4 h-4 inline mr-2" />
                      Share
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {nomineeData.map((nominee, idx) => (
                    <motion.tr 
                      key={idx} 
                      className="border-t border-white/10 hover:bg-white/5 transition-colors duration-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full flex items-center justify-center mr-3">
                            <Mail className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-white font-medium">{nominee.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <code className="text-sm text-gray-300 font-mono bg-white/5 rounded px-2 py-1 max-w-[200px] truncate">
                            {nominee.address}
                          </code>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <motion.div 
                          className="glass rounded-lg px-3 py-1 inline-flex items-center"
                          whileHover={{ scale: 1.05 }}
                        >
                          <span className="text-lg font-bold text-white">{nominee.share}%</span>
                        </motion.div>
                      </td>
                      <td className="py-4 px-4">
                        <motion.button
                          onClick={() => handleRemoveNominee(idx)}
                          className="text-red-400 hover:text-red-300 transition-colors duration-200 p-2 rounded-lg hover:bg-red-500/10"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Remove nominee"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="glass rounded-2xl p-8 text-center border border-white/10"
            variants={itemVariants}
          >
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300 text-lg">No nominees added yet.</p>
            <p className="text-gray-400 text-sm mt-2">Add your first nominee below to get started.</p>
          </motion.div>
        )}
      </motion.div>

      {/* Add New Nominee Form */}
      <motion.div 
        className="glass rounded-2xl p-8 border border-white/10"
        variants={itemVariants}
        whileHover={{ y: -2 }}
      >
        <motion.h2 
          className="text-2xl font-bold text-white mb-6 flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Plus className="w-6 h-6 mr-3 text-purple-400" />
          Add New Nominee
        </motion.h2>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              variants={itemVariants}
            >
              <label htmlFor="nomineeEmail" className="block text-sm font-medium text-gray-300 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Nominee's Email Address
              </label>
              <motion.input
                id="nomineeEmail"
                type="email"
                value={nomineeEmail}
                onChange={(e) => {
                  setNomineeEmail(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-3 glass border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200 text-white placeholder-gray-400"
                placeholder="nominee@example.com"
                required
                disabled={isSaving}
                whileFocus={{ scale: 1.02 }}
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
            >
              <label htmlFor="sharePercentage" className="block text-sm font-medium text-gray-300 mb-2">
                <Percent className="w-4 h-4 inline mr-2" />
                Share Percentage (1-{100 - getTotalShare()})
              </label>
              <motion.input
                id="sharePercentage"
                type="number"
                value={sharePercentage}
                onChange={(e) => {
                  setSharePercentage(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-3 glass border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200 text-white placeholder-gray-400"
                placeholder={`e.g., ${Math.min(50, 100 - getTotalShare())} for ${Math.min(50, 100 - getTotalShare())}%`}
                required
                min="1"
                max={100 - getTotalShare()}
                disabled={isSaving}
                whileFocus={{ scale: 1.02 }}
              />
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
          >
            <label htmlFor="nomineeAddress" className="block text-sm font-medium text-gray-300 mb-2">
              <Wallet className="w-4 h-4 inline mr-2" />
              Nominee's Wallet Address
            </label>
            <motion.input
              id="nomineeAddress"
              type="text"
              value={nomineeAddress}
              onChange={(e) => {
                setNomineeAddress(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 glass border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200 text-white placeholder-gray-400 font-mono"
              placeholder="0x..."
              required
              disabled={isSaving}
              whileFocus={{ scale: 1.02 }}
            />
          </motion.div>

          {error && (
            <motion.div
              className="glass border border-red-400/30 text-red-300 px-4 py-3 rounded-xl flex items-center"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
            >
              <AlertCircle className="w-5 h-5 mr-3 text-red-400" />
              {error}
            </motion.div>
          )}

          <motion.button
            type="submit"
            className={`w-full flex items-center justify-center px-6 py-4 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden ${
              isSaving || error || getTotalShare() >= 100
                ? 'glass cursor-not-allowed border border-white/20 text-gray-400' 
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg'
            }`}
            disabled={isSaving || !!error || getTotalShare() >= 100}
            whileHover={!isSaving && !error && getTotalShare() < 100 ? { scale: 1.02, y: -2 } : {}}
            whileTap={!isSaving && !error && getTotalShare() < 100 ? { scale: 0.98 } : {}}
          >
            {!(isSaving || error || getTotalShare() >= 100) && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center">
              {isSaving ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Save className="w-5 h-5 mr-2" />
                </motion.div>
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}
              {isSaving ? 'Saving...' : getTotalShare() >= 100 ? 'Maximum Share Reached' : 'Save Nominee'}
            </span>
          </motion.button>
        </form>
      </motion.div>

      {/* Success Modal */}
      {showModal && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="glass rounded-3xl p-8 shadow-2xl text-center max-w-md mx-4 border border-white/20 relative overflow-hidden"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            />
            
            <motion.div 
              className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-green-500/30 to-blue-500/30 rounded-2xl flex items-center justify-center relative z-10"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
            >
              <CheckCircle className="w-8 h-8 text-green-400" />
            </motion.div>
            
            <motion.h2 
              className="text-2xl font-bold text-white mb-4 relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Nominee Added Successfully!
            </motion.h2>
            
            <motion.p 
              className="text-gray-300 mb-6 relative z-10"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              The nominee details have been saved securely to your profile.
            </motion.p>
            
            <motion.button
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 relative z-10"
              onClick={() => setShowModal(false)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Close
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default NomineeManager;