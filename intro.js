/* ---- Neon Color Variables ---- */
const style = document.createElement('style');
style.innerHTML = `
  #intro-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    justify-content: center;

    opacity: 0;
    pointer-events: none;

    transition: opacity 1.2s ease, backdrop-filter 1.2s ease;
    z-index: 200;
  }

  #intro-overlay.active {
    opacity: 1;
    pointer-events: all;
    backdrop-filter: blur(18px);
  }

  #intro-box {
    text-align: center;
    position: relative;
  }

  #intro-title-1 {
    font-size: 38px;
    font-family: 'Orbitron', sans-serif;
    font-weight: bold;
    color: white;

    opacity: 0;
    transform: scale(0.8);
    transition: opacity 1.2s ease, transform 1.2s ease;

    text-shadow: 0 0 10px #d8bfd8, 0 0 18px #b0c4de;
  }

  #intro-title-1.show {
    opacity: 1;
    transform: scale(1);
  }

  #intro-title-2 {
    margin-top: 20px;
    font-size: 50px;
    font-family: 'Orbitron', sans-serif;
    font-weight: bold;
    color: white;

    opacity: 0;
    transform: scale(0.7);
    transition: opacity 1.2s ease, transform 1.2s ease;

    text-shadow: 0 0 12px #d8bfd8, 0 0 22px #b0c4de;
  }

  #intro-title-2.show {
    opacity: 1;
    transform: scale(1);
  }

  #intro-line {
    width: 0px;
    height: 8px;
    background: white;
    border-radius: 20px;
    margin: 25px auto 0 auto;
    opacity: 0;
    overflow: hidden;
    position: relative;
    box-shadow: 0 0 0px white;
    transition: opacity 0.4s ease, width 0.8s ease, box-shadow 0.8s ease;
  }

  #intro-line.show {
    opacity: 1;
    width: 500px;
    box-shadow: 0 0 12px white;
  }

  #intro-line::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, #2b0040, #3d0070, #5b00a5, #7a00d6);
    width: 200%;
    left: -200%;
    animation: accelColor 3.5s ease-out forwards;
    filter: blur(2px);
    opacity: 0.9;
  }

  @keyframes accelColor {
    0% { left: -200%; }
    40% { left: -60%; }
    70% { left: 20%; }
    100% { left: 0%; }
  }

  #intro-line::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, violet, indigo, blue, cyan, green, yellow, orange, red, violet);
    background-size: 300% 100%;
    animation: rainbowFlow 6s linear infinite;
    opacity: 0;
    transition: opacity 1.2s ease-out;
  }

  #intro-line.show::after {
    animation-delay: 3.5s;
    opacity: 0.8;
  }

  @keyframes rainbowFlow {
    0% { background-position: 0% 0; }
    100% { background-position: 300% 0; }
  }
`;
document.head.appendChild(style);

/* ================================
    INTRO SCREEN + EXIT HANDLER
================================ */

const intro = document.createElement("div");
intro.id = "intro-overlay";
intro.innerHTML = `
  <div id="intro-box">
    <div id="intro-title-1">Bài 11: QUANG PHỔ VẠCH CỦA NGUYÊN TỬ</div>
    <div id="intro-title-2">III. QUANG PHỔ VẠCH CỦA NGUYÊN TỬ</div>
    <div id="intro-line"></div>
  </div>
`;
document.body.appendChild(intro);

// Bắt đầu intro
setTimeout(() => {
  intro.classList.add("active");
  document.getElementById("intro-title-1").classList.add("show");
}, 500);

// Hiện title 2 + line
setTimeout(() => {
  document.getElementById("intro-title-2").classList.add("show");
  setTimeout(() => {
    document.getElementById("intro-line").classList.add("show");
  }, 600);
}, 3500);

// Cho phép click tắt intro
setTimeout(() => {
  intro.addEventListener("click", () => {
    // 1. Tắt intro
    intro.classList.remove("active");

    // 2. Trigger galaxy exit effect
    setTimeout(() => triggerGalaxyExitEffect(), 1500);

    // 3. Thông báo cho ui.js hiện UI sau 5s
    setTimeout(() => {
      const event = new Event('introEnded');
      window.dispatchEvent(event);
    }, 5000);
  });
}, 3500);


/* ================================
   HIỆU ỨNG THOÁT: ZOOM → FLASH
================================ */
function triggerGalaxyExitEffect() {

  /* 🔊 Play sound portal.mp3 (không loop) */
  const portalSound = new Audio("portal.mp3");
  portalSound.volume = 1.0;
  portalSound.play().catch(()=>{});

  const flash = document.createElement("div");
  flash.id = "flash-screen";
  flash.style.cssText = `
    position:fixed; inset:0;
    background:black;
    z-index:9999;
    opacity:0;
    transition:opacity 1s, background 1s;
  `;
  document.body.appendChild(flash);

  // B1: Zoom camera (nếu có)
  window.__galaxyZoomOut && window.__galaxyZoomOut();

  // B2: flash trắng
  setTimeout(() => {
    flash.style.background = "white";
    flash.style.opacity = "1";
  }, 1500);

  // B3: trắng → đen
  setTimeout(() => {
    flash.style.background = "black";
  }, 2600);

  // B4: load main2.js
  setTimeout(() => {
    const script = document.createElement("script");
    script.src = "main2.js";
    document.body.appendChild(script);
  }, 3600);

  // B5: fade-out
  setTimeout(() => {
    flash.style.opacity = "0";
  }, 4300);

  // B6: remove
  setTimeout(() => {
    flash.remove();
  }, 5300);
}
