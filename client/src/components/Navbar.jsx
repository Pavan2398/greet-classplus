import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Sparkles, Home } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { getImageUrl } from '../utils/getImageUrl';
import UserAvatar from './UserAvatar';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-600/30 group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
              WishCraft
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link
                  to="/"
                  className="flex items-center gap-1.5 text-white/70 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-all text-sm font-medium"
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Home</span>
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-white/70 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-all text-sm font-medium"
                >
                  <UserAvatar user={user} size="xs" />
                  <span className="hidden sm:inline">{user.name?.split(' ')[0]}</span>
                  {user.isPremium && (
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold px-1.5 py-0.5 rounded-full">
                      PRO
                    </span>
                  )}
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-white/70 hover:text-red-400 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-all text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
