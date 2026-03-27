/**************************************************

 * 熱中症クイズ

 * 40問ストック → 10問ランダム出題

 **************************************************/

// ==== 問題バンク ====

const questionBank = [

  {

    type: "choice",

    title: "Q1. 熱中症が起こりやすいのはどんなとき？",

    text: "いちばん危険度が高い状況を選ぼう。",

    choices: [

      "気温が低く、湿度も低い日",

      "気温は高いが、湿度が低い日",

      "気温はそれほど高くないが、湿度が高い日",

      "気温も湿度も高い日"

    ],

    answer: 3,

    explanation: "気温も湿度も高いと汗が蒸発しにくく、体に熱がこもりやすくなります。湿度が高い日も要注意です。"

  },

  {

    type: "choice",

    title: "Q2. 熱中症の初期に出やすいサインはどれ？",

    text: "次のうち、熱中症の「初期サイン」として正しいものを選ぼう。",

    choices: ["めまい・立ちくらみ", "急に視力がよくなる", "背が急に伸びる", "急にお腹がすく"],

    answer: 0,

    explanation: "めまい・立ちくらみ・吐き気・だるさなどは、体が「危ないよ」と知らせているサインです。"

  },

  {

    type: "choice",

    title: "Q3. 「のどが渇いた」と感じたときの体の状態は？",

    text: "のどが渇いたと感じたとき、体の中ではどうなっていることが多い？",

    choices: ["まだ余裕がある", "すでに水分不足が始まっている", "水分が多すぎる", "特に関係ない"],

    answer: 1,

    explanation: "のどの渇きは遅れて出ることがあります。渇きを感じた時点で不足が進んでいる場合があるので、渇く前からこまめに飲むのが大切です。"

  },

  {

    type: "choice",

    title: "Q4. 熱中症予防として、より適した飲み物は？",

    text: "運動や暑い日の外出で飲むものとして、より良いものを選ぼう。",

    choices: [

      "アルコール飲料",

      "カフェインが多い飲み物",

      "水・麦茶・スポーツドリンク",

      "甘い炭酸飲料だけ"

    ],

    answer: 2,

    explanation: "基本は水や麦茶。汗を多くかくときはスポーツドリンクなどで塩分も補うとよい場合があります。"

  },

  {

    type: "choice",

    title: "Q5. 熱中症になりやすい条件として正しいのは？",

    text: "次のうち、熱中症のリスクを高めるものをすべて含んでいるのはどれ？",

    choices: ["前日にあまり寝ていない", "朝ごはんを抜いた", "体調が悪いのに運動する", "上のA〜Cすべて"],

    answer: 3,

    explanation: "寝不足・朝食抜き・体調不良はどれもリスクを上げます。「今日はだるい」も大切なサインです。"

  },

  {

    type: "choice",

    title: "Q6. 真夏の部活で、正しい行動はどれ？",

    text: "熱中症予防として、いちばん良い行動を選ぼう。",

    choices: [

      "水を飲まず、最後まで走り切る",

      "のどが渇いたときだけ一気に飲む",

      "休憩のたびに、こまめに水分をとる",

      "具合が悪くても、誰にも言わず続ける"

    ],

    answer: 2,

    explanation: "「こまめに・少しずつ・休憩とセット」が理想です。しんどいときは早めに伝えて休むことも大事です。"

  },

  {

    type: "choice",

    title: "Q7. 暑い日の服装として、熱中症になりにくいのは？",

    text: "次のうち、熱中症のリスクを下げる服装に近いものを選ぼう。",

    choices: ["黒い長袖＋厚手の服", "通気性がよい明るい色の服", "カッパを着て汗をかく", "首元をきつくしめる服装"],

    answer: 1,

    explanation: "明るい色で通気性がよい服は、熱がこもりにくく、体への負担を減らしやすいです。"

  },

  {

    type: "choice",

    title: "Q8. 屋内でも熱中症になることがある。○か×か？",

    text: "体育館や室内でも熱中症は起こるでしょうか？",

    choices: ["○ 起こることがある", "× 起こらない"],

    answer: 0,

    explanation: "風通しが悪い部屋・体育館など、屋内でも熱中症は起こります。"

  },

  {

    type: "choice",

    title: "Q9. 熱中症が疑われるときの応急処置として正しいのは？",

    text: "次のうち、正しいものを選ぼう。",

    choices: [

      "涼しい場所へ移動／衣服をゆるめる／首・わき・脚の付け根を冷やす",

      "涼しい場所へ移動／首を冷やす／意識がなくても水を飲ませる",

      "衣服をゆるめる／走って風を当てる／水分はとらせない",

      "その場で寝かせて何もせず様子を見る"

    ],

    answer: 0,

    explanation: "意識がはっきりしているときだけ水分補給をします。意識がない人に飲ませるのは危険です。"

  },

  {

    type: "choice",

    title: "Q10. 「汗をかいていないから、熱中症ではない」と言える？",

    text: "重い熱中症のとき、汗はどうなっていることがある？",

    choices: ["必ず大量の汗が出る", "逆に汗が出ていないこともある", "汗が変な色になる", "汗の有無は関係ない"],

    answer: 1,

    explanation: "重症化すると汗が止まることもあります。「汗がない＝安全」とは言えません。"

  },

  {

    type: "choice",

    title: "Q11. 水分補給のコツとして正しいのは？",

    text: "より安全に近い飲み方を選ぼう。",

    choices: ["のどが渇いたら一気に飲む", "渇く前から少しずつ回数多めに飲む", "1日1回まとめて飲む", "できるだけ我慢する"],

    answer: 1,

    explanation: "少量をこまめに飲むのが基本です。まとめ飲みより分けて飲むほうが安全です。"

  },

  {

    type: "choice",

    title: "Q12. スポーツドリンクが役立ちやすいのは？",

    text: "どんな状況で選びやすい？",

    choices: ["寒い日に家でゆっくりしているとき", "汗をたくさんかく運動や炎天下の活動", "寝る直前に大量に飲むとき", "水分が一切とれないとき"],

    answer: 1,

    explanation: "汗で水分と一緒に塩分も失うため、汗が多いときに役立ちやすいです。"

  },

  {

    type: "choice",

    title: "Q13. 休憩の入れ方で正しいのは？",

    text: "より良い考え方を選ぼう。",

    choices: ["限界まで頑張ってから休む", "元気なうちに短い休憩を入れる", "休憩は不要", "水分だけあれば休憩しない"],

    answer: 1,

    explanation: "疲れてからでは遅いことがあります。早めに短い休憩を入れるのが有効です。"

  },

  {

    type: "choice",

    title: "Q14. 日陰を選ぶと何がいい？",

    text: "いちばん近い理由を選ぼう。",

    choices: ["気分が変わるだけ", "体に入る熱が減り、負担が下がる", "歩くのが遅くなるから", "水分がいらなくなるから"],

    answer: 1,

    explanation: "直射日光を避けると体温が上がりにくく、負担を減らしやすいです。"

  },

  {

    type: "choice",

    title: "Q15. 帽子や日傘の効果として正しいのは？",

    text: "役立つ点を選ぼう。",

    choices: ["頭や首に当たる直射日光を減らせる", "水分補給が不要になる", "湿度を下げられる", "必ず体温を下げられる"],

    answer: 0,

    explanation: "直射日光を減らすのがポイントです。"

  },

  {

    type: "choice",

    title: "Q16. 暑い日に睡眠不足が危険な理由は？",

    text: "いちばん近いものを選ぼう。",

    choices: ["眠いだけで関係ない", "体調が落ち、暑さに弱くなりやすい", "汗が出なくなる", "のどが渇かなくなる"],

    answer: 1,

    explanation: "睡眠不足は体調を落とし、熱中症のリスクを上げる要因になります。"

  },

  {

    type: "choice",

    title: "Q17. 朝食を抜くと危険になりやすい理由は？",

    text: "いちばん近い理由を選ぼう。",

    choices: ["エネルギーや水分が不足しやすい", "走るのが速くなる", "汗が止まる", "関係ない"],

    answer: 0,

    explanation: "朝食を抜くと体調を崩しやすく、暑さへの耐性が落ちることがあります。"

  },

  {

    type: "choice",

    title: "Q18. 暑い中で頭痛が出たときの優先行動は？",

    text: "いちばん近い行動を選ぼう。",

    choices: ["我慢して続ける", "涼しい場所で休み、冷やして水分をとる", "もっと運動して汗を出す", "水分を我慢する"],

    answer: 1,

    explanation: "初期サインの可能性があります。休む・冷やす・補給を優先します。"

  },

  {

    type: "choice",

    title: "Q19. めまいがあるときに危ない行動は？",

    text: "いちばん危ない行動を選ぼう。",

    choices: ["日陰で座る", "一人で歩いて移動する", "周りに伝える", "水分をとる"],

    answer: 1,

    explanation: "転倒や急な悪化の危険があります。周りに伝えて助けを求めましょう。"

  },

  {

    type: "choice",

    title: "Q20. 経口補水液が選ばれやすいのはどんなとき？",

    text: "いちばん近いものを選ぼう。",

    choices: ["脱水が疑われるとき", "普段のジュース代わり", "眠気覚まし", "運動前に必ず一気飲み"],

    answer: 0,

    explanation: "脱水が疑われる場面で使われます。日常の飲み物として常用するものではありません。"

  },

  {

    type: "choice",

    title: "Q21. 体を冷やすとき、効果が出やすい場所は？",

    text: "冷やす場所として正しいものを選ぼう。",

    choices: ["指先", "首・わき・脚の付け根", "ひじだけ", "髪の毛"],

    answer: 1,

    explanation: "太い血管が通る場所を冷やすと効率よく体を冷やしやすいです。"

  },

  {

    type: "choice",

    title: "Q22. 水分を飲ませてよい条件は？",

    text: "熱中症が疑われる人に水分を飲ませてよいのはどれ？",

    choices: ["意識がぼんやりでも飲ませる", "意識がはっきりして飲み込める", "意識がないが少しならOK", "けいれん中でもOK"],

    answer: 1,

    explanation: "意識がはっきりして、飲み込めるときだけ。意識障害がある場合は危険です。"

  },

  {

    type: "choice",

    title: "Q23. 体育館でリスクが上がりやすい理由は？",

    text: "いちばん近い理由を選ぼう。",

    choices: ["床が硬いから", "風通しが悪く熱がこもりやすいから", "音が大きいから", "ボールがあるから"],

    answer: 1,

    explanation: "風通しが悪いと熱が逃げにくく、湿度も上がりやすいです。"

  },

  {

    type: "choice",

    title: "Q24. 風（扇風機など）の役割は？",

    text: "いちばん近い効果を選ぼう。",

    choices: ["気温を必ず下げる", "汗の蒸発を助けて体温調整に役立つ", "水分が不要になる", "湿度を必ず下げる"],

    answer: 1,

    explanation: "風は汗の蒸発を助け、体温調整をサポートします。"

  },

  {

    type: "choice",

    title: "Q25. 直射日光を避ける工夫としてよいのは？",

    text: "いちばんよい選択肢を選ぼう。",

    choices: ["日陰ルートを選ぶ", "できるだけ日なたを歩く", "黒い帽子だけで十分", "水分を我慢して早歩き"],

    answer: 0,

    explanation: "日陰を選ぶと体に入る熱を減らしやすいです。"

  },

  {

    type: "choice",

    title: "Q26. 急に暑くなった日はなぜ注意？",

    text: "いちばん近い理由を選ぼう。",

    choices: ["体が暑さに慣れておらずリスクが上がりやすい", "汗が出ないので安全", "熱中症は起こらない", "関係ない"],

    answer: 0,

    explanation: "暑さに慣れていない時期は体温調整が追いつかないことがあります。"

  },

  {

    type: "choice",

    title: "Q27. 屋内で暑いと感じるときの考え方は？",

    text: "正しい考え方に近いものを選ぼう。",

    choices: ["我慢が基本", "無理せず冷房などで環境を整える", "扇風機だけで十分", "水を飲めば冷房はいらない"],

    answer: 1,

    explanation: "屋内でも熱中症は起こります。環境を整えることが重要です。"

  },

  {

    type: "choice",

    title: "Q28. 頭痛＋吐き気があるときの優先行動は？",

    text: "いちばん近い行動を選ぼう。",

    choices: ["一人で帰る", "すぐ涼しい場所で休み、周りに伝える", "気合で続ける", "水分を我慢する"],

    answer: 1,

    explanation: "中等度以上の可能性があります。周囲に伝えて休む・冷やすを優先します。"

  },

  {

    type: "choice",

    title: "Q29. 応急処置で危険なのはどれ？",

    text: "してはいけない対応を選ぼう。",

    choices: ["首を冷やす", "衣服をゆるめる", "意識がないのに水を飲ませる", "日陰へ移動する"],

    answer: 2,

    explanation: "意識がない人に飲ませると誤嚥の危険があります。"

  },

  {

    type: "choice",

    title: "Q30. 熱中症が疑われる人を一人にしない理由は？",

    text: "いちばん近い理由を選ぼう。",

    choices: ["退屈だから", "急に悪化することがあるから", "水が減るから", "汗が増えるから"],

    answer: 1,

    explanation: "急変の可能性があります。必ず周囲の助けを呼びましょう。"

  },

  {

    type: "choice",

    title: "Q31. 暑い日の移動で安全に近いのは？",

    text: "いちばん安全に近い行動を選ぼう。",

    choices: ["日なたの最短ルートで行く", "日陰ルート＋こまめな水分補給", "走って早く着く", "水分を我慢して歩く"],

    answer: 1,

    explanation: "日陰を選び、水分をこまめにとると負担を減らしやすいです。"

  },

  {

    type: "choice",

    title: "Q32. 体調が変なのに続けるのが危ない理由は？",

    text: "いちばん近いものを選ぼう。",

    choices: ["気合で治るから", "早めの対処を逃すと悪化しやすいから", "運が悪いだけ", "誰でも同じだから"],

    answer: 1,

    explanation: "初期サインを見逃すと短時間で悪化することがあります。"

  },

  {

    type: "choice",

    title: "Q33. 休憩場所としてよいのは？",

    text: "熱中症予防の休憩として適しているのはどれ？",

    choices: ["直射日光の下", "風通しのよい日陰や冷房のある場所", "蒸し暑い倉庫", "車内（エンジン停止）"],

    answer: 1,

    explanation: "日陰・冷房・風通しのよさがポイントです。"

  },

  {

    type: "choice",

    title: "Q34. 汗を多くかいた日は、何を意識する？",

    text: "より大事になりやすいものを選ぼう。",

    choices: ["水だけで十分", "水分＋塩分（電解質）", "何も飲まない", "甘いお菓子だけ"],

    answer: 1,

    explanation: "汗で塩分も失うので、水分だけだと不調が出ることがあります。"

  },

  {

    type: "choice",

    title: "Q35. 強い危険サインに近いのは？",

    text: "より危険度が高い状態を選ぼう。",

    choices: ["少し眠い", "意識がぼんやり・返事がおかしい", "少しお腹がすいた", "少し寒い"],

    answer: 1,

    explanation: "意識の異常は重症の可能性があります。すぐ大人に連絡し、救急判断を。"

  },

  {

    type: "choice",

    title: "Q36. ふらついて立てないときの対応は？",

    text: "正しい対応に近いものを選ぼう。",

    choices: ["一人で帰る", "周囲に助けを求めて休ませる", "運動して鍛える", "水分を我慢する"],

    answer: 1,

    explanation: "自力で動くのが危ない可能性があります。周囲に助けを求めましょう。"

  },

  {

    type: "choice",

    title: "Q37. 気温が高くなくても危険になりやすいのは？",

    text: "どれがリスクを上げやすい？",

    choices: ["湿度が高い", "風がある", "日陰が多い", "冷房が効いている"],

    answer: 0,

    explanation: "湿度が高いと汗が蒸発しにくく、体温が下がりにくくなります。"

  },

  {

    type: "choice",

    title: "Q38. 「周りに伝える」が大事な理由は？",

    text: "いちばん近い理由を選ぼう。",

    choices: ["話すと治るから", "一人では対応できないことがあるから", "恥ずかしいから", "ルールだから"],

    answer: 1,

    explanation: "悪化や転倒の危険があります。早めに助けを求めることが安全につながります。"

  },

  {

    type: "choice",

    title: "Q39. 応急処置の基本として正しいのは？",

    text: "冷やす以外に大切なこととして近いものを選ぼう。",

    choices: ["走らせて風を当てる", "涼しい場所へ移動して休ませる", "熱い飲み物を飲ませる", "日なたで寝かせる"],

    answer: 1,

    explanation: "涼しい場所へ移動し、休ませながら冷やすのが基本です。"

  },

  {

    type: "choice",

    title: "Q40. 夏の活動前のチェックとしてよいのは？",

    text: "いちばん良い習慣に近いものを選ぼう。",

    choices: ["寝不足でも気合で参加", "体調が微妙なら無理せず調整・相談", "朝食は抜く", "水分は活動後にまとめて"],

    answer: 1,

    explanation: "体調不良・寝不足はリスク要因です。無理せず調整し、必要なら周囲に相談しましょう。"

  }

];

