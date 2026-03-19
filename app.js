// ==============================

// 画面切替

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

// 設定保存

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

// 地域選択

// ==============================

function changePref(pref, selectedCity = "", resetCity = true) {

  const citySelect = document.getElementById("citySelect");

  if (!citySelect) return;

  citySelect.innerHTML = "";

  if (!pref || typeof AREA_DATA === "undefined" || !AREA_DATA[pref]) {

    citySelect.innerHTML = "<option value=''>先に都道府県を選択</option>";

    return;

  }

  const first = document.createElement("option");

  first.value = "";

  first.textContent = "選択してください";

  citySelect.appendChild(first);

  AREA_DATA[pref].forEach((city) => {

    const option = document.createElement("option");

    option.value = city;

    option.textContent = city;

    if (city === selectedCity) {

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

// 通知設定

// ==============================

function requestNotificationPermission() {

  if (!("Notification" in window)) {

    alert("このブラウザは通知に対応していません。");

    return;

  }

  Notification.requestPermission().then((permission) => {

    if (permission === "granted") {

      console.log("通知が許可されました");

    } else if (permission === "denied") {

      console.log("通知が拒否されました");

    }

  });

}

function toggleNotify(enabled) {

  saveSetting("notifyEnabled", enabled ? "1" : "0");

  if (enabled) {

    requestNotificationPermission();

  }

}

function toggleAlert(enabled) {

  saveSetting("alertNotify", enabled ? "1" : "0");

}

function toggleWeatherNotify(enabled) {

  saveSetting("weatherNotify", enabled ? "1" : "0");

}

function toggleNewsNotify(enabled) {

  saveSetting("newsNotify", enabled ? "1" : "0");

}

function testNotification() {

  if (!("Notification" in window)) {

    alert("このブラウザは通知に対応していません。");

    return;

  }

  if (Notification.permission === "granted") {

    new Notification("熱中症対策ナビ", {

      body: "通知テストです",

      icon: "icon-192.png"

    });

  } else {

    alert("通知が許可されていません。");

  }

}

// ==============================

// 初期読み込み

// ==============================

window.addEventListener("DOMContentLoaded", () => {

  const savedPref = loadSetting("pref");

  const savedCity = loadSetting("city");

  const savedMode = loadSetting("displayMode");

  const savedNotify = loadSetting("notifyEnabled");

  const savedAlert = loadSetting("alertNotify");

  const savedWeather = loadSetting("weatherNotify");

  const savedNews = loadSetting("newsNotify");

  const prefSelect = document.getElementById("prefSelect");

  const modeValue = document.getElementById("modeValue");

  const notifyToggle = document.getElementById("notifyToggle");

  const alertToggle = document.getElementById("alertToggle");

  const weatherToggle = document.getElementById("weatherToggle");

  const newsToggle = document.getElementById("newsToggle");

  if (savedMode && modeValue) {

    modeValue.textContent = savedMode;

  }

  if (savedPref && prefSelect) {

    prefSelect.value = savedPref;

    changePref(savedPref, savedCity, false);

  }

  if (notifyToggle) {

    notifyToggle.checked = savedNotify === "1";

  }

  if (alertToggle) {

    alertToggle.checked = savedAlert === "1";

  }

  if (weatherToggle) {

    weatherToggle.checked = savedWeather === "1";

  }

  if (newsToggle) {

    newsToggle.checked = savedNews === "1";

  }

});

// ==============================

// Service Worker

// ==============================

if ("serviceWorker" in navigator) {

  window.addEventListener("load", async () => {

    try {

      await navigator.serviceWorker.register("./service-worker.js");

    } catch (e) {

      console.error(e);

    }

  });

}
 
