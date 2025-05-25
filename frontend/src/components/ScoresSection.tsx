import { Grid, Paper, alpha } from "@mui/material";
import { motion } from "framer-motion";
import ScoreDisplay from "./ScoreDisplay";
import type { AnalysisResult } from "../type";

interface ScoresSectionProps {
    data: AnalysisResult
}

const ScoresSection = ({ data }: ScoresSectionProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            aria-label="score section"
        >
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6} aria-label="score grid">
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            background: alpha('#001100', 0.5),
                            border: '1px solid rgba(0, 255, 0, 0.2)',
                            borderRadius: '8px',
                        }}
                        aria-label="score paper"
                    >
                        <ScoreDisplay
                            name="Bias Score"
                            label={data.bias_classification.labels ?? 'Unknown'}
                            score={data.bias_classification.scores ?? 0}
                        />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6} aria-label="score grid">
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            background: alpha('#001100', 0.5),
                            border: '1px solid rgba(0, 255, 0, 0.2)',
                            borderRadius: '8px',
                        }}
                        aria-label="score paper"
                    >
                        <ScoreDisplay
                            name="Topic Score"
                            label={data.topic_classification.labels ?? 'Unknown'}
                            score={data.topic_classification.scores ?? 0}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </motion.div>
    )
}

export default ScoresSection;