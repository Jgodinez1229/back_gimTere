const express = require("express");
const cors = require("cors");
const app = express();

// Use CORS middleware
app.use(cors());

/* const corsOptions = {
  origin: "https://www.nileshblog.tech/", //(https://your-client-app.com)
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions)); */

//Middleware para que express pueda entender json
app.use(express.json());

//Ruta por defecto que manda un response al visitar el home
app.get("/", (req, res) => {
  res.send("Hello World!");
});

//Rutas de usuarios
const usuariosRoutes = require("./routes/usuariosRoutes");
app.use("/usuarios", usuariosRoutes);

//Rutas de gimnasios
const gymRoutes = require("./routes/gymRoutes");
app.use("/gimnasios", gymRoutes);

//Rutas de entrenadores
const entrenadorRoutes = require("./routes/entrenadorRoutes");
app.use("/entrenadores", entrenadorRoutes);

const citasRoutes = require("./routes/citasRoutes");
app.use("/citas", citasRoutes);

//Rutas de autenticación
const authRoutes = require("./routes/autenticacionRoutes");
app.use("/auth", authRoutes);

//Rutas de solicitudes de entrenador
const solicitudesRoutes = require("./routes/solicitudesRoutes");
app.use("/solicitudes", solicitudesRoutes);

//Rutas de videos
const videoRoutes = require("./routes/videosRoutes");
app.use("/videos", videoRoutes);

// Set up the server to listen on port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
