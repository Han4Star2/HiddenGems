import { createJsonStore } from "./blobStore";
import { Game } from "./types";

const store = createJsonStore<Game>("hidden-gems-games");

export const listGames = () => store.list();
export const getGame = (slug: string) => store.get(slug);
export const saveGame = (game: Game) => store.set(game.slug, game);
export const removeGame = (slug: string) => store.remove(slug);
