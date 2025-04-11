// pages/api/proxy.js

import axios from 'axios';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Image URL is required' });
  }

  try {
    const imageResponse = await axios.get(url, {
      responseType: 'arraybuffer', // to fetch image as a binary buffer
    });

    const contentType = imageResponse.headers['content-type'];
    res.setHeader('Content-Type', contentType);

    // Add Cache-Control header to cache the image
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); // Cache for 1 year

    res.status(200).send(imageResponse.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch image from the provided URL' });
  }
}
