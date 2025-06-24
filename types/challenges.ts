export interface Challenge {
  id: string;
  title: string;
  type: 'photo' | 'video';
  icon?: string;
  description?: string;
}

export interface ChallengeContext {
  challenge: Challenge;
  source: 'weekly' | 'university' | 'random';
}