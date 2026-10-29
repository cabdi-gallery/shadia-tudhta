const gallery = document.getElementById("gallery");
const featuredPhoto = document.getElementById("featuredPhoto");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const photoCounter = document.getElementById("photoCounter");

const closeLightbox = document.getElementById("closeLightbox");
const previousPhoto = document.getElementById("previousPhoto");
const nextPhoto = document.getElementById("nextPhoto");

const filterButtons = document.querySelectorAll(".filter-btn");

// 19-ka sawir: photo1.jpeg ilaa photo19.jpeg
const photos = Array.from({ length: 19 }, (_, index) => ({
    id: index + 1,
    src: `photo${index + 1}.jpeg`,
    title: index === 0
        ? "Tushtu Waa Quruxdayda"
        : `Xusuus Qurux Badan ${index + 1}`,
    favorite: index === 0
}));

let currentFilter = "all";
let currentPhotoIndex = 0;

// Soo bandhig sawirrada
function displayPhotos() {
    gallery.innerHTML = "";

    const visiblePhotos = photos.filter(photo => {
        return currentFilter === "all" || photo.favorite;
    });

    if (visiblePhotos.length === 0) {
        gallery.innerHTML = `
            <div class="empty-message">
                <h3>♡ Weli favorites ma jiraan ♡</h3>
                <p>Taabo wadnaha sawirka si aad ugu darto favorites.</p>
            </div>
        `;
        return;
    }

    visiblePhotos.forEach(photo => {
        const card = document.createElement("article");
        card.className = "photo-card";

        const image = document.createElement("img");
        image.src = photo.src;
        image.alt = photo.title;
        image.loading = "lazy";

        image.addEventListener("click", () => {
            openPhoto(photo.id - 1);
        });

        const favoriteButton = document.createElement("button");
        favoriteButton.className = "favorite-btn";
        favoriteButton.type = "button";
        favoriteButton.textContent = photo.favorite ? "♥" : "♡";
        favoriteButton.classList.toggle(
            "is-favorite",
            photo.favorite
        );
        favoriteButton.setAttribute(
            "aria-label",
            photo.favorite
                ? "Ka saar favorites"
                : "Ku dar favorites"
        );

        favoriteButton.addEventListener("click", () => {
            photo.favorite = !photo.favorite;
            displayPhotos();
        });

        const title = document.createElement("div");
        title.className = "photo-title";
        title.textContent = photo.id === 1
            ? "Tushtu Waa Quruxdayda 🌸"
            : `${photo.title} 🌸`;

        card.appendChild(image);
        card.appendChild(favoriteButton);
        card.appendChild(title);

        gallery.appendChild(card);

        // Muuji calaamad marka sawirku maqan yahay
        image.addEventListener("error", () => {
            image.alt = `${photo.src} lama helin`;
            image.style.objectFit = "contain";
            image.style.padding = "15px";
        });
    });
}

// Fur sawirka weyn
function openPhoto(index) {
    currentPhotoIndex = index;
    updateLightbox();

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

// Cusboonaysii sawirka weyn
function updateLightbox() {
    const photo = photos[currentPhotoIndex];

    lightboxImage.src = photo.src;
    lightboxImage.alt = photo.title;

    photoCounter.textContent =
        `Sawirka ${currentPhotoIndex + 1} / ${photos.length}`;
}

// Sawirka xiga
function showNextPhoto() {
    currentPhotoIndex =
        (currentPhotoIndex + 1) % photos.length;

    updateLightbox();
}

// Sawirkii hore
function showPreviousPhoto() {
    currentPhotoIndex =
        (currentPhotoIndex - 1 + photos.length) % photos.length;

    updateLightbox();
}

// Xir sawirka weyn
function closePhoto() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
    document.body.style.overflow = "";
}

// Badhannada sawirrada
featuredPhoto.addEventListener("click", () => {
    openPhoto(0);
});

closeLightbox.addEventListener("click", closePhoto);
nextPhoto.addEventListener("click", showNextPhoto);
previousPhoto.addEventListener("click", showPreviousPhoto);

// Xir marka bannaanka sawirka la taabto
lightbox.addEventListener("click", event => {
    if (event.target === lightbox) {
        closePhoto();
    }
});

// Adeegso fallaaraha keyboard-ka
document.addEventListener("keydown", event => {
    if (!lightbox.classList.contains("open")) return;

    if (event.key === "Escape") closePhoto();
    if (event.key === "ArrowRight") showNextPhoto();
    if (event.key === "ArrowLeft") showPreviousPhoto();
});

// All Photos iyo Favorites
filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(item => {
            item.classList.toggle("active", item === button);
        });

        displayPhotos();
    });
});

// Bilow website-ka
displayPhotos();
