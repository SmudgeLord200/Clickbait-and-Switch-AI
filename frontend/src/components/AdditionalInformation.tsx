import { Box, alpha, Typography, Chip } from "@mui/material";
import { motion } from "framer-motion";
import type { AnalysisResult } from "../type";
import { getSentimentColor } from "../utilities";

interface AdditionalInformationProps {
    data: AnalysisResult
}

const AdditionalInformation = ({ data }: AdditionalInformationProps) => {
    return (
        ((data.named_people?.length ?? 0 > 0) || (data.sentiment && data.sentiment.label)) && (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
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
                        Additional Information
                    </Typography>
                    {data.sentiment && data.sentiment.label && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Sentiment
                            </Typography>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{ display: 'inline-block' }}
                            >
                                <Chip
                                    label={data.sentiment.label}
                                    size="small"
                                    aria-label="Sentiment chip"
                                    sx={{
                                        mt: 0.5,
                                        color: getSentimentColor(data.sentiment.label ?? 'neutral'),
                                        border: `1px solid ${getSentimentColor(data.sentiment.label ?? 'neutral')}`,
                                        background: alpha(getSentimentColor(data.sentiment.label ?? 'neutral'), 0.1),
                                    }}
                                />
                            </motion.div>

                        </Box>
                    )}
                    {data.named_people && data.named_people.length > 0 && (
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                                Named Entities
                            </Typography>
                            <Box sx={{ mt: 0.5, display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center', alignItems: 'center' }}>
                                {data.named_people.map((person, index) => (
                                    <motion.div
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        style={{ display: 'inline-block' }}
                                        key={index}
                                    >
                                        <Chip
                                            label={person}
                                            size="small"
                                            aria-label="people chip"
                                            sx={{
                                                background: alpha('#002200', 0.8),
                                                border: '1px solid rgba(0, 255, 0, 0.3)',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    background: alpha('#003300', 0.9),
                                                    border: '1px solid rgba(0, 255, 0, 0.5)',
                                                },
                                                padding: 1,
                                            }}
                                        />
                                    </motion.div>

                                ))}
                            </Box>
                        </Box>
                    )}
                </Box>
            </motion.div>
        )
    )
}

export default AdditionalInformation;