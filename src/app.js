const cors = require('cors');
const express = require("express");
const productRouter = require("./routes/products");
const productContainerClass = require("./classes/ProductContainer.js");
const messagesContainerClass = require("./classes/MessageContainer.js");
const io = require("./services/io.js");
const {app} = require("./services/express.js");

app.use(cors());

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(express.static(__dirname + "/public"));

app.use("/api/productos", productRouter);

const productContainer = new productContainerClass(__dirname + "/data/products.txt");
const messagesContainer = new messagesContainerClass(__dirname + "/data/messages.txt");

io.on('connection', async socket => {
  console.log('Cliente conectado');
  const products = await productContainer.getAll();
  const messages = await messagesContainer.getAll();
  socket.emit('deliverProducts', products.payload);
  socket.emit('deliverMessages', messages.payload);
  socket.on('message', data => {
    messagesContainer.save(data).then((result) => {
      io.emit("sendMessage", result.payload);
    });
  });
})
