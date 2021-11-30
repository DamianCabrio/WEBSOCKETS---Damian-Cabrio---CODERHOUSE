class Message {
  constructor(user, message) {
    this.user = user;
    this.message = message;
    this.date = this.getFormattedDate();
    this.id = undefined;
  }

  getUser() {
    return this.user;
  }

  getMessage() {
    return this.message;
  }

  getDate() {
    return this.date;
  }

  getId() {
    return this.id;
  }

  setUser(user) {
    this.user = user;
  }

  setMessage(message) {
    this.message = message;
  }

  setDate(date) {
    this.date = date;
  }

  setId(id) {
    this.id = id;
  }

  getFormattedDate() {
    var date = new Date();
    var str =
      date.getDate() +
      "/" +
      (date.getMonth() + 1) +
      "/" +
      date.getFullYear() +
      " " +
      date.getHours() +
      ":" +
      date.getMinutes() +
      ":" +
      date.getSeconds();
    return str;
  }
}

module.exports = Message;
