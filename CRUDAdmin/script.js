const form = document.getElementById("postForm");
const feed = document.getElementById("feed");
form.addEventListener("submit", function(e) {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const cost = document.getElementById("cost").value;
    const desc = document.getElementById("description").value;
    const imgFile = document.getElementById("image").files[0];
    const imgURL = URL.createObjectURL(imgFile);
    const card = document.createElement("div");
    card.classList.add("col-12", "col-sm-6", "col-lg-4"); 
    card.innerHTML = `
        <div class="card shadow h-100">
            <img src="${imgURL}" class="card-img-top" alt="Imagen publicación">
            <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <h6 class="card-title"> $${cost}</h6>
                <p class="card-text">${desc}</p>

                <div class="d-flex align-items-center gap-2">
                    <i class="bi bi-heart fs-4 like-btn"></i>
                    <span class="likes-count">0</span> likes
                </div>
            </div>
        </div>
            `;
    feed.prepend(card);
    const likeBtn = card.querySelector(".like-btn");
    const likesCount = card.querySelector(".likes-count");
    likeBtn.addEventListener("click", function() {
        likeBtn.classList.add("liked"); 
        likesCount.textContent = parseInt(likesCount.textContent) + 1;
        });
    form.reset();
});