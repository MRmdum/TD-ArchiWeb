// pages/api/proxy.js
import axios from 'axios';
import sharp from 'sharp';

const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/bmp',
  'image/gif',
  'image/apng',
  'image/avif',
  'image/svg+xml',
  'image/tiff',
  'image/x-icon',
  'image/vnd.microsoft.icon',
];

const allowedDomains = ['www.croquonslavie.fr', 'localhost', 'kappa.cours.quimerch.com'];

export default async function handler(req, res) {
  const { url, w, h, q } = req.query;

  if (!url) {
    return res.status(400).send('Missing image URL');
  }

  const width = parseInt(w) || null;
  const height = parseInt(h) || null;
  const quality = parseInt(q) || 75;

  const decodedUrl = decodeURIComponent(url);
  const urlObj = new URL(decodedUrl);

  // Domain check for safety
  if (!allowedDomains.includes(urlObj.hostname)) {
    return res.status(403).send('Forbidden domain');
  }

  try {
    const response = await axios.get(decodedUrl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/89.0.4389.82 Safari/537.36',
        'Referer': urlObj.origin,
        'Accept': 'image/*,*/*;q=0.8',
      },
    });

    const contentType = response.headers['content-type'];

    if (!allowedMimeTypes.some((type) => contentType.includes(type))) {
      return res.status(415).send('Unsupported media type');
    }

    const inputBuffer = Buffer.from(response.data);

    // Optional: Transform image to WebP for size savings
    let outputBuffer;

    if (width || height) {
      outputBuffer = await sharp(inputBuffer)
        .resize(width, height)
        .webp({ quality })
        .toBuffer();
    } else {
      outputBuffer = await sharp(inputBuffer)
        .webp({ quality })
        .toBuffer();
    }

    res.setHeader('Content-Type', 'image/webp');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(outputBuffer);
  } catch (error) {
    console.error('Error fetching image:', error.message);
    return res.status(500).send('Failed to fetch image');
  }
}
