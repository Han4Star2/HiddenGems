/**
 * Premium wird nicht per Kreditkarte auf der Website verkauft, sondern über
 * den Besitz eines Roblox Gamepasses oder T-Shirts, das direkt auf Roblox
 * gekauft wird (Roblox behält seinen üblichen Marketplace-Cut, wir verkaufen
 * nichts selbst). Diese Datei prüft nur den Besitz über die öffentliche
 * Roblox Inventory API — den Kauf wickelt Roblox ab.
 *
 * Ungetestet in dieser Sandbox (kein Netzwerkzugriff), aber nach der
 * öffentlichen Roblox-Inventory-API gebaut:
 * GET https://inventory.roblox.com/v1/users/{userId}/items/{itemType}/{itemId}
 */

const INVENTORY_API = "https://inventory.roblox.com";

type PremiumAssetType = "GamePass" | "Asset"; // "Asset" deckt u.a. T-Shirts ab

interface PremiumAssetConfig {
  type: PremiumAssetType;
  id: number;
}

function getConfiguredPremiumAssets(): PremiumAssetConfig[] {
  const assets: PremiumAssetConfig[] = [];
  if (process.env.PREMIUM_GAMEPASS_ID) {
    assets.push({ type: "GamePass", id: Number(process.env.PREMIUM_GAMEPASS_ID) });
  }
  if (process.env.PREMIUM_TSHIRT_ID) {
    assets.push({ type: "Asset", id: Number(process.env.PREMIUM_TSHIRT_ID) });
  }
  return assets;
}

async function ownsItem(robloxUserId: number, asset: PremiumAssetConfig): Promise<boolean> {
  const res = await fetch(
    `${INVENTORY_API}/v1/users/${robloxUserId}/items/${asset.type}/${asset.id}`
  );
  if (!res.ok) return false;
  const data = (await res.json()) as { data: unknown[] };
  return data.data.length > 0;
}

/** true, wenn der Nutzer mindestens einen der konfigurierten Premium-Items besitzt. */
export async function checkPremiumStatus(robloxUserId: number): Promise<boolean> {
  const assets = getConfiguredPremiumAssets();
  if (assets.length === 0) return false;
  const results = await Promise.all(assets.map((asset) => ownsItem(robloxUserId, asset)));
  return results.some(Boolean);
}

export function getPremiumGamepassUrl(): string | undefined {
  const gamepassId = process.env.PREMIUM_GAMEPASS_ID;
  return gamepassId ? `https://www.roblox.com/game-pass/${gamepassId}` : undefined;
}
