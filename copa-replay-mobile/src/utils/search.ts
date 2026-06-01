export function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

const TEAM_ALIASES: Record<string, string[]> = {
  brasil: ["brazil"],
  alemanha: ["germany"],
  franca: ["france"],
  espanha: ["spain"],
  italia: ["italy"],
  japao: ["japan"],
  coreia: ["korea"],
  "coreia do sul": ["korea republic", "south korea"],
  "costa do marfim": ["ivory coast", "cote d'ivoire"],
  marrocos: ["morocco"],
  estados: ["united states", "usa"],
  "estados unidos": ["united states", "usa"],
  mexico: ["mexico"],
  argentina: ["argentina"],
  portugal: ["portugal"],
  inglaterra: ["england"],
  uruguai: ["uruguay"],
  suica: ["switzerland"],
  belgica: ["belgium"],
  holanda: ["netherlands"],
  paisesbaixos: ["netherlands"],
  "paises baixos": ["netherlands"]
};

export function searchTerms(value: string) {
  const normalized = normalizeSearchText(value);
  return [normalized, ...(TEAM_ALIASES[normalized] ?? [])].filter(Boolean);
}
