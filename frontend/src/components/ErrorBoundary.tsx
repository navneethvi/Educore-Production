import React, { Component, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.log("Error caught by ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-300 p-5">
          {/* Shiny EDUCORE Title */}
          <motion.h1
            className="text-[1.5rem] sm:text-[3rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-glow"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, type: 'spring', stiffness: 120 }}
          >
            EDUCORE
          </motion.h1>

          {/* Animated 404 Image */}
          <motion.div
            className="mt-4" // Decreased margin-top
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.img
              src="/not-found.svg" // Ensure this path is correct
              alt="404 Error"
              className="w-[15rem] sm:w-[20rem] object-cover"
              initial={{ x: 0 }}
              animate={{
                x: [0, -10, 10, -10, 10, 0], // Adjust these values for subtle shaking
              }}
              transition={{
                x: { duration: 10, ease: "easeInOut", repeat: Infinity, repeatType: "loop" },
                opacity: { duration: 2 }
              }}
            />
          </motion.div>

          {/* Animated 404 Text */}
          <motion.div
            className="mt-4 text-gray-800 text-3xl sm:text-4xl font-bold" // Decreased margin-top
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <motion.span
              initial={{ scale: 1 }}
              animate={{ scale: 1.2 }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
              className="text-red-300"
            >
              404
            </motion.span>
          </motion.div>

          {/* "Something Went Wrong!" with different motion */}
          <motion.div
            className="mt-4 text-gray-800 text-lg sm:text-xl font-semibold" // Decreased margin-top
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 1.5 }}
          >
            Something Went Wrong!
          </motion.div>

          {/* Description */}
          <motion.p
            className="mt-4 text-gray-600 text-base sm:text-lg" // Decreased margin-top
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 2 }}
          >
            Please check your connection and try again.
          </motion.p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
