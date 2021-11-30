document.addEventListener("submit", enviarFormulario);

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
      }).then(() => {
        if (json.status === "success") {
          form.reset();
          imgPreviewEl.classList.add("d-none");
          imgTextEl.classList.add("d-none");
          document.getElementById("preview").src = "";
        }
      });
    });
}

const imgPreviewEl = document.getElementById("preview");
const imgTextEl = document.getElementById("image-text");
document.getElementById("thumbnail").onchange = (e) => {
  let read = new FileReader();
  read.onload = (e) => {
    imgPreviewEl.src = e.target.result;
    imgPreviewEl.classList.remove("d-none");
    imgTextEl.classList.remove("d-none");
  };

  read.readAsDataURL(e.target.files[0]);
};

const socket = io();

const input = document.getElementById("message");
const sendButton = document.getElementById("send");

const user = document.getElementById("user");
const errorMessage = document.getElementById("error-message");

const sendMessage = (event) => {
  event.preventDefault();
  socket.emit("message", {user:user.value, message: input.value});
  input.value = "";
};

const createMessage = (message) => {
  const div = document.createElement("div");
  const tmpDiv = document.createElement("div");
  tmpDiv.innerHTML = message.message;
  const finalMessage = tmpDiv.textContent || tmpDiv.innerText;

  tmpDiv.innerHTML = message.user;
  const finalUser = tmpDiv.textContent || tmpDiv.innerText;
  tmpDiv.remove();

  div.innerHTML = `<p>${finalUser} dice: ${finalMessage}</p>`;
  document.getElementById("messages").appendChild(div);
};

const toggleError = () => {
  if (user.value !== "") {
    sendButton.disabled = false;
    errorMessage.classList.add("d-none");
  } else {
    sendButton.disabled = true;
    errorMessage.classList.remove("d-none");
  }
};

toggleError();
user.addEventListener("keyup", (_) => {
  toggleError()
});

input.addEventListener("keyup", (event) => {
  if (event.key === "Enter" && input.value !== "" && user.value !== "") {
    sendMessage(event);
  }
});

sendButton.addEventListener("click", (event) => {
  if(input.value !== "" && user.value !== "") {
    sendMessage(event);
  }
});

socket.on('sendMessage', data => {
  createMessage(data);
});

socket.on('connected', data => {
  data.messages.forEach(message => {
    createMessage(message);
  });
});