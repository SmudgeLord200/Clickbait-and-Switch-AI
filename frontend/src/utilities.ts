export const getScoreColor = (score: number): "success" | "warning" | "error" | "primary" => {
    if (score >= 75) return "success";
    if (score >= 50) return "warning";
    if (score >= 25) return "error";
    return "primary"; // Or some other default for very low scores
};

export const getSentimentColor = (sentiment: string): string => {
    switch (sentiment.toLowerCase()) {
        case 'positive': return '#00ff00';
        case 'negative': return '#ff0000';
        case 'neutral': return '#ffff00';
        default: return '#00ff00';
    }
};

export const isValidURL = (url: string): boolean => {
    if (typeof url !== 'string' || url.trim() === '') {
        return false;
    }

    // Regex to check if the URL starts with http:// or https://
    const pattern = new RegExp('^https?:\\/\\/', 'i');

    return pattern.test(url);
};

export const getErrorMessage = (err: Error | null): string | null => {
    if (!err) return null;
    if (err instanceof Error) {
        return err.message;
    }
    if (typeof err === 'string') {
        return err;
    }
    return 'An unexpected error occurred. Please try again.';
};