// ==== このクイズで出す問題数 ====

const QUIZ_COUNT = 10;

// ==== 実際に出題する問題 ====

let questions = [];

// ==== DOM ====

let currentIndex = 0;

let correctCount = 0;

let quizArea;

let statusQuestion;

let statusScore;

let progressBar;

let stampArea;

// ==== シャッフル ====

function shuffle(arr) {

  const a = arr.slice();

  for (let i = a.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1));

    [a[i], a[j]] = [a[j], a[i]];

  }

  return a;

}

// ==== 40問から10問を重複なしで選ぶ ====

function pickRandomQuestions() {

  if (questionBank.length < QUIZ_COUNT) {

    throw new Error("問題数が足りません");

  }

  return shuffle(questionBank)

    .slice(0, QUIZ_COUNT)

    .map((q, idx) => ({

      ...q,

      title: q.title.replace(/^Q\d+\./, `Q${idx + 1}.`)

    }));

}

// ==== ヘルパー ====

function createEl(tag, className, text) {

  const el = document.createElement(tag);

  if (className) el.className = className;

  if (text !== undefined) el.textContent = text;

  return el;

}

function clearStamp() {

  if (stampArea) stampArea.innerHTML = "";

}

function showStamp() {

  if (!stampArea) return;

  stampArea.innerHTML = "";

  const stamp = createEl("div", "stamp", "💮");

  stampArea.appendChild(stamp);

  setTimeout(() => {

    clearStamp();

  }, 1000);

}

