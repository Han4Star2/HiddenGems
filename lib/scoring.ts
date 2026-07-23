export function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-400 border-emerald-400/40 bg-emerald-400/10";
  if (score >= 60) return "text-cyan-400 border-cyan-400/40 bg-cyan-400/10";
  if (score >= 40) return "text-amber-400 border-amber-400/40 bg-amber-400/10";
  return "text-rose-400 border-rose-400/40 bg-rose-400/10";
}

export function scoreLabel(score: number): string {
  if (score >= 80) return "Exceptional";
  if (score >= 60) return "Strong";
  if (score >= 40) return "Promising";
  return "Early Signal";
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(
    value
  );
}

export function formatGrowth(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}
