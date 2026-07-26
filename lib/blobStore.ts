/**
 * Generischer JSON-Key-Value-Store für vom Backend eingelesene Roblox-Daten
 * (echte Spiele/Entwickler, im Gegensatz zu den statischen lib/mockData.ts).
 *
 * Persistiert primär über Netlify Blobs (funktioniert automatisch, sobald die
 * App auf Netlify deployed ist — keine eigene Datenbank nötig). Außerhalb
 * eines Netlify-Runtime-Kontexts (z.B. lokal via `next dev`/`next build` in
 * dieser Sandbox) fällt der Store automatisch auf eine JSON-Datei unter
 * .data/ zurück, damit die Pipeline auch lokal testbar bleibt.
 */

import { promises as fs } from "fs";
import path from "path";

export interface JsonStore<T> {
  list(): Promise<T[]>;
  get(key: string): Promise<T | null>;
  set(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
}

async function tryGetNetlifyStore(storeName: string) {
  try {
    const { getStore } = await import("@netlify/blobs");
    return getStore(storeName);
  } catch {
    return null;
  }
}

export function createJsonStore<T>(storeName: string): JsonStore<T> {
  const localFile = path.join(process.cwd(), ".data", `${storeName}.json`);

  async function readLocal(): Promise<Record<string, T>> {
    try {
      return JSON.parse(await fs.readFile(localFile, "utf-8"));
    } catch {
      return {};
    }
  }

  async function writeLocal(data: Record<string, T>): Promise<void> {
    await fs.mkdir(path.dirname(localFile), { recursive: true });
    await fs.writeFile(localFile, JSON.stringify(data, null, 2));
  }

  return {
    async list() {
      const store = await tryGetNetlifyStore(storeName);
      if (store) {
        try {
          const { blobs } = await store.list();
          const values: T[] = [];
          for (const blob of blobs) {
            const value = (await store.get(blob.key, { type: "json" })) as T | null;
            if (value !== null) values.push(value);
          }
          return values;
        } catch {
          // Kein nutzbarer Netlify-Runtime-Kontext — auf lokalen Store zurückfallen.
        }
      }
      return Object.values(await readLocal());
    },

    async get(key) {
      const store = await tryGetNetlifyStore(storeName);
      if (store) {
        try {
          return (await store.get(key, { type: "json" })) as T | null;
        } catch {
          // Fallback siehe oben.
        }
      }
      return (await readLocal())[key] ?? null;
    },

    async set(key, value) {
      const store = await tryGetNetlifyStore(storeName);
      if (store) {
        try {
          await store.setJSON(key, value);
          return;
        } catch {
          // Fallback siehe oben.
        }
      }
      const data = await readLocal();
      data[key] = value;
      await writeLocal(data);
    },

    async remove(key) {
      const store = await tryGetNetlifyStore(storeName);
      if (store) {
        try {
          await store.delete(key);
          return;
        } catch {
          // Fallback siehe oben.
        }
      }
      const data = await readLocal();
      delete data[key];
      await writeLocal(data);
    },
  };
}
