import { createJsonStore } from "./blobStore";
import { Developer } from "./types";

const store = createJsonStore<Developer>("hidden-gems-developers");

export const listDevelopers = () => store.list();
export const getDeveloper = (id: string) => store.get(id);
export const saveDeveloper = (developer: Developer) => store.set(developer.id, developer);
export const removeDeveloper = (id: string) => store.remove(id);
