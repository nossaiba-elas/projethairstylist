// Script de synchronisation des créneaux entre disponibilite_db et reservation_db
// Usage : node sync_disponibilites.js

const mysql = require('mysql2/promise');

// Configurations des connexions
const configDisponibilite = {
  host: 'localhost',
  user: 'root', // adapte si besoin
  password: '', // adapte si besoin
  database: 'disponibilite_db',
};
const configReservation = {
  host: 'localhost',
  user: 'root', // adapte si besoin
  password: '', // adapte si besoin
  database: 'reservation_db',
};

async function syncDisponibilites() {
  const connDisp = await mysql.createConnection(configDisponibilite);
  const connResa = await mysql.createConnection(configReservation);

  // Récupère tous les créneaux de disponibilite_db
  const [rows] = await connDisp.execute('SELECT * FROM disponibilite');

  for (const slot of rows) {
    // Vérifie si l'ID existe déjà dans reservation_db
    const [exists] = await connResa.execute('SELECT id FROM disponibilite WHERE id = ?', [slot.id]);
    if (exists.length === 0) {
      // Insère le créneau dans reservation_db
      await connResa.execute(
        'INSERT INTO disponibilite (id, date, heure, is_reserved) VALUES (?, ?, ?, ?)',
        [slot.id, slot.date, slot.heure, slot.is_reserved]
      );
      console.log(`Créneau ID ${slot.id} copié.`);
    } else {
      console.log(`Créneau ID ${slot.id} déjà présent, ignoré.`);
    }
  }

  await connDisp.end();
  await connResa.end();
  console.log('Synchronisation terminée.');
}

syncDisponibilites().catch(err => {
  console.error('Erreur de synchronisation :', err);
  process.exit(1);
}); 