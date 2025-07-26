"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  Shield,
  Rocket,
  Mail,
  Github,
  BookOpen,
  MessageCircle,
  Zap,
  Lock,
  Users,
  ArrowRight,
  Sparkles,
} from "lucide-react"

const HomePage = () => {
  const [showLoading, setShowLoading] = useState(false)
  const [loadingText, setLoadingText] = useState("Initializing...")
  const navigate = useNavigate()

  useEffect(() => {
    if (showLoading) {
      // Update loading text sequence
      const textSequence = [
        "Initializing...",
        "Securing your assets...",
        "Connecting to BlockDAG...",
        "Almost ready...",
      ]

      let textIndex = 0
      setLoadingText(textSequence[0]) // Set initial text immediately

      const textInterval = setInterval(() => {
        textIndex = (textIndex + 1) % textSequence.length
        setLoadingText(textSequence[textIndex])
      }, 800) // Slightly slower for better readability

      const timer = setTimeout(() => {
        clearInterval(textInterval)
        setShowLoading(false)
        // Use replace instead of navigate to avoid navigation issues
        window.location.replace("/dashboard")
      }, 3200) // Slightly longer to show all messages

      return () => {
        clearTimeout(timer)
        clearInterval(textInterval)
      }
    }
  }, [showLoading, navigate])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0, rotateY: -15 },
    visible: {
      scale: 1,
      opacity: 1,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    hover: {
      scale: 1.05,
      y: -15,
      rotateY: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  }

  const floatingVariants = {
    animate: {
      y: [-20, 20, -20],
      rotate: [0, 360, 0],
      transition: {
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  // Loading Screen with enhanced animations
  if (showLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gradient-background relative overflow-hidden">
        {/* Animated background particles */}
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-purple-400 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: 0,
                opacity: 0,
              }}
              animate={{
                y: -100,
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
                ease: "easeOut",
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ scale: 0.5, rotate: -180, opacity: 0 }}
          animate={{
            scale: [0.5, 1.2, 1],
            rotate: [-180, 0, 360],
            opacity: 1,
          }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 10,
            duration: 1.5,
          }}
          className="mb-8 relative"
        >
          <div className="glass rounded-3xl p-8 shadow-2xl flex items-center justify-center relative overflow-hidden">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl"
            />
            <Shield className="w-20 h-20 text-purple-300 drop-shadow-lg relative z-10" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
          className="text-3xl md:text-4xl font-bold mb-6 text-center text-white"
          style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
        >
          SentryWallet
        </motion.h1>

        <motion.p
          key={loadingText} // Key prop to trigger re-animation on text change
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl text-black font-bold mb-8 text-center px-4"
          style={{
            textShadow: "2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(147, 51, 234, 0.6)",
            filter: "drop-shadow(0 0 10px rgba(255,255,255,0.3))",
          }}
        >
          Securing your assets...
          {loadingText}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="relative"
        >
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="absolute inset-0 w-16 h-16 border-4 border-blue-400/30 rounded-full"
          />
        </motion.div>

        {/* Background glow effects */}
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.3, 0.1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.5, 1, 1.5],
            opacity: [0.1, 0.3, 0.1],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        />
      </div>
    )
  }

  // Main Homepage
  return (
    <div className="min-h-screen gradient-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute top-1/4 left-1/4 w-12 h-12 bg-purple-400/30 rounded-full blur-sm"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 2 }}
          className="absolute top-1/3 right-1/4 w-8 h-8 bg-blue-400/40 rounded-full blur-sm"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 4 }}
          className="absolute bottom-1/4 left-1/3 w-6 h-6 bg-purple-300/50 rounded-full blur-sm"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 1 }}
          className="absolute top-1/2 right-1/3 w-10 h-10 bg-blue-300/30 rounded-full blur-sm"
        />
      </div>

      {/* Hero Section */}
      <motion.div
        className="relative min-h-screen flex items-center justify-center px-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="relative z-10 text-center max-w-6xl mx-auto">
          <motion.div className="mb-12" variants={itemVariants}>
            <motion.div
              className="w-32 h-32 mx-auto mb-8 glass rounded-3xl flex items-center justify-center relative overflow-hidden group"
              whileHover={{ scale: 1.1, rotateY: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
              <Shield className="w-16 h-16 text-white relative z-10 drop-shadow-lg" />
              <motion.div
                className="absolute inset-0 bg-white/10"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
            </motion.div>

            <motion.h1
              className="text-6xl md:text-8xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="text-white">The Smart Wallet</span>
              <br />
              <motion.span
                className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent text-glow"
                animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                You Can't Lose
              </motion.span>
            </motion.h1>
          </motion.div>

          <motion.p className="text-2xl md:text-3xl text-purple-100 mb-6 font-medium" variants={itemVariants}>
            Social recovery. Web2 login. Gasless UX — powered by BlockDAG.
          </motion.p>

          <motion.p className="text-lg text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed" variants={itemVariants}>
            SentryWallet is a smart, recoverable crypto wallet that uses Web2 login, social guardians, and gasless
            transactions — built on BlockDAG.
          </motion.p>

          <motion.div variants={itemVariants}>
            <motion.button
              className="relative group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-12 py-6 rounded-2xl text-xl font-bold transition-all duration-300 shadow-2xl overflow-hidden"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLoading(true)}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10 flex items-center justify-center">
                <Rocket className="w-6 h-6 mr-3" />
                Launch App
                <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
                  <ArrowRight className="w-6 h-6 ml-3" />
                </motion.div>
              </span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.section
        className="py-20 px-4 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              What Makes{" "}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                SentryWallet
              </span>{" "}
              Different
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Revolutionary features that redefine how you interact with crypto
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Social Recovery",
                description:
                  "Never lose access to your wallet again. Set trusted guardians who can help you recover your funds.",
                color: "from-purple-500 to-purple-700",
                delay: 0.1,
              },
              {
                icon: Zap,
                title: "Gasless Transactions",
                description:
                  "Enjoy seamless transactions without worrying about gas fees. We handle the complexity for you.",
                color: "from-blue-500 to-blue-700",
                delay: 0.2,
              },
              {
                icon: Lock,
                title: "Web2 Login",
                description:
                  "Use familiar login methods like Google or email. No need to remember complex seed phrases.",
                color: "from-purple-600 to-blue-600",
                delay: 0.3,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                className="glass rounded-3xl p-8 text-center group card-hover relative overflow-hidden"
              >
                <motion.div
                  className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <feature.icon className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-glow transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Hover effect overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className="py-20 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: "100K+", label: "Secure Wallets", icon: Users },
              { number: "99.9%", label: "Uptime", icon: Shield },
              { number: "0", label: "Gas Fees", icon: Zap },
              { number: "24/7", label: "Support", icon: MessageCircle },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center glass rounded-2xl p-6 hover-glow"
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <motion.div
                  className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center"
                  whileHover={{ rotate: 15 }}
                >
                  <stat.icon className="w-8 h-8 text-purple-300" />
                </motion.div>
                <motion.div
                  className="text-4xl font-bold text-white mb-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Technology Section */}
      <motion.section
        className="py-20 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.div variants={itemVariants}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Powered by{" "}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                BlockDAG
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto">
              Experience lightning-fast transactions with ultra-low fees on the most advanced blockchain architecture
            </p>
          </motion.div>

          <motion.div
            className="glass rounded-3xl p-12 relative overflow-hidden group"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5"
              animate={{
                background: [
                  "linear-gradient(0deg, rgba(147,51,234,0.05) 0%, rgba(59,130,246,0.05) 100%)",
                  "linear-gradient(90deg, rgba(147,51,234,0.05) 0%, rgba(59,130,246,0.05) 100%)",
                  "linear-gradient(180deg, rgba(147,51,234,0.05) 0%, rgba(59,130,246,0.05) 100%)",
                  "linear-gradient(270deg, rgba(147,51,234,0.05) 0%, rgba(59,130,246,0.05) 100%)",
                  "linear-gradient(0deg, rgba(147,51,234,0.05) 0%, rgba(59,130,246,0.05) 100%)",
                ],
              }}
              transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
            />

            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              {[
                { title: "Lightning Fast", desc: "Sub-second transaction finality", icon: Zap },
                { title: "Ultra Secure", desc: "Advanced cryptographic protection", icon: Shield },
                { title: "Scalable", desc: "Handles millions of transactions", icon: Sparkles },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-xl flex items-center justify-center"
                    whileHover={{ rotate: 180, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <item.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <motion.div
          className="max-w-4xl mx-auto text-center glass rounded-3xl p-12 relative overflow-hidden"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10"
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          />

          <div className="relative z-10">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              Ready to Secure Your Future?
            </motion.h2>
            <motion.p
              className="text-xl text-gray-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Join thousands of users who trust SentryWallet with their digital assets
            </motion.p>
            <motion.button
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-2xl relative overflow-hidden group"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLoading(true)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10 flex items-center justify-center">
                Get Started Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </span>
            </motion.button>
          </div>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="py-12 px-4 border-t border-white/10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div className="flex flex-col md:flex-row justify-between items-center" variants={itemVariants}>
            <div className="flex items-center mb-4 md:mb-0">
              <Shield className="w-8 h-8 text-purple-400 mr-3" />
              <span className="text-2xl font-bold text-white">SentryWallet</span>
            </div>

            <div className="flex space-x-6">
              {[
                { icon: Github, href: "#" },
                { icon: Mail, href: "#" },
                { icon: MessageCircle, href: "#" },
                { icon: BookOpen, href: "#" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <social.icon className="w-6 h-6" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-400" variants={itemVariants}>
            <p>&copy; 2024 SentryWallet. All rights reserved. Built with ❤️ for the future of finance.</p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  )
}

export default HomePage
