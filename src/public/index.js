const socket = io();

const input = document.getElementById("message");
const sendButton = document.getElementById("send");

const user = document.getElementById("user");
const errorMessage = document.getElementById("error-message");

const imgPreviewEl = document.getElementById("preview");
const imgTextEl = document.getElementById("image-text");

function enviarFormulario(event) {
  event.preventDefault();
  const form = event.target;
  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;
  const thumbnailEl = document.querySelector("#thumbnail");
  const thumbnail = thumbnailEl.files[0];

  const formData = new FormData();
  formData.append("title", title);
  formData.append("price", price);
  formData.append("thumbnail", thumbnail);

  fetch("/api/productos", {
    method: "POST",
    body: formData,
  })
    .then((result) => {
      return result.json();
    })
    .then((json) => {
      const title = json.status === "success" ? "Éxito" : "Error";
      const icon = json.status === "success" ? "success" : "error";
      Swal.fire({
        title: title,
        text: json.message,
        icon: icon,
        timer: 2000,
      });
      if (json.status === "success") {
        socket.emit("addedProduct");
        form.reset();
        imgPreviewEl.classList.add("d-none");
        imgTextEl.classList.add("d-none");
        document.getElementById("preview").src = "";
      }
    });
}

const sendMessage = (event) => {
  event.preventDefault();
  socket.emit("message", { user: user.value, message: input.value });
  input.value = "";
};

const createMessage = (message) => {
  const div = document.createElement("div");
  const finalMessage = cleanString(message.message);
  const finalUser = cleanString(message.user);

  div.innerHTML = `<p><span class="text-primary fw-bold">${finalUser}</span> <span class="text-brown">[${message.date}]</span>: <span class="text-success fst-italic">${finalMessage}</span></p>`;
  document.getElementById("messages").appendChild(div);
};

function checkIfEmailInString(text) {
  var re =
    /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
  return re.test(text);
}

const toggleError = () => {
  if (user.value !== "" && checkIfEmailInString(user.value)) {
    sendButton.disabled = false;
    errorMessage.classList.add("d-none");
  } else {
    sendButton.disabled = true;
    errorMessage.classList.remove("d-none");
  }
};

const cleanString = (string) => {
  const tmpDiv = document.createElement("div");
  tmpDiv.innerHTML = string;
  const cleanedString = tmpDiv.textContent || tmpDiv.innerText;
  tmpDiv.remove();
  return cleanedString;
};

user.addEventListener("keyup", (_) => {
  toggleError();
});

document.addEventListener("submit", enviarFormulario);
input.addEventListener("keyup", (event) => {
  if (event.key === "Enter" && input.value !== "" && user.value !== "") {
    sendMessage(event);
  }
});

sendButton.addEventListener("click", (event) => {
  if (input.value !== "" && user.value !== "") {
    sendMessage(event);
  }
});

document.getElementById("thumbnail").onchange = (e) => {
  let read = new FileReader();
  read.onload = (e) => {
    imgPreviewEl.src = e.target.result;
    imgPreviewEl.classList.remove("d-none");
    imgTextEl.classList.remove("d-none");
  };

  read.readAsDataURL(e.target.files[0]);
};

socket.on("sendMessage", (data) => {
  createMessage(data);
});

socket.on("connected", (data) => {
  data.messages.forEach((message) => {
    createMessage(message);
  });
});

socket.on("deliverProducts", (data) => {
  fetch("templates/productsTable.handlebars")
    .then((response) => response.text())
    .then((template) => {
      const templateFn = Handlebars.compile(template);
      const html = templateFn({ products: data });
      const productsDiv = document.getElementById("productos");
      productsDiv.innerHTML = html;
    });
});

socket.on("deliverMessages", (data) => {
  data.forEach((message) => {
    createMessage(message);
  });
});

toggleError();
