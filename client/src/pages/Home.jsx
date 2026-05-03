import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, Zap } from 'lucide-react';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import TemplateCard from '../components/TemplateCard';
import PremiumModal from '../components/PremiumModal';

const CATEGORIES = ['All', 'Birthday', 'Wedding', 'New Year', 'Festival', 'Anniversary', 'Greetings'];

export default function Home() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [pendingTemplate, setPendingTemplate] = useState(null);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/templates', {
        params: activeCategory !== 'All' ? { category: activeCategory } : {},
      });
      setTemplates(data);
    } catch (err) {
      console.error('Failed to load templates:', err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleTemplateSelect = (template) => {
    if (template.isPremium && !user?.isPremium) {
      setPendingTemplate(template);
      setShowPremiumModal(true);
      return;
    }
    navigate(`/preview/${template._id}`);
  };

  const handlePremiumSuccess = () => {
    if (pendingTemplate) {
      navigate(`/preview/${pendingTemplate._id}`);
      setPendingTemplate(null);
    }
  };

  const filtered = templates.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-20 pb-10">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-1/4 w-64 h-64 bg-brand-600/10 rounded-full blur-3xl" />
          <div className="absolute top-10 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center relative">
          <div className="inline-flex items-center gap-2 bg-brand-600/20 border border-brand-500/30 rounded-full px-4 py-1.5 text-brand-300 text-sm font-medium mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            Create beautiful personalized greetings
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
            Craft Wishes That{' '}
            <span className="bg-gradient-to-r from-brand-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Touch Hearts
            </span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto mb-8">
            Choose a template, personalize it with your name and photo, and share it instantly.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-11 text-white outline-none transition-all text-sm placeholder:text-white/30 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Filter */}
        <div className="flex items-center justify-center flex-wrap gap-3 pb-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
          {!user?.isPremium && (
            <button
              onClick={() => setShowPremiumModal(true)}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-300 hover:from-yellow-500/30 hover:to-orange-500/30 transition-all ml-auto"
            >
              <Zap className="w-3.5 h-3.5" />
              Go Premium
            </button>
          )}
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🎨</div>
            <h3 className="text-white font-semibold text-xl mb-2">No templates found</h3>
            <p className="text-white/40">Try a different category or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((template) => (
              <TemplateCard
                key={template._id}
                template={template}
                onSelect={handleTemplateSelect}
              />
            ))}
          </div>
        )}
      </div>

      {showPremiumModal && (
        <PremiumModal
          onClose={() => { setShowPremiumModal(false); setPendingTemplate(null); }}
          onSuccess={handlePremiumSuccess}
        />
      )}
    </div>
  );
}
