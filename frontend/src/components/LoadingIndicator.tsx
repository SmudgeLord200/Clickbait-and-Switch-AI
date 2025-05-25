import { Box, CircularProgress, Typography, LinearProgress } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { motion, useAnimationControls } from 'framer-motion';
import { useEffect, useState } from 'react';

const MatrixRain = () => (
  <Box
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      zIndex: 0,
      opacity: 0.3,
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(180deg, transparent 0%, rgba(0, 255, 0, 0.1) 50%, transparent 100%)',
        animation: 'matrixRain 2s linear infinite',
      },
      '@keyframes matrixRain': {
        '0%': { transform: 'translateY(-100%)' },
        '100%': { transform: 'translateY(100%)' },
      },
    }}
  />
);

const LoadingIndicator = () => {
  const [progress, setProgress] = useState(0);
  const controls = useAnimationControls();

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    controls.start({
      scale: [1, 1.1, 1],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    });

    return () => {
      clearInterval(timer);
    };
  }, [controls]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        position: 'relative',
        minHeight: '200px',
        py: 4,
        overflow: 'hidden',
      }}
    >
      <MatrixRain />
      <motion.div
        animate={controls}
        style={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        <CircularProgress
          color="primary"
          size={60}
          thickness={4}
          sx={{
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
          aria-label="circular progress"
        />
      </motion.div>
      <Typography
        variant="h6"
        sx={{
          mt: 2,
          color: 'primary.main',
          position: 'relative',
          zIndex: 1,
          textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
        }}
      >
        Analyzing URL...
      </Typography>
      <Typography
        variant="body2"
        sx={{
          mt: 1,
          mb: 2,
          color: 'text.secondary',
          position: 'relative',
          zIndex: 1,
          opacity: 0.8,
        }}
      >
        Please wait while we scan the article.
      </Typography>
      <Box sx={{ width: '80%', maxWidth: 400, position: 'relative', zIndex: 1 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: alpha('#00ff00', 0.1),
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #00ff00, #003300)',
              borderRadius: 4,
              transition: 'transform 0.5s ease-in-out',
            },
          }}
          aria-label="linear progress bar"
        />
        <Typography
          variant="caption"
          sx={{
            mt: 1,
            display: 'block',
            textAlign: 'center',
            color: 'primary.main',
          }}
        >
          {Math.round(progress)}% Complete
        </Typography>
      </Box>
    </Box>
  );
};

export default LoadingIndicator;
