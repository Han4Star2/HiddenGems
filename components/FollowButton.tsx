"use client";

import { useSession } from "./SessionProvider";

export default function FollowButton({ developerId }: { developerId: string }) {
  const { session, toggleFollowDeveloper } = useSession();
  const isFollowed = session?.followedDeveloperIds.includes(developerId) ?? false;

  return (
    <button
      type="button"
      onClick={() => toggleFollowDeveloper(developerId)}
      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
        isFollowed
          ? "border-accent/60 bg-accent/15 text-accent"
          : "border-border text-foreground/70 hover:bg-surface-hover"
      }`}
    >
      {isFollowed ? "Gefolgt" : "Folgen"}
    </button>
  );
}
