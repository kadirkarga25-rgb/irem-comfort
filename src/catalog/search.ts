import type { Catalog } from './db';

export type SearchHit = { catalog: Catalog; page: number; title: string; snippet: string };

export function searchCatalogs(catalogs: Catalog[], query: string): SearchHit[] {
  const q = query.trim().toLocaleLowerCase('tr-TR');
  if (!q) return [];
  const hits: SearchHit[] = [];
  for (const catalog of catalogs) {
    const catalogText = [catalog.title, catalog.year, catalog.season, catalog.description, ...(catalog.tags || []), ...(catalog.collections || []).map(c => c.name)].join(' ').toLocaleLowerCase('tr-TR');
    if (catalogText.includes(q)) hits.push({ catalog, page: 1, title: catalog.title, snippet: `${catalog.year} · ${catalog.season}` });
    (catalog.pageTexts || []).forEach((text, index) => {
      if (!text.toLocaleLowerCase('tr-TR').includes(q)) return;
      const clean = text.replace(/\s+/g, ' ').trim();
      const at = clean.toLocaleLowerCase('tr-TR').indexOf(q);
      hits.push({ catalog, page: index + 1, title: clean.slice(Math.max(0, at - 30), at + q.length + 70) || `Sayfa ${index + 1}`, snippet: `Sayfa ${index + 1}` });
    });
    catalog.contents.forEach(item => { if (item.title.toLocaleLowerCase('tr-TR').includes(q)) hits.push({ catalog, page: item.page, title: item.title, snippet: `İçindekiler · Sayfa ${item.page}` }); });
  }
  return hits.slice(0, 80);
}
