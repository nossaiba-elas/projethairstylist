const express = require('express');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

// Load env variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const rendezvousRoutes = require('./routes/rendezvous');
app.use('/rendezvous', rendezvousRoutes(prisma));

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log('reservation_service running on port', PORT);
});
