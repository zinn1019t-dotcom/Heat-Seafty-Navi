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

// 現在地から地域を自動取得

// ==============================

async function detectLocationAndSetRegion() {

  const ok = confirm("現在地を取得して、都道府県と地域を自動設定しますか？");

  if (!ok) return;

  if (!navigator.geolocation) {

    alert("このブラウザは位置情報に対応していません。");

    return;

  }

  navigator.geolocation.getCurrentPosition(

    async (position) => {

      const lat = position.coords.latitude;

      const lon = position.coords.longitude;

      try {

        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=ja`;

        const response = await fetch(url);

        const data = await response.json();

        const address = data.address || {};

        const pref = address.state || "";

        const city =

          address.city ||

          address.town ||

          address.village ||

          address.county ||

          "";

        const prefSelect = document.getElementById("prefSelect");

        const citySelect = document.getElementById("citySelect");

        if (prefSelect && pref) {

          prefSelect.value = pref;

          changePref(pref, city, false);

        }

        if (citySelect && city) {

          citySelect.value = city;

          changeCity(city);

        }

        if (pref) saveSetting("pref", pref);

        if (city) saveSetting("city", city);

        alert(`地域を設定しました：${pref} ${city}`);

      } catch (error) {

        console.error(error);

        alert("地域の自動取得に失敗しました。");

      }

    },

    (error) => {

      console.error(error);

      alert("位置情報の取得が許可されていないか、取得に失敗しました。");

    }

  );

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

      icon: "/icons/favicon-192.png"

    });

  } else {

    alert("通知が許可されていません。");

  }

}

// ==============================

// 地域ごとの自動通知

// ==============================

let autoNotifyTimer = null;

let lastAlertLevel = "";

// 仮の天気データ取得

// 後でGASや天気APIに置き換え

async function getRegionWeather(pref, city) {

  console.log("天気取得対象:", pref, city);

  return {

    temperature: 32,

    humidity: 75

  };

}

// 簡易危険度判定

function getHeatRiskLevel(temp, humidity) {

  if (temp >= 35) return "危険";

  if (temp >= 31) return "警戒";

  if (temp >= 28) return "注意";

  return "安全";

}

// 通知送信

function sendHeatNotification(level, pref, city, temp) {

  if (!("Notification" in window)) return;

  if (Notification.permission !== "granted") return;

  new Notification("熱中症対策ナビ", {

    body: `${pref} ${city} は現在「${level}」です。気温 ${temp}℃`,

    icon: "/icons/favicon-192.png"

  });

}

// 自動チェック本体

async function checkHeatAlertForSavedRegion() {

  const notifyEnabled = loadSetting("notifyEnabled") === "1";

  const alertEnabled = loadSetting("alertNotify") === "1";

  const pref = loadSetting("pref");

  const city = loadSetting("city");

  if (!notifyEnabled || !alertEnabled || !pref || !city) return;

  try {

    const weather = await getRegionWeather(pref, city);

    const level = getHeatRiskLevel(weather.temperature, weather.humidity);

    if ((level === "警戒" || level === "危険") && level !== lastAlertLevel) {

      sendHeatNotification(level, pref, city, weather.temperature);

      lastAlertLevel = level;

    }

    if (level === "安全" || level === "注意") {

      lastAlertLevel = "";

    }

    console.log("地域通知チェック:", {

      pref,

      city,

      temperature: weather.temperature,

      humidity: weather.humidity,

      level

    });

  } catch (error) {

    console.error("地域通知チェック失敗:", error);

  }

}

function startAutoRegionNotification() {

  if (autoNotifyTimer) {

    clearInterval(autoNotifyTimer);

  }

  checkHeatAlertForSavedRegion();

  autoNotifyTimer = setInterval(() => {

    checkHeatAlertForSavedRegion();

  }, 10 * 60 * 1000);

}

// ==============================

// 初回：位置情報取得確認

// ==============================

function askLocationPermission() {

  const alreadyAsked = loadSetting("locationAsked");

  if (alreadyAsked === "1") return;

  setTimeout(() => {

    const result = confirm("現在地を取得して地域を自動設定しますか？");

    saveSetting("locationAsked", "1");

    if (result) {

      detectLocationAndSetRegion();

    }

  }, 800);

}

// ==============================

// 現在日時表示

// ==============================

function updateTime() {

  const el = document.getElementById("currentTime");

  if (!el) return;

  const now = new Date();

  const year = now.getFullYear();

  const month = now.getMonth() + 1;

  const date = now.getDate();

  const day = ["日", "月", "火", "水", "木", "金", "土"][now.getDay()];

  const hour = String(now.getHours()).padStart(2, "0");

  const min = String(now.getMinutes()).padStart(2, "0");

  el.textContent = `${year}/${month}/${date}（${day}） ${hour}:${min}`;

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

  updateTime();

  setInterval(updateTime, 60000);

  askLocationPermission();

  startAutoRegionNotification();

});

// ==============================

// Service Worker

// ==============================

if ("serviceWorker" in navigator) {

  window.addEventListener("load", async () => {

    try {

      await navigator.serviceWorker.register("/service-worker.js");

      console.log("SW登録成功");

    } catch (e) {

      console.error("SW登録失敗:", e);

    }

  });

}
 
