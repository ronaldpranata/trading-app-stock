
// Keyword dictionaries for financial sentiment analysis
// These are weighted based on their impact in financial contexts

const POSITIVE_KEYWORDS: Record<string, number> = {
  'surge': 2, 'jump': 2, 'soar': 2, 'record': 2, 'high': 1,
  'gain': 1, 'up': 1, 'rise': 1, 'growth': 1, 'profit': 2,
  'revenue': 1, 'beat': 2, 'exceed': 2, 'outperform': 2,
  'strong': 1, 'buy': 2, 'upgrade': 2, 'bull': 2, 'bullish': 2,
  'rally': 2, 'climb': 1, 'boost': 1, 'positive': 1, 'success': 1,
  'approval': 2, 'launch': 1, 'partnership': 1, 'deal': 1,
  'acquire': 1, 'acquisition': 1, 'merger': 1, 'dividend': 1,
  'split': 1, 'buyback': 1, 'recover': 1, 'breakthrough': 2,
  'innovate': 1, 'patent': 1, 'award': 1, 'lead': 1, 'leader': 1
};

const NEGATIVE_KEYWORDS: Record<string, number> = {
  'plunge': 3, 'crash': 3, 'drop': 2, 'fall': 1, 'down': 1,
  'loss': 2, 'miss': 2, 'fail': 2, 'decline': 1, 'lower': 1,
  'weak': 1, 'sell': 2, 'downgrade': 2, 'bear': 2, 'bearish': 2,
  'slump': 2, 'tumble': 2, 'slide': 1, 'negative': 1, 'risk': 1,
  'warn': 2, 'warning': 2, 'investigation': 3, 'lawsuit': 3,
  'sue': 3, 'fine': 2, 'penalty': 2, 'ban': 3, 'regulatory': 1,
  'scrutiny': 1, 'recall': 2, 'delay': 1, 'cancel': 2, 'cut': 1,
  'layoff': 2, 'job': 1, 'debt': 1, 'bankruptcy': 3, 'default': 3,
  'inflation': 1, 'recession': 2, 'crisis': 2, 'uncertainty': 1
};

/**
 * Calculates a sentiment score for a single headline
 * Returns a value between -1 (very negative) and 1 (very positive)
 */
function analyzeHeadline(headline: string): number {
  const words = headline.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
  let score = 0;
  let matches = 0;

  for (const word of words) {
    if (POSITIVE_KEYWORDS[word]) {
      score += POSITIVE_KEYWORDS[word];
      matches++;
    } else if (NEGATIVE_KEYWORDS[word]) {
      score -= NEGATIVE_KEYWORDS[word];
      matches++;
    }
  }

  if (matches === 0) return 0;
  
  // Normalize per match to avoid bias towards longer headlines
  const normalizedScore = score / matches;
  return Math.max(-1, Math.min(1, normalizedScore));
}

export interface SentimentAnalysisResult {
  score: number; // 0 to 100
  sentiment: 'positive' | 'negative' | 'neutral';
  keywordMatches: { word: string; impact: 'positive' | 'negative' }[];
}

/**
 * analyzes a list of headlines and returns an aggregate sentiment score
 */
export function calculateSentiment(headlines: string[]): SentimentAnalysisResult {
  if (!headlines || headlines.length === 0) {
    return { score: 50, sentiment: 'neutral', keywordMatches: [] };
  }

  let totalScore = 0;
  let relevantHeadlines = 0;
  const allMatches: { word: string; impact: 'positive' | 'negative' }[] = [];

  for (const headline of headlines) {
    const score = analyzeHeadline(headline);
    if (score !== 0) {
      totalScore += score;
      relevantHeadlines++;
      
      // Collect keywords for debug/display
      const words = headline.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
      for (const word of words) {
        if (POSITIVE_KEYWORDS[word]) allMatches.push({ word, impact: 'positive' });
        if (NEGATIVE_KEYWORDS[word]) allMatches.push({ word, impact: 'negative' });
      }
    }
  }

  // If no relevant keywords found in any headlines
  if (relevantHeadlines === 0) {
    return { score: 50, sentiment: 'neutral', keywordMatches: [] };
  }

  // Calculate average score (-1 to 1)
  const averageScore = totalScore / relevantHeadlines;
  
  // Map -1...1 to 0...100
  // -1 -> 0
  // 0 -> 50
  // 1 -> 100
  const finalScore = Math.round((averageScore + 1) * 50);

  let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
  if (finalScore >= 60) sentiment = 'positive';
  else if (finalScore <= 40) sentiment = 'negative';

  return {
    score: finalScore,
    sentiment,
    keywordMatches: [...new Set(allMatches.map(m => JSON.stringify(m)))] // De-duplicate
      .map(s => JSON.parse(s))
      .slice(0, 10) // Limit to top 10
  };
}
