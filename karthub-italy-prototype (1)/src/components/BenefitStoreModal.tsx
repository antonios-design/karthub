import React, { useState } from 'react';
import { X, Sparkles, Trophy, Ticket, CheckCircle, Gift, Flame, Zap, Copy, ShieldAlert } from 'lucide-react';
import { DriverProfile, BenefitReward, BenefitVoucher } from '../types';
import { BENEFIT_CATALOG } from '../data/mockData';

interface BenefitStoreModalProps {
  currentUser: DriverProfile;
  onClose: () => void;
  onRedeemBenefit: (reward: BenefitReward, newVoucher: BenefitVoucher) => void;
}

export const BenefitStoreModal: React.FC<BenefitStoreModalProps> = ({
  currentUser,
  onClose,
  onRedeemBenefit
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleRedeem = (reward: BenefitReward) => {
    if (currentUser.starPoints < reward.costStarPoints) return;

    const voucherCode = `KH-${reward.id.split('-')[1].toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const newVoucher: BenefitVoucher = {
      id: `voucher-${Date.now()}`,
      rewardId: reward.id,
      rewardTitle: reward.title,
      voucherCode,
      discountEur: reward.discountAmountEur,
      redeemedAt: new Date().toISOString().split('T')[0],
      used: false
    };

    onRedeemBenefit(reward, newVoucher);
    setSuccessMessage(`Hai riscattato: ${reward.title}! Codice: ${voucherCode}`);
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-5 my-auto relative text-slate-900">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer border border-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-red-600 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-lg shadow-sm">
              SEZIONE BENEFIT & STAR STORE
            </span>
            <span className="text-xs text-slate-500 font-medium">
              PREMI KARTHUB
            </span>
          </div>
          <h2 className="text-xl font-extrabold uppercase text-slate-900 tracking-tight flex items-center">
            <Gift className="w-5 h-5 mr-2 text-red-600" />
            SCONTI ISCRIZIONI & GIRI SU KART 125cc
          </h2>
          <p className="text-xs text-slate-500">
            Accumula punti Star ad ogni gara completata e riscatta sconti sulle iscrizioni o sessioni in pista su Kart 125cc 2 Tempi.
          </p>
        </div>

        {/* User Star Points Balance Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                IL TUO SALDO STAR POINTS
              </p>
              <p className="text-2xl font-black text-slate-900 flex items-center">
                {currentUser.starPoints} <span className="text-xs text-red-600 ml-1">PTS</span>
              </p>
            </div>
          </div>

          {/* Points Rules Summary */}
          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-4">
            <div>🏁 Gara Completata: <strong className="text-emerald-600">+100 PTS</strong></div>
            <div>🏆 Podio / Vittoria: <strong className="text-emerald-600">+50/100 PTS</strong></div>
            <div>📡 Telemetria GPS: <strong className="text-emerald-600">+25 PTS</strong></div>
            <div>🎖️ Livello pilota: <strong className="text-slate-900 font-bold">{currentUser.experienceLevel}</strong></div>
          </div>
        </div>

        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-medium flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-xs text-slate-900 font-bold underline cursor-pointer"
            >
              OK
            </button>
          </div>
        )}

        {/* Benefit Catalog */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          <h3 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">
            BENEFIT DISPONIBILI PER IL RISCATTO
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {BENEFIT_CATALOG.map(reward => {
              const canAfford = currentUser.starPoints >= reward.costStarPoints;

              return (
                <div
                  key={reward.id}
                  className={`bg-slate-50 border rounded-2xl p-4 space-y-3 transition relative flex flex-col justify-between ${
                    canAfford
                      ? 'border-slate-200 hover:border-red-300 shadow-sm'
                      : 'border-slate-200 opacity-60'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-lg bg-slate-200 text-slate-700">
                        {reward.category === 'track_session' ? 'KART 125cc' : reward.category === 'discount' ? 'SCONTO ISCRIZIONE' : 'PRO BENEFIT'}
                      </span>
                      <span className="text-xs font-extrabold text-red-600 flex items-center">
                        <Sparkles className="w-3 h-3 mr-1" />
                        {reward.costStarPoints} PTS
                      </span>
                    </div>

                    <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-tight">
                      {reward.title}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {reward.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={!canAfford}
                    className={`w-full py-2.5 rounded-xl text-xs font-extrabold uppercase transition cursor-pointer flex items-center justify-center space-x-1.5 ${
                      canAfford
                        ? 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <span>{canAfford ? 'RISCATTA BENEFIT' : `MANCANO ${reward.costStarPoints - currentUser.starPoints} PTS`}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Redeemed Benefits Section */}
        {currentUser.redeemedBenefits && currentUser.redeemedBenefits.length > 0 && (
          <div className="border-t border-slate-100 pt-3 space-y-2">
            <h3 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider flex items-center">
              <Ticket className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              I TUOI VOUCHER BENEFIT ATTIVI ({currentUser.redeemedBenefits.filter(v => !v.used).length})
            </h3>

            <div className="space-y-2 max-h-36 overflow-y-auto">
              {currentUser.redeemedBenefits.map(voucher => (
                <div
                  key={voucher.id}
                  className={`bg-slate-50 border rounded-xl p-3 flex items-center justify-between text-xs ${
                    voucher.used ? 'border-slate-200 opacity-50' : 'border-emerald-200'
                  }`}
                >
                  <div>
                    <strong className="text-slate-900">{voucher.rewardTitle}</strong>
                    <p className="text-[10px] text-slate-500">Riscattato il {voucher.redeemedAt}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-emerald-600 font-extrabold tracking-widest text-[11px]">
                      {voucher.voucherCode}
                    </span>
                    <button
                      onClick={() => copyToClipboard(voucher.voucherCode)}
                      className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition cursor-pointer"
                      title="Copia Codice"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
