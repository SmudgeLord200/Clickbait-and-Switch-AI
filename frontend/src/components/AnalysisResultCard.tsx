import { Card, CardContent } from '@mui/material';
import type { AnalysisResult } from '../type';
import { motion } from 'framer-motion';
import AdditionalInformation from './AdditionalInformation';
import SummarySection from './SummarySection';
import ScoresSection from './ScoresSection';
import TitleSection from './TitleSection';

interface Props {
  data: AnalysisResult;
}

const AnalysisResultCard = ({ data }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        sx={{
          mt: 3,
          mb: 3,
          maxWidth: 700,
          margin: '24px auto',
          borderRadius: '16px',
          position: 'relative',
          overflow: 'visible',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -2,
            left: -2,
            right: -2,
            bottom: -2,
            background: 'linear-gradient(45deg, #00ff00, #003300)',
            borderRadius: '18px',
            zIndex: -1,
            animation: 'borderGlow 2s infinite alternate',
          },
        }}
        aria-label="Result card"
      >
        <CardContent sx={{ p: 3 }}>
          {/* Title Section */}
          <TitleSection data={data} />

          {/* Scores Section */}
          <ScoresSection data={data} />

          {/* Summary Section */}
          <SummarySection data={data} />

          {/* Additional Info Section */}
          <AdditionalInformation data={data} />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AnalysisResultCard;