// ==== ステータス ====

function setStatusForStart() {

  statusQuestion.textContent = "スタート";

  statusScore.textContent = `全 ${questions.length} 問（ランダム）`;

  progressBar.style.width = "0%";

}

function setStatusForQuiz() {

  statusQuestion.textContent = `Q ${currentIndex + 1} / ${questions.length}`;

  statusScore.textContent = `正解数：${correctCount}`;

  const progress = (currentIndex / questions.length) * 100;

  progressBar.style.width = `${progress}%`;

}

function setStatusForResult() {

  statusQuestion.textContent = "結果";

  statusScore.textContent = `正解数：${correctCount} / ${questions.length}`;

  progressBar.style.width = "100%";

}

// ==== スタート画面 ====

function renderStart() {

  currentIndex = 0;

  correctCount = 0;

  clearStamp();

  setStatusForStart();

  quizArea.innerHTML = "";

  const title = createEl("p", "q-title", "熱中症クイズにチャレンジ！");

  const text = createEl(

    "p",

    "q-text",

    "40問の控えから、毎回ランダムで10問出題します。こたえを選んでチェックしよう！"

  );

  const pointList = createEl("ul", "start-points");

  [

    "のどが渇く前に水分をとる",

    "「なんかへん」は体のサイン",

    "無理せず、休む・伝えるが大事"

  ].forEach((item) => {

    const li = createEl("li", "", item);

    pointList.appendChild(li);

  });

  const btnWrap = createEl("div", "btn-wrap");

  const startBtn = createEl("button", "btn-next", "▶ クイズを始める");

  startBtn.type = "button";

  startBtn.addEventListener("click", () => {

    currentIndex = 0;

    correctCount = 0;

    clearStamp();

    renderQuestion();

  });

  const rerollBtn = createEl("button", "btn-next small", "🔄 10問を引き直す");

  rerollBtn.type = "button";

  rerollBtn.addEventListener("click", () => {

    questions = pickRandomQuestions();

    setStatusForStart();

    alert("10問を引き直しました！");

  });

  btnWrap.appendChild(startBtn);

  btnWrap.appendChild(rerollBtn);

  quizArea.appendChild(title);

  quizArea.appendChild(text);

  quizArea.appendChild(pointList);

  quizArea.appendChild(btnWrap);

}

