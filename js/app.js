// ==============================

// 画面切替

// ==============================

const navItems = document.querySelectorAll(".nav-item");

const screens = document.querySelectorAll(".screen");

if (navItems.length > 0 && screens.length > 0) {

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

}

// ==============================

// 設定保存

// ==============================

function saveSetting(key, value) {

  localStorage.setItem(key, value);

}

function loadSetting(key) {

  return localStorage.getItem(key);

}

function removeSetting(key) {

  localStorage.removeItem(key);

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

function clearSavedCoordinates() {

  removeSetting("lat");

  removeSetting("lon");

}

function changePref(pref, selectedCity = "", resetCity = true) {

  const citySelect = document.getElementById("citySelect");

  if (!citySelect) return;

  citySelect.innerHTML = "";

  if (!pref || typeof AREA_DATA === "undefined" || !AREA_DATA[pref]) {

    citySelect.innerHTML = "<option value=''>先に都道府県を選択</option>";

    saveSetting("pref", pref || "");

    if (resetCity) saveSetting("city", "");

    if (resetCity) clearSavedCoordinates();

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

    citySelect.appendChild(option);

  });

  citySelect.value = selectedCity || "";

  saveSetting("pref", pref);

  if (resetCity) {

    saveSetting("city", "");

    clearSavedCoordinates();

  } else if (selectedCity) {

    saveSetting("city", selectedCity);

  }

}

function changeCity(city) {

  saveSetting("city", city);

  clearSavedCoordinates();

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

        saveSetting("lat", String(lat));

        saveSetting("lon", String(lon));

        alert(`地域を設定しました：${pref} ${city}`);

      } catch (error) {

        console.error(error);

        alert("地域の自動取得に失敗しました。");

      }

    },

    (error) => {

      console.error(error);

      alert("位置情報の取得が許可されていないか、取得に失敗しました。");

    },

    { enableHighAccuracy: true, timeout: 10000 }

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

  if (enabled) requestNotificationPermission();

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

      icon: "icons/favicon-192-v2.png"

    });

  } else {

    alert("通知が許可されていません。");

  }

}

// ==============================

// 地域ごとの自動通知

// ==============================

let autoNotifyTimer = null;

function getLastAlertLevel() {

  return loadSetting("lastAlertLevel") || "";

}

function setLastAlertLevel(level) {

  saveSetting("lastAlertLevel", level || "");

}

function getLastAlertTime() {

  return Number(loadSetting("lastAlertTime") || "0");

}

function setLastAlertTime(timestamp) {

  saveSetting("lastAlertTime", String(timestamp));

}

async function geocodeRegion(pref, city) {

  const query = encodeURIComponent(`${pref} ${city} 日本`);

  const geoUrl = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${query}&limit=1&accept-language=ja`;

  const geoRes = await fetch(geoUrl, {

    headers: { Accept: "application/json" }

  });

  const geoData = await geoRes.json();

  if (!geoData || geoData.length === 0) {

    throw new Error("地域の座標を取得できませんでした");

  }

  const lat = Number(geoData[0].lat);

  const lon = Number(geoData[0].lon);

  saveSetting("lat", String(lat));

  saveSetting("lon", String(lon));

  return { lat, lon };

}

async function getRegionWeather(pref, city) {

  let lat = Number(loadSetting("lat"));

  let lon = Number(loadSetting("lon"));

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {

    const coords = await geocodeRegion(pref, city);

    lat = coords.lat;

    lon = coords.lon;

  }

  const weatherUrl =

    `https://api.open-meteo.com/v1/forecast` +

    `?latitude=${lat}` +

    `&longitude=${lon}` +

    `&current=temperature_2m,relative_humidity_2m` +

    `&timezone=Asia%2FTokyo`;

  const weatherRes = await fetch(weatherUrl);

  const weatherData = await weatherRes.json();

  if (!weatherData.current) {

    throw new Error("天気データを取得できませんでした");

  }

  return {

    temperature: weatherData.current.temperature_2m,

    humidity: weatherData.current.relative_humidity_2m,

    lat,

    lon

  };

}

function getHeatRiskLevel(temp, humidity) {

  const wbgtLike = 0.7 * temp + 0.3 * (humidity / 10);

  if (wbgtLike >= 31) return "危険";

  if (wbgtLike >= 28) return "警戒";

  if (wbgtLike >= 25) return "注意";

  return "安全";

}

function sendHeatNotification(level, pref, city, temp) {

  if (!("Notification" in window)) return;

  if (Notification.permission !== "granted") return;

  new Notification("熱中症対策ナビ", {

    body: `${pref} ${city} は現在「${level}」です。気温 ${temp}℃`,

    icon: "icons/favicon-192-v2.png"

  });

}

function shouldNotify(level) {

  const lastLevel = getLastAlertLevel();

  const lastTime = getLastAlertTime();

  const now = Date.now();

  const cooldown = 60 * 60 * 1000;

  if (level !== lastLevel) return true;

  return now - lastTime > cooldown;

}

function markNotified(level) {

  setLastAlertLevel(level);

  setLastAlertTime(Date.now());

}

async function checkHeatAlertForSavedRegion() {

  const notifyEnabled = loadSetting("notifyEnabled") === "1";

  const alertEnabled = loadSetting("alertNotify") === "1";

  const pref = loadSetting("pref");

  const city = loadSetting("city");

  if (!notifyEnabled || !alertEnabled || !pref || !city) return;

  try {

    const weather = await getRegionWeather(pref, city);

    if (!weather) return;

    const level = getHeatRiskLevel(weather.temperature, weather.humidity);

    if ((level === "警戒" || level === "危険") && shouldNotify(level)) {

      sendHeatNotification(level, pref, city, weather.temperature);

      markNotified(level);

    }

    if (level === "安全" || level === "注意") {

      setLastAlertLevel("");

    }

    console.log("地域通知チェック:", {

      pref,

      city,

      temperature: weather.temperature,

      humidity: weather.humidity,

      lat: weather.lat,

      lon: weather.lon,

      level

    });

  } catch (error) {

    console.error("地域通知チェック失敗:", error);

  }

}

function startAutoRegionNotification() {

  if (window.__heatNotifyStarted) return;

  window.__heatNotifyStarted = true;

  if (autoNotifyTimer) clearInterval(autoNotifyTimer);

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

  const citySelect = document.getElementById("citySelect");

  const modeValue = document.getElementById("modeValue");

  const notifyToggle = document.getElementById("notifyToggle");

  const alertToggle = document.getElementById("alertToggle");

  const weatherToggle = document.getElementById("weatherToggle");

  const newsToggle = document.getElementById("newsToggle");

  if (savedMode && modeValue) {

    modeValue.textContent = savedMode;

  }

  if (prefSelect && savedPref) {

    prefSelect.value = savedPref;

    changePref(savedPref, savedCity, false);

  }

  if (citySelect && savedCity) {

    citySelect.value = savedCity;

  }

  if (notifyToggle) notifyToggle.checked = savedNotify === "1";

  if (alertToggle) alertToggle.checked = savedAlert === "1";

  if (weatherToggle) weatherToggle.checked = savedWeather === "1";

  if (newsToggle) newsToggle.checked = savedNews === "1";

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

      await navigator.serviceWorker.register("/service-worker.js?v=2");

      console.log("SW登録成功");

    } catch (e) {

      console.error("SW登録失敗:", e);

    }

  });

}

let refreshing = false;

if ("serviceWorker" in navigator) {

  navigator.serviceWorker.addEventListener("controllerchange", () => {

    if (refreshing) return;

    refreshing = true;

    window.location.reload();

  });

}
 
