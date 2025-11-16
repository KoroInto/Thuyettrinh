window.addEventListener('introEnded', () => {
  const title = document.getElementById("title");
  const pageContainer = document.getElementById("page-container");
  const circles = document.querySelectorAll("#page-circles .circle");

  title.classList.add("visible");

  let currentPage = 0;
  const totalPages = 7;       // 7 trang bình thường
  let pageLoaded = false;

  function loadPage(index) {
    if (index < 0) index = totalPages - 1;
    if (index >= totalPages) index = 0;

    const prev = pageContainer.querySelector("iframe");
    if (prev) {
      prev.style.opacity = 0;
      setTimeout(() => prev.remove(), 400);
    }

    const iframe = document.createElement("iframe");
    iframe.src = `page${index + 1}.html`;
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.style.opacity = "0";
    iframe.style.transition = "opacity 0.5s ease";
    pageContainer.appendChild(iframe);

    setTimeout(() => iframe.style.opacity = "1", 30);

    circles.forEach(c => c.classList.remove("active"));
    circles[index].classList.add("active");

    currentPage = index;

    /* ==========================
       KHI ĐÃ TỚI TRANG 7 → SPAWN NÚT OUTRO
       ========================== */
    if (currentPage === totalPages - 1) showOutroCircle();
  }

  /* CLICK 1 LẦN → LOAD PAGE 1 */
  pageContainer.addEventListener("click", () => {
    if (!pageLoaded) {
      pageLoaded = true;
      pageContainer.classList.add("visible");
      loadPage(0);
    }
  });

  /* CHUYỂN PAGE QUA CÁC CIRCLE */
  circles.forEach(c => {
    c.addEventListener("click", (e) => {
      e.stopPropagation();
      loadPage(parseInt(c.dataset.page));
    });
  });

  /* ==============================
     OUTRO CIRCLE SPAWN FUNCTION
     ============================== */
  function showOutroCircle() {
    // Nếu đã tạo rồi → khỏi tạo lại
    if (document.getElementById("outro-circle")) return;

    const bar = document.getElementById("page-circles");
    const btn = document.createElement("span");

    btn.id = "outro-circle";
    btn.className = "circle";
    btn.style.background = "gold";
    btn.style.boxShadow = "0 0 12px gold";
    btn.style.transform = "scale(1.6)";

    bar.appendChild(btn);

    // CLICK → MỞ OUTRO.HTML (đè lên tất cả)
    btn.addEventListener("click", (e) => {
      e.stopPropagation();

      const prev = pageContainer.querySelector("iframe");
      if (prev) prev.remove();

      const iframe = document.createElement("iframe");
      iframe.src = "outro.html";
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.border = "none";
      iframe.style.opacity = "0";
      iframe.style.transition = "opacity 0.5s ease";
      pageContainer.appendChild(iframe);

      setTimeout(() => iframe.style.opacity = "1", 30);
    });
  }

});
