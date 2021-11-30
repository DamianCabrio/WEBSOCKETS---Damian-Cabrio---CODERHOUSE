const express = require("express");

const app = express();
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
    console.log(`Servidor HTTP escuchando en el puerto ${server.address().port}`);
  });

server.on("error", (error) => console.log(`Error en servidor: ${error}`));

exports.server = server;
exports.app = app;