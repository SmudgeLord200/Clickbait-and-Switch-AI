import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../test/utils';
import App from '../../App';
import { analyseArticleUrl } from '../../apiServices/analysisService';
import { cacheService } from '../../apiServices/cacheService';
import { mockAnalysisResult } from '../../test/utils';

// Mock the API service
vi.mock('../../apiServices/analysisService', () => ({
  analyseArticleUrl: vi.fn(),
}));

// Mock the cache service
vi.mock('../../apiServices/cacheService', () => ({
  cacheService: {
    getCachedResult: vi.fn(),
    setCachedResult: vi.fn(),
    clearCache: vi.fn(),
    getCacheSize: vi.fn(),
  },
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (cacheService.getCacheSize as any).mockReturnValue(0);
  });

  it('renders the main title and input field', () => {
    render(<App />);
    
    expect(screen.getByText('NewsGuard AI Analyser')).toBeInTheDocument();
    expect(screen.getByLabelText('Enter article URL to scan...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Scan' })).toBeInTheDocument();
  });

  it('handles URL input change', () => {
    render(<App />);
    
    const input = screen.getByLabelText('Enter article URL to scan...');
    fireEvent.change(input, { target: { value: 'https://example.com' } });
    
    expect(input).toHaveValue('https://example.com');
  });

  it('validates URL before scanning', async () => {
    render(<App />);
    
    const input = screen.getByLabelText('Enter article URL to scan...');
    const scanButton = screen.getByRole('button', { name: 'Scan' });
    
    // Test invalid URL
    fireEvent.change(input, { target: { value: 'invalid-url' } });
    fireEvent.click(scanButton);
    
    expect(await screen.findByText('Invalid URL.')).toBeInTheDocument();
    expect(analyseArticleUrl).not.toHaveBeenCalled();
  });

  it('shows loading state during scan', async () => {
    (analyseArticleUrl as any).mockImplementation(() => new Promise(() => {}));
    
    render(<App />);
    
    const input = screen.getByLabelText('Enter article URL to scan...');
    const scanButton = screen.getByRole('button', { name: 'Scan' });
    
    fireEvent.change(input, { target: { value: 'https://example.com' } });
    fireEvent.click(scanButton);
    
    expect(screen.getByText('Analyzing URL...')).toBeInTheDocument();
    expect(scanButton).toBeDisabled();
    expect(input).toBeDisabled();
  });

  it('displays analysis result after successful scan', async () => {
    (analyseArticleUrl as any).mockResolvedValue({ data: mockAnalysisResult });
    
    render(<App />);
    
    const input = screen.getByLabelText('Enter article URL to scan...');
    const scanButton = screen.getByRole('button', { name: 'Scan' });
    
    fireEvent.change(input, { target: { value: 'https://example.com' } });
    fireEvent.click(scanButton);
    
    await waitFor(() => {
      expect(screen.getByText('Analysis Report')).toBeInTheDocument();
      expect(screen.getByText('Inflation was 3.5% in April, up from 2.6% in March and higher than economists had expected. Water, gas and electricity prices all went up on 1 April.')).toBeInTheDocument();
      expect(screen.getByText('factual')).toBeInTheDocument();
      expect(screen.getByText('climate')).toBeInTheDocument();
    });
  });

  it('displays error message on scan failure', async () => {
    const errorMessage = 'Analysis failed';
    (analyseArticleUrl as any).mockResolvedValue({ error: errorMessage });
    
    render(<App />);
    
    const input = screen.getByLabelText('Enter article URL to scan...');
    const scanButton = screen.getByRole('button', { name: 'Scan' });
    
    fireEvent.change(input, { target: { value: 'https://example.com' } });
    fireEvent.click(scanButton);
    
    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('uses cached result when available', async () => {
    (cacheService.getCachedResult as any).mockReturnValue(mockAnalysisResult);
    
    render(<App />);
    
    const input = screen.getByLabelText('Enter article URL to scan...');
    const scanButton = screen.getByRole('button', { name: 'Scan' });
    
    fireEvent.change(input, { target: { value: 'https://example.com' } });
    fireEvent.click(scanButton);
    
    await waitFor(() => {
      expect(screen.getByText('Analysis Report')).toBeInTheDocument();
      expect(analyseArticleUrl).not.toHaveBeenCalled();
    });
  });

  it('shows and clears cache', async () => {
    (cacheService.getCacheSize as any).mockReturnValue(2);
    
    render(<App />);
    
    expect(screen.getByText('Cached results: 2')).toBeInTheDocument();
    
    const clearCacheButton = screen.getByRole('button', { name: 'Clear Cache' });
    fireEvent.click(clearCacheButton);
    
    expect(cacheService.clearCache).toHaveBeenCalled();
    expect(screen.queryByText('Cached results: 2')).not.toBeInTheDocument();
  });

  it('clears input and error after successful scan', async () => {
    (analyseArticleUrl as any).mockResolvedValue({ data: mockAnalysisResult });
    
    render(<App />);
    
    const input = screen.getByLabelText('Enter article URL to scan...');
    const scanButton = screen.getByRole('button', { name: 'Scan' });
    
    // First enter invalid URL
    fireEvent.change(input, { target: { value: 'invalid-url' } });
    fireEvent.click(scanButton);
    
    // Then enter valid URL
    fireEvent.change(input, { target: { value: 'https://example.com' } });
    fireEvent.click(scanButton);
    
    await waitFor(() => {
      expect(input).toHaveValue("");
      expect(screen.queryByText('Invalid URL.')).not.toBeInTheDocument();
    });
  });
}); 