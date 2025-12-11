card.querySelector(".like").onclick=()=>{
  const likeBtn = card.querySelector(".like");
  const count = card.querySelector(".like-count");

  if (likeBtn.classList.contains("text-danger")) {
    likeBtn.classList.remove("text-danger");
    count.textContent = Number(count.textContent) - 1;
  } else {
    likeBtn.classList.add("text-danger");
    count.textContent = Number(count.textContent) + 1;
  }
};
