'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Hand, 
  Palette, 
  Zap, 
  ChevronRight,
  Play,
  ArrowRight,
  Wand2,
  Layers,
  Share2
} from 'lucide-react';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const features = [
    {
      icon: <Hand className="w-8 h-8" />,
      title: 'Hand Tracking',
      description: 'Advanced AI-powered hand tracking detects your gestures in real-time',
      gradient: 'from-purple-500/20 to-blue-500/20'
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: 'Multiple Colors',
      description: 'Choose from a beautiful palette of colors to express your creativity',
      gradient: 'from-pink-500/20 to-orange-500/20'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Real-time Drawing',
      description: 'Smooth, lag-free drawing experience with instant response',
      gradient: 'from-yellow-500/20 to-green-500/20'
    },
    {
      icon: <Wand2 className="w-8 h-8" />,
      title: 'Gesture Controls',
      description: 'Use natural gestures to clear canvas, change tools, and more',
      gradient: 'from-cyan-500/20 to-blue-500/20'
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="min-h-screen text-white">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="glass px-6 py-3 flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-lg">
                AD
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                AirDraw Pro
              </span>
            </motion.div>
            
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
                How it Works
              </a>
              <Link href="/draw">
                <motion.button 
                  className="glass-button glass-button-primary flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Play className="w-4 h-4" />
                  Start Drawing
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-24">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="max-w-5xl mx-auto text-center"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2 glass px-4 py-2 text-sm text-purple-300">
              Powered by AI
            </span>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Draw in the{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-glow">
              Air
            </span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto"
          >
            Transform your hand movements into digital art with our 
            AI-powered drawing experience. No touch required.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/draw">
              <motion.button 
                className="glass-button glass-button-primary px-8 py-4 text-lg flex items-center gap-3 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play className="w-5 h-5" />
                Start Drawing Now
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Floating Animation Preview */}
          <motion.div 
            variants={itemVariants}
            className="mt-16 relative"
          >
            <div className="glass-card p-2 max-w-3xl mx-auto overflow-hidden">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-purple-900/50 to-blue-900/50">
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="w-64 h-64 border-4 border-purple-500/30 rounded-full"
                  />
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                    className="absolute w-32 h-32 bg-gradient-to-r from-purple-500/40 to-blue-500/40 rounded-full blur-xl"
                  />
                  <motion.div
                    className="absolute flex items-center justify-center"
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    <Hand className="w-20 h-20 text-white/80" />
                  </motion.div>
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <span className="text-white/60 text-sm">Point your finger to start drawing</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Amazing{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                Features
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Experience the future of digital art with our cutting-edge features
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                className="relative group"
              >
                <div className={`glass-card p-8 h-full transition-all duration-500 ${
                  hoveredFeature === index ? 'bg-gradient-to-br ' + feature.gradient : ''
                }`}>
                  <motion.div 
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                    whileHover={{ rotate: 5 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                Works
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Get started in seconds with our intuitive gesture controls
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Allow Camera',
                description: 'Grant camera access to enable hand tracking',
                icon: <Layers className="w-6 h-6" />
              },
              {
                step: '02',
                title: 'Point & Draw',
                description: 'Use your RIGHT hand index finger to draw',
                icon: <Hand className="w-6 h-6" />
              },
              {
                step: '03',
                title: 'Erase & Save',
                description: 'Show LEFT hand open palm to erase, then download',
                icon: <Share2 className="w-6 h-6" />
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="glass-card p-8 mb-6 relative overflow-hidden">
                  <span className="absolute top-4 left-4 text-6xl font-bold text-white/5">
                    {item.step}
                  </span>
                  <div className="relative z-10">
                    <motion.div 
                      className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500/30 to-cyan-500/30 flex items-center justify-center mb-4"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {item.icon}
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-400">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10" />
            <div className="relative z-10">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Hand className="w-16 h-16 mx-auto mb-6 text-purple-400" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Create?
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                Jump into the canvas and let your creativity flow. No signup required.
              </p>
              <Link href="/draw">
                <motion.button 
                  className="glass-button glass-button-primary px-10 py-5 text-xl flex items-center gap-3 mx-auto group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Drawing
                  <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold">
                AD
              </div>
              <span className="text-lg font-semibold">AirDraw Pro</span>
            </div>
            <p className="text-gray-500">
              Made for creativity
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
