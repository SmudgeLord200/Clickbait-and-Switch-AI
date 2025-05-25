export interface AnalysisResult {
    title: string | null;
    summary: string | null;
    named_people: string[] | null;
    sentiment: {
        label: string | null;
        score: number | null;
    };
    bias_classification: {
        labels: string | null;
        scores: number | null;
    };
    topic_classification: {
        labels: string | null;
        scores: number | null;
    };
}