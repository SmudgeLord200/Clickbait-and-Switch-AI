import { Box, alpha, Typography } from "@mui/material";
import { motion } from "framer-motion";
import type { AnalysisResult } from "../type";

interface SummarySectionProps {
    data: AnalysisResult
}

const SummarySection = ({ data }: SummarySectionProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
        >
            <Box
                sx={{
                    mt: 3,
                    p: 2,
                    background: alpha('#001100', 0.5),
                    border: '1px solid rgba(0, 255, 0, 0.2)',
                    borderRadius: '8px',
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        mb: 2,
                        fontWeight: 'medium',
                        color: 'primary.main',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                    }}
                >
                    Summary
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        lineHeight: 1.7,
                        textShadow: '0 0 5px rgba(0, 255, 0, 0.3)',
                    }}
                >
                    {data.summary || "No summary available."}
                </Typography>
            </Box>
        </motion.div>
    )
}

export default SummarySection;