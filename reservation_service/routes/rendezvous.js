const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

module.exports = (prisma) => {
  // Get user's reservations
  router.get('/', auth, async (req, res) => {
    try {
      const reservations = await prisma.reservation.findMany({
        where: { utilisateur_id: req.user.id },
        include: { Disponibilite: true },
        orderBy: { date: 'asc' }
      });
      res.json(reservations);
    } catch (err) {
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  });

  // Book a reservation
  router.post('/', auth, async (req, res) => {
    const { date, heure, service, disponibilite_id } = req.body;
    const utilisateur_id = req.user.id;
    
    if (!date || !heure || !service || !disponibilite_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // Fetch from disponibilite service first
      const dispResponse = await fetch(`http://localhost:3001/disponibilites/${disponibilite_id}`, {
        headers: {
          'Authorization': req.headers.authorization
        }
      });
      
      const dispSlot = await dispResponse.json();
      
      console.log('Disponibilite service response:', dispSlot);
      
      if (!dispSlot || dispSlot.error) {
        throw new Error('Time slot not found in disponibilite service');
      }
      
      // If slot exists in disponibilite service but not in reservation service,
      // create it in reservation service
      let localSlot = await prisma.disponibilite.findUnique({
        where: { id: disponibilite_id },
        select: { 
          id: true,
          date: true,
          heure: true,
          is_reserved: true 
        },
      });
      
      if (!localSlot) {
        console.log('Creating slot in reservation service');
        localSlot = await prisma.disponibilite.create({
          data: {
            id: dispSlot.id,
            date: new Date(dispSlot.date),
            heure: dispSlot.heure,
            is_reserved: dispSlot.is_reserved
          }
        });
      }
      
      // Use a transaction to make the booking atomic
      const result = await prisma.$transaction(async (prisma) => {
        // Verify slot status again within transaction
        const slot = await prisma.disponibilite.findUnique({
          where: { id: disponibilite_id },
          select: { 
            id: true,
            date: true,
            heure: true,
            is_reserved: true 
          },
        });

        // Log slot details for debugging
        console.log('Attempting to book slot:', {
          slotId: disponibilite_id,
          slotDetails: slot,
          is_reserved_type: slot ? typeof slot.is_reserved : 'slot not found'
        });

        if (!slot) {
          throw new Error('Time slot not found');
        }

        // Explicitly check if is_reserved is true
        if (slot.is_reserved === true) {
          console.log('Slot already reserved:', {
            slotId: slot.id,
            is_reserved: slot.is_reserved,
            is_reserved_type: typeof slot.is_reserved
          });
          throw new Error('Time slot is already reserved');
        }

        // Create the reservation and update the slot atomically
        const reservation = await prisma.reservation.create({
          data: {
            date: new Date(date),
            heure,
            service,
            utilisateur_id,
            disponibilite_id,
          },
        });

        // Explicitly set is_reserved to true
        const updatedSlot = await prisma.disponibilite.update({
          where: { id: disponibilite_id },
          data: { is_reserved: true },
        });

        console.log('Successfully booked:', {
          reservationId: reservation.id,
          slotId: updatedSlot.id,
          newStatus: updatedSlot.is_reserved
        });

        return { reservation, slot: updatedSlot };
      });

      res.status(201).json(result);
    } catch (err) {
      console.error('Booking error:', err);
      
      // Handle specific error cases
      switch (err.message) {
        case 'Time slot not found':
          res.status(404).json({ 
            error: 'The requested time slot does not exist',
            details: 'The slot may have been removed'
          });
          break;
        case 'Time slot is already reserved':
          res.status(409).json({ 
            error: 'This time slot has already been reserved by another client',
            details: 'Please choose another available time slot'
          });
          break;
        default:
          res.status(500).json({ 
            error: 'Server error', 
            details: err.message,
            message: 'An unexpected error occurred while processing your booking'
          });
      }
    }
  });

  // View reservation by ID
  router.get('/:id', auth, async (req, res) => {
    try {
      const reservation = await prisma.reservation.findUnique({
        where: { id: parseInt(req.params.id) },
      });
      if (!reservation) return res.status(404).json({ error: 'Not found' });
      res.json(reservation);
    } catch (err) {
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  });

  // Modify reservation
  router.put('/:id', auth, async (req, res) => {
    const { date, heure, service, disponibilite_id } = req.body;
    try {
      const updated = await prisma.reservation.update({
        where: { id: parseInt(req.params.id) },
        data: { date: new Date(date), heure, service, disponibilite_id },
      });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  });

  // Cancel reservation
  router.delete('/:id', auth, async (req, res) => {
    try {
      const reservation = await prisma.reservation.delete({
        where: { id: parseInt(req.params.id) },
      });
      // Free up the slot
      await prisma.disponibilite.update({
        where: { id: reservation.disponibilite_id },
        data: { is_reserved: false },
      });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  });

  return router;
};
