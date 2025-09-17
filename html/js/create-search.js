"use strict";

// Create / Search - Both buttons and holding the forms
const tabCreate = document.getElementById("tab-create");
const tabSearch = document.getElementById("tab-search");
const panelCreate = document.getElementById("panel-create");
const panelSearch = document.getElementById("panel-search");

// Activates either the Create or Search tab/panel
function activate(which) {
  const isCreate = which === "Create";
  tabCreate.classList.toggle("active", isCreate);
  tabSearch.classList.toggle("active", !isCreate);

  // Accessibility precautions
  tabCreate.setAttribute("aria-selected", String(isCreate));
  tabSearch.setAttribute("aria-selected", String(!isCreate));

  panelCreate.classList.toggle("active", isCreate);
  panelSearch.classList.toggle("active", !isCreate);
}

// Event Listeners for clicking the tabs to swap
tabCreate?.addEventListener("click", () => activate("Create"));
tabSearch?.addEventListener("click", () => activate("Search"));

document.getElementById("panel-search").addEventListener("submit", searchContact);

// Directs to contact.html when a contact is clicked
document.getElementById("results").addEventListener("click", (e) => {
    const row = e.target.closest(".contact-row");
    if (!row) return;

    window.location.href = "contact.html";
});

// Fish Images
const FISH_IMAGES = [
  "assets/fish/purpleBlueFish.png",
  "assets/fish/yellowBlueFish.png",
  "assets/fish/nemoFish.png",
  "assets/fish/redOrangeFish.png",
  "assets/fish/yellowPinkFish.png",
  "assets/fish/orangeFish.png",
  "assets/fish/blueFish.png",
  "assets/fish/pinkFish.png"
];

// Where fish will spawn + how many, duration, size, etc
const lane = document.querySelector(".swimlane");
if (lane) {
  const MAX = 8;
  const INTERVAL = 3500;
  const MIN_DUR = 22, MAX_DUR = 40;
  const MIN_SIZE = 70, MAX_SIZE = 180;
  const MIN_BOTTOM = 8, MAX_BOTTOM = 65;
  let onScreen = 0;

  for (let i = 0; i < Math.min(4, MAX); i++) spawn();
  setInterval(() => { if (onScreen < MAX) spawn(); }, INTERVAL);

  // Fish Spawner + Randomizer
  function spawn(){
    const wrap = document.createElement("div");
    wrap.className = "fish-wrap";

    const img = document.createElement("img");
    img.className = "fish";
    img.src = FISH_IMAGES[(Math.random() * FISH_IMAGES.length) | 0];

    const size   = rand(MIN_SIZE, MAX_SIZE);
    const bottom = rand(MIN_BOTTOM, MAX_BOTTOM);
    wrap.style.bottom = `${bottom}vh`;
    img.style.width   = `${size}px`;
    img.style.opacity = String(rand(0.85, 1));

    const dur = rand(MIN_DUR, MAX_DUR);
    const leftToRight = Math.random() < 0.5;
    wrap.style.animation = `${leftToRight ? "swim-right" : "swim-left"} ${dur}s linear`;
    img.style.setProperty("--bob", `${rand(6,14)}px`);
    img.style.setProperty("--bobDur", `${rand(3,6)}s`);
    img.style.setProperty("--bobDelay", `${rand(0,2)}s`);
    img.style.setProperty("--flip", leftToRight ? "1" : "-1");

    wrap.appendChild(img);
    lane.appendChild(wrap);
    onScreen++;

    wrap.addEventListener("animationend", () => { wrap.remove(); onScreen--; });
  }

  function rand(min, max){ 
    return Math.random() * (max - min) + min; 
  }

}
