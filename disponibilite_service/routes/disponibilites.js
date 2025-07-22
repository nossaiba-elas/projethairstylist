const express = require('express');
const authenticateJWT = require('../middleware/auth');

module.exports = (prisma) => {
  const router = express.Router();

  // GET /disponibilites - return all available slots (is_reserved: false)
  router.get('/', async (req, res) => {
    try {
      const slots = await prisma.disponibilite.findMany({
        where: { is_reserved: false },
      });
      res.json(slots);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  // GET /disponibilites/:id - get a single slot by ID
  router.get('/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const slot = await prisma.disponibilite.findUnique({
        where: { id },
      });
      if (!slot) {
        return res.status(404).json({ error: 'Slot not found' });
      }
      res.json(slot);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  // POST /disponibilites - admin only, add new slot
  router.post('/', authenticateJWT, (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  }, async (req, res) => {
    const { date, heure } = req.body;
    if (!date || !heure) {
      return res.status(400).json({ error: 'date and heure are required' });
    }
    try {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
      }
      const newSlot = await prisma.disponibilite.create({
        data: { 
          date: parsedDate,
          heure,
          is_reserved: false 
        },
      });
      res.status(201).json(newSlot);
    } catch (err) {
      console.error('Error creating slot:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  return router;
}; 