import React, { useState } from 'react';
import { X, CheckCircle, CreditCard, ShieldCheck, Ticket, Sparkles, AlertCircle, ArrowRight, Euro } from 'lucide-react';
import { Race, DriverProfile, PurchasedRaceTicket, BenefitVoucher } from '../types';

interface RaceCheckoutModalProps {
  race: Race;
  currentUser: DriverProfile;
  onClose: () => void;
  onSuccessPurchase: (ticket: PurchasedRaceTicket, updatedUser: Partial<DriverProfile>) => void;
}

export const RaceCheckoutModal: React.FC<RaceCheckoutModalProps> = ({
  race,
  currentUser,
  onClose,
  onSuccessPurchase
}) => {
  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details');
  const [teamName, setTeamName] = useState(`${currentUser?.name || 'Pilota'} Racing Team`);
  const [driversCount, setDriversCount] = useState<number>(race.format === 'Endurance' ? 3 : 1);
  const [selectedVoucher, setSelectedVoucher] = useState<BenefitVoucher | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'Credit Card' | 'PayPal' | 'Satispay' | 'Star Points'>('Credit Card');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdTicket, setCreatedTicket] = useState<PurchasedRaceTicket | null>(null);

  // Discount calculation
  const basePrice = race.entryFee;
  const voucherDiscount = selectedVoucher?.discountEur || 0;
  const finalPrice = Math.max(0, basePrice - voucherDiscount);

  // Filter valid vouchers
  const availableVouchers = currentUser.redeemedBenefits?.filter(v => !v.used) || [];

  const handleConfirmPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const newTicket: PurchasedRaceTicket = {
        id: `ticket-${Date.now()}`,
        raceId: race.id,
        raceTitle: race.title,
        trackName: race.trackName,
        date: race.date,
        time: race.time,
        teamName: teamName || `${currentUser?.name || 'Pilota'} Team`,
        driversCount,
        paidAmountEur: finalPrice,
        discountAppliedEur: voucherDiscount,
        purchaseDate: new Date().toISOString().split('T')[0],
        paymentMethod,
        qrCodeToken: `KH-PASS-${Math.floor(1000000 + Math.random() * 9000000)}`,
        status: 'CONFIRMED'
      };

      // Mark voucher as used if selected
      const updatedVouchers = currentUser.redeemedBenefits?.map(v => 
        v.id === selectedVoucher?.id ? { ...v, used: true } : v
      ) || [];

      // Update user purchased races
      const updatedPurchased = [newTicket, ...(currentUser.purchasedRaces || [])];

      onSuccessPurchase(newTicket, {
        redeemedBenefits: updatedVouchers,
        purchasedRaces: updatedPurchased
      });

      setCreatedTicket(newTicket);
      setIsProcessing(false);
      setStep('confirmation');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 my-auto relative text-slate-900 font-sans">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer border border-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        {step !== 'confirmation' && (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 bg-red-600 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-lg shadow-sm">
                CHECKOUT KARTHUB
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {race.trackName}
              </span>
            </div>
            <h2 className="text-lg font-extrabold uppercase text-slate-900 tracking-tight">
              {race.title}
            </h2>
          </div>
        )}

        {step === 'details' && (
          <form onSubmit={() => setStep('payment')} className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>CATEGORIA:</span>
                <strong className="text-slate-900">{race.category}</strong>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>DATA & ORA:</span>
                <strong className="text-slate-900">{race.date} @ {race.time}</strong>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>QUOTA UFFICIALE:</span>
                <strong className="text-emerald-600 font-black text-sm">€{race.entryFee}</strong>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] text-slate-600 uppercase mb-1 font-bold">
                  Nome Team / Scuderia
                </label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Es. Scuderia Pomposa Racing"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 text-xs focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-600 uppercase mb-1 font-bold">
                    Numero Piloti
                  </label>
                  <select
                    value={driversCount}
                    onChange={(e) => setDriversCount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 text-xs focus:outline-none focus:border-red-600"
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Pilota' : 'Piloti'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-600 uppercase mb-1 font-bold">
                    Peso Pilota Min.
                  </label>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-600 text-xs font-medium">
                    {race.minWeightKg ? `${race.minWeightKg} kg Zavorra` : 'Libero'}
                  </div>
                </div>
              </div>

              {/* Voucher Selector */}
              <div>
                <label className="block text-[11px] text-slate-600 uppercase mb-1 font-bold flex justify-between">
                  <span>Sconto / Voucher Benefit Star Points</span>
                  <span className="text-red-600">{availableVouchers.length} Disponibili</span>
                </label>
                
                {availableVouchers.length === 0 ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-500">
                    Nessun buono sconto attivo. Puoi accumulare Star Points gareggiando per sbloccarne nella Sezione Benefit!
                  </div>
                ) : (
                  <select
                    value={selectedVoucher?.id || ''}
                    onChange={(e) => {
                      const found = availableVouchers.find(v => v.id === e.target.value);
                      setSelectedVoucher(found || null);
                    }}
                    className="w-full bg-slate-50 border border-red-200 rounded-xl px-3.5 py-2.5 text-slate-900 text-xs focus:outline-none focus:border-red-600"
                  >
                    <option value="">Nessun buono applicato</option>
                    {availableVouchers.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.rewardTitle} (-€{v.discountEur}) [{v.voucherCode}]
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Price Summary */}
            <div className="border-t border-slate-100 pt-3 space-y-1">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Prezzo Iscrizione:</span>
                <span>€{basePrice}</span>
              </div>
              {voucherDiscount > 0 && (
                <div className="flex justify-between text-xs text-emerald-600 font-bold">
                  <span>Sconto Star Points:</span>
                  <span>-€{voucherDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1">
                <span>TOTALE DA PAGARE:</span>
                <span className="text-red-600 text-base font-black">€{finalPrice}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold rounded-xl shadow-sm transition cursor-pointer flex items-center justify-center space-x-2 uppercase tracking-wide"
            >
              <span>CONTINUA AL PAGAMENTO</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {step === 'payment' && (
          <form onSubmit={handleConfirmPurchase} className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>TEAM:</span>
                <strong className="text-slate-900">{teamName}</strong>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>TOTALE ORDINE:</span>
                <strong className="text-emerald-600 font-extrabold">€{finalPrice}</strong>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <label className="block text-[11px] text-slate-600 uppercase mb-1 font-bold">
                Seleziona Metodo di Pagamento
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Credit Card')}
                  className={`p-3 rounded-xl border text-left font-bold transition flex items-center space-x-2 cursor-pointer ${
                    paymentMethod === 'Credit Card'
                      ? 'bg-red-50 border-red-600 text-red-600'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-red-600" />
                  <span>Carta / Visa</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('PayPal')}
                  className={`p-3 rounded-xl border text-left font-bold transition flex items-center space-x-2 cursor-pointer ${
                    paymentMethod === 'PayPal'
                      ? 'bg-red-50 border-red-600 text-red-600'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="font-black text-red-600">P</span>
                  <span>PayPal</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Satispay')}
                  className={`p-3 rounded-xl border text-left font-bold transition flex items-center space-x-2 cursor-pointer ${
                    paymentMethod === 'Satispay'
                      ? 'bg-red-50 border-red-600 text-red-600'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="font-black text-red-600">S</span>
                  <span>Satispay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Star Points')}
                  className={`p-3 rounded-xl border text-left font-bold transition flex items-center space-x-2 cursor-pointer ${
                    paymentMethod === 'Star Points'
                      ? 'bg-red-50 border-red-600 text-red-600'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-red-600" />
                  <span>Star Points ({currentUser.starPoints} PTS)</span>
                </button>
              </div>

              {paymentMethod === 'Credit Card' && (
                <div className="space-y-2 pt-2">
                  <div>
                    <label className="block text-[10px] text-slate-500">Numero Carta</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-500">Scadenza</label>
                      <input
                        type="text"
                        defaultValue="08/28"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500">CVC</label>
                      <input
                        type="text"
                        defaultValue="742"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="w-1/3 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold rounded-xl border border-slate-200 transition cursor-pointer"
              >
                INDIETRO
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="w-2/3 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold rounded-xl shadow-sm transition cursor-pointer flex items-center justify-center space-x-2 uppercase tracking-wide"
              >
                {isProcessing ? (
                  <span>ELABORAZIONE IN CORSO...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>CONFERMA E PAGA €{finalPrice}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {step === 'confirmation' && createdTicket && (
          <div className="space-y-4 text-center py-2">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-slate-900 uppercase tracking-tight">
                ISCRIZIONE CONFERMATA!
              </h3>
              <p className="text-xs text-slate-500 font-sans">
                La tua prenotazione è stata pubblicata su KARTHUB ed aggiunta al tuo Garage. Presenta il Pass al briefing in pista.
              </p>
            </div>

            {/* Digital Ticket Badge */}
            <div className="bg-white border border-red-200 rounded-2xl p-4 space-y-3 text-left shadow-sm">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <div className="flex items-center space-x-2">
                  <Ticket className="w-4 h-4 text-red-600" />
                  <span className="font-extrabold text-xs text-slate-900">PASS GARA DIGITALE</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
                  {createdTicket.status}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <p className="text-slate-500">Gara: <strong className="text-slate-900">{createdTicket.raceTitle}</strong></p>
                <p className="text-slate-500">Circuito: <strong className="text-slate-900">{createdTicket.trackName}</strong></p>
                <p className="text-slate-500">Team: <strong className="text-slate-900">{createdTicket.teamName}</strong> ({createdTicket.driversCount} Piloti)</p>
                <p className="text-slate-500">Data: <strong className="text-slate-900">{createdTicket.date} @ {createdTicket.time}</strong></p>
                <p className="text-slate-500">Importo Pagato: <strong className="text-emerald-600 font-extrabold">€{createdTicket.paidAmountEur}</strong></p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center space-y-1">
                <p className="text-[9px] font-bold text-slate-400">CODICE QR VERIFICA IN PISTA</p>
                <p className="font-extrabold text-sm text-red-600 tracking-wider">{createdTicket.qrCodeToken}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 bg-red-600 text-white text-xs font-extrabold rounded-xl shadow-sm hover:bg-red-700 transition cursor-pointer uppercase tracking-wider"
            >
              CHIUDI E TORNA AI CALENDARI
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
