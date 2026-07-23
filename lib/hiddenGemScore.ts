export interface ScoreInput {
  currentPlayers: number;
  growth24h: number;
  growth7d: number;
  likes: number;
  dislikes: number;
  favorites: number;
  visits: number;
  ageDays: number;
  daysSinceLastUpdate: number;
}

export interface ScoreBreakdown {
  total: number;
  growth: number;
  likeRate: number;
  favoriteRatio: number;
  age: number;
  devActivity: number;
  size: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function growthScore(growth7d: number): number {
  return clamp(100 * (1 - 1 / (1 + Math.max(0, growth7d) / 50)), 0, 100);
}

function likeRateScore(likes: number, dislikes: number): number {
  const total = likes + dislikes;
  if (total < 10) return 50; // zu wenig Daten für ein belastbares Urteil
  const likeRate = (likes / total) * 100;
  return clamp(((likeRate - 60) / 40) * 100, 0, 100);
}

function favoriteRatioScore(favorites: number, visits: number): number {
  if (visits === 0) return 0;
  const ratio = (favorites / visits) * 100;
  return clamp(ratio * 20, 0, 100);
}

function ageScore(ageDays: number): number {
  // Sweet Spot um ~14 Tage: alt genug für verlässliche Daten, jung genug um noch "hidden" zu sein.
  const confidencePenalty = ageDays < 2 ? 0.7 : 1;
  return clamp(100 - Math.abs(ageDays - 14) * 1.2, 0, 100) * confidencePenalty;
}

function devActivityScore(daysSinceLastUpdate: number): number {
  return clamp(100 - daysSinceLastUpdate * 10, 0, 100);
}

function sizeScore(currentPlayers: number): number {
  return clamp(100 - currentPlayers / 20, 0, 100);
}

const WEIGHTS = {
  growth: 0.3,
  likeRate: 0.15,
  favoriteRatio: 0.15,
  age: 0.1,
  devActivity: 0.15,
  size: 0.15,
};

export function calculateHiddenGemScore(input: ScoreInput): ScoreBreakdown {
  const growth = growthScore(input.growth7d);
  const likeRate = likeRateScore(input.likes, input.dislikes);
  const favoriteRatio = favoriteRatioScore(input.favorites, input.visits);
  const age = ageScore(input.ageDays);
  const devActivity = devActivityScore(input.daysSinceLastUpdate);
  const size = sizeScore(input.currentPlayers);

  const total = Math.round(
    growth * WEIGHTS.growth +
      likeRate * WEIGHTS.likeRate +
      favoriteRatio * WEIGHTS.favoriteRatio +
      age * WEIGHTS.age +
      devActivity * WEIGHTS.devActivity +
      size * WEIGHTS.size
  );

  return {
    total: clamp(total, 0, 100),
    growth: Math.round(growth),
    likeRate: Math.round(likeRate),
    favoriteRatio: Math.round(favoriteRatio),
    age: Math.round(age),
    devActivity: Math.round(devActivity),
    size: Math.round(size),
  };
}
