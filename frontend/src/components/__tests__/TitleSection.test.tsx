import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/utils';
import TitleSection from '../TitleSection';
import { mockAnalysisResult } from '../../test/utils';

describe('TitleSection', () => {
  it('renders the main title', () => {
    render(<TitleSection data={mockAnalysisResult} />);
    
    expect(screen.getByText('Analysis Report')).toBeInTheDocument();
  });

  it('renders with correct title styling', () => {
    render(<TitleSection data={mockAnalysisResult} />);
    
    const title = screen.getByText('Analysis Report');
    expect(title).toHaveStyle({
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '2px',
      textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
    });
  });

  it('renders with motion animation properties', () => {
    render(<TitleSection data={mockAnalysisResult} />);
    
    const motionDiv = screen.getByText('Analysis Report').parentElement?.parentElement;
    expect(motionDiv).toHaveAttribute('style', expect.stringContaining('opacity: 0'));
    expect(motionDiv).toHaveAttribute('style', expect.stringContaining('transform: translateY(-20px)'));
  });

  it('renders with correct box styling', () => {
    render(<TitleSection data={mockAnalysisResult} />);
    
    const box = screen.getByText('Analysis Report').parentElement;
    expect(box).toHaveStyle({
      textAlign: 'center',
      marginBottom: '24px', // mb: 3 in MUI equals 24px
      position: 'relative',
    });
  });

  it('renders optional title when provided', () => {
    const dataWithTitle = {
      ...mockAnalysisResult,
      title: 'Test Article Title',
    };
    
    render(<TitleSection data={dataWithTitle} />);
    
    expect(screen.getByText('Test Article Title')).toBeInTheDocument();
    expect(screen.getByText('Test Article Title')).toHaveStyle({
      color: 'rgba(0, 255, 0, 0.7)', // text.secondary color
      fontStyle: 'italic',
      fontWeight: 700,
    });
  });

  it('does not render optional title when not provided', () => {
    const dataWithoutTitle = {
      ...mockAnalysisResult,
      title: null,
    };
    
    render(<TitleSection data={dataWithoutTitle} />);
    
    expect(screen.queryByText('Test Article Title')).not.toBeInTheDocument();
  });
}); 