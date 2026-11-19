/**
 * Formate un montant en Francs CFA (FCFA)
 * Exemple : 15000 -> "15 000 FCFA"
 */
export function formatFCFA(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0 FCFA';
  }
  // Formatage avec séparateur d'espace insécable standard en français
  const formatted = new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));

  return `${formatted} FCFA`;
}

/**
 * Formate une date ISO en chaîne lisible en français
 */
export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return isoString;
  }
}

/**
 * Crée un slug URL propre à partir d'un nom de produit ou catégorie
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '') // Supprime les caractères spéciaux
    .replace(/\s+/g, '-') // Remplace les espaces par des tirets
    .replace(/-+/g, '-'); // Évite les tirets consécutifs
}

/**
 * Nettoie une chaîne de recherche utilisateur (espaces multiples, trim)
 */
export function cleanSearchTerm(term: string): string {
  return term.trim().replace(/\s+/g, ' ');
}
