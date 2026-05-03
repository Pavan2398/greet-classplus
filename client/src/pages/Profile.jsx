import { useState, useRef } from 'react';
import { Camera, Save, User, Mail, Star, Loader2 } from 'lucide-react';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import { getImageUrl } from '../utils/getImageUrl';
import UserAvatar from '../components/UserAvatar';

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [preview, setPreview] = useState(user?.profileImage ? getImageUrl(user.profileImage) : '');
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef();

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      formData.append('name', name);
      if (file) formData.append('profileImage', file);

      const { data } = await api.put('/user/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser({ name: data.name, profileImage: data.profileImage });
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto animate-slide-up">
        <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
        <p className="text-white/50 mb-8">Manage your account and preferences</p>

        <div className="glass-card p-8 space-y-8">
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile"
                  className="w-24 h-24 rounded-2xl object-cover ring-4 ring-brand-500/30 group-hover:ring-brand-500/60 transition-all"
                />
              ) : (
                <UserAvatar user={user} size="lg" className="rounded-2xl" />
              )}
              <button
                type="button"
                onClick={() => fileRef.current.click()}
                className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="w-6 h-6 text-white" />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user?.name}</h2>
              <p className="text-white/50 text-sm mt-1">{user?.email}</p>
              {user?.isPremium ? (
                <span className="inline-flex items-center gap-1.5 mt-2 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-500/30 text-yellow-300 text-xs font-bold px-3 py-1 rounded-full">
                  <Star className="w-3 h-3" /> Premium Member
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 mt-2 bg-white/5 border border-white/10 text-white/50 text-xs px-3 py-1 rounded-full">
                  Free Plan
                </span>
              )}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-5">
            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-emerald-400 text-sm text-center">
                {success}
              </div>
            )}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  value={user?.email || ''}
                  className="input-field pl-10 opacity-50 cursor-not-allowed"
                  disabled
                />
              </div>
              <p className="text-white/30 text-xs mt-1.5 ml-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="label">Profile Photo</label>
              <button
                type="button"
                onClick={() => fileRef.current.click()}
                className="w-full btn-secondary py-3 text-sm flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" />
                {file ? file.name : 'Choose new photo'}
              </button>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
