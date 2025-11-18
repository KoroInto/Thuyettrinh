// ===============================
// Blue Screen Event (60s → 7s)
// ===============================

// Thời gian xuất hiện tính từ lúc load trang
const TRIGGER_TIME = 60 * 1000; // 60 giây
const DISPLAY_TIME = 7 * 1000;  // Hiện 7 giây

setTimeout(() => {

    // Tạo overlay toàn màn hình
    const blue = document.createElement("div");
    blue.id = "blue-screen";
    blue.style.cssText = `
        position: fixed;
        inset: 0;
        background: url('Bluescreen.png') center/cover no-repeat;
        z-index: 99999;
        pointer-events: none;
        opacity: 1;
    `;
    document.body.appendChild(blue);

    // 7 giây sau thì xoá
    setTimeout(() => {
        blue.remove();
    }, DISPLAY_TIME);

}, TRIGGER_TIME);
