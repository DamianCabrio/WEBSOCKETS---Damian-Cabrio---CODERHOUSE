const cors = require('cors');
const express = require("express");
const { engine } = require("express-handlebars");
const { Server } = require("socket.io");
const Contenedor = require("./classes/Contenedor.js");
const productRouter = require("./routes/products.js");

const app = express();
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`Servidor HTTP escuchando en el puerto ${server.address().port}`);
});

server.on("error", (error) => console.log(`Error en servidor: ${error}`));

app.use(cors());
app.engine("handlebars", engine());
app.set("views", __dirname +  "/views");
app.set("view engine", "handlebars");

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(express.static(__dirname + "/public"));

app.use("/api/productos", productRouter);

const io = new Server(server);


const contenedor = new Contenedor("./data/products.txt");

app.get("/", (_, res) => {
  contenedor.getAll().then((result) => {
    const data = {
      title: "Productos",
      products: result.payload,
    };
    res.render("index", data);
  });
})

const messages = [];
io.on('connection', socket => {
  console.log('Cliente conectado');
  socket.emit("connected" , {messages});
  socket.on('message', data => {
    messages.push(data);
    io.emit('sendMessage', data);
  });
})
