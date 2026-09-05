/**
 * IC CMS PRO - Volume 2C: Product Matching & Shopping Intelligence Engine
 * Scores every product based on user intent, foot ergonomics, materials, usage scenarios,
 * and generates matching scores with reasons and comparisons.
 */

import { CollectionItem } from '../../types';
import { COLLECTION_ITEMS } from '../../constants/data';

export interface ProductMatchResult {
  product: CollectionItem;
  score: number; // 0 to 100
  matchReason: string;
  recommendedFor: string;
}

export interface ComparisonResult {
  productA: CollectionItem;
  productB: CollectionItem;
  comparisonPoints: Array<{
    feature: string;
    valueA: string;
    valueB: string;
  }>;
  verdict: string;
}

export class ProductMatchingEngine {
  /**
   * Scores all collection items based on user query keywords, foot ergonomics, and usage scenarios.
   * Returns top matching products sorted by recommendation score (Max 3).
   */
  public matchProducts(userQuery: string, activeProduct?: CollectionItem | null): ProductMatchResult[] {
    const qLower = (userQuery || '').toLowerCase().trim();
    const scoredList: ProductMatchResult[] = [];

    COLLECTION_ITEMS.forEach((item) => {
      let score = 50; // Base score
      const reasons: string[] = [];

      const name = (item.name || '').toLowerCase();
      const cat = (item.category || '').toLowerCase();
      const desc = (item.description || '').toLowerCase();
      const tagline = (item.tagline || '').toLowerCase();
      const featuresStr = (item.features || []).join(' ').toLowerCase();
      const materialsStr = (item.materials || []).join(' ').toLowerCase();

      // 1. Foot Ergonomics & Fit Matching
      if (qLower.includes('taraklı') || qLower.includes('ödem') || qLower.includes('geniş') || qLower.includes('rahat kalıp')) {
        if (featuresStr.includes('tokalar') || featuresStr.includes('ayarlanabilir') || featuresStr.includes('cırt') || name.includes('tokalı') || desc.includes('cırtlı')) {
          score += 30;
          reasons.push('Ayarlanabilir bantlı yapısı ile taraklı ayaklara tam uyum sağlar.');
        } else {
          score += 15;
        }
      }

      // 2. Long Standing / Hospital / Sabo / Comfort Intent
      if (qLower.includes('hastane') || qLower.includes('sabo') || qLower.includes('ayakta duran') || qLower.includes('ağrı') || qLower.includes('ortopedik') || qLower.includes('nöbet')) {
        if (cat.includes('sabo') || featuresStr.includes('ortopedik') || featuresStr.includes('topuk dikeni') || featuresStr.includes('perfore')) {
          score += 35;
          reasons.push('Topuk ve bel yükünü azaltan ortopedik jel pedli tabana sahiptir.');
        } else if (featuresStr.includes('anatomik')) {
          score += 20;
          reasons.push('Anatomik taban desteği ile uzun süreli yürüyüşlerde konfor sunar.');
        }
      }

      // 3. Genuine Leather / Material Intent
      if (qLower.includes('deri') || qLower.includes('hakiki') || qLower.includes('terleme') || qLower.includes('nefes')) {
        if (materialsStr.includes('hakiki') || materialsStr.includes('dana derisi') || featuresStr.includes('nefes alan')) {
          score += 25;
          reasons.push('%100 Hakiki deri saya ve nefes alan deri astar terlemeyi engeller.');
        }
      }

      // 4. Summer / Sandal / Outdoor Yürüyüş Intent
      if (qLower.includes('yaz') || qLower.includes('sandalet') || qLower.includes('yürüyüş') || qLower.includes('tatil')) {
        if (cat.includes('sandalet') || name.includes('sandalet') || desc.includes('yazlık')) {
          score += 30;
          reasons.push('Bileği güvenle saran yazlık şık ve esnek tasarım.');
        }
      }

      // 5. Direct Category or Name match
      if (name.includes(qLower) || cat.includes(qLower)) {
        score += 35;
        reasons.push('Aramanızla doğrudan eşleşen kategori ve model ismi.');
      }

      // 6. Active Product Boost (if relevant)
      if (activeProduct && activeProduct.id === item.id) {
        score += 10;
      }

      // Cap score at 99
      const finalScore = Math.min(Math.max(score, 60), 98);

      const mainReason = reasons.length > 0 
        ? reasons[0] 
        : `${item.category} kategorisinde anatomik %100 hakiki deri comfort model.`;

      scoredList.push({
        product: item,
        score: finalScore,
        matchReason: mainReason,
        recommendedFor: item.subtitle
      });
    });

    // Sort descending by score
    scoredList.sort((a, b) => b.score - a.score);

    // Return top 3 products
    return scoredList.slice(0, 3);
  }

  /**
   * Compares two products and generates a structured comparison matrix
   */
  public compareProducts(prodA: CollectionItem, prodB: CollectionItem): ComparisonResult {
    return {
      productA: prodA,
      productB: prodB,
      comparisonPoints: [
        {
          feature: 'Taban Ergonomisi',
          valueA: prodA.features.find(f => f.includes('taban')) || 'Anatomik Kavisli Taban',
          valueB: prodB.features.find(f => f.includes('taban')) || 'Anatomik Kavisli Taban'
        },
        {
          feature: 'Saya & Astar',
          valueA: prodA.materials[0] || '%100 Hakiki Deri',
          valueB: prodB.materials[0] || '%100 Hakiki Deri'
        },
        {
          feature: 'Kullanım Alanı',
          valueA: prodA.category,
          valueB: prodB.category
        },
        {
          feature: 'Ayağa Uyum / Kalıp',
          valueA: prodA.features.some(f => f.includes('tokal') || f.includes('cırt')) ? 'Ayarlanabilir (Taraklı Ayaklar İçin İdeal)' : 'Standart Regular Fit',
          valueB: prodB.features.some(f => f.includes('tokal') || f.includes('cırt')) ? 'Ayarlanabilir (Taraklı Ayaklar İçin İdeal)' : 'Standart Regular Fit'
        }
      ],
      verdict: `Her iki modelimiz de %100 hakiki deriden Manisa atölyemizde üretilmektedir. ${prodA.name} günlük şıklık ve pratiklik sunarken, ${prodB.name} uzun ayakta durmalar ve özel ihtiyaçlar için idealdir.`
    };
  }
}

export const productMatchingEngine = new ProductMatchingEngine();
