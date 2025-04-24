import { VotesAnalysisDecision } from "./votes-analysis-decision.enum";

export interface VoteFrequency {
  vote: string;
  count: number;
  isHighest?: boolean;
  analysisDecision?: VotesAnalysisDecision;
}