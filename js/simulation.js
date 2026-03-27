(() => {

  const get = (id) => document.getElementById(id);

  const clamp = (v) => Math.max(0, Math.min(100, v));

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const state = {

    hydration: 70,

    heat: 20,

    fatigue: 20,

    step: 0,

    difficulty: "normal",

    flags: {

      hasHat: false,

      usedShade: false,

      drankSalt: false,

      sleptWell: false

    }

  };

  const DIFF = {

    easy:   { effectMul: 0.85, heatGainMul: 0.9, fatigueGainMul: 0.9 },

    normal: { effectMul: 1.0, heatGainMul: 1.0, fatigueGainMul: 1.0 },

    hard:   { effectMul: 1.2, heatGainMul: 1.15, fatigueGainMul: 1.15 }

  };

  function applyEffectRaw(effect = {}) {

    const d = DIFF[state.difficulty] || DIFF.normal;

    const hydrationRaw = effect.hydration || 0;

    const heatRaw = effect.heat || 0;

    const fatigueRaw = effect.fatigue || 0;

    const hydrationDelta = Math.round(hydrationRaw * d.effectMul);

    const heatDelta = Math.round(heatRaw * (heatRaw > 0 ? d.heatGainMul : d.effectMul));

    const fatigueDelta = Math.round(fatigueRaw * (fatigueRaw > 0 ? d.fatigueGainMul : d.effectMul));

    state.hydration = clamp(state.hydration + hydrationDelta);

    state.heat = clamp(state.heat + heatDelta);

    state.fatigue = clamp(state.fatigue + fatigueDelta);

  }

  function calcRiskScore() {

    const base = (state.heat + state.fatigue) / 2;

    const hydrateBonus = (state.hydration - 50) * 0.4;

    return clamp(Math.round(base - hydrateBonus));

  }

  function riskBand(score) {

    if (score < 40) return "low";

    if (score < 70) return "mid";

    return "high";

  }

  function updateStatus() {

    get("bar-hydration").style.width = `${state.hydration}%`;

    get("bar-heat").style.width = `${state.heat}%`;

    get("bar-fatigue").style.width = `${state.fatigue}%`;

    get("text-hydration").textContent = state.hydration;

    get("text-heat").textContent = state.heat;

    get("text-fatigue").textContent = state.fatigue;

    const score = calcRiskScore();

    const band = riskBand(score);

    get("risk-label").textContent =

      band === "low" ? `リスク：低め（${score}/100）` :

      band === "mid" ? `リスク：注意（${score}/100）` :

      `リスク：危険（${score}/100）`;

    get("risk-label").style.color =

      band === "low" ? "green" :

      band === "mid" ? "orange" : "red";

  }

  function addLog(text) {

    const li = document.createElement("li");

    li.textContent = text;

    get("log-list").appendChild(li);

  }

  function hideMainPanels() {

    document.querySelector(".scene").style.display = "none";

    document.querySelector(".choices").style.display = "none";

    document.querySelector(".status").style.display = "none";

    document.querySelector(".log").style.display = "none";

    document.querySelector(".restart").style.display = "none";

  }

  function showMainPanels() {

    document.querySelector(".scene").style.display = "block";

    document.querySelector(".choices").style.display = "block";

    document.querySelector(".status").style.display = "block";

    document.querySelector(".log").style.display = "block";

    document.querySelector(".restart").style.display = "block";

  }

  const sceneMap = new Map();

  function registerScenes(list) {

    list.forEach((scene) => sceneMap.set(scene.id, scene));

  }

  const route = [

    "S_MORNING_PREP",

    "S_COMMUTE_SUN",

    "S_CLASSROOM_HOT",

    "S_BREAK_1030",

    "S_PE_1050",

    "S_AFTER_PE",

    "S_LUNCH_1230",

    "S_AFTER_SCHOOL",

    "S_COMMUTE_HOME",

    "S_BATH",

    "S_SLEEP"

  ];

  const randomEvents = [

    {

      id: "E_CLOUDY_WIND",

      title: "突発イベント：風が吹いた",

      text: "一瞬風が吹いて少し楽になった。",

      weight: 2,

      effect: { heat: -8, fatigue: -3 },

      log: "風が吹いて体温負担が少し下がった。"

    },

    {

      id: "E_VENDING_MACHINE",

      title: "突発イベント：自販機が近い",

      text: "自販機を見つけた。飲み物を買う？",

      weight: 2,

      type: "choice",

      choices: [

        {

          label: "スポドリを買う",

          tag: "GOOD",

          effect: { hydration: 12, heat: -3 },

          log: "自販機でスポドリを買った。",

          setFlags: { drankSalt: true }

        },

        {

          label: "水を買う",

          tag: "まあOK",

          effect: { hydration: 10 },

          log: "自販機で水を買った。"

        },

        {

          label: "買わない",

          tag: "注意",

          effect: { hydration: -5, heat: 3 },

          log: "買わずに通過した。"

        }

      ]

    },

    {

      id: "E_FORGOT_HAT",

      title: "突発イベント：帽子を忘れた",

      text: "帽子を忘れて日差しがきつい。",

      weight: 1,

      effect: { heat: 10, fatigue: 5 },

      log: "帽子がなくて暑さが増した…"

    }

  ];

  function rollRandomEventChance() {

    return Math.random() < 0.25;

  }

  function pickWeightedEvent() {

    const pool = [];

    randomEvents.forEach((event) => {

      const weight = event.weight || 1;

      for (let i = 0; i < weight; i++) {

        pool.push(event);

      }

    });

    return pick(pool);

  }

  function ensureSafetyGate() {

    const score = calcRiskScore();

    if (score >= 85) return "S_NURSE_ROOM";

    return null;

  }

  function tagClass(tag) {

    if (["おすすめ", "GOOD", "安全寄り"].includes(tag)) return "good";

    if (["まあOK", "普通"].includes(tag)) return "neutral";

    if (["注意"].includes(tag)) return "warn";

    return "danger";

  }

  function renderChoices(scene) {

    const area = get("choices-area");

    area.innerHTML = "";

    scene.choices.forEach((choice, index) => {

      const button = document.createElement("button");

      button.className = "choice-btn";

      button.innerHTML =

        `<span class="tag tag-${tagClass(choice.tag)}">${choice.tag}</span>` +

        `<span><span class="choice-number">${index + 1}</span>${choice.label}</span>`;

      button.onclick = () => applyChoice(choice);

      area.appendChild(button);

    });

  }

  function renderSceneById(sceneId) {

    const scene = sceneMap.get(sceneId);

    if (!scene) {

      showResult();

      return;

    }

    if (scene.condition && !scene.condition(state)) {

      state.step++;

      renderNext();

      return;

    }

    if (scene.onEnter) {

      scene.onEnter(state);

    }

    get("scene-title").textContent = scene.title;

    get("scene-text").textContent = scene.text;

    renderChoices(scene);

  }

  function applyChoice(choice) {

    applyEffectRaw(choice.effect || {});

    if (choice.setFlags) {

      Object.keys(choice.setFlags).forEach((key) => {

        state.flags[key] = !!choice.setFlags[key];

      });

    }

    if (choice.log) {

      addLog(choice.log);

    }

    updateStatus();

    if (choice.nextId) {

      renderSceneById(choice.nextId);

      return;

    }

    state.step++;

    renderNext();

  }

  function renderEvent(event) {

    get("scene-title").textContent = event.title;

    get("scene-text").textContent = event.text;

    const area = get("choices-area");

    area.innerHTML = "";

    if (event.type === "choice") {

      event.choices.forEach((choice, index) => {

        const button = document.createElement("button");

        button.className = "choice-btn";

        button.innerHTML =

          `<span class="tag tag-${tagClass(choice.tag)}">${choice.tag}</span>` +

          `<span><span class="choice-number">${index + 1}</span>${choice.label}</span>`;

        button.onclick = () => {

          applyEffectRaw(choice.effect || {});

          if (choice.setFlags) {

            Object.keys(choice.setFlags).forEach((key) => {

              state.flags[key] = !!choice.setFlags[key];

            });

          }

          if (choice.log) {

            addLog(choice.log);

          }

          updateStatus();

          renderSceneById(route[state.step] || null);

        };

        area.appendChild(button);

      });

      return;

    }

    applyEffectRaw(event.effect || {});

    if (event.log) addLog(event.log);

    updateStatus();

    const button = document.createElement("button");

    button.className = "choice-btn";

    button.textContent = "次へ進む";

    button.onclick = () => renderSceneById(route[state.step] || null);

    area.appendChild(button);

  }

  function renderNext() {

    const gateScene = ensureSafetyGate();

    if (gateScene) {

      renderSceneById(gateScene);

      return;

    }

    if (!route[state.step]) {

      showResult();

      return;

    }

    if (rollRandomEventChance()) {

      const event = pickWeightedEvent();

      renderEvent(event);

      return;

    }

    renderSceneById(route[state.step]);

  }

  registerScenes([

    {

      id: "S_MORNING_PREP",

      title: "朝 8:00 登校前",

      text: "今日も猛暑日。家を出る前にどうする？",

      choices: [

        {

          label: "スポーツドリンクを用意する",

          tag: "おすすめ",

          effect: { hydration: 10 },

          log: "スポドリを準備した。",

          setFlags: { drankSalt: true }

        },

        {

          label: "水だけ持つ",

          tag: "まあOK",

          effect: { hydration: 5 },

          log: "水を準備した。"

        },

        {

          label: "何も用意しない",

          tag: "危険寄り",

          effect: { hydration: -10, heat: 5 },

          log: "準備せず出た…"

        }

      ]

    },

    {

      id: "S_COMMUTE_SUN",

      title: "登校中 8:20 日なたの坂道",

      text: "日差しが強い。どうやって移動する？",

      choices: [

        {

          label: "日陰ルート＋ゆっくり歩く",

          tag: "GOOD",

          effect: { hydration: 0, heat: -5, fatigue: -5 },

          log: "日陰を選んでゆっくり歩いた。",

          setFlags: { usedShade: true }

        },

        {

          label: "普通に歩く",

          tag: "普通",

          effect: { hydration: -5, heat: 5, fatigue: 5 },

          log: "普通に歩いた。"

        },

        {

          label: "急いで走る",

          tag: "危険",

          effect: { hydration: -10, heat: 15, fatigue: 15 },

          log: "急いで走って一気に暑くなった…"

        }

      ]

    },

    {

      id: "S_CLASSROOM_HOT",

      title: "1時間目 9:10 教室（換気が弱い）",

      text: "室内が蒸し暑い。どうする？",

      choices: [

        {

          label: "先生に相談して換気・扇風機を使う",

          tag: "おすすめ",

          effect: { hydration: 0, heat: -10, fatigue: -5 },

          log: "換気して体温負担を下げた。"

        },

        {

          label: "何もせず我慢",

          tag: "注意",

          effect: { hydration: -5, heat: 10, fatigue: 5 },

          log: "我慢してだんだんきつくなった。"

        },

        {

          label: "窓際で日なたに当たる",

          tag: "危険寄り",

          effect: { hydration: -5, heat: 15, fatigue: 5 },

          log: "日なたでさらに暑くなった…"

        }

      ]

    },

    {

      id: "S_BREAK_1030",

      title: "午前 10:30 休み時間",

      text: "教室が暑い…休み時間に何をする？",

      choices: [

        {

          label: "水分補給する",

          tag: "GOOD",

          effect: { hydration: 15, heat: -5 },

          log: "水分をとった。"

        },

        {

          label: "スマホで休む",

          tag: "注意",

          effect: { hydration: -5, heat: 5, fatigue: 5 },

          log: "水分をとらずに休んだ。"

        },

        {

          label: "走り回る",

          tag: "危険",

          effect: { hydration: -10, heat: 10, fatigue: 10 },

          log: "走り回って汗だく。"

        }

      ]

    },

    {

      id: "S_PE_1050",

      title: "体育 10:50 グラウンド",

      text: "体育の時間。体調と暑さを見てどう動く？",

      choices: [

        {

          label: "こまめに休憩＋水分＋帽子",

          tag: "GOOD",

          effect: { hydration: 10, heat: -5, fatigue: 0 },

          log: "休憩をはさみながら安全に動いた。",

          setFlags: { hasHat: true }

        },

        {

          label: "水分は後でまとめて",

          tag: "注意",

          effect: { hydration: -10, heat: 10, fatigue: 10 },

          log: "水分を後回しにして苦しくなった。"

        },

        {

          label: "無理して全力",

          tag: "危険",

          effect: { hydration: -15, heat: 20, fatigue: 20 },

          log: "無理して一気に危険度が上がった…"

        }

      ]

    },

    {

      id: "S_AFTER_PE",

      title: "体育後 11:30 汗だく",

      text: "汗がすごい。次の授業前にどうする？",

      choices: [

        {

          label: "水＋塩分をとる",

          tag: "おすすめ",

          effect: { hydration: 15, heat: -5, fatigue: -5 },

          log: "水分と塩分を補給した。",

          setFlags: { drankSalt: true }

        },

        {

          label: "水だけ飲む",

          tag: "まあOK",

          effect: { hydration: 10, heat: -3, fatigue: 0 },

          log: "水分はとった。"

        },

        {

          label: "飲まない",

          tag: "危険寄り",

          effect: { hydration: -10, heat: 10, fatigue: 5 },

          log: "補給せず次の授業へ…"

        }

      ]

    },

    {

      id: "S_LUNCH_1230",

      title: "昼休み 12:30",

      text: "外は猛暑。昼休みどう過ごす？",

      choices: [

        {

          label: "日陰で涼む",

          tag: "安全寄り",

          effect: { hydration: 10, heat: -5, fatigue: -5 },

          log: "日陰で休んだ。",

          setFlags: { usedShade: true }

        },

        {

          label: "外で遊ぶ",

          tag: "危険",

          effect: { hydration: -15, heat: 15, fatigue: 15 },

          log: "外で遊んで疲労。"

        },

        {

          label: "教室で雑談",

          tag: "普通",

          effect: { hydration: 0, heat: 5, fatigue: 0 },

          log: "室内で過ごした。"

        }

      ]

    },

    {

      id: "S_AFTER_SCHOOL",

      title: "放課後 16:10 部活開始",

      text: "まだ暑い。部活をどう進める？",

      choices: [

        {

          label: "日陰・休憩を固定で入れる",

          tag: "GOOD",

          effect: { hydration: 5, heat: -10, fatigue: -5 },

          log: "休憩ルールで安全に進めた。",

          setFlags: { usedShade: true }

        },

        {

          label: "様子を見ながら続行",

          tag: "普通",

          effect: { hydration: -5, heat: 8, fatigue: 8 },

          log: "休憩が少なく少しきつい。"

        },

        {

          label: "気合で通す",

          tag: "危険",

          effect: { hydration: -15, heat: 20, fatigue: 20 },

          log: "気合で続けて危険が増した…"

        }

      ]

    },

    {

      id: "S_COMMUTE_HOME",

      title: "帰宅中 18:00 まだ暑い",

      text: "疲れてきた。帰り道どうする？",

      choices: [

        {

          label: "涼しい場所で5分休んでから帰る",

          tag: "安全寄り",

          effect: { hydration: 5, heat: -10, fatigue: -10 },

          log: "休憩して落ち着いてから帰った。"

        },

        {

          label: "そのまま帰る",

          tag: "普通",

          effect: { hydration: -5, heat: 5, fatigue: 5 },

          log: "そのまま帰宅した。"

        },

        {

          label: "寄り道して外に長くいる",

          tag: "注意",

          effect: { hydration: -10, heat: 10, fatigue: 10 },

          log: "外に長くいてさらに消耗…"

        }

      ]

    },

    {

      id: "S_BATH",

      title: "夜 20:30 お風呂",

      text: "疲れた。お風呂どうする？",

      choices: [

        {

          label: "ぬるめで短め＋水分を先に飲む",

          tag: "GOOD",

          effect: { hydration: 10, heat: -5, fatigue: -5 },

          log: "体に負担をかけず整えた。"

        },

        {

          label: "普通に入る",

          tag: "普通",

          effect: { hydration: 0, heat: 3, fatigue: 0 },

          log: "普通に入浴した。"

        },

        {

          label: "熱い湯に長く入る",

          tag: "注意",

          effect: { hydration: -10, heat: 10, fatigue: 5 },

          log: "のぼせて体温負担が上がった…"

        }

      ]

    },

    {

      id: "S_SLEEP",

      title: "就寝前 23:00 明日に備える",

      text: "明日も暑そう。寝る前にどうする？",

      choices: [

        {

          label: "水を枕元に置いて早めに寝る",

          tag: "おすすめ",

          effect: { hydration: 5, heat: -5, fatigue: -10 },

          log: "睡眠と準備で回復した。",

          setFlags: { sleptWell: true }

        },

        {

          label: "スマホをだらだら見て寝不足",

          tag: "注意",

          effect: { hydration: -5, heat: 5, fatigue: 15 },

          log: "寝不足で疲れが増えた…"

        },

        {

          label: "水を飲まずに寝る",

          tag: "危険寄り",

          effect: { hydration: -10, heat: 5, fatigue: 5 },

          log: "水分不足のまま寝てしまった…"

        }

      ]

    },

    {

      id: "S_NURSE_ROOM",

      title: "緊急：保健室に行くべき状態",

      text: "危険な状態です。無理はせず、涼しい場所で休み、周りの大人に相談しましょう。",

      choices: [

        {

          label: "先生/大人に伝えて休む",

          tag: "おすすめ",

          effect: { heat: -20, fatigue: -15, hydration: 10 },

          log: "大人に伝えて休んだ。体が少し落ち着いた。"

        },

        {

          label: "水分と塩分をとって安静",

          tag: "GOOD",

          effect: { heat: -15, fatigue: -10, hydration: 15 },

          log: "水分・塩分をとって安静にした。",

          setFlags: { drankSalt: true }

        },

        {

          label: "休まず戻る（危険）",

          tag: "危険",

          effect: { heat: 10, fatigue: 10, hydration: -10 },

          log: "休まず戻ってさらに危険になった…"

        }

      ],

      onEnter: () => addLog("⚠️ 危険域に入ったため「保健室」シーンへ移動。")

    }

  ]);

  function showResult() {

    hideMainPanels();

    get("result-screen").style.display = "block";

    const score = calcRiskScore();

    get("result-title").textContent =

      score < 40 ? "結果：安全に過ごせました！" :

      score < 70 ? "結果：注意が必要でした" :

      "結果：危険な状態でした！";

    get("result-text").textContent =

      score < 40 ? "良い選択が多く、熱中症リスクは低めでした。" :

      score < 70 ? "ところどころ水分や休憩が不足していました。" :

      "熱中症リスクが高く、とても危険な状態でした！";

    get("result-hydration").textContent = state.hydration;

    get("result-heat").textContent = state.heat;

    get("result-fatigue").textContent = state.fatigue;

    get("result-score").textContent = score;

    const advice = [];

    if (!state.flags.drankSalt) advice.push("汗をかく日は『水＋塩分』も意識。");

    if (!state.flags.usedShade) advice.push("日陰・涼しい場所の活用で体温負担が下がります。");

    if (!state.flags.sleptWell) advice.push("睡眠不足は疲れが増えてリスクが上がりやすいです。");

    advice.push(

      score < 40 ? "今のペースで『こまめな水分・休憩』を続けましょう。" :

      score < 70 ? "休憩と水分のタイミングを増やして改善しましょう。" :

      "次回は無理せず、早めの休憩・冷却・相談を最優先に。"

    );

    get("result-advice").textContent = advice.join(" ");

  }

  function resetGame() {

    state.hydration = 70;

    state.heat = 20;

    state.fatigue = 20;

    state.step = 0;

    state.difficulty = "normal";

    state.flags = {

      hasHat: false,

      usedShade: false,

      drankSalt: false,

      sleptWell: false

    };

    get("log-list").innerHTML = "";

    get("result-screen").style.display = "none";

    showMainPanels();

    updateStatus();

    renderNext();

  }

  function cycleDifficulty() {

    state.difficulty =

      state.difficulty === "easy" ? "normal" :

      state.difficulty === "normal" ? "hard" : "easy";

    addLog(`🎚 難易度：${state.difficulty} に変更`);

    updateStatus();

  }

  window.resetGame = resetGame;

  document.addEventListener("DOMContentLoaded", () => {

    get("restart-btn").addEventListener("click", resetGame);

    const title = document.querySelector("header.panel h1");

    if (title) {

      title.addEventListener("dblclick", cycleDifficulty);

    }

    updateStatus();

    renderNext();

  });

})();
 
