import { motion } from 'framer-motion';

const Loading = () => {
  return (
    <motion.div
      className="loading-container"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        style={{
          width: 50,
          height: 50,
          borderRadius: '50%',
          backgroundColor: '#3498db',
        }}
        animate={{ scale: [1, 1.5, 1], rotate: [0, 360, 0] }}
        transition={{
          duration: 1.5,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
      />
    </motion.div>
  );
};

export default Loading;
