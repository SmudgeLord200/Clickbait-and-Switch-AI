import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '../../test/utils';
import LoadingIndicator from '../LoadingIndicator';

describe('LoadingIndicator', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks(); // Restores all spies and mocks
  });

  it('renders all main elements', () => {
    render(<LoadingIndicator />);

    expect(screen.getByText('Analyzing URL...')).toBeInTheDocument();
    expect(screen.getByText('Please wait while we scan the article.')).toBeInTheDocument();
    expect(screen.getByLabelText('linear progress bar')).toBeInTheDocument();
    expect(screen.getByText('0% Complete')).toBeInTheDocument();
  });

  it('updates progress over time', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5); // Makes diff consistently 5

    render(<LoadingIndicator />);

    // Initial state
    expect(screen.getByText('0% Complete')).toBeInTheDocument();

    // Advance timers by 500ms
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Progress should have increased
    const progressText = screen.getByText('5% Complete'); // Now deterministic
    expect(progressText).toBeInTheDocument();
  });

  it('renders with correct styling', () => {
    render(<LoadingIndicator />);

    // Check main container
    // The main Box is the parent of the "Analyzing URL..." Typography
    const mainBox = screen.getByText('Analyzing URL...').parentElement;
    expect(mainBox).toHaveStyle({
      minHeight: '200px',
      overflow: 'hidden',
      paddingTop: '32px', 
      paddingBottom: '32px',
      position: 'relative',
    });

    // Check title text
    const title = screen.getByText('Analyzing URL...');
    expect(title).toHaveStyle({
      color: 'rgb(0, 255, 0)', // primary.main color
      textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
    });

    // Check progress bar
    const linearProgressBar = screen.getByLabelText('linear progress bar');
    expect(linearProgressBar).toHaveStyle({
      borderRadius: '16px',
      height: '8px',
    });
  });

  it('renders MatrixRain effect', () => {
    render(<LoadingIndicator />);

    // MatrixRain is the first child of the main Box container
    const mainBox = screen.getByText('Analyzing URL...').parentElement;
    const matrixRain = mainBox?.firstChild;
    // Ensure matrixRain element is found before asserting styles
    expect(matrixRain).toBeInTheDocument(); 
    expect(matrixRain).toHaveStyle({
      position: 'absolute',
      top: '0px', 
      left: '0px',     
      right: '0px',    
      bottom: '0px',   
      overflow: 'hidden',
      zIndex: '0',     
      opacity: '0.3',   
    });
  });

  it('cleans up interval on unmount', () => {
    const { unmount } = render(<LoadingIndicator />);

    // Spy on clearInterval
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval');

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it('progress does not exceed 100%', () => {
    // Mock Math.random to ensure deterministic progress for this test
    // Make diff consistently 10 (since Math.random() * 10)
    vi.spyOn(Math, 'random').mockReturnValue(1);

    render(<LoadingIndicator />);

    // With diff = 10, it should take 10 steps (10 * 500ms) to reach 100%
    act(() => {
      for (let i = 0; i < 10; i++) {
        vi.advanceTimersByTime(500);
      }
    });

    expect(screen.getByText('100% Complete')).toBeInTheDocument();

    // Advance timers one more time to ensure progress stays capped at 100%
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(screen.getByText('100% Complete')).toBeInTheDocument();
    // mathRandomSpy.mockRestore(); // Handled by vi.restoreAllMocks() in afterEach
  });
}); 