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


// ==============================

// ★★★ ここから追加（都道府県→地域） ★★★

// ==============================

// 地域データ

const AREA_DATA = {

  "沖縄県": ["名護市", "那覇市", "沖縄市", "うるま市"],

  "東京都": ["渋谷区", "新宿区", "港区"],

  "大阪府": ["大阪市", "堺市"],

  "愛知県": ["名古屋市", "豊田市"]

};

// 都道府県変更

function changePref(pref) {

  const citySelect = document.getElementById("citySelect");

  if (!citySelect) return;

  citySelect.innerHTML = "";

  if (!pref || !AREA_DATA[pref]) {

    citySelect.innerHTML = "<option>選択できません</option>";

    return;

  }

  AREA_DATA[pref].forEach(city => {

    const option = document.createElement("option");

    option.value = city;

    option.textContent = city;

    citySelect.appendChild(option);

  });

  localStorage.setItem("pref", pref);

}

// 地域変更

function changeCity(city) {

  localStorage.setItem("city", city);

}

// 初期復元（追加）

window.addEventListener("DOMContentLoaded", () => {

  const pref = localStorage.getItem("pref");

  const city = localStorage.getItem("city");

  const prefSelect = document.getElementById("prefSelect");

  const citySelect = document.getElementById("citySelect");

  if (pref && prefSelect) {

    prefSelect.value = pref;

    changePref(pref);

  }

  if (city && citySelect) {

    citySelect.value = city;

  }

});
 
