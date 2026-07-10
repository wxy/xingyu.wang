export function parseShieldValue(raw: string): number | null {
  const value = raw.trim().toLowerCase();
  if (!value || value === "n/a" || value === "not found") return null;

  const match = value.match(/^([\d.]+)\s*([kmb])?$/i);
  if (!match) {
    const plain = Number(value.replace(/,/g, ""));
    return Number.isFinite(plain) ? plain : null;
  }

  const num = Number(match[1]);
  if (!Number.isFinite(num)) return null;

  const suffix = match[2]?.toLowerCase();
  if (suffix === "k") return Math.round(num * 1_000);
  if (suffix === "m") return Math.round(num * 1_000_000);
  if (suffix === "b") return Math.round(num * 1_000_000_000);
  return Math.round(num);
}

export async function fetchChromeStoreUsers(
  chromeStoreId: string,
): Promise<number | null> {
  try {
    const res = await fetch(
      `https://img.shields.io/chrome-web-store/users/${chromeStoreId}.json`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;

    const data = (await res.json()) as { message?: string };
    if (!data.message) return null;
    return parseShieldValue(data.message);
  } catch {
    return null;
  }
}

export async function fetchChromeStoreRating(
  chromeStoreId: string,
): Promise<number | null> {
  try {
    const res = await fetch(
      `https://img.shields.io/chrome-web-store/rating/${chromeStoreId}.json`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;

    const data = (await res.json()) as { message?: string };
    if (!data.message) return null;
    const rating = Number(data.message.split("/")[0]);
    return Number.isFinite(rating) ? rating : null;
  } catch {
    return null;
  }
}
