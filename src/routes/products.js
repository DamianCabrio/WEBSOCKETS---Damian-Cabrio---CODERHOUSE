const express = require("express");
const upload = require("../services/upload.js");
const productContainerClass = require("../classes/ProductContainer.js");
const io = require("../services/io.js");

const router = express.Router();
const productContainer = new productContainerClass(
  __dirname + "/../data/products.txt"
);

const filePath = (protocol, hostname, filename) => {
  return `${protocol}://${hostname}:8080/images/${filename}`;
};

//GET
router.get("/", (_, res) => {
  productContainer.getAll().then((products) => {
    res.send(products);
  });
});

//GET ONE
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  productContainer.getById(id).then((product) => {
    res.send(product);
  });
});

//POST
router.post("/", upload.single("thumbnail"), (req, res) => {
  const product = req.body;
  if (req.file) {
    const thumbnail = filePath(req.protocol, req.hostname, req.file.filename);
    product.thumbnail = thumbnail;
    productContainer.save(product).then((product) => {
      res.send(product);
      if (product.status === "success") {
        productContainer.getAll().then((products) => {
          io.emit("deliverProducts", products.payload);
        });
      }
    });
  } else {
    res.send(
      JSON.stringify({
        status: "error",
        message: "No se ha podido subir la imagen",
        payload: null,
      })
    );
  }
});

//UPDATE
router.put("/:id", upload.single("thumbnail"), (req, res) => {
  const id = parseInt(req.params.id);
  const product = req.body;
  product.thumbnail = null;
  if (req.file) {
    const thumbnail = filePath(req.protocol, req.hostname, req.file.filename);
    product.thumbnail = thumbnail;
  }

  productContainer.updateById(id, product).then((product) => {
    res.send(product);
  });
});

//DELETE
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  productContainer.deleteById(id).then((product) => {
    res.send(product);
  });
});

module.exports = router;
