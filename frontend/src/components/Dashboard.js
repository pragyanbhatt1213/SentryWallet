import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, LogOut, User, Wallet, Settings, ArrowRight, AlertCircle, CheckCircle, Sparkles, Zap, Star } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import WalletManager from './WalletManager';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWalletManager, setShowWalletManager] = useState(false);
  const [initialSection, setInitialSection] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          setError('Authentication error. Please try logging in again.');
          navigate('/login');
          return;
        }

        if (!session) {
          navigate('/login');
          return;
        }

        setUser(session.user);
      } catch (error) {
        setError('Failed to load user session. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!session) {
          navigate('/login');
        } else {
          setUser(session.user);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError('Failed to logout. Please try again.');
      } else {
        navigate('/');
      }
    } catch (error) {
      setError('Network error during logout. Please check your connection.');
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

  const cardHoverVariants = {
    hover: {
      scale: 1.02,
      y: -10,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-purple-400/30 rounded-full"
              initial={{ 
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000)
              }}
              animate={{
                y: -100,
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
        
        <motion.div 
          className="text-center relative z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-20 h-20 mx-auto mb-6 bg-white/10 backdrop-blur-lg rounded-3xl flex items-center justify-center border border-white/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Shield className="w-10 h-10 text-purple-300" />
          </motion.div>
          
          <motion.div
            className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          />
          
          <motion.p 
            className="text-purple-200 font-medium text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Loading your dashboard...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (showWalletManager) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <WalletManager 
          user={user} 
          onBack={() => setShowWalletManager(false)} 
          initialSection={initialSection}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            rotate: [0, 360, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-12 h-12 bg-purple-400/20 rounded-full blur-sm"
        />
        <motion.div
          animate={{
            y: [20, -20, 20],
            x: [10, -10, 10],
            rotate: [360, 0, 360]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 right-1/4 w-8 h-8 bg-blue-400/30 rounded-full blur-sm"
        />
        <motion.div
          animate={{
            y: [-15, 15, -15],
            x: [15, -15, 15],
            rotate: [0, 180, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/3 w-6 h-6 bg-purple-300/40 rounded-full blur-sm"
        />
      </div>

      {/* Header */}
      <motion.header 
        className="border-b border-white/10 bg-white/10 backdrop-blur-lg sticky top-0 z-40"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Shield className="w-8 h-8 text-purple-400 mr-3" />
            </motion.div>
            <span className="text-2xl font-bold text-white">SentryWallet</span>
          </motion.div>
          
          <div className="flex items-center space-x-4">
            {user?.user_metadata?.avatar_url && (
              <motion.img 
                src={user.user_metadata.avatar_url} 
                alt="Avatar" 
                className="w-10 h-10 rounded-full border-2 border-purple-400/30"
                whileHover={{ scale: 1.1, rotate: 5 }}
              />
            )}
            <div className="hidden md:block">
              <span className="text-white font-medium block">
                {user?.user_metadata?.full_name || 'User'}
              </span>
              <span className="text-sm text-gray-300">
                {user?.email}
              </span>
            </div>
            <motion.button
              onClick={handleLogout}
              className="flex items-center text-gray-300 hover:text-white transition-colors duration-300 p-2 rounded-lg bg-white/10 backdrop-blur-lg border border-white/20"
              title="Logout"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Error Message */}
          {error && (
            <motion.div
              className="mb-8 bg-red-500/10 backdrop-blur-lg border border-red-400/30 text-red-300 px-6 py-4 rounded-2xl flex items-center shadow-lg"
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
            >
              <AlertCircle className="w-5 h-5 mr-3 text-red-400" />
              <span>{error}</span>
              <motion.button
                onClick={() => setError('')}
                className="ml-auto text-red-400 hover:text-red-300 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ×
              </motion.button>
            </motion.div>
          )}

          {/* Welcome Section */}
          <motion.div 
            className="text-center mb-12"
            variants={itemVariants}
          >
            <motion.div 
              className="w-24 h-24 mx-auto mb-6 bg-white/10 backdrop-blur-lg rounded-3xl flex items-center justify-center relative overflow-hidden group border border-white/20"
              whileHover={{ scale: 1.1, rotateY: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <CheckCircle className="w-12 h-12 text-green-400 relative z-10" />
              <motion.div
                className="absolute inset-0 bg-white/10"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-6xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Welcome to{" "}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                SentryWallet
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              Your secure crypto wallet is ready to use on the BlockDAG network. 
              Create wallets, manage your funds, and enjoy gasless transactions.
            </motion.p>
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            className="flex justify-center mb-12"
            variants={itemVariants}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 text-center group w-full max-w-xl relative overflow-hidden"
              variants={cardHoverVariants}
              whileHover="hover"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
              />
              
              <motion.div 
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-2xl flex items-center justify-center relative overflow-hidden"
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                <Wallet className="w-10 h-10 text-white relative z-10" />
              </motion.div>
              
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-200 transition-all duration-300">
                Your Wallet
              </h3>
              <p className="text-gray-300 mb-6 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                Create and manage your crypto wallets with secure encryption and social recovery features.
              </p>
              
              <motion.button 
                onClick={() => setShowWalletManager(true)}
                className="flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-medium shadow-lg relative overflow-hidden group"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                <Wallet className="w-4 h-4 mr-2 relative z-10" />
                <span className="relative z-10">Open My Wallet</span>
                <ArrowRight className="w-4 h-4 ml-2 relative z-10" />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* User Info Card */}
          <motion.div
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-lg w-full max-w-4xl mx-auto mb-12 relative overflow-hidden"
            variants={itemVariants}
            whileHover={{ scale: 1.01, y: -5 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300"
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
            />
            
            <motion.h2 
              className="text-3xl font-bold text-white mb-8 flex items-center justify-center relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <User className="w-8 h-8 mr-4 text-purple-400" />
              </motion.div>
              Account Information
            </motion.h2>
            
            <div className="grid md:grid-cols-2 gap-8 relative z-10">
              <div className="space-y-6">
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Email Address
                  </label>
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl px-4 py-3 border border-white/10">
                    <p className="text-white font-medium flex items-center">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      </motion.div>
                      {user?.email}
                    </p>
                  </div>
                </motion.div>
                
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Full Name
                  </label>
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl px-4 py-3 border border-white/10">
                    <p className="text-white font-medium">
                      {user?.user_metadata?.full_name || 'Not provided'}
                    </p>
                  </div>
                </motion.div>
              </div>

              <div className="space-y-6">
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Last Sign In
                  </label>
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl px-4 py-3 border border-white/10">
                    <p className="text-white font-medium">
                      {new Date(user?.last_sign_in_at).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
                
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Account Created
                  </label>
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl px-4 py-3 border border-white/10">
                    <p className="text-white font-medium">
                      {new Date(user?.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            className="grid md:grid-cols-3 gap-6 mb-12"
            variants={containerVariants}
          >
            {[
              {
                icon: Shield,
                title: "Secure & Protected",
                description: "Your wallet is protected with advanced encryption",
                color: "from-purple-500 to-purple-700",
                delay: 0.1
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Experience instant transactions on BlockDAG",
                color: "from-blue-500 to-blue-700",
                delay: 0.2
              },
              {
                icon: Star,
                title: "Premium Experience",
                description: "Enjoy gasless transactions and premium features",
                color: "from-purple-600 to-blue-600",
                delay: 0.3
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center group relative overflow-hidden"
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                />
                
                <motion.div
                  className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center relative z-10`}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-200 transition-all duration-300 relative z-10">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors duration-300 relative z-10">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* BlockDAG Network Info */}
          <motion.div
            className="text-center py-12 bg-white/10 backdrop-blur-lg border border-purple-400/20 rounded-3xl relative overflow-hidden"
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5"
              animate={{ 
                background: [
                  "linear-gradient(0deg, rgba(147,51,234,0.05) 0%, rgba(59,130,246,0.05) 100%)",
                  "linear-gradient(90deg, rgba(147,51,234,0.05) 0%, rgba(59,130,246,0.05) 100%)",
                  "linear-gradient(180deg, rgba(147,51,234,0.05) 0%, rgba(59,130,246,0.05) 100%)",
                  "linear-gradient(270deg, rgba(147,51,234,0.05) 0%, rgba(59,130,246,0.05) 100%)",
                  "linear-gradient(0deg, rgba(147,51,234,0.05) 0%, rgba(59,130,246,0.05) 100%)"
                ]
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            
            <div className="relative z-10">
              <motion.div
                className="flex items-center justify-center mb-4"
                whileHover={{ scale: 1.1 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-8 h-8 text-purple-400 mr-3" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white">
                  Connected to{" "}
                  <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    BlockDAG Testnet
                  </span>
                </h3>
              </motion.div>
              
              <motion.p 
                className="text-gray-300 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Experience lightning-fast transactions with ultra-low fees on the BlockDAG network. 
                Perfect for testing and development with enterprise-grade security.
              </motion.p>
              
              <motion.div 
                className="flex justify-center mt-6 space-x-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                {[
                  { label: "Network", value: "Testnet" },
                  { label: "Status", value: "Connected" },
                  { label: "Latency", value: "<50ms" }
                ].map((stat, index) => (
                  <motion.div 
                    key={index}
                    className="text-center"
                    whileHover={{ y: -5 }}
                  >
                    <div className="text-sm text-gray-400">{stat.label}</div>
                    <div className="text-lg font-bold text-white">{stat.value}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;