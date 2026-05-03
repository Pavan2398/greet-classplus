import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper: download image from URL to buffer
const fetchImageBuffer = async (url) => {
  if (url.startsWith('http')) {
    console.log('Fetching remote image:', url);
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    if (!res.ok) throw new Error(`Failed to fetch image (${res.status}): ${url}`);
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } else {
    // Local file
    const localPath = path.resolve(__dirname, '..', url.startsWith('/') ? url.slice(1) : url);
    if (!fs.existsSync(localPath)) {
      console.error('Local image not found:', localPath);
      throw new Error(`Local image not found: ${url}`);
    }
    return fs.readFileSync(localPath);
  }
};

// @desc    Merge template + user image + name and return final image
// @route   POST /api/image/generate
// @access  Private
export const generateImage = async (req, res, next) => {
  try {
    const { templateImageUrl, userImageUrl, userName, overlayConfig } = req.body;

    if (!templateImageUrl) {
      res.status(400);
      throw new Error('templateImageUrl is required');
    }

    // Fetch template background
    let templateBuffer = await fetchImageBuffer(templateImageUrl);

    // Memory Safety: Resize template to a reasonable max-width before processing
    templateBuffer = await sharp(templateBuffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .toBuffer();

    // Get template dimensions
    const templateMeta = await sharp(templateBuffer).metadata();
    const W = templateMeta.width || 800;
    const H = templateMeta.height || 800;

    const name = overlayConfig?.namePosition;
    const imgPos = overlayConfig?.imagePosition;

    const compositeInputs = [];

    // Overlay user profile image if available
    if (userImageUrl && imgPos) {
      try {
        const userImgBuffer = await fetchImageBuffer(userImageUrl);
        const imgW = imgPos.width || 120;
        const imgH = imgPos.height || 120;

        let resizedUser = await sharp(userImgBuffer)
          .resize(imgW, imgH, { fit: 'cover' })
          .toBuffer();

        // Apply circular mask and border if needed
        if (imgPos.shape === 'circle') {
          const radius = imgW / 2;
          const strokeWidth = 8; // thicker for final high-res output
          const borderColor = imgPos.borderColor || '#ffffff';
          
          const mask = Buffer.from(
            `<svg width="${imgW}" height="${imgH}">
              <circle cx="${radius}" cy="${radius}" r="${radius}" fill="white"/>
            </svg>`
          );
          
          resizedUser = await sharp(resizedUser)
            .composite([{ input: mask, blend: 'dest-in' }])
            .toBuffer();

          const border = Buffer.from(
            `<svg width="${imgW}" height="${imgH}">
              <circle cx="${radius}" cy="${radius}" r="${radius - strokeWidth/2}" fill="none" stroke="${borderColor}" stroke-width="${strokeWidth}"/>
            </svg>`
          );

          resizedUser = await sharp(resizedUser)
            .composite([{ input: border, blend: 'over' }])
            .png()
            .toBuffer();
        }


        const left = Math.round(((imgPos.x || 50) / 100) * W - imgW / 2);
        const top = Math.round(((imgPos.y || 30) / 100) * H - imgH / 2);

        compositeInputs.push({
          input: resizedUser,
          left: Math.max(0, left),
          top: Math.max(0, top),
        });
      } catch (e) {
        console.error('Failed to overlay user image:', e.message);
      }
    }

    // Overlay user name as SVG text
    if (userName && name) {
      const fontSize = name.fontSize || 36;
      const color = name.color || '#ffffff';
      const textX = Math.round(((name.x || 50) / 100) * W);
      const textY = Math.round(((name.y || 80) / 100) * H);

      const svgText = `
        <svg width="${W}" height="${H}">
          <text
            x="${textX}"
            y="${textY}"
            font-size="${fontSize}"
            fill="${color}"
            text-anchor="middle"
            font-family="Arial, sans-serif"
            font-weight="bold"
          >${userName}</text>
        </svg>
      `;

      compositeInputs.push({
        input: Buffer.from(svgText),
        top: 0,
        left: 0,
      });
    }

    // Compose final image
    const outputBuffer = await sharp(templateBuffer)
      .composite(compositeInputs)
      .jpeg({ quality: 90 })
      .toBuffer();

    // Save to /uploads
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    const filename = `generated_${Date.now()}.jpg`;
    const outputPath = path.join(uploadsDir, filename);
    fs.writeFileSync(outputPath, outputBuffer);

    const imageUrl = `/uploads/${filename}`;
    res.json({ imageUrl, message: 'Image generated successfully' });
  } catch (error) {
    next(error);
  }
};
