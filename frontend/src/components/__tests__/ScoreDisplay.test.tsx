import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/utils';
import ScoreDisplay from '../ScoreDisplay';

describe('ScoreDisplay', () => {
  const defaultProps = {
    name: 'Test Score',
    label: 'Test Label',
    score: 0.75,
  };

  it('renders with correct name and label', () => {
    render(<ScoreDisplay {...defaultProps} />);

    expect(screen.getByText('Test Score')).toBeInTheDocument();
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('displays correct score value', () => {
    render(<ScoreDisplay {...defaultProps} />);

    expect(screen.getByText('75/100')).toBeInTheDocument();
  });

  it('renders with different score values', () => {
    const { rerender } = render(<ScoreDisplay {...defaultProps} score={0.25} />);
    expect(screen.getByText('25/100')).toBeInTheDocument();

    rerender(<ScoreDisplay {...defaultProps} score={0.5} />);
    expect(screen.getByText('50/100')).toBeInTheDocument();

    rerender(<ScoreDisplay {...defaultProps} score={0.9} />);
    expect(screen.getByText('90/100')).toBeInTheDocument();
  });

  it('renders LinearProgress with correct value', () => {
    render(<ScoreDisplay {...defaultProps} />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '75');
  });
}); 