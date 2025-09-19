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
document.getElementById("panel-create").addEventListener("submit", addContact);

// update header to show user name when logged in
window.addEventListener("DOMContentLoaded", () => {
    readCookie();

    const header = document.querySelector(".header");
    if (header) {
        header.textContent = `Welcome, ${firstName} ${lastName}!`;
    }
});

// Directs to contact.html when a contact is clicked
document.getElementById("results").addEventListener("click", (e) => {
    const row = e.target.closest(".contact-row");
    if (!row) return;

    // Extract data from row
    const nameParts = row.querySelector("strong").textContent.trim().split(" ");
    const contactFirstName = nameParts[0] ?? "";
    const contactLastName = nameParts[1] ?? "";
    const contactPhone = row.querySelectorAll("span")[0]?.textContent.trim() ?? "";
    const contactEmail = row.querySelectorAll("span")[1]?.textContent.trim() ?? "";

    // Save to cookies
    saveContact(contactFirstName, contactLastName, contactEmail, contactPhone);

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

// Spawn jellyfish
(function(){
  const root = document.querySelector(".jellies");
  if (!root) return;

  const variants = [
    "assets/jellyfish/blue-jf.png",
    "assets/jellyfish/pink-jf.png",
    "assets/jellyfish/purple-jf.png",
    "assets/jellyfish/teal-jf.png",
  ];

  const CAP = 6;

function spawnOne() {
  const wrap = document.createElement("div");
  wrap.className = "jelly-wrap";

  const img = document.createElement("img");
  img.className = "jelly";
  img.alt = "";
  img.src = variants[(Math.random()*variants.length)|0];

  const leftVW = Math.random()*100;
  const rise   = 24 + Math.random()*18;
  const sway   = 4  + Math.random()*5;
  const dRise  = (Math.random()*10).toFixed(2);
  const dSway  = (Math.random()*3 ).toFixed(2);
  const px     = Math.round(20 + Math.random()*24);

  wrap.style.left = `${leftVW}vw`;
  wrap.style.setProperty("--rise", `${rise}s`);
  wrap.style.animationDelay = `${dRise}s`;

  img.style.setProperty("--sway", `${sway}s`);
  img.style.animationDelay = `${dSway}s`;
  img.style.width = `${px}px`;

  wrap.appendChild(img);
  root.appendChild(wrap);

  wrap.addEventListener("animationend", () => {
    wrap.remove();
    spawnOne(); 
  }, { once: true });
}

for (let i = 0; i < CAP; i++) spawnOne();


// Mouse
const RADIUS   = 140;  
const MAX_PUSH = 70;  
const EASE     = 0.08; 

const OFFSETS = new WeakMap();
let mx = -9999, my = -9999;

window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
window.addEventListener('touchmove', e => {
  const t = e.touches[0];
  if (t) { mx = t.clientX; my = t.clientY; }
}, { passive: true });

function tick() {
  root.querySelectorAll('.jelly').forEach(el => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;

    const dx = cx - mx;
    const dy = cy - my;
    const dist = Math.hypot(dx, dy);

    let tx = 0, ty = 0;
    if (dist < RADIUS) {
      const strength = 1 - dist / RADIUS;
      const nx = dx / (dist || 1);   
      const ny = dy / (dist || 1);
      tx = nx * strength * MAX_PUSH;
      ty = ny * strength * MAX_PUSH;
    }

    const s = OFFSETS.get(el) || { x: 0, y: 0 };
    s.x += (tx - s.x) * EASE;
    s.y += (ty - s.y) * EASE;
    OFFSETS.set(el, s);

    el.style.setProperty('--repelX', `${s.x}px`);
    el.style.setProperty('--repelY', `${s.y}px`);
  });

  requestAnimationFrame(tick);
}
tick();

})();

// Shark
(function () {
  const sea = document.querySelector(".bg-sea");
  if (!sea) return;

  let inFlight = false;

  function spawnShark() {
    if (inFlight) return;
    inFlight = true;

    const shark = document.createElement("div");
    shark.className = "shark";

    const y = 10 + Math.random() * 50;
    const goRight = Math.random() < 0.5;

    const dur = 55 + Math.random() * 35;

    shark.style.setProperty("--sharkY", `${y}vh`);
    shark.style.setProperty("--swimDur", `${dur}s`);
    shark.classList.add(goRight ? "swim-right" : "swim-left");

    sea.appendChild(shark);

    shark.addEventListener("animationend", () => {
      shark.remove();
      inFlight = false;
      setTimeout(spawnShark, 8000 + Math.random() * 16000);
    }, { once: true });
  }

  setTimeout(spawnShark, 3000 + Math.random() * 5000);
  setInterval(() => { if (!inFlight) spawnShark(); }, 30000);
})();
