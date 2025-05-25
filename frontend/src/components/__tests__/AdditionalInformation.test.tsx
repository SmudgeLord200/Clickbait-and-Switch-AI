import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/utils';
import AdditionalInformation from '../AdditionalInformation';
import { mockAnalysisResult } from '../../test/utils';

describe('AdditionalInformation', () => {
  const mockDataWithSentiment = {
    ...mockAnalysisResult,
    sentiment: {
      label: 'POSITIVE',
      score: 0.9549601674079895,
    },
  };

  const mockDataWithNamedPeople = {
    ...mockAnalysisResult,
    named_people: ['John Doe', 'Jane Smith'],
  };

  const mockDataWithBoth = {
    ...mockAnalysisResult,
    sentiment: {
      label: 'POSITIVE',
      score: 0.9549601674079895,
    },
    named_people: ['John Doe', 'Jane Smith'],
  };

  const mockNoData = {
    sentiment: { label: null, score: null },
    bias_classification: { labels: null, scores: null },
    topic_classification: { labels: null, scores: null },
    summary: null,
    title: null,
    named_people: [],
  }

  it('renders nothing when no additional information is available', () => {
    const { container } = render(<AdditionalInformation data={mockNoData} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders sentiment section when sentiment data is available', () => {
    render(<AdditionalInformation data={mockDataWithSentiment} />);

    expect(screen.getByText('Additional Information')).toBeInTheDocument();
    expect(screen.getByText('Sentiment')).toBeInTheDocument();
    expect(screen.getByText('POSITIVE')).toBeInTheDocument();
  });

  it('renders named entities section when named people are available', () => {
    render(<AdditionalInformation data={mockDataWithNamedPeople} />);

    expect(screen.getByText('Additional Information')).toBeInTheDocument();
    expect(screen.getByText('Named Entities')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('renders both sections when all data is available', () => {
    render(<AdditionalInformation data={mockDataWithBoth} />);

    expect(screen.getByText('Additional Information')).toBeInTheDocument();
    expect(screen.getByText('Sentiment')).toBeInTheDocument();
    expect(screen.getByText('Named Entities')).toBeInTheDocument();
    expect(screen.getByText('POSITIVE')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('renders with correct styling', () => {
    render(<AdditionalInformation data={mockDataWithBoth} />);

    const container = screen.getByText('Additional Information').parentElement;
    expect(container).toHaveStyle({
      background: 'rgba(0, 17, 0, 0.5)',
      border: '1px solid rgba(0, 255, 0, 0.2)',
      borderRadius: '8px',
    });

    const title = screen.getByText('Additional Information');
    expect(title).toHaveStyle({
      fontWeight: 500,
      color: 'rgb(0, 255, 0)', // primary.main color
      textTransform: 'uppercase',
      letterSpacing: '1px',
    });
  });

  it('renders sentiment chip with correct styling', () => {
    render(<AdditionalInformation data={mockDataWithSentiment} />);

    const sentimentChip = screen.getByLabelText('Sentiment chip');
    expect(sentimentChip).toHaveStyle({
      border: '1px solid rgb(0, 255, 0)', 
      background: 'rgba(0, 255, 0, 0.1)',
    });
  });

  it('renders named entity chips with correct styling', () => {
    render(<AdditionalInformation data={mockDataWithNamedPeople} />);

    const entityChips = screen.getAllByLabelText('people chip');
    entityChips.forEach(chip => {
      expect(chip).toHaveStyle({
        background: 'rgba(0, 34, 0, 0.8)',
        border: '1px solid rgba(0, 255, 0, 0.3)',
      });
    });
  });

  it('renders with motion animation properties', () => {
    render(<AdditionalInformation data={mockDataWithBoth} />);

    const motionDiv = screen.getByText('Additional Information').parentElement?.parentElement;
    expect(motionDiv).toHaveAttribute('style', expect.stringContaining('opacity: 0'));
    expect(motionDiv).toHaveAttribute('style', expect.stringContaining('transform: translateY(20px)'));
  });

  it('renders chips with hover and tap animations', () => {
    render(<AdditionalInformation data={mockDataWithBoth} />);

    // The motion.div wrapping the chip is responsible for hover/tap animations.
    // This test verifies its initial style. Testing the dynamic styles applied
    // during hover/tap would require event simulation.
    const sentimentChipWrapper = screen.getByLabelText('Sentiment chip').parentElement;
    // The motion.div has an explicit style prop: style={{ display: 'inline-block' }}
    expect(sentimentChipWrapper).toHaveAttribute('style', 'display: inline-block;');

    const entityChipWrappers = screen.getAllByLabelText('people chip').map(chip => chip.parentElement);
    entityChipWrappers.forEach(wrapper => {
      // Each motion.div wrapping an entity chip also has style={{ display: 'inline-block' }}
      expect(wrapper).toHaveAttribute('style', 'display: inline-block;');
    });
  });
}); 