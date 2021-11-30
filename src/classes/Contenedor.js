const fs = require("fs");
const Product = require("./Product.js");

class Contenedor {
  constructor(path) {
    this.path = path;
  }

  async deleteImage(image) {
    const imgPath = "./public/images/" + image.split("/")[4];
    try {
      if (fs.existsSync(imgPath)) {
        await fs.promises.unlink("./public/images/" + image.split("/")[4]);
      }
      return true
    } catch (error) {
      return false
    }
  }

  async save(product) {
    if (!product.title) {
      await this.deleteImage(product.thumbnail);
      return this.returnMessage(true, "El titulo es obligatorio", null);
    }

    if (!product.price) {
      await this.deleteImage(product.thumbnail);
      return this.returnMessage(true, "El precio es obligatorio", null);
    }

    if (!product.thumbnail) {
      await this.deleteImage(product.thumbnail);
      return this.returnMessage(true, "La imagen es obligatoria", null);
    }

    try {
      const products = (await this.getAll()).payload;
      const newProduct = new Product(
        product.title,
        product.price,
        product.thumbnail
      );
      const idProducto =
        products.length > 0 ? products[products.length - 1].id + 1 : 1;
      newProduct.setId(idProducto);

      products.push(newProduct);
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));

      return this.returnMessage(false, "Producto guardado", newProduct);
    } catch (error) {
      return this.returnMessage(true, "Error al guardar el producto", null);
    }
  }

  async getById(id) {
    try {
      const products = (await this.getAll()).payload;
      const product = products.find((product) => product.id === id);

      if (product) {
        return this.returnMessage(false, "Producto encontrado", product);
      } else {
        return this.returnMessage(true, "Producto no encontrado", null);
      }
    } catch (error) {
      return this.returnMessage(true, "Error al obtener el producto", null);
    }
  }

  async getAll() {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const products = JSON.parse(data);

      return this.returnMessage(false, "Productos encontrados", products);
    } catch (error) {
      return this.returnMessage(true, "Error al obtener los productos", null);
    }
  }

  async deleteById(id) {
    try {
      const products = (await this.getAll()).payload;
      const eliminatedProduct = products.find((product) => product.id === id);
      if (!eliminatedProduct) {
        return this.returnMessage(true, "Producto no encontrado", null);
      }
      const productsFiltered = products.filter((product) => product.id !== id);
      await this.deleteImage(eliminatedProduct.thumbnail);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(productsFiltered, null, 2)
      );

      return this.returnMessage(false, "Producto eliminado", eliminatedProduct);
    } catch (error) {
      return this.returnMessage(
        true,
        "Error al eliminar el producto: " + error,
        null
      );
    }
  }

  async deleteAll() {
    try {
      await fs.promises.writeFile(this.path, "[]");

      return this.returnMessage(false, "Productos eliminados", null);
    } catch (error) {
      return this.returnMessage(true, "Error al eliminar los productos", null);
    }
  }

  async updateById(id, newProduct) {
    try {
      const products = (await this.getAll()).payload;
      const indexProduct = products.findIndex((product) => product.id === id);
      if (indexProduct === -1) {
        await this.deleteImage(newProduct.thumbnail);
        return this.returnMessage(true, "Producto no encontrado", null);
      }
      const productToBeUpdated = products[indexProduct];

      if (newProduct.title) {
        productToBeUpdated.title = newProduct.title;
      }
      if (newProduct.price) {
        productToBeUpdated.price = parseFloat(newProduct.price);
      }
      if (newProduct.thumbnail) {
        await this.deleteImage(productToBeUpdated.thumbnail);
        productToBeUpdated.thumbnail = newProduct.thumbnail;
      }

      products[indexProduct] = productToBeUpdated;

      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
      return this.returnMessage(
        false,
        "Producto actualizado",
        productToBeUpdated
      );
    } catch (error) {
      return this.returnMessage(
        true,
        "Error al actualizar el producto" + error,
        null
      );
    }
  }

  returnMessage(isError, message, payload) {
    return {
      status: isError ? "error" : "success",
      message,
      payload,
    };
  }
}

module.exports = Contenedor;
