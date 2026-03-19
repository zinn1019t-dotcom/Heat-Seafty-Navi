// ==============================

// 画面切替（SPA部分）

// ==============================

const navItems = document.querySelectorAll(".nav-item");

const screens = document.querySelectorAll(".screen");

navItems.forEach((item) => {

  item.addEventListener("click", (e) => {

    const target = item.dataset.target;

    // data-targetがない（＝外部リンク）は処理しない

    if (!target) return;

    e.preventDefault();

    // ナビのアクティブ切替

    navItems.forEach((btn) => btn.classList.remove("active"));

    item.classList.add("active");

    // 画面切替

    screens.forEach((screen) => {

      screen.classList.toggle("active", screen.id === target);

    });

  });

});


// ==============================

// カードクリックエフェクト（軽いアニメーション）

// ==============================

const cards = document.querySelectorAll(".feature-card, .feature-wide-card");

cards.forEach((card) => {

  card.addEventListener("click", () => {

    card.style.transform = "scale(0.96)";

    setTimeout(() => {

      card.style.transform = "";

    }, 120);

  });

});


// ==============================

// ローカル設定（例：地域）

// ==============================

function saveSetting(key, value) {

  localStorage.setItem(key, value);

}

function loadSetting(key) {

  return localStorage.getItem(key);

}

// 初期読み込み例

const region = loadSetting("region");

if (region) {

  console.log("地域設定:", region);

}


// ==============================

// ★ 追加：設定機能

// ==============================

// 地域設定

function setRegion() {

  const region = prompt("地域を入力してください（例：名護市）");

  if (!region) return;

  saveSetting("region", region);

  const el = document.getElementById("regionValue");

  if (el) el.textContent = region;

}

// 表示モード切替

function toggleMode() {

  let mode = loadSetting("displayMode") || "通常";

  mode = mode === "通常" ? "シンプル" : "通常";

  saveSetting("displayMode", mode);

  const el = document.getElementById("modeValue");

  if (el) el.textContent = mode;

}

// 初期反映

window.addEventListener("DOMContentLoaded", () => {

  const region = loadSetting("region");

  const mode = loadSetting("displayMode");

  const regionEl = document.getElementById("regionValue");

  const modeEl = document.getElementById("modeValue");

  if (region && regionEl) {

    regionEl.textContent = region;

  }

  if (mode && modeEl) {

    modeEl.textContent = mode;

  }

});


// ==============================

// PWA Service Worker登録

// ==============================

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


// ==============================

// 将来拡張用（空関数）

// ==============================

// 天気取得（後でGAS接続）

async function fetchWeather() {

  // TODO: GAS API接続

}

// 熱リポ送信

async function postReport(data) {

  // TODO: GASにPOST

}

// クイズ読み込み

function loadQuiz() {

  // TODO: JSON or Sheets

}

// シミュレーション開始

function startSimulation() {

  // TODO: ロジック追加

}
 
