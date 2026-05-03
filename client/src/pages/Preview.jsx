import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Download, Share2, MessageCircle, Mail,
  Link2, Loader2, RefreshCw, Camera,
} from 'lucide-react';
import api, { BASE_URL } from '../services/api';
import { getImageUrl } from '../utils/getImageUrl';
import useAuthStore from '../store/authStore';
import PreviewCanvas from '../components/PreviewCanvas';

export default function Preview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [userName, setUserName] = useState(user?.name || '');
  const [userImageUrl, setUserImageUrl] = useState(getImageUrl(user?.profileImage) || '');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(getImageUrl(user?.profileImage) || '');
  const fileRef = useRef();

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const { data } = await api.get(`/templates/${id}`);
        setTemplate(data);
      } catch {
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
  }, [id, navigate]);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setImageFile(f);
    const localUrl = URL.createObjectURL(f);
    setImagePreviewUrl(localUrl);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setGeneratedUrl('');
    try {
      let finalUserImageUrl = userImageUrl;

      // If the user chose a local file, upload it first via profile update
      if (imageFile) {
        const formData = new FormData();
        formData.append('name', user.name);
        formData.append('profileImage', imageFile);
        const { data: updated } = await api.put('/user/profile', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        finalUserImageUrl = getImageUrl(updated.profileImage);
      }

      const { data } = await api.post('/image/generate', {
        templateImageUrl: template.imageUrl,
        userImageUrl: finalUserImageUrl,
        userName,
        overlayConfig: template.overlayConfig,
      });

      setGeneratedUrl(getImageUrl(data.imageUrl));
    } catch (err) {
      console.error('Generation failed:', err);
    } finally {
      setGenerating(false);
    }
  };

  const canvasRef = useRef();
  
  const handleDownload = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.downloadImage(`wishcraft_${Date.now()}.jpg`);
    }
  }, []);

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Check out my greeting: ${generatedUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleShare = async () => {
    if (!generatedUrl) return;
    
    // Check if Web Share API is supported
    if (navigator.share) {
      try {
        // We need to fetch the image and convert it to a file object to share it natively
        const response = await fetch(generatedUrl);
        const blob = await response.blob();
        const file = new File([blob], `wishcraft_${Date.now()}.jpg`, { type: 'image/jpeg' });

        await navigator.share({
          title: 'My Custom Greeting',
          text: 'Check out this greeting I made on WishCraft!',
          files: [file]
        });
      } catch (error) {
        console.error('Error sharing natively:', error);
      }
    } else {
      alert("Native sharing is not supported on this browser.");
    }
  };

  const handleEmail = () => {
    window.open(
      `mailto:?subject=A greeting for you!&body=Check out this greeting I made: ${generatedUrl}`,
      '_blank'
    );
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">{template?.title}</h1>
            <p className="text-white/50 text-sm">{template?.category}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Canvas Preview */}
          <div className="glass-card p-4 flex items-center justify-center min-h-[400px]">
            {template && (
              <PreviewCanvas
                ref={canvasRef}
                templateUrl={getImageUrl(template.imageUrl)}
                userImageUrl={imagePreviewUrl}
                userName={userName}
                overlayConfig={template.overlayConfig}
              />
            )}
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            {/* Customization */}
            <div className="glass-card p-6 space-y-5">
              <h2 className="text-lg font-semibold text-white">Personalize</h2>

              <div>
                <label className="label">Your Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Your Photo</label>
                <div className="flex items-center gap-4">
                  <img
                    src={imagePreviewUrl || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                    alt="preview"
                    className="w-14 h-14 rounded-xl object-cover ring-2 ring-white/10"
                  />
                  <button
                    onClick={() => fileRef.current.click()}
                    className="flex-1 btn-secondary flex items-center justify-center gap-2 text-sm py-2.5"
                  >
                    <Camera className="w-4 h-4" />
                    {imageFile ? imageFile.name : 'Change Photo'}
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-base disabled:opacity-60"
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  Generate Final Image
                </>
              )}
            </button>

            {/* Share Section (shown after generation) */}
            {generatedUrl && (
              <div className="glass-card p-6 space-y-4 animate-slide-up">
                <h2 className="text-lg font-semibold text-white">Share & Download</h2>
                <img
                  src={generatedUrl}
                  alt="Generated"
                  className="w-full rounded-xl object-cover max-h-48"
                />
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-2 btn-primary text-sm py-2.5"
                  >
                    <Download className="w-4 h-4" /> Download
                  </button>
                  {navigator.share ? (
                    <button
                      onClick={handleShare}
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all col-span-1"
                    >
                      <Share2 className="w-4 h-4" /> Share Natively
                    </button>
                  ) : (
                    <button
                      onClick={handleWhatsApp}
                      className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all"
                    >
                      <MessageCircle className="w-4 h-4" /> WhatsApp
                    </button>
                  )}
                  <button
                    onClick={handleEmail}
                    className="flex items-center justify-center gap-2 btn-secondary text-sm py-2.5"
                  >
                    <Mail className="w-4 h-4" /> Email
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center justify-center gap-2 btn-secondary text-sm py-2.5"
                  >
                    <Link2 className="w-4 h-4" />
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
