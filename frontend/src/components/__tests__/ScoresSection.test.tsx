import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/utils';
import ScoresSection from '../ScoresSection';
import { mockAnalysisResult } from '../../test/utils';
import type { AnalysisResult } from '../../type';

describe('ScoresSection', () => {
  const mockData: AnalysisResult = {
    ...mockAnalysisResult,
    bias_classification: {
      labels: 'factual',
      scores: 0.364,
    },
    topic_classification: {
      labels: 'climate',
      scores: 0.261,
    },
  };

  it('renders both score displays with correct labels', () => {
    render(<ScoresSection data={mockData} />);
    
    expect(screen.getByText('Bias Score')).toBeInTheDocument();
    expect(screen.getByText('Topic Score')).toBeInTheDocument();
    expect(screen.getByText('factual')).toBeInTheDocument();
    expect(screen.getByText('climate')).toBeInTheDocument();
  });

  it('renders scores with correct values', () => {
    render(<ScoresSection data={mockData} />);
    
    expect(screen.getByText('36/100')).toBeInTheDocument();
    expect(screen.getByText('26/100')).toBeInTheDocument();
  });

  it('renders with fallback values when classifications are null', () => {
    const dataWithNull: AnalysisResult = {
      ...mockAnalysisResult,
      bias_classification: {
        labels: null,
        scores: null,
      },
      topic_classification: {
        labels: null,
        scores: null,
      },
    };
    
    render(<ScoresSection data={dataWithNull} />);
    
    expect(screen.getAllByText('Unknown')).toHaveLength(2);
    expect(screen.getAllByText('0/100')).toHaveLength(2);
  });

  it('renders with correct grid layout', () => {
    render(<ScoresSection data={mockData} />);
    
    const gridItems = screen.getAllByLabelText('score grid');
    expect(gridItems).toHaveLength(2);
    
    gridItems.forEach(item => {
      expect(item).toHaveClass('MuiGrid-item');
      expect(item).toHaveClass('MuiGrid-grid-xs-12');
      expect(item).toHaveClass('MuiGrid-grid-md-6');
    });
  });

  it('renders papers with correct styling', () => {
    render(<ScoresSection data={mockData} />);
    
    const papers = screen.getAllByLabelText('score paper');
    papers.forEach(paper => {
      expect(paper).toHaveStyle({
        background: 'rgba(0, 17, 0, 0.5)',
        border: '1px solid rgba(0, 255, 0, 0.2)',
        borderRadius: '8px',
      });
    });
  });

  it('renders with motion animation properties', () => {
    render(<ScoresSection data={mockData} />);
    
    const motionDiv = screen.getByLabelText('score section');
    expect(motionDiv).toHaveAttribute('style', expect.stringContaining('opacity: 0'));
    expect(motionDiv).toHaveAttribute('style', expect.stringContaining('transform: translateX(-20px)'));
  });
}); 