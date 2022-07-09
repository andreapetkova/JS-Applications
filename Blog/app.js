function attachEvents() {
  document
    .getElementById("btnLoadPosts")
    .addEventListener("click", getAllPosts);
  document
    .getElementById("btnViewPost")
    .addEventListener("click", displayPosts);
}

attachEvents();

async function displayPosts() {
  const selectedId = document.getElementById("posts").value;
  const ulElement = document.getElementById("post-comments");
  const titleElement = document.getElementById("post-title");
  const bodyElement = document.getElementById("post-body");

  titleElement.textContent = "Loading...";
  bodyElement.textContent = "";
  ulElement.replaceChildren();

  let [post, comments] = await Promise.all([
    getPostById(selectedId),
    getCommentsByPostId(selectedId),
  ]);

  titleElement.textContent = post.title;
  bodyElement.textContent = post.body;

  ulElement.replaceChildren();

  comments.forEach((c) => {
    const liElement = document.createElement("li");
    liElement.textContent = c.text;
    ulElement.appendChild(liElement);
  });
}

async function getAllPosts() {
  try {
    const res = await fetch("http://localhost:3030/jsonstore/blog/posts");

    if (res.ok == false) {
      throw new Error();
    }

    const allPosts = await res.json();

    const selectElement = document.getElementById("posts");
    selectElement.replaceChildren();

    Object.values(allPosts).forEach((p) => {
      const optionElement = document.createElement("option");
      optionElement.textContent = p.title;
      optionElement.value = p.id;

      selectElement.appendChild(optionElement);
    });
  } catch (err) {
    alert(err.message);
  }
}

async function getPostById(postId) {
  try {
    const url = "http://localhost:3030/jsonstore/blog/posts/" + postId;

    const res = await fetch(url);

    if (res.ok == false) {
      throw new Error();
    }

    const post = await res.json();
    return post;

  } catch (err) {
    alert(err.message);
  }
}

async function getCommentsByPostId(postId) {
  try {
    const res = await fetch("http://localhost:3030/jsonstore/blog/comments");

    if (res.ok == false) {
      throw new Error();
    }

    const data = await res.json();

    const comments = Object.values(data).filter((c) => c.postId == postId);

    return comments;
  } catch (err) {
    alert(err.message);
  }
}
