import api from "./api";
import { type AnalysisResult } from "../type";

interface AnalyseUrlPayload {
  url: string;
}

export interface AnalyseArticleUrlResponse {
  data: AnalysisResult | null;
  error: Error | unknown | null; 
}

export async function analyseArticleUrl(url: string): Promise<AnalyseArticleUrlResponse> {
  const payload: AnalyseUrlPayload = { url };

  try {
    const response = await api.post(`/analyse/`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Axios throws for non-2xx responses, so this block is only reached for successful responses
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Error calling analyseArticleUrl API:', error);
    return { data: null, error: error };
  }
}