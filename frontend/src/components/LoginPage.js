import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, Loader2, Eye, EyeOff, Mail, Lock, User, Sparkles, Star } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    // Handle OAuth callback and check existing session
    const handleAuthCallback = async () => {
      try {
        // First, try to get session from URL (for OAuth callback)
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          return;
        }

        if (data.session) {
          // Clear the URL hash
          if (window.location.hash) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
          navigate('/dashboard');
          return;
        }

        // If no session from URL, check for stored session
        const { data: storedSession } = await supabase.auth.getSession();
        if (storedSession.session) {
          navigate('/dashboard');
        }

      } catch (error) {
        console.error('Auth callback error:', error);
      }
    };

    handleAuthCallback();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Clear URL hash if present
          if (window.location.hash) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
          navigate('/dashboard');
        } else if (event === 'SIGNED_OUT') {
          // Handle sign out
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
            }
          }
        });

        if (error) {
          setError(error.message);
        } else if (data.user) {
          if (data.user.email_confirmed_at) {
            // User is immediately confirmed
            navigate('/dashboard');
          } else {
            // User needs to confirm email
            setError('Please check your email for confirmation link');
          }
        }
      } else {
        // Sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          setError(error.message);
        } else if (data.user) {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/login`
        }
      });

      if (error) {
        setError('Error with Google login: ' + error.message);
        setLoading(false);
      }
      // Don't set loading to false here - let the auth state change handle it
    } catch (error) {
      setError('An unexpected error occurred with Google login');
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0, rotateY: -10 },
    visible: {
      scale: 1,
      opacity: 1,
      rotateY: 0,
      transition: {
        duration: 0.7,
        delay: 0.2,
        type: "spring",
        stiffness: 100
      }
    }
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      transition: { type: "spring", stiffness: 300 }
    }
  };

  return (
    <div className="min-h-screen gradient-background flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400/30 rounded-full"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
              scale: 0,
              opacity: 0
            }}
            animate={{
              y: -100,
              scale: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeOut"
            }}
          />
        ))}
        
        <motion.div
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            rotate: [0, 360, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-16 h-16 bg-purple-400/20 rounded-full blur-lg"
        />
        <motion.div
          animate={{
            y: [20, -20, 20],
            x: [10, -10, 10],
            rotate: [360, 0, 360]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 right-1/4 w-12 h-12 bg-blue-400/30 rounded-full blur-lg"
        />
        <motion.div
          animate={{
            y: [-15, 15, -15],
            x: [15, -15, 15],
            rotate: [0, 180, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/3 w-8 h-8 bg-purple-300/40 rounded-full blur-lg"
        />
      </div>
      
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Back Button */}
        <motion.button
          className="flex items-center text-white hover:text-purple-300 transition-colors duration-300 mb-8 glass rounded-xl px-4 py-2"
          onClick={() => navigate('/')}
          whileHover={{ x: -5, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </motion.button>

        {/* Login/Signup Card */}
        <motion.div
          className="glass rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden"
          variants={cardVariants}
          whileHover={{ y: -5 }}
        >
          {/* Background glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300"
            initial={{ scale: 0 }}
            whileHover={{ scale: 1 }}
          />
          
          {/* Logo */}
          <motion.div 
            className="w-24 h-24 mx-auto mb-6 glass rounded-3xl flex items-center justify-center relative overflow-hidden group"
            whileHover={{ scale: 1.1, rotateY: 15 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <Shield className="w-12 h-12 text-white relative z-10" />
            <motion.div
              className="absolute inset-0 bg-white/10"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />
          </motion.div>

          {/* Title */}
          <motion.h1 
            className="text-3xl font-bold text-white mb-2 text-center relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </motion.h1>
          
          <motion.p 
            className="text-gray-300 mb-8 text-center relative z-10"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {isSignUp 
              ? 'Create your SentryWallet account to get started' 
              : 'Sign in to your SentryWallet account'
            }
          </motion.p>

          {/* Error Message */}
          {error && (
            <motion.div
              className="glass border border-red-400/30 text-red-300 px-4 py-3 rounded-lg mb-6 relative z-10"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
            >
              <div className="flex items-center">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-4 h-4 mr-2 text-red-400" />
                </motion.div>
                {error}
              </div>
            </motion.div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4 mb-6 relative z-10">
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <motion.div 
                  className="relative"
                  variants={inputVariants}
                  whileFocus="focus"
                >
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 glass border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200 text-white placeholder-gray-400"
                    placeholder="Enter your full name"
                    required={isSignUp}
                  />
                </motion.div>
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <motion.div 
                className="relative"
                variants={inputVariants}
                whileFocus="focus"
              >
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 glass border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200 text-white placeholder-gray-400"
                  placeholder="Enter your email"
                  required
                />
              </motion.div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <motion.div 
                className="relative"
                variants={inputVariants}
                whileFocus="focus"
              >
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 glass border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200 text-white placeholder-gray-400"
                  placeholder={isSignUp ? "Create a password" : "Enter your password"}
                  required
                  minLength={isSignUp ? 6 : undefined}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
              </motion.div>
              {isSignUp && (
                <motion.p 
                  className="text-xs text-gray-400 mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Password must be at least 6 characters long
                </motion.p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className={`w-full flex items-center justify-center px-6 py-4 rounded-2xl font-semibold transition-all duration-300 relative overflow-hidden ${
                loading 
                  ? 'glass cursor-not-allowed border border-white/20' 
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg'
              }`}
              disabled={loading}
              whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
            >
              {!loading && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center">
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="w-5 h-5 text-gray-300" />
                  </motion.div>
                ) : (
                  <>
                    <Star className="w-5 h-5 mr-2" />
                    {isSignUp ? 'Create Account' : 'Sign In'}
                  </>
                )}
              </span>
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 glass text-gray-300 rounded-lg">OR</span>
            </div>
          </div>

          {/* Google Login Button */}
          <motion.button
            className={`w-full flex items-center justify-center px-6 py-4 rounded-2xl font-semibold transition-all duration-300 mb-6 relative overflow-hidden ${
              loading 
                ? 'glass cursor-not-allowed border border-white/20' 
                : 'glass border border-white/20 hover:border-purple-400/50 text-white'
            }`}
            onClick={handleGoogleLogin}
            disabled={loading}
            whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
          >
            {!loading && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
              />
            )}
            <span className="relative z-10 flex items-center">
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-5 h-5 text-gray-400" />
                </motion.div>
              ) : (
                <>
                  <motion.svg 
                    className="w-5 h-5 mr-3" 
                    viewBox="0 0 24 24"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </motion.svg>
                  Continue with Google
                </>
              )}
            </span>
          </motion.button>

          {/* Toggle Login/Signup */}
          <div className="text-center relative z-10">
            <motion.button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setFormData({ email: '', password: '', fullName: '' });
              }}
              className="text-purple-300 hover:text-purple-200 font-medium transition-colors duration-300 glass rounded-lg px-4 py-2"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSignUp 
                ? 'Already have an account? Sign In' 
                : "Don't have an account? Sign Up"
              }
            </motion.button>
          </div>

          {/* Security Note */}
          <motion.div 
            className="mt-6 text-sm text-gray-400 leading-relaxed text-center flex items-center justify-center relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Shield className="w-4 h-4 mr-2 text-purple-400" />
            </motion.div>
            Your account is secured with industry-standard encryption and social recovery features.
          </motion.div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          className="mt-6 text-center text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.p
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            By continuing, you agree to our{" "}
            <span className="text-purple-300 hover:text-purple-200 cursor-pointer transition-colors">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-purple-300 hover:text-purple-200 cursor-pointer transition-colors">
              Privacy Policy
            </span>
            .
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;