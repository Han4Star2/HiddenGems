import { scoreColor, scoreLabel } from "@/lib/scoring";

export default function ScoreBadge({ score, showLabel = false }: { score: number; showLabel?: boolean }) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${scoreColor(
        score
      )}`}
      title={`Hidden Gem Score: ${score}/100 (${scoreLabel(score)})`}
    >
      <span>💎</span>
      <span>{score}</span>
      {showLabel && <span className="font-normal opacity-80">{scoreLabel(score)}</span>}
    </div>
  );
}
