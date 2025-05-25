import type { AnalysisResult } from '../type';

const CACHE_PREFIX = 'newsguard_analysis_';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface CacheEntry {
  data: AnalysisResult;
  timestamp: number;
}

export const cacheService = {
  getCachedResult: (url: string): AnalysisResult | null => {
    try {
      const cached = localStorage.getItem(`${CACHE_PREFIX}${url}`);
      if (!cached) return null;

      const entry: CacheEntry = JSON.parse(cached);
      const now = Date.now();

      // Check if cache is expired
      if (now - entry.timestamp > CACHE_EXPIRY) {
        localStorage.removeItem(`${CACHE_PREFIX}${url}`);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.error('Error reading from cache:', error);
      return null;
    }
  },

  setCachedResult: (url: string, data: AnalysisResult): void => {
    try {
      const entry: CacheEntry = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(`${CACHE_PREFIX}${url}`, JSON.stringify(entry));
    } catch (error) {
      console.error('Error writing to cache:', error);
    }
  },

  clearCache: (): void => {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(CACHE_PREFIX))
        .forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  },

  getCacheSize: (): number => {
    try {
      return Object.keys(localStorage)
        .filter(key => key.startsWith(CACHE_PREFIX))
        .length;
    } catch (error) {
      console.error('Error getting cache size:', error);
      return 0;
    }
  },
}; 