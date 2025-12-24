const express = require("express");
const cors = require("cors");
const os = require('os');

const authRoutes = require("./routes/auth");
const pharmaRoutes = require("./routes/pharmacies");
const medicRoutes = require("./routes/medicaments");
const cmdRoutes = require("./routes/commandes");
const categoryRoutes = require("./routes/categoryRoutes");
const utilisateursRoutes = require("./routes/utilisateurs");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/utilisateurs", utilisateursRoutes);
app.use("/api/pharmacies", pharmaRoutes);
app.use("/api/medicaments", medicRoutes);
app.use("/api/commandes", cmdRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  const interfaces = os.networkInterfaces();
  let localIp = 'localhost';
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        localIp = iface.address;
      }
    }
  }
  
  console.log(`🚀 Serveur démarré sur http://0.0.0.0:${PORT}`);
  console.log(`📡 Accès local (ex): http://${localIp}:${PORT}/api`);
});
