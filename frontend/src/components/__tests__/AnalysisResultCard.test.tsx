import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/utils';
import AnalysisResultCard from '../AnalysisResultCard';
import { mockAnalysisResult } from '../../test/utils';

describe('AnalysisResultCard', () => {
  it('renders all main sections', () => {
    render(<AnalysisResultCard data={mockAnalysisResult} />);
    
    // Check for all main sections
    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('Bias Score')).toBeInTheDocument();
    expect(screen.getByText('Topic Score')).toBeInTheDocument();
    expect(screen.getByText('Additional Information')).toBeInTheDocument();
  });

  it('renders with correct card styling', () => {
    render(<AnalysisResultCard data={mockAnalysisResult} />);
    
    const card = screen.getByLabelText('Result card');
    expect(card).toHaveStyle({
      maxWidth: '700px',
      margin: '24px auto',
      borderRadius: '16px',
      position: 'relative',
      overflow: 'visible',
    });
  });

  it('renders with motion animation properties', () => {
    render(<AnalysisResultCard data={mockAnalysisResult} />);

    const motionDiv = screen.getByLabelText('Result card').parentElement;
    expect(motionDiv).toHaveAttribute('style', expect.stringContaining('opacity: 0'));
    expect(motionDiv).toHaveAttribute('style', expect.stringContaining('transform: translateY(20px)'));
  });

  it('renders card content with correct padding', () => {
    render(<AnalysisResultCard data={mockAnalysisResult} />);

    const cardContent = screen.getByLabelText('Result card').firstChild;
    expect(cardContent).toHaveStyle({
      padding: '24px 24px 24px 24px', // p: 3 in MUI equals 24px
    });
  });

  it('renders all child components with correct data', () => {
    render(<AnalysisResultCard data={mockAnalysisResult} />);
    
    // Check TitleSection
    expect(screen.getByText(mockAnalysisResult.title)).toBeInTheDocument();
    
    // Check ScoresSection
    expect(screen.getByText('36/100')).toBeInTheDocument();
    expect(screen.getByText('26/100')).toBeInTheDocument();
    
    // Check SummarySection
    expect(screen.getByText('Inflation was 3.5% in April, up from 2.6% in March and higher than economists had expected. Water, gas and electricity prices all went up on 1 April.')).toBeInTheDocument();
    
    // Check AdditionalInformation
    expect(screen.getByText('POSITIVE')).toBeInTheDocument();
  });
}); 