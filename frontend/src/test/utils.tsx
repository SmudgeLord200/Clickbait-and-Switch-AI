import { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { matrixTheme } from '../theme';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={matrixTheme}>
      {children}
    </ThemeProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock data for testing
export const mockAnalysisResult = {
  title: "UK inflation rate rises to highest in more than a year",
  summary: "Inflation was 3.5% in April, up from 2.6% in March and higher than economists had expected. Water, gas and electricity prices all went up on 1 April.",
  named_people: [],
  sentiment: {
    label: "POSITIVE",
    score: 0.9549601674079895
  },
  bias_classification: {
    labels: "factual",
    scores: 0.364
  },
  topic_classification: {
    labels: "climate",
    scores: 0.261
  }
};

export * from '@testing-library/react';
export { customRender as render }; 