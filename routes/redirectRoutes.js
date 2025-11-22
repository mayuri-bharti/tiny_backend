import express from 'express';
import Link from '../models/Link.js';

const router = express.Router();

// GET /:code - Redirect
router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;

    // Skip if it's a known route
    if (['api', 'code', 'healthz'].includes(code)) {
      return res.status(404).json({ error: 'Not found' });
    }

    const link = await Link.findOne({ code });

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    // Update click statistics
    link.totalClicks += 1;
    link.lastClicked = new Date();
    await link.save();

    // Perform 302 redirect
    res.redirect(302, link.targetUrl);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


