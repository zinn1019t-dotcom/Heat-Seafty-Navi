// ==============================

// 画面切替（SPA部分）

// ==============================

const navItems = document.querySelectorAll(".nav-item");

const screens = document.querySelectorAll(".screen");

navItems.forEach((item) => {

  item.addEventListener("click", (e) => {

    const target = item.dataset.target;

    if (!target) return;

    e.preventDefault();

    navItems.forEach((btn) => btn.classList.remove("active"));

    item.classList.add("active");

    screens.forEach((screen) => {

      screen.classList.toggle("active", screen.id === target);

    });

  });

});


// ==============================

// カードクリックエフェクト

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

// ローカル設定

// ==============================

function saveSetting(key, value) {

  localStorage.setItem(key, value);

}

function loadSetting(key) {

  return localStorage.getItem(key);

}


// ==============================

// 表示モード

// ==============================

function toggleMode() {

  let mode = loadSetting("displayMode") || "通常";

  mode = mode === "通常" ? "シンプル" : "通常";

  saveSetting("displayMode", mode);

  const el = document.getElementById("modeValue");

  if (el) el.textContent = mode;

}


// ==============================

// 都道府県 → 市町村（修正版）

// ==============================

function changePref(pref, selectedCity = "", resetCity = true) {

  const citySelect = document.getElementById("citySelect");

  if (!citySelect) return;

  citySelect.innerHTML = "";

  if (!pref || !AREA_DATA || !AREA_DATA[pref]) {

    citySelect.innerHTML = "<option value=''>先に都道府県を選択</option>";

    saveSetting("pref", "");

    saveSetting("city", "");

    return;

  }

  const firstOption = document.createElement("option");

  firstOption.value = "";

  firstOption.textContent = "選択してください";

  citySelect.appendChild(firstOption);

  AREA_DATA[pref].forEach((city) => {

    const option = document.createElement("option");

    option.value = city;

    option.textContent = city;

    // ★ここが重要（復元）

    if (selectedCity && city === selectedCity) {

      option.selected = true;

    }

    citySelect.appendChild(option);

  });

  saveSetting("pref", pref);

  if (resetCity) {

    saveSetting("city", "");

  }

}

function changeCity(city) {

  saveSetting("city", city);

}


// ==============================

// 初期反映（修正版）

// ==============================

window.addEventListener("DOMContentLoaded", () => {

  const savedMode = loadSetting("displayMode");

  const savedPref = loadSetting("pref");

  const savedCity = loadSetting("city");

  const modeEl = document.getElementById("modeValue");

  const prefSelect = document.getElementById("prefSelect");

  if (savedMode && modeEl) {

    modeEl.textContent = savedMode;

  }

  if (savedPref && prefSelect) {

    prefSelect.value = savedPref;

    // ★地域も一緒に復元

    changePref(savedPref, savedCity, false);

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

// 将来拡張用

// ==============================

async function fetchWeather() {

  // TODO: GAS API接続

}

async function postReport(data) {

  // TODO: GASにPOST

}

function loadQuiz() {

  // TODO: JSON or Sheets

}

function startSimulation() {

  // TODO: ロジック追加

}
 
