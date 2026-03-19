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
 
// ローカル設定
 
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
 
// 設定機能
 
// ==============================
 
// 表示モード切替
 
function toggleMode() {
 
  let mode = loadSetting("displayMode") || "通常";
 
  mode = mode === "通常" ? "シンプル" : "通常";
 
  saveSetting("displayMode", mode);
 
  const el = document.getElementById("modeValue");
 
  if (el) el.textContent = mode;
 
}
 
 
// ==============================
 
// 都道府県 → 地域選択
 
// ==============================
 
const AREA_DATA = {
 
  "北海道": ["札幌市", "旭川市", "函館市", "帯広市", "釧路市", "北見市"],
 
  "青森県": ["青森市", "弘前市", "八戸市"],
 
  "岩手県": ["盛岡市", "一関市", "奥州市"],
 
  "宮城県": ["仙台市", "石巻市", "大崎市"],
 
  "秋田県": ["秋田市", "横手市", "大仙市"],
 
  "山形県": ["山形市", "鶴岡市", "米沢市"],
 
  "福島県": ["福島市", "郡山市", "いわき市"],
 
  "茨城県": ["水戸市", "つくば市", "日立市", "土浦市"],
 
  "栃木県": ["宇都宮市", "小山市", "足利市"],
 
  "群馬県": ["前橋市", "高崎市", "太田市"],
 
  "埼玉県": ["さいたま市", "川越市", "越谷市", "所沢市"],
 
  "千葉県": ["千葉市", "船橋市", "柏市", "松戸市"],
 
  "東京都": ["新宿区", "渋谷区", "港区", "足立区", "八王子市"],
 
  "神奈川県": ["横浜市", "川崎市", "相模原市", "藤沢市"],
 
  "新潟県": ["新潟市", "長岡市", "上越市"],
 
  "富山県": ["富山市", "高岡市"],
 
  "石川県": ["金沢市", "小松市"],
 
  "福井県": ["福井市", "敦賀市"],
 
  "山梨県": ["甲府市", "富士吉田市"],
 
  "長野県": ["長野市", "松本市", "上田市"],
 
  "岐阜県": ["岐阜市", "大垣市", "高山市"],
 
  "静岡県": ["静岡市", "浜松市", "沼津市"],
 
  "愛知県": ["名古屋市", "豊田市", "岡崎市", "一宮市"],
 
  "三重県": ["津市", "四日市市", "伊勢市"],
 
  "滋賀県": ["大津市", "草津市"],
 
  "京都府": ["京都市", "宇治市"],
 
  "大阪府": ["大阪市", "堺市", "東大阪市"],
 
  "兵庫県": ["神戸市", "姫路市", "西宮市"],
 
  "奈良県": ["奈良市", "橿原市"],
 
  "和歌山県": ["和歌山市", "田辺市"],
 
  "鳥取県": ["鳥取市", "米子市"],
 
  "島根県": ["松江市", "出雲市"],
 
  "岡山県": ["岡山市", "倉敷市"],
 
  "広島県": ["広島市", "福山市"],
 
  "山口県": ["山口市", "下関市"],
 
  "徳島県": ["徳島市", "鳴門市"],
 
  "香川県": ["高松市", "丸亀市"],
 
  "愛媛県": ["松山市", "今治市"],
 
  "高知県": ["高知市", "四万十市"],
 
  "福岡県": ["福岡市", "北九州市", "久留米市"],
 
  "佐賀県": ["佐賀市", "唐津市"],
 
  "長崎県": ["長崎市", "佐世保市"],
 
  "熊本県": ["熊本市", "八代市"],
 
  "大分県": ["大分市", "別府市"],
 
  "宮崎県": ["宮崎市", "都城市"],
 
  "鹿児島県": ["鹿児島市", "霧島市"],
 
  "沖縄県": ["那覇市", "名護市", "沖縄市", "うるま市", "浦添市", "国頭村", "大宜味村"]
 
};
 
// 都道府県変更
 
function changePref(pref) {
 
  const citySelect = document.getElementById("citySelect");
 
  if (!citySelect) return;
 
  citySelect.innerHTML = "";
 
  if (!pref || !AREA_DATA[pref]) {
 
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
 
    citySelect.appendChild(option);
 
  });
 
  saveSetting("pref", pref);
 
  saveSetting("city", "");
 
}
 
