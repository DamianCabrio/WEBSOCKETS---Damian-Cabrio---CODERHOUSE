const fs = require("fs");
const Message = require("./Message.js");

class MessageContainer {
  constructor(path) {
    this.path = path;
  }

  async save(message) {
    if (!message.user) {
      return this.returnMessage(true, "El usuario es obligatorio", null);
    }

    if (!message.message) {
      return this.returnMessage(true, "El mensaje es obligatorio", null);
    }
    try {
      const messages = (await this.getAll()).payload;
      const newMessage = new Message(message.user, message.message);
      const idMensaje =
        messages.length > 0 ? messages[messages.length - 1].id + 1 : 1;
      newMessage.setId(idMensaje);

      messages.push(newMessage);
      await fs.promises.writeFile(this.path, JSON.stringify(messages, null, 2));

      return this.returnMessage(false, "Mensaje guardado", newMessage);
    } catch (error) {
      return this.returnMessage(true, "Error al guardar el mensaje: "+ error, null);
    }
  }

  async getAll() {
    try {
      const messages = (await fs.promises.readFile(this.path)).toString();
      return this.returnMessage(
        false,
        "Mensajes obtenidos",
        JSON.parse(messages)
      );
    } catch (error) {
      return this.returnMessage(true, "Error al obtener los mensajes", null);
    }
  }

  returnMessage(error, message, payload) {
    return {
      error: error,
      message: message,
      payload: payload,
    };
  }
}

module.exports = MessageContainer;