// ==== 問題描画 ====

function renderQuestion() {

  const q = questions[currentIndex];

  clearStamp();

  setStatusForQuiz();

  quizArea.innerHTML = "";

  const qTitle = createEl("p", "q-title", q.title);

  const qText = createEl("p", "q-text", q.text);

  const choicesWrap = createEl("div", "choices-area");

  q.choices.forEach((choiceText, idx) => {

    const btn = createEl("button", "choice-btn");

    btn.type = "button";

    const labelSpan = createEl("span", "choice-label", ["A", "B", "C", "D", "E", "F"][idx] || String(idx + 1));

    const textSpan = createEl("span", "choice-text", choiceText);

    btn.appendChild(labelSpan);

    btn.appendChild(textSpan);

    btn.addEventListener("click", () => handleAnswer(idx, choicesWrap));

    choicesWrap.appendChild(btn);

  });

  quizArea.appendChild(qTitle);

  quizArea.appendChild(qText);

  quizArea.appendChild(choicesWrap);

}

// ==== 回答処理 ====

function handleAnswer(selectedIndex, choicesWrap) {

  const q = questions[currentIndex];

  const allButtons = choicesWrap.querySelectorAll(".choice-btn");

  if (choicesWrap.querySelector(".disabled")) return;

  allButtons.forEach((btn) => btn.classList.add("disabled"));

  const selectedBtn = allButtons[selectedIndex];

  const correctBtn = allButtons[q.answer];

  const isCorrect = selectedIndex === q.answer;

  if (isCorrect) {

    correctCount++;

    selectedBtn.classList.add("correct");

    showStamp();

  } else {

    selectedBtn.classList.add("wrong");

    correctBtn.classList.add("correct");

  }

  const box = createEl("div", `result-box ${isCorrect ? "result-ok" : "result-ng"}`);

  const titleSpan = createEl("div", "title", isCorrect ? "✅ 正解！" : "❌ 不正解…");

  const msg = createEl("p", "", q.explanation);

  msg.style.margin = "4px 0 0";

  box.appendChild(titleSpan);

  box.appendChild(msg);

  quizArea.appendChild(box);

  const nextBtn = createEl(

    "button",

    "btn-next",

    currentIndex === questions.length - 1 ? "結果を見る" : "つぎの問題へ"

  );

  nextBtn.type = "button";

  nextBtn.addEventListener("click", () => {

    currentIndex++;

    if (currentIndex >= questions.length) {

      showResult();

    } else {

      renderQuestion();

    }

  });

  quizArea.appendChild(nextBtn);

}

