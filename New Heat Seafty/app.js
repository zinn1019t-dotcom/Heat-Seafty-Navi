const navItems = document.querySelectorAll(".nav-item");
const screens = document.querySelectorAll(".screen");

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    const target = item.dataset.target;

    navItems.forEach((btn) => btn.classList.remove("active"));
    item.classList.add("active");

    screens.forEach((screen) => {
      screen.classList.toggle("active", screen.id === target);
    });
  });
});

// PWA Service Worker登録
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("./service-worker.js");
      console.log("Service Worker registered");
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  });
}