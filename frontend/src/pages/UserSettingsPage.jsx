import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Save, CheckCircle, AlertCircle, Loader2, Shield } from 'lucide-react';
import { supabase } from '../utils/wallet';

const UserSettingsPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: ''
  });

  useEffect(() => {
    const checkAuthAndLoadProfile = async () => {
      try {
        // Check authentication
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        
        if (authError || !session) {
          navigate('/login');
          return;
        }

        setUser(session.user);
        
        // Populate form with current user data
        setFormData({
          fullName: session.user.user_metadata?.full_name || '',
          email: session.user.email || ''
        });
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoadProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear messages when user types
    setError('');
    setSuccess('');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Validate input
      if (!formData.fullName.trim()) {
        setError('Full name is required.');
        setSaving(false);
        return;
      }

      // Update user metadata
      const { data, error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: formData.fullName.trim()
        }
      });

      if (updateError) {
        throw updateError;
      }

      setSuccess('Profile updated successfully!');
      
      // Update local user state
      setUser(prev => ({
        ...prev,
        user_metadata: {
          ...prev.user_metadata,
          full_name: formData.fullName.trim()
        }
      }));

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E8FFF5] via-[#C2F3E0] to-[#A5F0D8] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-teal-500 mx-auto mb-4" />
          <p className="text-accent">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8FFF5] via-[#C2F3E0] to-[#A5F0D8] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            rotate: [0, 360, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-12 h-12 bg-[#C2F3E0]/40 rounded-full blur-sm"
        />
        <motion.div
          animate={{
            y: [20, -20, 20],
            x: [10, -10, 10],
            rotate: [360, 0, 360]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 right-1/4 w-8 h-8 bg-[#A5F0D8]/30 rounded-full blur-sm"
        />
        <motion.div
          animate={{
            y: [-15, 15, -15],
            x: [15, -15, 15],
            rotate: [0, 180, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/3 w-6 h-6 bg-[#8CE0C0]/40 rounded-full blur-sm"
        />
      </div>

      {/* Header */}
      <header className="border-b border-[#A5F0D8]/30 bg-[#C2F3E0]/30 backdrop-blur-lg sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <motion.button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-accent hover:text-teal-600 transition-colors duration-300 glass rounded-xl px-4 py-2"
            whileHover={{ x: -5, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </motion.button>
          
          <div className="flex items-center">
            <User className="w-6 h-6 text-teal-500 mr-2" />
            <span className="text-xl font-bold text-accent">Profile Settings</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Page Title */}
          <motion.div 
            className="text-center mb-12"
            variants={itemVariants}
          >
            <motion.div 
              className="w-20 h-20 mx-auto mb-6 bg-teal-500/20 rounded-3xl flex items-center justify-center border border-teal-400/30"
              whileHover={{ scale: 1.1, rotateY: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <User className="w-10 h-10 text-teal-500" />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-accent mb-4">
              Profile Settings
            </h1>
            
            <p className="text-xl text-accent-light max-w-3xl mx-auto leading-relaxed">
              Manage your account information and preferences for your SentryWallet.
            </p>
          </motion.div>

          {/* Success Message */}
          {success && (
            <motion.div
              className="mb-8 glass border border-green-400/30 text-green-600 px-6 py-4 rounded-2xl flex items-center"
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
            >
              <CheckCircle className="w-5 h-5 mr-3 text-green-500" />
              <span>{success}</span>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              className="mb-8 glass border border-red-400/30 text-red-600 px-6 py-4 rounded-2xl flex items-center"
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
            >
              <AlertCircle className="w-5 h-5 mr-3 text-red-500" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Profile Form */}
          <motion.div
            className="glass rounded-2xl p-8 border border-white/10"
            variants={itemVariants}
            whileHover={{ y: -2 }}
          >
            <motion.h2 
              className="text-2xl font-bold text-accent mb-8 flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <User className="w-6 h-6 mr-3 text-teal-400" />
              Account Information
            </motion.h2>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {/* Full Name Field */}
              <motion.div
                variants={itemVariants}
              >
                <label htmlFor="fullName" className="block text-sm font-medium text-accent-light mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                <motion.input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 glass border border-white/20 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none transition-all duration-200 text-accent placeholder-accent-light"
                  placeholder="Enter your full name"
                  required
                  disabled={saving}
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.div>

              {/* Email Field (Read-only) */}
              <motion.div
                variants={itemVariants}
              >
                <label htmlFor="email" className="block text-sm font-medium text-accent-light mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <motion.input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  className="w-full px-4 py-3 glass border border-white/20 rounded-xl bg-white/10 text-accent-light cursor-not-allowed"
                  disabled
                  readOnly
                />
                <p className="text-xs text-accent-light mt-2">
                  Email address cannot be changed. Contact support if you need to update your email.
                </p>
              </motion.div>

              {/* Account Info Display */}
              <motion.div
                className="grid md:grid-cols-2 gap-6 pt-6 border-t border-white/10"
                variants={itemVariants}
              >
                <div>
                  <label className="block text-sm font-medium text-accent-light mb-2">
                    Login Method
                  </label>
                  <div className="glass rounded-xl px-4 py-3 border border-white/10">
                    <p className="text-accent font-medium flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-teal-500" />
                      {user?.app_metadata?.provider === 'google' ? 'Google OAuth' : 'Email & Password'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-accent-light mb-2">
                    Account Created
                  </label>
                  <div className="glass rounded-xl px-4 py-3 border border-white/10">
                    <p className="text-accent font-medium">
                      {new Date(user?.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Save Button */}
              <motion.button
                type="submit"
                className={`w-full flex items-center justify-center px-6 py-4 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden ${
                  saving || !formData.fullName.trim()
                    ? 'glass cursor-not-allowed border border-white/20 text-accent-light' 
                    : 'bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white shadow-lg'
                }`}
                disabled={saving || !formData.fullName.trim()}
                whileHover={!saving && formData.fullName.trim() ? { scale: 1.02, y: -2 } : {}}
                whileTap={!saving && formData.fullName.trim() ? { scale: 0.98 } : {}}
              >
                {!(saving || !formData.fullName.trim()) && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center">
                  {saving ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="w-5 h-5 mr-2" />
                    </motion.div>
                  ) : (
                    <Save className="w-5 h-5 mr-2" />
                  )}
                  {saving ? 'Saving Changes...' : 'Save Changes'}
                </span>
              </motion.button>
            </form>
          </motion.div>

          {/* Security Notice */}
          <motion.div
            className="mt-8 text-center py-8 glass border border-teal-400/20 rounded-3xl relative overflow-hidden"
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-teal-600/5"
              animate={{ 
                background: [
                  "linear-gradient(0deg, rgba(0,180,159,0.05) 0%, rgba(0,164,139,0.05) 100%)",
                  "linear-gradient(90deg, rgba(0,180,159,0.05) 0%, rgba(0,164,139,0.05) 100%)",
                  "linear-gradient(180deg, rgba(0,180,159,0.05) 0%, rgba(0,164,139,0.05) 100%)",
                  "linear-gradient(270deg, rgba(0,180,159,0.05) 0%, rgba(0,164,139,0.05) 100%)",
                  "linear-gradient(0deg, rgba(0,180,159,0.05) 0%, rgba(0,164,139,0.05) 100%)"
                ]
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-teal-500 mr-3" />
                <h3 className="text-xl font-bold text-accent">
                  Your Data is{" "}
                  <span className="bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">
                    Secure
                  </span>
                </h3>
              </div>
              
              <p className="text-accent-light max-w-3xl mx-auto leading-relaxed">
                All profile information is encrypted and stored securely. Your wallet data remains 
                protected with industry-standard encryption.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default UserSettingsPage;