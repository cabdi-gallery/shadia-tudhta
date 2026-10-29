const gallery = document.getElementById("gallery");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const photoCounter = document.getElementById("photoCounter");

const closeLightbox = document.getElementById("closeLightbox");
const previousPhoto = document.getElementById("previousPhoto");
const nextPhoto = document.getElementById("nextPhoto");

const filterButtons = document.querySelectorAll(".filter-btn");

// 15 sawir oo JPEG ah
const photos = Array.from({ length: 15 }, (_, index) => ({
    id: index + 1,
    src: `images/photo${index + 1}.jpeg`,
    title: index === 0
        ? "Tushtu Waa Quruxdayda 💗"
        : `Xusuus Qurux Badan ${index + 1} 🌸`
}));

// Sawirrada uu qofku jecel yahay
let favorites = new Set();

try {
    const savedFavorites = JSON.parse(
        localStorage.getItem("beertaFavorites") || "[]"
    );

    if (Array.isArray(savedFavorites)) {
        favorites = new Set(
            savedFavorites.filter(
                id => Number.isInteger(id) && id >= 1 && id <= 15
            )
        );
    }
} catch (error) {
    favorites = new Set();
}

let currentPhotoIndex = 0;
let activeFilter = "all";

// Samee gallery-ga
function renderGallery() {
    gallery.innerHTML = "";

    const visiblePhotos = photos.filter(photo => {
        return activeFilter === "all" ||
            favorites.has(photo.id);
    });

    if (visiblePhotos.length === 0) {
        gallery.innerHTML = `
            <p class="empty-message">
                💗 Weli ma jiraan sawirro favorites ah.
                Taabo wadnaha sawirka aad jeceshahay.
            </p>
        `;
        return;
    }

    visiblePhotos.forEach(photo => {
        const isFavorite = favorites.has(photo.id);

        const card = document.createElement("article");
        card.className = "photo-card";

        const favoriteButton = document.createElement("button");
        favoriteButton.className =
            `favorite-btn ${isFavorite ? "is-favorite" : ""}`;

        favoriteButton.textContent = isFavorite ? "♥" : "♡";
        favoriteButton.setAttribute(
            "aria-label",
            isFavorite
                ? "Ka saar favorites"
                : "Ku dar favorites"
        );

        favoriteButton.addEventListener("click", () => {
            toggleFavorite(photo.id);
        });

        const image = document.createElement("img");
        image.className = "card-image";
        image.src = photo.src;
        image.alt = photo.title;
        image.loading = "lazy";

        image.addEventListener("click", () => {
            openPhoto(photo.src, photo.title);
        });

        // Haddii sawirku maqan yahay, muuji fariin
        image.addEventListener("error", () => {
            image.alt = "Sawirkan weli lama gelin";
            image.style.objectFit = "contain";
        });

        const caption = document.createElement("p");
        caption.className = "card-caption";
        caption.textContent = photo.title;

        card.append(favoriteButton, image, caption);
        gallery.appendChild(card);
    });
}

// Ku dar ama ka saar favorites
function toggleFavorite(id) {
    if (favorites.has(id)) {
        favorites.delete(id);
    } else {
        favorites.add(id);
    }

    try {
        localStorage.setItem(
            "beertaFavorites",
            JSON.stringify([...favorites])
        );
    } catch (error) {
        // Gallery-gu wuu shaqaynayaa xitaa haddii
        // kaydinta favorites aan la heli karin.
    }

    renderGallery();
}

// Badhannada kala shaandhaynta
filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        activeFilter = button.dataset.filter;

        filterButtons.forEach(btn => {
            btn.classList.toggle("active", btn === button);
        });

        renderGallery();
    });
});

// Fur sawir weyn
function openPhoto(src, alt) {
    currentPhotoIndex = photos.findIndex(photo => photo.src === src);

    if (currentPhotoIndex < 0) {
        currentPhotoIndex = 0;
    }

    lightboxImage.src = src;
    lightboxImage.alt = alt;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    updateCounter();
}

// Tirada sawirka
function updateCounter() {
    photoCounter.textContent =
        `Sawirka ${currentPhotoIndex + 1} / ${photos.length}`;
}

// Sawirka xiga
function showNextPhoto() {
    currentPhotoIndex =
        (currentPhotoIndex + 1) % photos.length;

    const photo = photos[currentPhotoIndex];

    lightboxImage.src = photo.src;
    lightboxImage.alt = photo.title;

    updateCounter();
}

// Sawirkii hore
function showPreviousPhoto() {
    currentPhotoIndex =
        (currentPhotoIndex - 1 + photos.length) % photos.length;

    const photo = photos[currentPhotoIndex];

    lightboxImage.src = photo.src;
    lightboxImage.alt = photo.title;

    updateCounter();
}

// Xir sawirka weyn
function closePhoto() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

closeLightbox.addEventListener("click", closePhoto);

nextPhoto.addEventListener("click", showNextPhoto);

previousPhoto.addEventListener("click", showPreviousPhoto);

// Guji meel bannaan si aad u xirto
lightbox.addEventListener("click", event => {
    if (event.target === lightbox) {
        closePhoto();
    }
});

// Keyboard-ka laptop-ka
document.addEventListener("keydown", event => {
    if (!lightbox.classList.contains("open")) return;

    if (event.key === "Escape") {
        closePhoto();
    }

    if (event.key === "ArrowRight") {
        showNextPhoto();
    }

    if (event.key === "ArrowLeft") {
        showPreviousPhoto();
    }
});

// Bilow website-ka
renderGallery();
