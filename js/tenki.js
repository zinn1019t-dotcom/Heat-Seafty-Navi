let currentLat = null;

let currentLon = null;

window.addEventListener("load", () => {

  const ok = window.confirm(

    "天気予報は現在地付近のOpen-Meteoデータを使って表示します。\n\n位置情報を利用してもよいですか？"

  );

  if (ok) {

    document.getElementById("lat_text").textContent = "北緯：取得中";

    document.getElementById("lon_text").textContent = "東経：取得中";

    getLocation();

  } else {

    document.getElementById("tenki").innerHTML = "<span class='kyouchou'>未取得</span>";

    document.getElementById("chuui").textContent = "位置情報が許可されていないため取得できません。";

  }

});

function getLocation() {

  if (!navigator.geolocation) {

    alert("この端末では位置情報が使えません。");

    return;

  }

  navigator.geolocation.getCurrentPosition(

    (pos) => {

      currentLat = pos.coords.latitude;

      currentLon = pos.coords.longitude;

      document.getElementById("lat_text").innerHTML =

        "北緯：<span class='kyouchou'>" + currentLat.toFixed(2) + "</span>";

      document.getElementById("lon_text").innerHTML =

        "東経：<span class='kyouchou'>" + currentLon.toFixed(2) + "</span>";

      fetchWeather(currentLat, currentLon);

    },

    () => {

      alert("位置情報の取得に失敗しました。");

      document.getElementById("chuui").textContent = "位置情報の取得に失敗しました。";

    },

    { enableHighAccuracy: true, timeout: 10000 }

  );

}

async function fetchWeather(lat, lon) {

  const url =

    "https://api.open-meteo.com/v1/forecast" +

    "?latitude=" + lat +

    "&longitude=" + lon +

    "&hourly=temperature_2m,apparent_temperature,weather_code," +

    "relative_humidity_2m,wind_speed_10m,shortwave_radiation" +

    "&wind_speed_unit=ms" +

    "&timezone=Asia%2FTokyo" +

    "&forecast_days=1";

  try {

    const res = await fetch(url);

    const data = await res.json();

    const now = new Date();

    let idx = data.hourly.time.findIndex(t =>

      Math.abs(new Date(t) - now) < 30 * 60 * 1000

    );

    if (idx < 0) idx = 0;

    const temp = data.hourly.temperature_2m[idx];

    const app = data.hourly.apparent_temperature[idx];

    const hum = data.hourly.relative_humidity_2m[idx];

    const wind = data.hourly.wind_speed_10m[idx];

    const code = data.hourly.weather_code[idx];

    const rad = data.hourly.shortwave_radiation[idx] / 1000;

    const wbgt =

      0.735 * temp +

      0.0374 * hum +

      0.00292 * temp * hum +

      7.619 * rad -

      4.557 * rad * rad -

      0.0572 * wind -

      4.064;

    let shisuu = "";

    let naiyou = "";

    if (wbgt >= 31) {

      shisuu = "危険";

      naiyou = "運動は原則禁止";

    } else if (wbgt >= 28) {

      shisuu = "厳重警戒";

      naiyou = "激しい運動は避ける";

    } else if (wbgt >= 25) {

      shisuu = "警戒";

      naiyou = "積極的に休息を";

    } else if (wbgt >= 21) {

      shisuu = "注意";

      naiyou = "積極的に水分補給";

    } else {

      shisuu = "ほぼ安全";

      naiyou = "適時水分補給を";

    }

    document.getElementById("wbgt-sisuu").innerHTML =

      "WBGT：<span class='kyouchou'>" + (Math.round(wbgt * 10) / 10) + "</span>℃";

    document.getElementById("shisuu").innerHTML =

      "<span class='kyouchou'>" + shisuu + "</span>";

    document.getElementById("chuui").textContent = naiyou;

    document.getElementById("wbgt").innerHTML =

      "WBGT：<span class='kyouchou'>" + (Math.round(wbgt * 10) / 10) + "</span>℃";

    document.getElementById("tenki").innerHTML =

      "<span class='kyouchou'>" + tenkihai(code) + "</span>";

    document.getElementById("ondo").innerHTML =

      "温度：<span class='kyouchou'>" + temp.toFixed(1) + "</span>℃";

    document.getElementById("taikan").innerHTML =

      "体感温度：<span class='kyouchou'>" + app.toFixed(1) + "</span>℃";

    document.getElementById("shitudo").innerHTML =

      "湿度：<span class='kyouchou'>" + hum.toFixed(0) + "</span>％";

    document.getElementById("wind").innerHTML =

      "風速：<span class='kyouchou'>" + wind.toFixed(1) + "</span>m/s";

  } catch (e) {

    alert("天気情報の取得に失敗しました。");

    console.error(e);

    document.getElementById("chuui").textContent = "天気情報の取得に失敗しました。";

  }

}

function tenkihai(code) {

 const table = {
  0: ["晴天", "hare"],
  1: ["一部曇り", "itibukumori"],
  2: ["一部曇り", "itibukumori2"],
  3: ["曇り", "kumori"],

  45: ["霧", "kiri"],
  48: ["霧", "kiri"],

  51: ["小雨", "ame"],
  53: ["雨", "ame"],
  55: ["強い雨", "tuyoiame"],

  61: ["雨", "ame"],
  63: ["強い雨", "tuyoiame"],
  65: ["強い雨", "tuyoiame"],

  71: ["雪", "yuki"],
  73: ["雪", "yuki"],
  75: ["強い雪", "tuyoyuki"],

  80: ["にわか雨", "niwakaame"],
  81: ["にわか雨", "niwakaame"],
  82: ["激しい雨", "tuyoiame"],

  95: ["雷雨", "raiu"]
};

  const item = table[code] || ["曇り", "kumori"];

  document.getElementById("emoji").innerHTML =

    "<img src='images/" + item[1] + ".png' alt='天気アイコン'>";

  return item[0];

}
 
