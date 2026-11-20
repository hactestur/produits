import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { formatFCFA, buildWhatsAppOrderMessage } from '../../utils/formatters';
import { COMPANY_CONFIG } from '../../config/company';
import type { ClientOrderInfo } from '../../types/cart';
import {
  X,
  ArrowLeft,
  ArrowRight,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Copy,
  AlertCircle,
  Phone,
  User,
  MapPin,
  Mail,
  FileText,
  ExternalLink,
} from 'lucide-react';

export const OrderRequestModal: React.FC = () => {
  const { items, totalAmount, totalItems, isOrderModalOpen, closeOrderModal, clearCart } =
    useCart();

  // Étapes : 1 = Coordonnées, 2 = Récapitulatif & Confirmation, 3 = Transmis WhatsApp
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Formulaire client
  const [clientInfo, setClientInfo] = useState<ClientOrderInfo>({
    fullName: '',
    phone: '',
    city: 'Douala',
    neighborhood: '',
    email: '',
    notes: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [confirmedCheck, setConfirmedCheck] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [isSending, setIsSending] = useState(false);

  if (!isOrderModalOpen) return null;

  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};

    if (!clientInfo.fullName.trim()) {
      errors.fullName = 'Veuillez renseigner votre nom complet.';
    }

    const cleanPhone = clientInfo.phone.replace(/[\s-]/g, '');
    if (!cleanPhone) {
      errors.phone = 'Le numéro de téléphone est obligatoire.';
    } else if (cleanPhone.length < 8) {
      errors.phone = 'Veuillez saisir un numéro de téléphone valide (ex: 699 34 23 12).';
    }

    if (!clientInfo.city.trim()) {
      errors.city = 'Veuillez préciser votre ville.';
    }

    if (!clientInfo.neighborhood.trim()) {
      errors.neighborhood = 'Veuillez indiquer votre quartier ou point de repère.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextToSummary = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBackToForm = () => {
    setStep(1);
  };

  const handleCopyMessage = async () => {
    const message = buildWhatsAppOrderMessage({
      client: clientInfo,
      items: items.map((i) => ({
        name: i.product.name,
        packaging: i.product.packaging,
        sku: i.product.sku,
        quantity: i.quantity,
        unitPrice: i.product.price,
        subtotal: i.quantity * i.product.price,
      })),
      totalAmount,
    });

    try {
      await navigator.clipboard.writeText(message);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 3000);
    } catch (e) {
      console.warn('Impossible de copier dans le presse-papier:', e);
    }
  };

  const handleSendWhatsApp = () => {
    if (!confirmedCheck) return;

    setIsSending(true);

    const message = buildWhatsAppOrderMessage({
      client: clientInfo,
      items: items.map((i) => ({
        name: i.product.name,
        packaging: i.product.packaging,
        sku: i.product.sku,
        quantity: i.quantity,
        unitPrice: i.product.price,
        subtotal: i.quantity * i.product.price,
      })),
      totalAmount,
    });

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${COMPANY_CONFIG.whatsappRaw}?text=${encodedMessage}`;

    // Ouvrir WhatsApp dans un nouvel onglet
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    setIsSending(false);
    setStep(3);
  };

  const handleFinish = (shouldClear = true) => {
    if (shouldClear) {
      clearCart();
    }
    closeOrderModal();
    setStep(1);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-forest-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-modal-title"
    >
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-warm-xl overflow-hidden border border-cream-200 my-auto flex flex-col max-h-[94vh]">
        {/* En-tête Modal */}
        <div className="p-4 sm:p-6 bg-forest-950 text-white flex items-center justify-between shrink-0 border-b border-forest-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest-800 border border-forest-700 text-gold-400 flex items-center justify-center shadow-warm-xs">
              <MessageSquare className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="order-modal-title" className="text-lg sm:text-xl font-serif font-black tracking-tight">
                Demande de Commande {COMPANY_CONFIG.brandName}
              </h2>
              <p className="text-xs text-cream-300">
                {step === 1 && 'Étape 1/2 : Vos coordonnées pour la livraison'}
                {step === 2 && 'Étape 2/2 : Vérification & Transmission WhatsApp'}
                {step === 3 && 'Demande prête pour transmission'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeOrderModal}
            className="p-2 text-cream-400 hover:text-white rounded-xl hover:bg-forest-900 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Fermer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Corps selon l'étape */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* ÉTAPE 1 : COORDONNÉES */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-cream-100/90 border border-cream-300 text-earth-900 text-xs sm:text-sm flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-forest-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-forest-950">Commande directe sans paiement en ligne</p>
                  <p className="text-earth-700 leading-relaxed text-xs">
                    Renseignez vos coordonnées à Douala ou environs. Notre équipe commerciale réceptionne votre sélection sur WhatsApp pour valider la disponibilité et planifier l'enlèvement ou la livraison.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nom & Prénom */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-forest-950 uppercase tracking-wider mb-1.5">
                    Nom et Prénom (ou Nom de votre Entreprise / Échoppe) <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 text-earth-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Ex: Jean Paul Kamga / Alimentation du Marché"
                      value={clientInfo.fullName}
                      onChange={(e) => setClientInfo({ ...clientInfo, fullName: e.target.value })}
                      className={`w-full pl-11 pr-4 py-3 bg-white border rounded-xl text-earth-950 text-sm min-h-[48px] focus:ring-2 focus:ring-forest-700 ${
                        formErrors.fullName ? 'border-rose-500 bg-rose-50/30' : 'border-cream-300'
                      }`}
                    />
                  </div>
                  {formErrors.fullName && (
                    <p className="mt-1 text-xs text-rose-600">{formErrors.fullName}</p>
                  )}
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-xs font-bold text-forest-950 uppercase tracking-wider mb-1.5">
                    Numéro de Téléphone (WhatsApp de préférence) <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-5 h-5 text-earth-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="tel"
                      placeholder="+237 6XX XX XX XX"
                      value={clientInfo.phone}
                      onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                      className={`w-full pl-11 pr-4 py-3 bg-white border rounded-xl text-earth-950 text-sm min-h-[48px] focus:ring-2 focus:ring-forest-700 ${
                        formErrors.phone ? 'border-rose-500 bg-rose-50/30' : 'border-cream-300'
                      }`}
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="mt-1 text-xs text-rose-600">{formErrors.phone}</p>
                  )}
                </div>

                {/* Ville */}
                <div>
                  <label className="block text-xs font-bold text-forest-950 uppercase tracking-wider mb-1.5">
                    Ville <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-5 h-5 text-earth-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Douala"
                      value={clientInfo.city}
                      onChange={(e) => setClientInfo({ ...clientInfo, city: e.target.value })}
                      className={`w-full pl-11 pr-4 py-3 bg-white border rounded-xl text-earth-950 text-sm min-h-[48px] focus:ring-2 focus:ring-forest-700 ${
                        formErrors.city ? 'border-rose-500 bg-rose-50/30' : 'border-cream-300'
                      }`}
                    />
                  </div>
                  {formErrors.city && (
                    <p className="mt-1 text-xs text-rose-600">{formErrors.city}</p>
                  )}
                </div>

                {/* Quartier / Repère de livraison */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-forest-950 uppercase tracking-wider mb-1.5">
                    Quartier, Marché ou Adresse de livraison <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-5 h-5 text-earth-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Ex: Makepe Missoke, Akwa, Bonanjo, Deido, Bassa..."
                      value={clientInfo.neighborhood}
                      onChange={(e) =>
                        setClientInfo({ ...clientInfo, neighborhood: e.target.value })
                      }
                      className={`w-full pl-11 pr-4 py-3 bg-white border rounded-xl text-earth-950 text-sm min-h-[48px] focus:ring-2 focus:ring-forest-700 ${
                        formErrors.neighborhood
                          ? 'border-rose-500 bg-rose-50/30'
                          : 'border-cream-300'
                      }`}
                    />
                  </div>
                  {formErrors.neighborhood && (
                    <p className="mt-1 text-xs text-rose-600">{formErrors.neighborhood}</p>
                  )}
                </div>

                {/* Email (Facultatif) */}
                <div>
                  <label className="block text-xs font-bold text-forest-950 uppercase tracking-wider mb-1.5">
                    Adresse E-mail <span className="text-earth-400 font-normal">(Optionnelle)</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-earth-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="email"
                      placeholder="votre-email@exemple.com"
                      value={clientInfo.email}
                      onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-cream-300 rounded-xl text-earth-950 text-sm min-h-[48px] focus:ring-2 focus:ring-forest-700"
                    />
                  </div>
                </div>

                {/* Instructions / Notes (Facultatif) */}
                <div>
                  <label className="block text-xs font-bold text-forest-950 uppercase tracking-wider mb-1.5">
                    Précisions de livraison <span className="text-earth-400 font-normal">(Optionnel)</span>
                  </label>
                  <div className="relative">
                    <FileText className="w-5 h-5 text-earth-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Ex: Enlèvement en magasin souhaité le matin..."
                      value={clientInfo.notes}
                      onChange={(e) => setClientInfo({ ...clientInfo, notes: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-cream-300 rounded-xl text-earth-950 text-sm min-h-[48px] focus:ring-2 focus:ring-forest-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ÉTAPE 2 : RÉCAPITULATIF & ENVOI */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Coordonnées Client */}
              <div className="bg-cream-50 p-4 sm:p-5 rounded-2xl border border-cream-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-forest-950 uppercase tracking-wider">
                    Client & Destination
                  </h3>
                  <button
                    type="button"
                    onClick={handleBackToForm}
                    className="text-xs text-forest-800 hover:text-forest-950 font-bold underline"
                  >
                    Modifier mes coordonnées
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-earth-800">
                  <p>
                    <span className="text-earth-400 text-xs block">Nom :</span>
                    <strong className="text-forest-950">{clientInfo.fullName}</strong>
                  </p>
                  <p>
                    <span className="text-earth-400 text-xs block">Téléphone :</span>
                    <strong className="text-forest-950">{clientInfo.phone}</strong>
                  </p>
                  <p>
                    <span className="text-earth-400 text-xs block">Ville & Quartier :</span>
                    <strong className="text-forest-950">
                      {clientInfo.city} — {clientInfo.neighborhood}
                    </strong>
                  </p>
                  {clientInfo.notes && (
                    <p>
                      <span className="text-earth-400 text-xs block">Note :</span>
                      <span>{clientInfo.notes}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Tableau des Articles */}
              <div className="border border-cream-200 rounded-2xl overflow-hidden bg-white shadow-warm-xs">
                <div className="bg-cream-100 p-3 text-xs font-bold text-forest-950 uppercase tracking-wider flex justify-between">
                  <span>Articles sélectionnés ({totalItems})</span>
                  <span>Sous-total indicatif</span>
                </div>
                <div className="divide-y divide-cream-100 max-h-60 overflow-y-auto">
                  {items.map((item) => {
                    const subtotal = item.quantity * item.product.price;
                    return (
                      <div
                        key={item.product.id}
                        className="p-3.5 flex items-center justify-between gap-3 text-sm"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-forest-950 truncate">{item.product.name}</p>
                          <p className="text-xs text-earth-500">
                            Quantité : <strong className="text-forest-900">{item.quantity}</strong> × {formatFCFA(item.product.price)}
                            {item.product.packaging && ` (${item.product.packaging})`}
                          </p>
                        </div>
                        <span className="font-serif font-black text-forest-900 whitespace-nowrap">
                          {formatFCFA(subtotal)}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="p-4 bg-cream-100/70 border-t border-cream-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-earth-500 font-bold block uppercase tracking-wider">
                      Total indicatif estimé
                    </span>
                    <span className="text-2xl font-serif font-black text-forest-900 tracking-tight">
                      {formatFCFA(totalAmount)}
                    </span>
                  </div>
                  <span className="text-xs px-3 py-1 bg-gold-400/30 text-forest-950 border border-gold-400 rounded-lg font-black">
                    Devise : FCFA
                  </span>
                </div>
              </div>

              {/* Avertissement RÈGLE FONDAMENTALE : PAS DE PAIEMENT */}
              <div className="p-4 rounded-2xl bg-cream-100/80 border border-cream-300 text-earth-950 text-xs sm:text-sm space-y-2">
                <div className="flex items-center gap-2 font-bold text-forest-950">
                  <AlertCircle className="w-5 h-5 text-gold-600 shrink-0" />
                  <span>Important : Aucun paiement en ligne requis</span>
                </div>
                <p className="leading-relaxed text-xs text-earth-700">
                  {COMPANY_CONFIG.orderDisclaimer}
                </p>
              </div>

              {/* Case de confirmation */}
              <label className="flex items-start gap-3 p-4 rounded-2xl border border-cream-300 bg-cream-50/70 cursor-pointer hover:bg-cream-100/80 transition-colors">
                <input
                  type="checkbox"
                  checked={confirmedCheck}
                  onChange={(e) => setConfirmedCheck(e.target.checked)}
                  className="mt-1 w-5 h-5 text-forest-800 rounded-md focus:ring-forest-700 border-cream-300"
                />
                <span className="text-xs sm:text-sm font-semibold text-earth-900 leading-snug">
                  Je confirme l'exactitude de mes coordonnées et de ma sélection. Je comprends qu'un commercial {COMPANY_CONFIG.fullName} me confirmera la disponibilité et les modalités de livraison directement sur WhatsApp.
                </span>
              </label>
            </div>
          )}

          {/* ÉTAPE 3 : TRANSMISSION WHATSAPP CONFIRMÉE */}
          {step === 3 && (
            <div className="text-center py-6 sm:py-8 space-y-5">
              <div className="w-16 h-16 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center mx-auto shadow-warm-xs border border-forest-200">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-serif font-black text-forest-950">
                  Votre demande est prête !
                </h3>
                <p className="text-sm text-earth-600 max-w-md mx-auto leading-relaxed">
                  L'application a ouvert WhatsApp avec votre message pré-rempli. 
                  <br />
                  <strong className="text-forest-950">Appuyez impérativement sur le bouton « Envoyer » dans WhatsApp</strong> pour que notre équipe commerciale reçoive votre commande.
                </p>
              </div>

              {/* Solution de secours (Copier le message) */}
              <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 text-left max-w-md mx-auto space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-forest-950 uppercase tracking-wider">
                    Une difficulté avec l'ouverture WhatsApp ?
                  </span>
                  {copiedToast && (
                    <span className="text-xs text-forest-800 font-bold bg-forest-100 px-2 py-0.5 rounded">
                      Copié !
                    </span>
                  )}
                </div>
                <p className="text-xs text-earth-600 leading-relaxed">
                  Vous pouvez copier directement le texte et l'envoyer manuellement au numéro commercial : <strong>{COMPANY_CONFIG.whatsapp}</strong>.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-cream-300 hover:bg-cream-100 text-earth-800 text-xs font-bold transition-colors min-h-[40px]"
                  >
                    <Copy className="w-4 h-4 text-earth-500" />
                    <span>Copier le message</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSendWhatsApp}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors min-h-[40px]"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Réessayer</span>
                  </button>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => handleFinish(true)}
                  className="px-6 py-3.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-white font-bold text-sm transition-colors min-h-[48px] shadow-warm-xs"
                >
                  J'ai envoyé le message — Vider le panier
                </button>
                <button
                  type="button"
                  onClick={() => handleFinish(false)}
                  className="px-5 py-3.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-earth-900 font-semibold text-sm transition-colors min-h-[48px]"
                >
                  Conserver mon panier
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Barre d'action inférieure pour les étapes 1 et 2 */}
        {step !== 3 && (
          <div className="p-4 sm:p-5 bg-cream-50/90 border-t border-cream-200 flex items-center justify-between shrink-0">
            {step === 1 ? (
              <>
                <button
                  type="button"
                  onClick={closeOrderModal}
                  className="px-4 py-2.5 rounded-xl border border-cream-300 text-earth-700 font-semibold text-sm hover:bg-cream-100 min-h-[44px]"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleNextToSummary}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-white font-bold text-sm min-h-[48px] shadow-warm-xs"
                >
                  <span>Vérifier ma commande</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleBackToForm}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-cream-300 text-earth-700 font-semibold text-sm hover:bg-cream-100 min-h-[44px]"
                >
                  <ArrowLeft className="w-4 h-4 text-forest-700" />
                  <span>Coordonnées</span>
                </button>
                <button
                  type="button"
                  disabled={!confirmedCheck || isSending}
                  onClick={handleSendWhatsApp}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm sm:text-base min-h-[48px] shadow-warm-md"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Transmettre sur WhatsApp ({COMPANY_CONFIG.whatsapp})</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
