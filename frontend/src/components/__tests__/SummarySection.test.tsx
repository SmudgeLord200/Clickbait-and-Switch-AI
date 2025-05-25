import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/utils';
import SummarySection from '../SummarySection';
import { mockAnalysisResult } from '../../test/utils';

describe('SummarySection', () => {
  it('renders with provided summary', () => {
    render(<SummarySection data={mockAnalysisResult} />);
    
    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('Inflation was 3.5% in April, up from 2.6% in March and higher than economists had expected. Water, gas and electricity prices all went up on 1 April.')).toBeInTheDocument();
  });

  it('renders fallback text when no summary is available', () => {
    const dataWithoutSummary = {
      ...mockAnalysisResult,
      summary: null,
    };
    
    render(<SummarySection data={dataWithoutSummary} />);
    
    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('No summary available.')).toBeInTheDocument();
  });

  it('renders with empty summary', () => {
    const dataWithEmptySummary = {
      ...mockAnalysisResult,
      summary: '',
    };
    
    render(<SummarySection data={dataWithEmptySummary} />);
    
    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('No summary available.')).toBeInTheDocument();
  });

  it('applies correct styling to summary title', () => {
    render(<SummarySection data={mockAnalysisResult} />);
    
    const title = screen.getByText('Summary');
    expect(title).toHaveStyle({
      fontWeight: 500,
      color: 'rgb(0, 255, 0)', // primary.main color
      textTransform: 'uppercase',
      letterSpacing: '1px',
    });
  });

  it('applies correct styling to summary content', () => {
    render(<SummarySection data={mockAnalysisResult} />);

    const content = screen.getByText('Inflation was 3.5% in April, up from 2.6% in March and higher than economists had expected. Water, gas and electricity prices all went up on 1 April.');
    expect(content).toHaveStyle({
      lineHeight: '1.7',
      textShadow: '0 0 5px rgba(0, 255, 0, 0.3)',
    });
  });

  it('renders with motion animation properties', () => {
    render(<SummarySection data={mockAnalysisResult} />);
    
    const motionDiv = screen.getByText('Summary').parentElement?.parentElement;
    expect(motionDiv).toHaveAttribute('style', expect.stringContaining('opacity: 0'));
  });
}); 