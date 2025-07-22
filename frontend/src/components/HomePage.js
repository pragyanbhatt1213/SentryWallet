import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Rocket, Mail, Github, BookOpen, MessageCircle } from 'lucide-react';

const HomePage = () => {
  const [showLoading, setShowLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (showLoading) {
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showLoading, navigate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    },
    hover: { 
      scale: 1.05,
      y: -10,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  // 🌀 If loading, show animation
  if (showLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white relative overflow-hidden">
        <motion.div
          initial={{ scale: 0.7, rotate: -30, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 10 }}
          className="mb-8"
        >
          <div className="bg-gray-900 rounded-3xl p-8 shadow-xl flex items-center justify-center">
            <Shield className="w-20 h-20 text-blue-400 drop-shadow-lg" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-3xl md:text-4xl font-bold mb-4 text-center"
        >
          SentryWallet
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="text-lg md:text-xl text-blue-300 mb-8 text-center"
        >
          Securing your assets...
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto"
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 1.2, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute inset-0 bg-gradient-to-br from-blue-400/30 via-transparent to-purple-500/20 pointer-events-none"
        />
      </div>
    );
  }

  // ✨ Else, show homepage
  return (
    <div className="min-h-screen gradient-background">
      {/* Hero Section */}
      <motion.div 
        className="relative min-h-screen flex items-center justify-center px-4 hero-image"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-background/80"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div className="mb-8" variants={itemVariants}>
            <div className="w-24 h-24 mx-auto mb-6 bg-primary/20 rounded-3xl flex items-center justify-center neumorphic">
              <Shield className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-accent mb-4 leading-tight">
              The Smart Wallet
              <br />
              <span className="text-primary">You Can't Lose</span>
            </h1>
          </motion.div>

          <motion.p className="text-xl md:text-2xl text-gray-600 mb-4 font-medium" variants={itemVariants}>
            Social recovery. Web2 login. Gasless UX — powered by BlockDAG.
          </motion.p>

          <motion.p className="text-lg text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed" variants={itemVariants}>
            SentryWallet is a smart, recoverable crypto wallet that uses Web2 login, social guardians, and gasless transactions — built on BlockDAG.
          </motion.p>

          <motion.button
            className="bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 backdrop-blur-sm border-2 border-white/50 hover:border-white/70 shadow-lg"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLoading(true)}
          >
            Launch App
          </motion.button>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-primary/30 rounded-full animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-accent/20 rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-primary/40 rounded-full animate-float-delayed-2"></div>
      </motion.div>

      {/* Rest of sections below (keep as-is): "What Makes SentryWallet Different", Features, CTA, Footer */}
      {/* (You already wrote them above — you can paste the remaining JSX below this block) */}
    </div>
  );
};

export default HomePage;
