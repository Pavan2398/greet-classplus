export const getImageUrl = (path) => {
  if (!path) return 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
  if (path.startsWith('http') || path.startsWith('blob:')) return path;
  
  // Connect local /uploads path to backend server
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseURL}${normalizedPath}`;
};

