import { Lock, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../utils/getImageUrl';
import useAuthStore from '../store/authStore';

export default function TemplateCard({ template, onSelect }) {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    onSelect(template);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-brand-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-brand-600/20 hover:-translate-y-1 animate-fade-in"
    >
      {/* Template Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={getImageUrl(template.imageUrl)}
          alt={template.title}

          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <button className="w-full btn-primary text-sm py-2">
            Use This Template →
          </button>
        </div>

        {/* Premium Badge */}
        {template.isPremium && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
            <Star className="w-3 h-3" />
            Premium
          </div>
        )}

        {/* Free Badge */}
        {!template.isPremium && (
          <div className="absolute top-3 right-3 bg-emerald-500/90 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            Free
          </div>
        )}

        {/* Lock icon for non-premium users on premium templates */}
        {template.isPremium && !user?.isPremium && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black/60 rounded-full p-4 backdrop-blur-sm">
              <Lock className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="p-3 bg-white/5">
        <h3 className="font-semibold text-sm text-white truncate">{template.title}</h3>
        <span className="text-xs text-white/50 mt-0.5 block">{template.category}</span>
      </div>
    </div>
  );
}
