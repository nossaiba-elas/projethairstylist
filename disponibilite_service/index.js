const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Pass prisma to routes if needed
const disponibilitesRoutes = require('./routes/disponibilites');
app.use('/disponibilites', disponibilitesRoutes(prisma));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log('disponibilite_service running', PORT);
}); 