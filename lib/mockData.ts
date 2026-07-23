import { Developer, Game, StatPoint } from "./types";
import { calculateHiddenGemScore } from "./hiddenGemScore";
import { detectOfficialDiscord } from "./discord";

function daysAgo(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

function generateHistory(
  days: number,
  endPlayers: number,
  endVisits: number,
  endFavorites: number,
  volatility = 0.08
): StatPoint[] {
  const points: StatPoint[] = [];
  const dailyGrowth = 1 + Math.random() * 0.06 + 0.02;
  let players = endPlayers / Math.pow(dailyGrowth, days);
  let visits = endVisits / Math.pow(dailyGrowth, days);
  let favorites = endFavorites / Math.pow(dailyGrowth, days);

  for (let i = days; i >= 0; i--) {
    const noise = 1 + (Math.random() - 0.5) * volatility;
    points.push({
      date: daysAgo(i),
      players: Math.max(1, Math.round(players * noise)),
      visits: Math.max(1, Math.round(visits * noise)),
      favorites: Math.max(0, Math.round(favorites * noise)),
    });
    players *= dailyGrowth;
    visits *= dailyGrowth;
    favorites *= dailyGrowth;
  }
  // Force the last point to match the "current" values exactly.
  points[points.length - 1] = {
    date: daysAgo(0),
    players: endPlayers,
    visits: endVisits,
    favorites: endFavorites,
  };
  return points;
}

export const developers: Developer[] = [
  {
    id: "dev-frostbyte",
    slug: "frostbyte-studios",
    name: "Frostbyte Studios",
    avatarUrl: "https://picsum.photos/seed/frostbyte/200",
    memberCount: 12,
    description:
      "Ein kleines vierköpfiges Team, das seit 2023 an atmosphärischen Survival-Erlebnissen arbeitet.",
    discordUrl: "https://discord.gg/frostbyte-studios",
    gameIds: ["glacier-outpost", "frozen-depths"],
  },
  {
    id: "dev-neonroot",
    slug: "neonroot-games",
    name: "NeonRoot Games",
    avatarUrl: "https://picsum.photos/seed/neonroot/200",
    memberCount: 7,
    description:
      "Indie-Kollektiv mit Fokus auf schnelle, wettbewerbsorientierte Arcade-Titel.",
    discordUrl: "https://discord.gg/neonroot-games",
    gameIds: ["neon-dash-arena", "circuit-breakers"],
  },
  {
    id: "dev-hollowtide",
    slug: "hollowtide-collective",
    name: "Hollowtide Collective",
    avatarUrl: "https://picsum.photos/seed/hollowtide/200",
    memberCount: 5,
    description:
      "Storytelling-getriebenes Studio, das narrative Horror- und Mystery-Erfahrungen baut.",
    discordUrl: "https://discord.gg/hollowtide",
    gameIds: ["the-drowned-manor"],
  },
  {
    id: "dev-pixelforge",
    slug: "pixelforge-crew",
    name: "PixelForge Crew",
    avatarUrl: "https://picsum.photos/seed/pixelforge/200",
    memberCount: 9,
    description: "Baut Tycoon- und Simulationsspiele mit klarem Wachstumsfokus.",
    discordUrl: "https://discord.gg/pixelforge",
    gameIds: ["bakery-tycoon-2", "junkyard-empire"],
  },
  {
    id: "dev-luminary",
    slug: "luminary-works",
    name: "Luminary Works",
    avatarUrl: "https://picsum.photos/seed/luminary/200",
    memberCount: 3,
    description: "Zwei-Personen-Team mit einem überraschend viralen Plattformer.",
    discordUrl: "https://discord.gg/luminary-works",
    gameIds: ["skybound-sprint"],
  },
  {
    id: "dev-ironclad",
    slug: "ironclad-labs",
    name: "Ironclad Labs",
    avatarUrl: "https://picsum.photos/seed/ironclad/200",
    memberCount: 15,
    description: "Ambitioniertes Team, das ein PvP-Battle-Royale mit eigenem Twist entwickelt.",
    discordUrl: "https://discord.gg/ironclad-labs",
    gameIds: ["scrapyard-royale"],
  },
];

interface GameSeed {
  id: string;
  slug: string;
  name: string;
  genre: string;
  description: string;
  createdDaysAgo: number;
  updatedDaysAgo: number;
  developerId: string;
  groupName?: string;
  currentPlayers: number;
  visits: number;
  likes: number;
  dislikes: number;
  favorites: number;
  growth24h: number;
  growth7d: number;
  editorsPick: boolean;
  discordSource: "game" | "group";
}

const seeds: GameSeed[] = [
  {
    id: "glacier-outpost",
    slug: "glacier-outpost",
    name: "Glacier Outpost",
    genre: "Survival",
    description:
      "Baue und verteidige eine Forschungsstation in einer prozedural generierten Eiswüste, bevor Schneestürme und Kälte dich zermürben.",
    createdDaysAgo: 42,
    updatedDaysAgo: 1,
    developerId: "dev-frostbyte",
    groupName: "Frostbyte Studios",
    currentPlayers: 340,
    visits: 128000,
    likes: 4100,
    dislikes: 180,
    favorites: 6200,
    growth24h: 18.4,
    growth7d: 92.1,
    editorsPick: true,
    discordSource: "group",
  },
  {
    id: "frozen-depths",
    slug: "frozen-depths",
    name: "Frozen Depths",
    genre: "Horror",
    description:
      "Tauche in ein verlassenes Unterwasserlabor unter dem Eis ab und finde heraus, was mit der Crew geschehen ist.",
    createdDaysAgo: 9,
    updatedDaysAgo: 2,
    developerId: "dev-frostbyte",
    groupName: "Frostbyte Studios",
    currentPlayers: 76,
    visits: 9400,
    likes: 610,
    dislikes: 40,
    favorites: 890,
    growth24h: 34.2,
    growth7d: 210.5,
    editorsPick: false,
    discordSource: "group",
  },
  {
    id: "neon-dash-arena",
    slug: "neon-dash-arena",
    name: "Neon Dash Arena",
    genre: "Arcade",
    description:
      "Schnelles 1v1-Parkour-Rennen durch neonbeleuchtete Arenen mit wöchentlichen Ranglisten.",
    createdDaysAgo: 65,
    updatedDaysAgo: 3,
    developerId: "dev-neonroot",
    groupName: "NeonRoot Games",
    currentPlayers: 610,
    visits: 310000,
    likes: 15200,
    dislikes: 900,
    favorites: 21000,
    growth24h: 6.1,
    growth7d: 28.3,
    editorsPick: false,
    discordSource: "game",
  },
  {
    id: "circuit-breakers",
    slug: "circuit-breakers",
    name: "Circuit Breakers",
    genre: "Puzzle",
    description:
      "Löse Schaltkreis-Rätsel gegen die Zeit in einem Cyberpunk-Setting mit Koop-Modus für bis zu 3 Spieler.",
    createdDaysAgo: 4,
    updatedDaysAgo: 0,
    developerId: "dev-neonroot",
    groupName: "NeonRoot Games",
    currentPlayers: 58,
    visits: 3100,
    likes: 240,
    dislikes: 12,
    favorites: 410,
    growth24h: 61.0,
    growth7d: 340.0,
    editorsPick: true,
    discordSource: "game",
  },
  {
    id: "the-drowned-manor",
    slug: "the-drowned-manor",
    name: "The Drowned Manor",
    genre: "Mystery",
    description:
      "Erkunde ein überflutetes Herrenhaus, sammle Hinweise und entkomme, bevor die Flut steigt.",
    createdDaysAgo: 21,
    updatedDaysAgo: 5,
    developerId: "dev-hollowtide",
    groupName: "Hollowtide Collective",
    currentPlayers: 430,
    visits: 87000,
    likes: 5300,
    dislikes: 260,
    favorites: 7100,
    growth24h: 4.8,
    growth7d: 15.2,
    editorsPick: false,
    discordSource: "group",
  },
  {
    id: "bakery-tycoon-2",
    slug: "bakery-tycoon-2",
    name: "Bakery Tycoon 2",
    genre: "Simulation",
    description:
      "Baue dein Backwaren-Imperium von einem winzigen Stand bis zur landesweiten Kette aus.",
    createdDaysAgo: 120,
    updatedDaysAgo: 1,
    developerId: "dev-pixelforge",
    groupName: "PixelForge Crew",
    currentPlayers: 890,
    visits: 540000,
    likes: 22000,
    dislikes: 1400,
    favorites: 31000,
    growth24h: 2.1,
    growth7d: 9.4,
    editorsPick: false,
    discordSource: "game",
  },
  {
    id: "junkyard-empire",
    slug: "junkyard-empire",
    name: "Junkyard Empire",
    genre: "Simulation",
    description:
      "Sammle Schrott, baue Maschinen und verwandle einen verlassenen Schrottplatz in ein florierendes Recycling-Imperium.",
    createdDaysAgo: 15,
    updatedDaysAgo: 1,
    developerId: "dev-pixelforge",
    groupName: "PixelForge Crew",
    currentPlayers: 215,
    visits: 41000,
    likes: 2800,
    dislikes: 150,
    favorites: 3600,
    growth24h: 22.6,
    growth7d: 145.0,
    editorsPick: true,
    discordSource: "game",
  },
  {
    id: "skybound-sprint",
    slug: "skybound-sprint",
    name: "Skybound Sprint",
    genre: "Platformer",
    description:
      "Ein rasanter 3D-Plattformer über schwebenden Inseln mit Wallrun- und Gleiter-Mechaniken.",
    createdDaysAgo: 30,
    updatedDaysAgo: 2,
    developerId: "dev-luminary",
    groupName: "Luminary Works",
    currentPlayers: 495,
    visits: 190000,
    likes: 12400,
    dislikes: 500,
    favorites: 16800,
    growth24h: 12.9,
    growth7d: 58.7,
    editorsPick: false,
    discordSource: "game",
  },
  {
    id: "scrapyard-royale",
    slug: "scrapyard-royale",
    name: "Scrapyard Royale",
    genre: "Battle Royale",
    description:
      "50 Spieler, ein schrumpfender Schrottplatz und improvisierte Waffen aus gefundenem Müll.",
    createdDaysAgo: 3,
    updatedDaysAgo: 0,
    developerId: "dev-ironclad",
    groupName: "Ironclad Labs",
    currentPlayers: 41,
    visits: 2100,
    likes: 150,
    dislikes: 8,
    favorites: 260,
    growth24h: 88.0,
    growth7d: 88.0,
    editorsPick: false,
    discordSource: "group",
  },
  {
    id: "moss-hollow",
    slug: "moss-hollow",
    name: "Moss Hollow",
    genre: "Adventure",
    description:
      "Ein ruhiges Erkundungsspiel durch einen verwunschenen Wald voller versteckter Schreine.",
    createdDaysAgo: 55,
    updatedDaysAgo: 4,
    developerId: "dev-hollowtide",
    groupName: "Hollowtide Collective",
    currentPlayers: 128,
    visits: 34000,
    likes: 2600,
    dislikes: 90,
    favorites: 4400,
    growth24h: 5.5,
    growth7d: 22.0,
    editorsPick: false,
    discordSource: "group",
  },
  {
    id: "voltage-drift",
    slug: "voltage-drift",
    name: "Voltage Drift",
    genre: "Racing",
    description:
      "Arcade-Driftrennen durch eine elektrisierte Stadt bei Nacht mit anpassbaren E-Fahrzeugen.",
    createdDaysAgo: 12,
    updatedDaysAgo: 1,
    developerId: "dev-neonroot",
    groupName: "NeonRoot Games",
    currentPlayers: 302,
    visits: 61000,
    likes: 4700,
    dislikes: 220,
    favorites: 6100,
    growth24h: 26.3,
    growth7d: 130.8,
    editorsPick: true,
    discordSource: "game",
  },
  {
    id: "hollow-star-mining-co",
    slug: "hollow-star-mining-co",
    name: "Hollow Star Mining Co.",
    genre: "Simulation",
    description:
      "Baue eine Asteroiden-Minenkolonie auf, verwalte Sauerstoffreserven und handle mit vorbeiziehenden Frachtern.",
    createdDaysAgo: 6,
    updatedDaysAgo: 0,
    developerId: "dev-pixelforge",
    groupName: "PixelForge Crew",
    currentPlayers: 33,
    visits: 1800,
    likes: 110,
    dislikes: 5,
    favorites: 190,
    growth24h: 45.0,
    growth7d: 250.0,
    editorsPick: false,
    discordSource: "game",
  },
];

export const games: Game[] = seeds.map((seed) => {
  // Discord-Invite steckt je nach Quelle in der Spiel- oder Gruppenbeschreibung,
  // genau wie es die echte Erkennung später bei echten Roblox-Texten vorfindet.
  const gameDescriptionRaw =
    seed.discordSource === "game"
      ? `${seed.description} Offizieller Discord: https://discord.gg/${seed.slug}`
      : seed.description;
  const groupDescriptionRaw =
    seed.discordSource === "group"
      ? `Offizielle Gruppe von ${seed.groupName}. Community & Support: https://discord.gg/${seed.slug}`
      : `Offizielle Gruppe von ${seed.groupName}.`;

  const discord = detectOfficialDiscord({
    gameDescription: gameDescriptionRaw,
    groupDescription: groupDescriptionRaw,
  });

  const score = calculateHiddenGemScore({
    currentPlayers: seed.currentPlayers,
    growth24h: seed.growth24h,
    growth7d: seed.growth7d,
    likes: seed.likes,
    dislikes: seed.dislikes,
    favorites: seed.favorites,
    visits: seed.visits,
    ageDays: seed.createdDaysAgo,
    daysSinceLastUpdate: seed.updatedDaysAgo,
  });

  return {
    id: seed.id,
    slug: seed.slug,
    name: seed.name,
    thumbnailUrl: `https://picsum.photos/seed/${seed.slug}/600/338`,
    genre: seed.genre,
    description: seed.description,
    createdAt: daysAgo(seed.createdDaysAgo),
    lastUpdatedAt: daysAgo(seed.updatedDaysAgo),
    developerId: seed.developerId,
    groupName: seed.groupName,
    robloxUrl: `https://www.roblox.com/games/0000000/${seed.slug}`,
    currentPlayers: seed.currentPlayers,
    visits: seed.visits,
    likes: seed.likes,
    dislikes: seed.dislikes,
    favorites: seed.favorites,
    growth24h: seed.growth24h,
    growth7d: seed.growth7d,
    hiddenGemScore: score.total,
    editorsPick: seed.editorsPick,
    discord,
    statHistory: generateHistory(
      Math.min(seed.createdDaysAgo, 30),
      seed.currentPlayers,
      seed.visits,
      seed.favorites
    ),
  };
});

export function getGameBySlug(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug);
}

export function getDeveloperBySlug(slug: string): Developer | undefined {
  return developers.find((d) => d.slug === slug);
}

export function getDeveloperForGame(game: Game): Developer | undefined {
  return developers.find((d) => d.id === game.developerId);
}

export function getGamesForDeveloper(developerId: string): Game[] {
  return games.filter((g) => g.developerId === developerId);
}
