const form = document.getElementById("messageForm");
const messagesDiv = document.getElementById("messages");

//const API = import.meta.env.VITE_SERVER_URL;
const API = import.meta.env.VITE_SERVER_URL;

// Load messages on page load
async function loadMessages() {
  const res = await fetch(`${API}/messages`);
  const data = await res.json();

  messagesDiv.innerHTML = "";

  // data.forEach((msg) => {
  //   const p = document.createElement("p");
  //   p.textContent = `${msg.username}: ${msg.content}`;
  //   messagesDiv.appendChild(p);
  // });

  // //Delete
  // data.forEach((msg) => {
  //   const wrapper = document.createElement("div");
  //   wrapper.className = "message";

  //   const p = document.createElement("p");
  //   p.textContent = `${msg.username}: ${msg.content}`;

  //   const del = document.createElement("button");
  //   del.textContent = "Delete";
  //   del.onclick = async () => {
  //     await fetch(`${API}/messages/${msg.id}`, { method: "DELETE" });
  //     loadMessages();
  //   };

  //   wrapper.appendChild(p);
  //   wrapper.appendChild(del);
  //   messagesDiv.appendChild(wrapper);
  // });

  //Likes
  data.forEach((msg) => {
    const wrapper = document.createElement("div");
    wrapper.className = "message";

    const p = document.createElement("p");
    p.textContent = `${msg.username}: ${msg.content}`;

    //  Like button
    const like = document.createElement("button");
    like.className = "like-btn";
    like.textContent = `❤️ ${msg.likes}`;
    like.onclick = async () => {
      await fetch(`${API}/messages/${msg.id}/like`, { method: "POST" });
      loadMessages();
    };

    //  Delete button
    const del = document.createElement("button");
    del.className = "delete-btn";
    del.textContent = "Delete";
    del.onclick = async () => {
      await fetch(`${API}/messages/${msg.id}`, { method: "DELETE" });
      loadMessages();
    };

    wrapper.appendChild(like);
    wrapper.appendChild(p);
    wrapper.appendChild(del);
    messagesDiv.appendChild(wrapper);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  //Validation
  const username = form.username.value.trim();
  const content = form.content.value.trim();
  if (username.length < 2) {
    alert("Name must be at least 2 characters.");
    return;
  }
  if (content.length < 2) {
    alert("Message must be at least 5 characters.");
    return;
  }

  const formData = new FormData(form);
  const body = Object.fromEntries(formData);

  await fetch(`${API}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  form.reset();
  loadMessages();
});

loadMessages();
