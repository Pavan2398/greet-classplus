import { X, Star, Zap, Check } from 'lucide-react';
import { useState } from 'react';
import api from '../services/api';
import useAuthStore from '../store/authStore';

export default function PremiumModal({ onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { updateUser } = useAuthStore();

  const handleSubscribe = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/subscription/subscribe');
      updateUser({ isPremium: true, subscriptionExpiry: data.subscriptionExpiry });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Subscription failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md glass-card p-0 overflow-hidden animate-scale-in">
        {/* Header gradient */}
        <div className="bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-brand-600/20 p-8 text-center border-b border-white/10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-yellow-500/30">
            <Star className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Unlock Premium</h2>
          <p className="text-white/60 text-sm">
            Get access to all exclusive templates and premium features.
          </p>
        </div>

        {/* Benefits */}
        <div className="p-6 space-y-3">
          {[
            'Access to all premium templates',
            'No watermarks on generated images',
            'Priority image generation',
            'Unlimited downloads',
            '30-day access',
          ].map((benefit) => (
            <div key={benefit} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-emerald-400" />
              </div>
              <span className="text-white/80 text-sm">{benefit}</span>
            </div>
          ))}

          {/* Price */}
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-brand-600/20 to-purple-600/20 border border-brand-500/30 text-center">
            <div className="flex items-end justify-center gap-1">
              <span className="text-4xl font-bold text-white">₹99</span>
              <span className="text-white/50 mb-1">/month</span>
            </div>
            <p className="text-white/40 text-xs mt-1">Cancel anytime</p>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center bg-red-500/10 rounded-lg p-2">{error}</p>
          )}

          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-yellow-500/30 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Upgrade to Premium
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full text-white/40 hover:text-white/70 text-sm py-2 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
