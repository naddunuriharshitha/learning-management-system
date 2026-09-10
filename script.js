/* =========================================================
   GREAT MINDS - JAVASCRIPT
   ========================================================= */


/* =========================================================
   1. FAVORITES
   ========================================================= */

const FAVORITES_KEY = "greatMindsFavorites";


function getFavorites() {
    try {
        return JSON.parse(
            localStorage.getItem(FAVORITES_KEY)
        ) || [];
    } catch (error) {
        return [];
    }
}


function saveFavorites(favorites) {
    localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(favorites)
    );
}


function isFavorite(leaderName) {
    const favorites = getFavorites();

    return favorites.includes(leaderName);
}


function toggleFavorite(leaderName, button) {

    let favorites = getFavorites();

    if (favorites.includes(leaderName)) {

        favorites = favorites.filter(
            name => name !== leaderName
        );

        if (button) {
            button.classList.remove("active");
            button.textContent = "♡";
        }

    } else {

        favorites.push(leaderName);

        if (button) {
            button.classList.add("active");
            button.textContent = "♥";
        }
    }

    saveFavorites(favorites);
}


/* Update favorite buttons */
function updateFavoriteButtons() {

    const buttons = document.querySelectorAll(
        ".favorite-icon"
    );

    buttons.forEach(button => {

        const leaderName =
            button.dataset.leader;

        if (!leaderName) {
            return;
        }

        if (isFavorite(leaderName)) {

            button.classList.add("active");
            button.textContent = "♥";

        } else {

            button.classList.remove("active");
            button.textContent = "♡";
        }
    });
}


/* Favorite button click */
document.addEventListener("click", function (event) {

    const button =
        event.target.closest(".favorite-icon");

    if (!button) {
        return;
    }

    const leaderName =
        button.dataset.leader;

    if (!leaderName) {
        return;
    }

    toggleFavorite(
        leaderName,
        button
    );
});


/* =========================================================
   2. LEADERS PAGE SEARCH + FILTER
   ========================================================= */

const leaderSearch =
    document.getElementById("leaderSearch");

const leadersGrid =
    document.getElementById("leadersGrid");

const noResults =
    document.getElementById("noResults");

const filterButtons =
    document.querySelectorAll(
        ".filter-btn"
    );


let selectedCategory = "all";


function filterLeaders() {

    if (!leadersGrid) {
        return;
    }

    const cards =
        leadersGrid.querySelectorAll(
            ".leader-card"
        );

    const searchText =
        leaderSearch
            ? leaderSearch.value
                .trim()
                .toLowerCase()
            : "";

    let visibleCount = 0;

    cards.forEach(card => {

        const name =
            (
                card.dataset.name ||
                card.querySelector("h3")?.textContent ||
                ""
            ).toLowerCase();

        const category =
            (
                card.dataset.category ||
                ""
            ).toLowerCase();

        const description =
            (
                card.querySelector("p")?.textContent ||
                ""
            ).toLowerCase();

        const matchesSearch =
            name.includes(searchText) ||
            description.includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            category === selectedCategory;

        if (
            matchesSearch &&
            matchesCategory
        ) {

            card.style.display = "";

            visibleCount++;

        } else {

            card.style.display = "none";
        }
    });


    if (noResults) {

        noResults.style.display =
            visibleCount === 0
                ? "block"
                : "none";
    }
}


/* Search while typing */
if (leaderSearch) {

    leaderSearch.addEventListener(
        "input",
        filterLeaders
    );
}


/* Category buttons */
filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        function () {

            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            this.classList.add("active");

            selectedCategory =
                this.dataset.category || "all";

            filterLeaders();
        }
    );
});


/* =========================================================
   3. CATEGORY FROM URL
   Example:
   leaders.html?category=scientists
   ========================================================= */

function applyUrlCategory() {

    if (!leadersGrid) {
        return;
    }

    const params =
        new URLSearchParams(
            window.location.search
        );

    const category =
        params.get("category");

    if (!category) {
        return;
    }

    selectedCategory =
        category.toLowerCase();

    filterButtons.forEach(button => {

        button.classList.remove("active");

        if (
            button.dataset.category ===
            selectedCategory
        ) {
            button.classList.add("active");
        }
    });

    filterLeaders();
}

applyUrlCategory();


/* =========================================================
   4. SEARCH PAGE
   ========================================================= */

const searchForm =
    document.getElementById("searchForm");

const searchInput =
    document.getElementById("searchInput");

const searchResults =
    document.getElementById("searchResults");

const searchNoResults =
    document.getElementById(
        "searchNoResults"
    );

const resultsTitle =
    document.getElementById(
        "resultsTitle"
    );

const resultCount =
    document.getElementById(
        "resultCount"
    );

const clearSearch =
    document.getElementById(
        "clearSearch"
    );


let searchCategory = "all";