// ==== 結果画面 ====

function showResult() {

  clearStamp();

  setStatusForResult();

  quizArea.innerHTML = "";

  const scoreRate = correctCount / questions.length;

  let titleText = "";

  let summary = "";

  if (scoreRate >= 0.8) {

    titleText = "🌟 すばらしい！ 熱中症マスター級";

    summary = "基本がかなり身についています。周りにも声をかけられると最高です。";

  } else if (scoreRate >= 0.5) {

    titleText = "👍 なかなか良い！ もう一歩レベルアップ";

    summary = "大事なポイントは理解できています。間違えた問題を見直すとさらに強くなれます。";

  } else {

    titleText = "⚠️ これから身につけていこう";

    summary = "まずは『こまめに飲む』『無理しない』『早めに伝える』を意識しよう。";

  }

  const title = createEl("p", "q-title", titleText);

  const text = createEl("p", "q-text", `正解数は ${correctCount} / ${questions.length} 問 でした。`);

  const detail = createEl("p", "q-text", summary);

  const btnWrap = createEl("div", "btn-wrap");

  const retryBtn = createEl("button", "btn-next small", "もう一度（別の10問）");

  retryBtn.type = "button";

  retryBtn.addEventListener("click", () => {

    questions = pickRandomQuestions();

    currentIndex = 0;

    correctCount = 0;

    renderQuestion();

  });

  const backBtn = createEl("button", "btn-next small", "タイトルにもどる");

  backBtn.type = "button";

  backBtn.addEventListener("click", renderStart);

  btnWrap.appendChild(retryBtn);

  btnWrap.appendChild(backBtn);

  quizArea.appendChild(title);

  quizArea.appendChild(text);

  quizArea.appendChild(detail);

  quizArea.appendChild(btnWrap);

}

// ==== 初期化 ====

document.addEventListener("DOMContentLoaded", () => {

  quizArea = document.getElementById("quiz-area");

  statusQuestion = document.getElementById("status-question");

  statusScore = document.getElementById("status-score");

  progressBar = document.getElementById("progress-bar");

  stampArea = document.getElementById("stamp-area");

  questions = pickRandomQuestions();

  renderStart();

});
 
