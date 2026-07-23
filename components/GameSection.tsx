import { Category } from "@/lib/categories";
import GameCard from "./GameCard";

export default function GameSection({ category }: { category: Category }) {
  if (category.games.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="flex items-center gap-2 text-xl font-semibold">
        <span aria-hidden>{category.emoji}</span>
        <span>{category.title}</span>
      </h2>
      <div className="scrollbar-thin flex gap-4 overflow-x-auto pb-2">
        {category.games.map((game) => (
          <div key={game.id} className="w-72 shrink-0">
            <GameCard game={game} />
          </div>
        ))}
      </div>
    </section>
  );
}
