/* Responsible for the bubble bed animations in the footer */

document.addEventListener("DOMContentLoaded", () => {
  const bed = document.querySelector(".bubble-bed");
  if (!bed) return;

  const COUNT = 30;
  for (let i = 0; i < COUNT; i++) spawn();

  function spawn() {
    const b = document.createElement("span");
    b.className = "bubble";

    // Randomize size, position, duration, delay
    const size  = 8 + Math.random() * 20;
    const left  = Math.random() * 100;
    const dur   = 6 + Math.random() * 8;
    const delay = Math.random() * 5;

    b.style.width  = `${size}px`;
    b.style.height = `${size}px`;
    b.style.left   = `${left}%`;
    b.style.animationDuration = `${dur}s`;
    b.style.animationDelay    = `${delay}s`;

    //Infinite bubble loop
    b.addEventListener("animationend", () => { 
      b.remove();
      spawn(); 
    });
    bed.appendChild(b);
  }
});
