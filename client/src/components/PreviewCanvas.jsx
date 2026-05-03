import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';

const PreviewCanvas = forwardRef(({ templateUrl, userImageUrl, userName, overlayConfig }, ref) => {
  const canvasRef = useRef(null);

  useImperativeHandle(ref, () => ({
    downloadImage: (filename = 'greeting.jpg') => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();
    }
  }));

  const drawPreview = useCallback(async () => {
    // ... existing drawPreview logic ...
    const canvas = canvasRef.current;
    if (!canvas || !templateUrl) return;

    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Load and draw template background
    const loadImage = (src) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

    try {
      const templateImg = await loadImage(templateUrl);
      ctx.drawImage(templateImg, 0, 0, W, H);
    } catch {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, W, H);
    }

    const imgPos = overlayConfig?.imagePosition;
    const namePos = overlayConfig?.namePosition;

    // Draw user profile image
    if (userImageUrl && imgPos) {
      try {
        const userImg = await loadImage(userImageUrl);
        const imgW = imgPos.width || 120;
        const imgH = imgPos.height || 120;
        const x = ((imgPos.x || 50) / 100) * W - imgW / 2;
        const y = ((imgPos.y || 30) / 100) * H - imgH / 2;

        ctx.save();
        if (imgPos.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(x + imgW / 2, y + imgH / 2, imgW / 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
        }
        ctx.drawImage(userImg, x, y, imgW, imgH);
        ctx.restore();

        // Circle border
        if (imgPos.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(x + imgW / 2, y + imgH / 2, imgW / 2, 0, Math.PI * 2);
          ctx.strokeStyle = imgPos.borderColor || 'rgba(255,255,255,0.8)';
          ctx.lineWidth = 4;
          ctx.stroke();
        }

      } catch {
        // Fallback: Draw a colored circle with initials if image fails
        const imgW = imgPos.width || 120;
        const imgH = imgPos.height || 120;
        const x = ((imgPos.x || 50) / 100) * W - imgW / 2;
        const y = ((imgPos.y || 30) / 100) * H - imgH / 2;
        const radius = imgW / 2;

        ctx.save();
        // Circle background
        ctx.beginPath();
        ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#6366f1'; // Indigo-500
        ctx.fill();

        // Initials
        const initials = userName ? userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${radius * 0.8}px Inter, Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(initials, x + radius, y + radius);

        // Border
        if (imgPos.shape === 'circle') {
          ctx.strokeStyle = imgPos.borderColor || 'rgba(255,255,255,0.8)';
          ctx.lineWidth = 4;
          ctx.stroke();
        }
        ctx.restore();
      }
    }

    // Draw user name text
    if (userName && namePos) {
      const fontSize = namePos.fontSize || 36;
      const color = namePos.color || '#ffffff';
      const x = ((namePos.x || 50) / 100) * W;
      const y = ((namePos.y || 80) / 100) * H;

      ctx.font = `bold ${fontSize}px Inter, Arial, sans-serif`;
      ctx.textAlign = namePos.align || 'center';
      ctx.fillStyle = color;

      // Text shadow for readability
      ctx.shadowColor = 'rgba(0,0,0,0.7)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      ctx.fillText(userName, x, y);
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }
  }, [templateUrl, userImageUrl, userName, overlayConfig]);

  useEffect(() => {
    drawPreview();
  }, [drawPreview]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={800}
      className="w-full h-full rounded-xl object-contain shadow-2xl"
      style={{ maxHeight: '500px' }}
    />
  );
});

PreviewCanvas.displayName = 'PreviewCanvas';
export default PreviewCanvas;
