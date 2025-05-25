import { Box, Tooltip, Typography, LinearProgress, Chip, alpha } from "@mui/material";
import { motion } from "framer-motion";
import { getScoreColor } from "../utilities";

interface ScoreDisplayProps {
    name: string;
    label: string;
    score: number
}

const ScoreDisplay = ({ label, name, score }: ScoreDisplayProps) => (
    <Box mb={2.5}>
        <Box display="flex" flexDirection="column" alignItems="center" sx={{ mb: 1.5 }}>
            {/* Name of the score (e.g., "Bias Score") */}
            <Tooltip title={`${name} indicates the confidence level of our analysis`} arrow>
                <Typography 
                    variant="subtitle1" 
                    component="div" 
                    fontWeight="bold" 
                    sx={{ color: 'text.secondary', mb: 1 }}
                >
                    {name}
                </Typography>
            </Tooltip>

            {/* Label (e.g., "Neutral", "Technology") */}
            <Chip
                label={label}
                size="small"
                sx={{
                    background: alpha('#002200', 0.8),
                    border: '1px solid rgba(0, 255, 0, 0.3)',
                    color: alpha('#00FF00', 0.9), 
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        background: alpha('#003300', 0.9),
                        border: '1px solid rgba(0, 255, 0, 0.5)',
                    },
                    padding: 1, 
                    mb: 1, 
                }}
            />

            {/* Score value (e.g., "75/100") */}
            <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
                <Typography
                    variant="h5" 
                    component="div"
                    fontWeight="bold"
                    color={getScoreColor(score * 100)}
                    sx={{
                        textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
                    }}
                >
                    {Math.round(score * 100)}/100
                </Typography>
            </motion.div>
        </Box>
        <Tooltip title={`${Math.round(score * 100)}% confidence in ${label.toLowerCase()}`} arrow>
            <LinearProgress
                variant="determinate"
                value={score * 100}
                color={getScoreColor(score * 100)}
                sx={{
                    height: 8,
                    borderRadius: '4px',
                    '& .MuiLinearProgress-bar': {
                        animation: 'pulse 2s infinite',
                    },
                    '@keyframes pulse': {
                        '0%': { opacity: 1 },
                        '50%': { opacity: 0.7 },
                        '100%': { opacity: 1 },
                    },
                }}
            />
        </Tooltip>
    </Box>
);

export default ScoreDisplay;