function performSearch() {

    if (!searchResults) {
        return;
    }

    const cards =
        searchResults.querySelectorAll(
            ".search-result-card"
        );

    const query =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";

    let visibleCount = 0;

    cards.forEach(card => {

        const name =
            (
                card.dataset.name ||
                card.querySelector("h3")?.textContent ||
                ""
            ).toLowerCase();

        const category =
            (
                card.dataset.category ||
                ""
            ).toLowerCase();

        const text =
            card.textContent.toLowerCase();

        const matchesSearch =
            query === "" ||
            name.includes(query) ||
            text.includes(query);

        const matchesCategory =
            searchCategory === "all" ||
            category === searchCategory;

        if (
            matchesSearch &&
            matchesCategory
        ) {

            card.style.display = "";

            visibleCount++;

        } else {

            card.style.display = "none";
        }
    });


    /* Result count */
    if (resultCount) {

        resultCount.textContent =
            visibleCount +
            (
                visibleCount === 1
                    ? " Leader"
                    : " Leaders"
            );
    }


    /* Result title */
    if (resultsTitle) {

        if (query) {

            resultsTitle.textContent =
                `Results for "${searchInput.value.trim()}"`;

        } else if (
            searchCategory !== "all"
        ) {

            resultsTitle.textContent =
                "Filtered Leaders";

        } else {

            resultsTitle.textContent =
                "All Leaders";
        }
    }


    /* No results */
    if (searchNoResults) {

        searchNoResults.style.display =
            visibleCount === 0
                ? "block"
                : "none";
    }
}


/* Search form */
if (searchForm) {

    searchForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            performSearch();

            const resultsSection =
                document.getElementById(
                    "searchResults"
                );

            if (resultsSection) {

                resultsSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        }
    );
}


/* Search input */
if (searchInput) {

    searchInput.addEventListener(
        "input",
        performSearch
    );
}


/* =========================================================
   5. POPULAR SEARCH TAGS
   ========================================================= */

const searchTags =
    document.querySelectorAll(
        ".search-tag"
    );


searchTags.forEach(tag => {

    tag.addEventListener(
        "click",
        function () {

            const searchValue =
                this.dataset.search || "";

            if (searchInput) {

                searchInput.value =
                    searchValue;
            }

            performSearch();
        }
    );
});


/* =========================================================
   6. SEARCH PAGE CATEGORY FILTER
   ========================================================= */

const searchFilterButtons =
    document.querySelectorAll(
        ".search-filters .filter-btn"
    );


searchFilterButtons.forEach(button => {

    button.addEventListener(
        "click",
        function () {

            searchFilterButtons.forEach(
                btn => {
                    btn.classList.remove(
                        "active"
                    );
                }
            );

            this.classList.add("active");

            searchCategory =
                this.dataset.category ||
                "all";

            performSearch();
        }
    );
});


/* =========================================================
   7. CLEAR SEARCH
   ========================================================= */

if (clearSearch) {

    clearSearch.addEventListener(
        "click",
        function () {

            if (searchInput) {
                searchInput.value = "";
            }

            searchCategory = "all";

            searchFilterButtons.forEach(
                button => {

                    button.classList.remove(
                        "active"
                    );

                    if (
                        button.dataset.category ===
                        "all"
                    ) {
                        button.classList.add(
                            "active"
                        );
                    }
                }
            );

            performSearch();
        }
    );
}


/* =========================================================
   8. FAVORITES PAGE
   ========================================================= */

const favoritesContainer =
    document.getElementById(
        "favoritesContainer"
    );

const emptyFavorites =
    document.getElementById(
        "emptyFavorites"
    );

const clearFavoritesBtn =
    document.getElementById(
        "clearFavoritesBtn"
    );


function displayFavorites() {

    if (!favoritesContainer) {
        return;
    }

    const favorites =
        getFavorites();

    favoritesContainer.innerHTML = "";


    if (favorites.length === 0) {

        if (emptyFavorites) {
            emptyFavorites.style.display =
                "block";
        }

        return;
    }


    if (emptyFavorites) {
        emptyFavorites.style.display =
            "none";
    }


    favorites.forEach(name => {

        const card =
            document.createElement(
                "article"
            );

        card.className =
            "leader-card";

        card.innerHTML = `

            <div class="leader-card-image leader-placeholder">
                <span>
                    ${getInitials(name)}
                </span>
            </div>

            <div class="leader-card-content">

                <span class="leader-category">
                    Favorite Leader
                </span>

                <h3>
                    ${escapeHtml(name)}
                </h3>

                <p>
                    This leader has been added
                    to your Great Minds favorites.
                </p>

                <div class="leader-card-footer">

                    <a
                        href="leader-details.html"
                        class="card-link"
                    >
                        View Profile →
                    </a>

                    <button
                        type="button"
                        class="favorite-icon active"
                        data-leader="${escapeAttribute(name)}"
                    >
                        ♥
                    </button>

                </div>

            </div>
        `;

        favoritesContainer.appendChild(
            card
        );
    });
}


/* Get initials */
function getInitials(name) {

    return name
        .split(" ")
        .filter(word => word.length > 0)
        .slice(0, 2)
        .map(word =>
            word.charAt(0).toUpperCase()
        )
        .join("");
}


