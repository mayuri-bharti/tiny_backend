import express from 'express';
import Link from '../models/Link.js';
import { validateUrl, generateCode } from '../utils/validation.js';

const router = express.Router();

// POST /api/links - Create link
router.post('/', async (req, res) => {
  try {
    const { targetUrl, code } = req.body;

    // Validate target URL
    if (!targetUrl || !validateUrl(targetUrl)) {
      return res.status(400).json({ error: 'Invalid URL provided' });
    }

    // Generate or validate code
    let linkCode = code;
    if (!linkCode) {
      linkCode = generateCode();
      // Ensure uniqueness
      let exists = await Link.findOne({ code: linkCode });
      let attempts = 0;
      while (exists && attempts < 10) {
        linkCode = generateCode();
        exists = await Link.findOne({ code: linkCode });
        attempts++;
      }
      if (exists) {
        return res.status(500).json({ error: 'Failed to generate unique code' });
      }
    } else {
      // Validate custom code format
      if (!/^[A-Za-z0-9]{6,8}$/.test(linkCode)) {
        return res.status(400).json({ error: 'Code must be 6-8 alphanumeric characters' });
      }

      // Check if code already exists
      const existingLink = await Link.findOne({ code: linkCode });
      if (existingLink) {
        return res.status(409).json({ error: 'Code already exists' });
      }
    }

    // Create link
    const link = new Link({
      code: linkCode,
      targetUrl
    });

    await link.save();

    res.status(201).json({
      code: link.code,
      targetUrl: link.targetUrl,
      totalClicks: link.totalClicks,
      lastClicked: link.lastClicked,
      createdAt: link.createdAt
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Code already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// GET /api/links - List all links
router.get('/', async (req, res) => {
  try {
    const links = await Link.find().sort({ createdAt: -1 });
    res.json(links);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/links/:code - Stats for one code
router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const link = await Link.findOne({ code });

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    res.json({
      code: link.code,
      targetUrl: link.targetUrl,
      totalClicks: link.totalClicks,
      lastClicked: link.lastClicked,
      createdAt: link.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/links/:code - Delete link
router.delete('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const link = await Link.findOneAndDelete({ code });

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    res.json({ message: 'Link deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/links/:code/click - Track a click (for frontend redirects)
router.post('/:code/click', async (req, res) => {
  try {
    const { code } = req.params;
    const link = await Link.findOne({ code });

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    // Update click statistics
    link.totalClicks += 1;
    link.lastClicked = new Date();
    await link.save();

    res.json({ targetUrl: link.targetUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

