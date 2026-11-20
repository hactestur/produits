/**
 * Configuration Officielle de l'Entreprise — Saveurs d'Or / AMIGO
 * 
 * Centralisation de l'identité de marque, des coordonnées et des paramètres
 * commerciaux pour la distribution alimentaire au Cameroun.
 */
export const COMPANY_CONFIG = {
  brandName: "Saveurs d'Or",
  parentCompany: "AMIGO",
  legalName: "AMIGO Distribution Alimentaire S.A.",
  fullName: "Saveurs d'Or by AMIGO",
  tagline: "Épicerie Fine & Distribution Alimentaire à Douala",
  subTagline: "Grossiste & Demi-gros en Produits d'Épicerie Sélectionnés",
  description: "Sélection de produits d'épicerie fine, grossiste et demi-gros en denrées de qualité supérieure à Douala : riz parfumé, huiles végétales pures, conserves, farines panifiables, sucres et boissons. Tarifs officiels en FCFA et disponibilités actualisés.",
  currency: "FCFA",
  
  // Coordonnées officielles
  phone: "+237 693 54 46 73",
  phoneRaw: "+237693544673",
  whatsapp: "+237 699 34 23 12",
  whatsappRaw: "237699342312",
  email: "contact@amigo.cm",
  adminDemoEmail: "admin@amigo.cm",
  
  // Localisation
  city: "Douala",
  country: "Cameroun",
  address: "Marché Makepe Missoke, Douala, Cameroun",
  googleMapsQuery: "Marche Makepe Missoke, Douala, Cameroun",
  openingHours: "Lundi au Samedi : 07h30 – 18h30 (Fermé le Dimanche)",
  
  // Mentions commerciales
  catalogNotice: "Ce catalogue présente notre sélection d'épicerie fine et de denrées de grande consommation pour les commerçants, demi-grossistes, restaurateurs et particuliers. Les prix sont exprimés en Francs CFA (FCFA).",
  orderDisclaimer: "Ceci est une demande de commande indicative. Aucun paiement en ligne n'est effectué sur cette plateforme. La disponibilité des stocks, les frais de livraison éventuels et les modalités de règlement sont confirmés directement par notre équipe commerciale via WhatsApp ou téléphone.",
  
  // Engagements
  advantages: [
    {
      title: "Sélection Rigoureuse & Stock Garanti",
      description: "Approvisionnement continu en riz parfumé, huiles pures, conserves et farines certifiées.",
      icon: "PackageCheck",
    },
    {
      title: "Tarifs Direct Grossiste en FCFA",
      description: "Prix transparents et dégressifs adaptés aux revendeurs, traiteurs et familles.",
      icon: "Coins",
    },
    {
      title: "Retrait Dépôt ou Livraison Douala",
      description: "Enlèvement direct au Marché Makepe Missoke ou expédition organisée sur Douala et environs.",
      icon: "Truck",
    },
    {
      title: "Conseil & Service Client WhatsApp",
      description: "Écoute et confirmation réactive de notre équipe commerciale du lundi au samedi.",
      icon: "MessageSquare",
    },
  ],
  
  // Rétrocompatibilité avec le code existant
  name: "Saveurs d'Or",
};