// 地域変更
 
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
 
  const citySelect = document.getElementById("citySelect");
 
  if (savedMode && modeEl) {
 
    modeEl.textContent = savedMode;
 
  }
 
  if (savedPref && prefSelect) {
 
    prefSelect.value = savedPref;
 
    // ←これ超重要
 
    changePref(savedPref);
 
    // ←生成後にセット
 
    if (savedCity && citySelect) {
 
      citySelect.value = savedCity;
 
    }
 
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

// ローカル設定

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

// 設定機能

// ==============================

// 表示モード切替

function toggleMode() {

  let mode = loadSetting("displayMode") || "通常";

  mode = mode === "通常" ? "シンプル" : "通常";

  saveSetting("displayMode", mode);

  const el = document.getElementById("modeValue");

  if (el) el.textContent = mode;

}


// ==============================

// 都道府県 → 地域選択

// ==============================

const AREA_DATA = {

  "北海道": ["札幌市", "旭川市", "函館市", "帯広市", "釧路市", "北見市"],

  "青森県": ["青森市", "弘前市", "八戸市"],

  "岩手県": ["盛岡市", "一関市", "奥州市"],

  "宮城県": ["仙台市", "石巻市", "大崎市"],

  "秋田県": ["秋田市", "横手市", "大仙市"],

  "山形県": ["山形市", "鶴岡市", "米沢市"],

  "福島県": ["福島市", "郡山市", "いわき市"],

  "茨城県": ["水戸市", "つくば市", "日立市", "土浦市"],

  "栃木県": ["宇都宮市", "小山市", "足利市"],

  "群馬県": ["前橋市", "高崎市", "太田市"],

  "埼玉県": ["さいたま市", "川越市", "越谷市", "所沢市"],

  "千葉県": ["千葉市", "船橋市", "柏市", "松戸市"],

  "東京都": ["新宿区", "渋谷区", "港区", "足立区", "八王子市"],

  "神奈川県": ["横浜市", "川崎市", "相模原市", "藤沢市"],

  "新潟県": ["新潟市", "長岡市", "上越市"],

  "富山県": ["富山市", "高岡市"],

  "石川県": ["金沢市", "小松市"],

  "福井県": ["福井市", "敦賀市"],

  "山梨県": ["甲府市", "富士吉田市"],

  "長野県": ["長野市", "松本市", "上田市"],

  "岐阜県": ["岐阜市", "大垣市", "高山市"],

  "静岡県": ["静岡市", "浜松市", "沼津市"],

  "愛知県": ["名古屋市", "豊田市", "岡崎市", "一宮市"],

  "三重県": ["津市", "四日市市", "伊勢市"],

  "滋賀県": ["大津市", "草津市"],

  "京都府": ["京都市", "宇治市"],

  "大阪府": ["大阪市", "堺市", "東大阪市"],

  "兵庫県": ["神戸市", "姫路市", "西宮市"],

  "奈良県": ["奈良市", "橿原市"],

  "和歌山県": ["和歌山市", "田辺市"],

  "鳥取県": ["鳥取市", "米子市"],

  "島根県": ["松江市", "出雲市"],

  "岡山県": ["岡山市", "倉敷市"],

  "広島県": ["広島市", "福山市"],

  "山口県": ["山口市", "下関市"],

  "徳島県": ["徳島市", "鳴門市"],

  "香川県": ["高松市", "丸亀市"],

  "愛媛県": ["松山市", "今治市"],

  "高知県": ["高知市", "四万十市"],

  "福岡県": ["福岡市", "北九州市", "久留米市"],

  "佐賀県": ["佐賀市", "唐津市"],

  "長崎県": ["長崎市", "佐世保市"],

  "熊本県": ["熊本市", "八代市"],

  "大分県": ["大分市", "別府市"],

  "宮崎県": ["宮崎市", "都城市"],

  "鹿児島県": ["鹿児島市", "霧島市"],

  "沖縄県": ["那覇市", "名護市", "沖縄市", "うるま市", "浦添市", "国頭村", "大宜味村"]

};

// 都道府県変更

function changePref(pref, resetCity = true) {

  const citySelect = document.getElementById("citySelect");

  if (!citySelect) return;

  citySelect.innerHTML = "";

  if (!pref || !AREA_DATA[pref]) {

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

    citySelect.appendChild(option);

  });

  saveSetting("pref", pref);

  if (resetCity) {

    saveSetting("city", "");

  }

}

// 地域変更

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

  const citySelect = document.getElementById("citySelect");

  if (savedMode && modeEl) {

    modeEl.textContent = savedMode;

  }

  if (savedPref && prefSelect) {

    prefSelect.value = savedPref;

    // リロード時は city を消さない

    changePref(savedPref, false);

    if (savedCity && citySelect) {

      citySelect.value = savedCity;

    }

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
 
