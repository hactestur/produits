/**
 * Utilitaires de formatage et de manipulation de données
 * pour la plateforme AMIGO (Cameroun - FCFA)
 */

import { COMPANY_CONFIG } from '../config/company';

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
 * Nettoie et fiabilise un nom de catégorie (supprime les artefacts ou libellés corrompus comme 'blesliquide')
 */
export function sanitizeCategoryName(name: string | null | undefined): string {
  if (!name) return 'Autre rayon';
  let cleaned = name.trim();
  // Correction spécifique pour les libellés corrompus répertoriés
  if (/blesliquide/i.test(cleaned)) {
    cleaned = cleaned.replace(/blesliquide/gi, 'Huiles & Boissons');
  }
  // Supprime d'éventuels caractères de contrôle
  // oxlint-disable-next-line no-control-regex
  cleaned = cleaned.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
  return cleaned || 'Rayon Alimentaire';
}

/**
 * Extrait intelligemment le conditionnement ou la marque depuis le nom du produit
 * si non spécifié en base de données.
 */
export function inferPackaging(name: string): string {
  const match = name.match(/—\s*([^—]+)$/) || name.match(/\(([^)]+)\)$/) || name.match(/(Sac\s+\d+\s*kg|Carton\s+[^—]+|Bidon\s+\d+\s*[Ll]|Bouteille\s+[^—]+)/i);
  if (match && match[1]) {
    return match[1].trim();
  }
  if (/sac/i.test(name)) return 'Sac';
  if (/carton/i.test(name)) return 'Carton';
  if (/bidon/i.test(name)) return 'Bidon';
  if (/bouteille/i.test(name)) return 'Bouteille';
  return 'Conditionnement standard';
}

/**
 * Génère une référence SKU lisible pour un produit
 */
export function generateProductSku(name: string, id: string): string {
  const prefix = slugify(name).slice(0, 8).toUpperCase();
  const shortId = id.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase() || '001';
  return `AM-${prefix}-${shortId}`;
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

export interface WhatsAppOrderDetails {
  client: {
    fullName: string;
    phone: string;
    city: string;
    neighborhood: string;
    email?: string;
    notes?: string;
  };
  items: Array<{
    name: string;
    packaging?: string | null;
    sku?: string | null;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
  totalAmount: number;
}

/**
 * Construit un message WhatsApp officiel, clair, structuré et professionnel
 * pour la transmission de commande au Cameroun (+237).
 */
export function buildWhatsAppOrderMessage(order: WhatsAppOrderDetails): string {
  const dateStr = new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date());

  const lines: string[] = [];

  lines.push(`Bonjour l'équipe commerciale de *${COMPANY_CONFIG.name}*,`);
  lines.push(``);
  lines.push(`Je souhaite soumettre une *demande de commande* depuis votre catalogue en ligne.`);
  lines.push(`Date : ${dateStr}`);
  lines.push(``);
  lines.push(`━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`👤 *COORDONNÉES CLIENT*`);
  lines.push(`• *Nom & Prénom* : ${order.client.fullName}`);
  lines.push(`• *Téléphone* : ${order.client.phone}`);
  lines.push(`• *Ville* : ${order.client.city}`);
  lines.push(`• *Quartier / Adresse* : ${order.client.neighborhood}`);
  if (order.client.email) {
    lines.push(`• *Email* : ${order.client.email}`);
  }
  lines.push(`━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(``);
  lines.push(`📦 *DÉTAIL DE LA DEMANDE* (${order.items.length} article${order.items.length > 1 ? 's' : ''}) :`);
  lines.push(``);

  order.items.forEach((item, index) => {
    const packagingStr = item.packaging ? ` (${item.packaging})` : '';
    const refStr = item.sku ? ` [Réf: ${item.sku}]` : '';
    lines.push(`${index + 1}. *${item.name}*${packagingStr}${refStr}`);
    lines.push(`   ▸ Quantité : *${item.quantity}*`);
    lines.push(`   ▸ Prix unitaire : ${formatFCFA(item.unitPrice)}`);
    lines.push(`   ▸ Sous-total : *${formatFCFA(item.subtotal)}*`);
    lines.push(``);
  });

  lines.push(`━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`💰 *MONTANT TOTAL INDICATIF* : *${formatFCFA(order.totalAmount)}*`);
  lines.push(`━━━━━━━━━━━━━━━━━━━━━`);

  if (order.client.notes && order.client.notes.trim()) {
    lines.push(``);
    lines.push(`💬 *Précision ou instructions* :`);
    lines.push(`"${order.client.notes.trim()}"`);
  }

  lines.push(``);
  lines.push(`Merci de bien vouloir vérifier la disponibilité des stocks et me confirmer les modalités de commande, d'enlèvement ou de livraison à Douala.`);
  lines.push(``);
  lines.push(`Bien cordialement,`);
  lines.push(`*${order.client.fullName}*`);

  return lines.join('\n');
}