/* Basic HTML safety */
function escapeHtml(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


function escapeAttribute(text) {

    return text
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}


/* Clear all favorites */
if (clearFavoritesBtn) {

    clearFavoritesBtn.addEventListener(
        "click",
        function () {

            const favorites =
                getFavorites();

            if (favorites.length === 0) {
                return;
            }

            const confirmed =
                confirm(
                    "Are you sure you want to clear all favorites?"
                );

            if (!confirmed) {
                return;
            }

            localStorage.removeItem(
                FAVORITES_KEY
            );

            displayFavorites();

            updateFavoriteButtons();
        }
    );
}


/* =========================================================
   9. CONTACT FORM
   ========================================================= */

const contactForm =
    document.getElementById(
        "contactForm"
    );

const formMessage =
    document.getElementById(
        "formMessage"
    );


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                contactForm.querySelector(
                    '[name="name"]'
                )?.value.trim();

            const email =
                contactForm.querySelector(
                    '[name="email"]'
                )?.value.trim();

            const message =
                contactForm.querySelector(
                    '[name="message"]'
                )?.value.trim();


            if (
                !name ||
                !email ||
                !message
            ) {

                showFormMessage(
                    formMessage,
                    "Please fill in all required fields.",
                    "error"
                );

                return;
            }


            if (!isValidEmail(email)) {

                showFormMessage(
                    formMessage,
                    "Please enter a valid email address.",
                    "error"
                );

                return;
            }


            showFormMessage(
                formMessage,
                "Thank you! Your message has been received.",
                "success"
            );

            contactForm.reset();
        }
    );
}


/* Email validation */
function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);
}


/* Form message */
function showFormMessage(
    element,
    message,
    type
) {

    if (!element) {
        return;
    }

    element.textContent =
        message;

    if (type === "success") {

        element.style.color =
            "#15803d";

    } else {

        element.style.color =
            "#dc2626";
    }
}


/* =========================================================
   10. LOGIN FORM
   ========================================================= */

const loginForm =
    document.getElementById(
        "loginForm"
    );

const loginMessage =
    document.getElementById(
        "loginMessage"
    );


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const emailInput =
                document.getElementById(
                    "loginEmail"
                );

            const passwordInput =
                document.getElementById(
                    "loginPassword"
                );


            const email =
                emailInput
                    ? emailInput.value.trim()
                    : "";

            const password =
                passwordInput
                    ? passwordInput.value
                    : "";


            if (!email || !password) {

                showFormMessage(
                    loginMessage,
                    "Please enter your email and password.",
                    "error"
                );

                return;
            }


            if (!isValidEmail(email)) {

                showFormMessage(
                    loginMessage,
                    "Please enter a valid email address.",
                    "error"
                );

                return;
            }


            if (password.length < 6) {

                showFormMessage(
                    loginMessage,
                    "Password must contain at least 6 characters.",
                    "error"
                );

                return;
            }


            /*
             * This is frontend-only.
             * No real account authentication is performed.
             */

            showFormMessage(
                loginMessage,
                "Login form submitted successfully. Backend authentication can be added later.",
                "success"
            );
        }
    );
}


/* =========================================================
   11. REGISTER FORM
   ========================================================= */

const registerForm =
    document.getElementById(
        "registerForm"
    );

const registerMessage =
    document.getElementById(
        "registerMessage"
    );


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const nameInput =
                document.getElementById(
                    "registerName"
                );

            const emailInput =
                document.getElementById(
                    "registerEmail"
                );

            const passwordInput =
                document.getElementById(
                    "registerPassword"
                );

            const confirmPasswordInput =
                document.getElementById(
                    "confirmPassword"
                );

            const termsInput =
                document.getElementById(
                    "terms"
                );


            const name =
                nameInput
                    ? nameInput.value.trim()
                    : "";

            const email =
                emailInput
                    ? emailInput.value.trim()
                    : "";

            const password =
                passwordInput
                    ? passwordInput.value
                    : "";

            const confirmPassword =
                confirmPasswordInput
                    ? confirmPasswordInput.value
                    : "";


            if (!name || !email) {

                showFormMessage(
                    registerMessage,
                    "Please fill in all required fields.",
                    "error"
                );

                return;
            }


            if (!isValidEmail(email)) {

                showFormMessage(
                    registerMessage,
                    "Please enter a valid email address.",
                    "error"
                );

                return;
            }


            if (password.length < 6) {

                showFormMessage(
                    registerMessage,
                    "Password must contain at least 6 characters.",
                    "error"
                );

                return;
            }


            if (
                password !==
                confirmPassword
            ) {

                showFormMessage(
                    registerMessage,
                    "Passwords do not match.",
                    "error"
                );

                return;
            }


            if (
                termsInput &&
                !termsInput.checked
            ) {

                showFormMessage(
                    registerMessage,
                    "Please accept the terms and conditions.",
                    "error"
                );

                return;
            }


            showFormMessage(
                registerMessage,
                "Registration form submitted successfully. Backend can be connected later.",
                "success"
            );

            registerForm.reset();
        }
    );
}


/* =========================================================
   12. SIMPLE PAGE FADE-IN
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateFavoriteButtons();

        displayFavorites();

        performSearch();

        filterLeaders();
    }
);