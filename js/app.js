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

// 地域名補正

// ==============================

function normalizeCityName(rawCity, pref) {

  if (!rawCity || typeof AREA_DATA === "undefined" || !AREA_DATA[pref]) {

    return "";

  }

  const options = AREA_DATA[pref];

  if (options.includes(rawCity)) return rawCity;

  const noGun = rawCity.replace(/.+郡/, "");

  if (options.includes(noGun)) return noGun;

  const base = rawCity.replace(/[市区町村]$/, "");

  const found = options.find((opt) => {

    const optBase = opt.replace(/[市区町村]$/, "");

    return (

      opt === rawCity ||

      opt === noGun ||

      optBase === base ||
 
