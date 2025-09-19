document.addEventListener("DOMContentLoaded", () => {
    // === DOM ELEMENTS ===
    const container       = document.getElementById("store-container");
    const popup           = document.getElementById("popup");
    const closePopupBtn   = document.getElementById("close-popup");
    const popupHeading    = document.getElementById("popup-heading");
    const popupDetails    = document.getElementById("popup-details");

    // Slideshow elements
    const slideshow       = document.getElementById("slideshow");
    const slideImage      = document.getElementById("slide-image");
    const prevSlideBtn    = document.getElementById("prev-slide");
    const nextSlideBtn    = document.getElementById("next-slide");

    // === STATE ===
    let currentSlideIndex   = 0;
    let currentScreenshots  = [];

    // === MODAL CONTROL ===
    const openModal = () => {
        popup.style.display = "block";
        popup.setAttribute("aria-hidden", "false");
    };

    const closeModal = () => {
        popup.style.display = "none";
        popup.setAttribute("aria-hidden", "true");
    };

    // === SLIDESHOW CONTROL ===
    const showSlide = (index) => {
        if (currentScreenshots.length > 0) {
            slideImage.src = currentScreenshots[index];
        }
    };

    const changeSlide = (direction) => {
        if (currentScreenshots.length === 0) return;
        currentSlideIndex = (currentSlideIndex + direction + currentScreenshots.length) % currentScreenshots.length;
        showSlide(currentSlideIndex);
    };

    prevSlideBtn.addEventListener("click", () => changeSlide(-1));
    nextSlideBtn.addEventListener("click", () => changeSlide(1));

    // === CARD CREATION ===
    const createCard = (item) => {
        const card = document.createElement("div");
        card.classList.add("store-item");

        // Optional logo
        const logoHTML = item.logo 
            ? `<div class="logo-container"><img src="${item.logo}" alt="${item.name} logo"></div>` 
            : "";

        card.innerHTML = `
            ${logoHTML}
            <h2>${item.name ?? ""}</h2>
            <p><strong>Version:</strong> ${item.version ?? ""}</p>
            <p>${item.desc ?? ""}</p>
            <button type="button" class="view-btn">View Details</button>
        `;

        // View Details button
        card.querySelector(".view-btn").addEventListener("click", () => openPopupWithItem(item));

        return card;
    };

    // === POPUP CONTENT BUILDER ===
    const openPopupWithItem = (item) => {
        popupHeading.textContent = item.name ?? "App Details";

        // Build details (excluding special keys)
        const detailsHTML = Object.entries(item)
            .filter(([key]) => !["screenshots", "logo", "links"].includes(key))
            .map(([key, value]) => `<p><strong>${key}:</strong> ${String(value)}</p>`)
            .join("");

        popupDetails.innerHTML = detailsHTML || "<p>No details available.</p>";

        // Optional logo in popup
        if (item.logo) {
            popupDetails.insertAdjacentHTML("afterbegin", `
                <div class="popup-logo">
                    <img src="${item.logo}" alt="${item.name} logo">
                </div>
            `);
        }

        // Optional links in popup (with label + url)
        if (item.links && item.links.length > 0) {
            const linksHTML = `
                <div class="popup-links">
                    ${item.links.map(linkObj => 
                        `<a href="${linkObj.url}" target="_blank" class="link-btn">${linkObj.label}</a>`
                    ).join("")}
                </div>
            `;
            popupDetails.insertAdjacentHTML("beforeend", linksHTML);
        }

        // Slideshow setup
        if (item.screenshots && item.screenshots.length > 0) {
            currentScreenshots = item.screenshots;
            currentSlideIndex = 0;
            showSlide(currentSlideIndex);
            slideshow.style.display = "block";
        } else {
            slideshow.style.display = "none";
            currentScreenshots = [];
        }

        openModal();
    };

    // === RENDER ALL CARDS ===
    (storeData || []).forEach(item => {
        container.appendChild(createCard(item));
    });

    // === POPUP CLOSE EVENTS ===
    closePopupBtn.addEventListener("click", closeModal);
    window.addEventListener("click", (e) => { if (e.target === popup) closeModal(); });
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
});
