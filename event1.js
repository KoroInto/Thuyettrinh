// ============ EVENT TRIGGER SCRIPT ============

// Danh sách thời điểm & tên file ảnh
const events = [
    { time: 30,  file: "1.png" },
    { time: 45,  file: "2.png" },
    { time: 60,  file: "3.png" },
    { time: 75,  file: "4.png" },
    { time: 90,  file: "5.png" },
    { time: 105, file: "6.png" },
    { time: 120, file: "7.png" },
    { time: 160, file: "8.png" },
    { time: 200, file: "9.png" },
    { time: 240, file: "10.png" }
];

// Bắt đầu đếm ngay khi web được load
const startTime = performance.now();

function spawnImage(file) {
    const img = document.createElement("img");
    img.src = file;
    img.className = "spawn-img";
    img.style.position = "absolute";
    img.style.top = "50%";
    img.style.left = "50%";
    img.style.transform = "translate(-50%, -50%)";
    img.style.zIndex = "100";
    img.style.opacity = "0";
    img.style.transition = "opacity 0.05s linear";

    document.body.appendChild(img);

    // fade-in
    requestAnimationFrame(() => { img.style.opacity = 1; });

    // 0.1 giây sau → fade-out & xóa
    setTimeout(() => {
        img.style.opacity = 0;
        setTimeout(() => img.remove(), 60);
    }, 100);
}

function checkEvent() {
    const current = (performance.now() - startTime) / 1000;

    events.forEach(ev => {
        if (!ev.triggered && current >= ev.time) {
            ev.triggered = true;
            spawnImage(ev.file);
        }
    });

    requestAnimationFrame(checkEvent);
}

checkEvent();
