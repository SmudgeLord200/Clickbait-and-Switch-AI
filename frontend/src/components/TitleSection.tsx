import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import type { AnalysisResult } from "../type";

interface TitleSectionProps {
    data: AnalysisResult
}

const TitleSection = ({ data }: TitleSectionProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <Box sx={{ textAlign: 'center', mb: 3, position: 'relative' }}>
                <Typography
                    variant="h5"
                    component="div"
                    sx={{
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
                    }}
                >
                    Analysis Report
                </Typography>
                {data.title && (
                    <Typography
                        variant="body1"
                        sx={{
                            mt: 1,
                            color: 'text.secondary',
                            fontStyle: 'italic',
                            fontWeight: 'bold',
                        }}
                    >
                        {data.title}
                    </Typography>
                )}
            </Box>
        </motion.div>
    )
}

export default TitleSection;