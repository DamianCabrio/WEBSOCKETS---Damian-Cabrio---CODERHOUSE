class Product {
  constructor(title, price, thumbnail) {
    this.title = title;
    this.price = parseFloat(price);
    this.thumbnail = thumbnail;
    this.id = undefined;
  }
  getId() {
    return this.id;
  }
  setId(id) {
    this.id = id;
  }
  getTitle() {
    return this.title;
  }
  setTitle(title) {
    this.title = title;
  }
  getPrice() {
    return this.price;
  }
  setPrice(price) {
    this.price = price;
  }
  getThumbnail() {
    return this.thumbnail;
  }
  setThumbnail(thumbnail) {
    this.thumbnail = thumbnail;
  }
}

module.exports = Product;
