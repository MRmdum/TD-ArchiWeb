import axios from 'axios';
import sharp from 'sharp';

const allowedMimeTypes = [
  'image/jpeg', 'image/png', 'image/webp', 'image/bmp',
  'image/gif', 'image/apng', 'image/avif', 'image/svg+xml',
  'image/tiff', 'image/x-icon', 'image/vnd.microsoft.icon',
];

export default async function handler(req, res) {
  const { url, w, h, q } = req.query;

  // Add CORS headers for direct browser use
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  if (!url) {
    return res.status(400).send('Missing image URL');
  }

  let decodedUrl;
  try {
    decodedUrl = decodeURIComponent(url);
    const testUrl = new URL(decodedUrl); // Validate URL
  } catch {
    return res.status(400).send('Invalid image URL');
  }

  const width = parseInt(w) || null;
  const height = parseInt(h) || null;
  const quality = parseInt(q) || 75;

  try {
    const response = await axios.get(decodedUrl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'image/*,*/*;q=0.8',
        'Referer': decodedUrl,
      },
    });

    const contentType = response.headers['content-type'];
    if (!allowedMimeTypes.some(type => contentType.includes(type))) {
      return res.status(415).send('Unsupported media type');
    }

    const inputBuffer = Buffer.from(response.data);

    const outputBuffer = await sharp(inputBuffer)
      .resize(width, height)
      .webp({ quality })
      .toBuffer();

    res.setHeader('Content-Type', 'image/webp');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(outputBuffer);
  } catch (err) {
    console.error('Image proxy error:', err.message);
    return res.status(500).send('Failed to fetch image');
  }
}
