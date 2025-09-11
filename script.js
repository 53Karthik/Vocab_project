const data = [
  {
    date: "10/09/2025",
    cards: [
      { word: "Accomplish", phonetic: "[əˈkʌmplɪʃ]", meaning: "To succeed in doing something.", sentence: "She was able to accomplish her goals on time." },
      { word: "Benevolent", phonetic: "[bəˈnɛvələnt]", meaning: "Well meaning and kindly.", sentence: "The benevolent leader helped many people." },
      { word: "Concur", phonetic: "[kənˈkɜːr]", meaning: "To agree with someone.", sentence: "Experts concur on the importance of the policy." },
      { word: "Diligent", phonetic: "[ˈdɪlɪdʒənt]", meaning: "Showing care and effort in work or duties.", sentence: "She was diligent in her studies." },
      { word: "Emulate", phonetic: "[ˈɛmjʊleɪt]", meaning: "To try to equal or excel.", sentence: "He tries to emulate his favorite athlete." },
      { word: "Fortify", phonetic: "[ˈfɔːrtɪfaɪ]", meaning: "To strengthen or secure.", sentence: "They fortified the castle walls." },
      { word: "Gratify", phonetic: "[ˈɡrætɪfaɪ]", meaning: "To please or satisfy.", sentence: "Her achievements gratified her family." },
      { word: "Heed", phonetic: "[hiːd]", meaning: "To pay attention to advice or warnings.", sentence: "You should heed the teacher’s instructions." },
      { word: "Impart", phonetic: "[ɪmˈpɑːrt]", meaning: "To make information known.", sentence: "Teachers impart knowledge to students." },
      { word: "Jovial", phonetic: "[ˈdʒoʊviəl]", meaning: "Cheerful and friendly.", sentence: "He was in a jovial mood at the party." }
    ]},
  
 { date: "11/09/2025",
    cards: [
      { word: "Keen", phonetic: "[kiːn]", meaning: "Having a sharp edge or point; eager.", sentence: "I have a keen interest in psychology." },
      { word: "Luminous", phonetic: "[ˈluːmɪnəs]", meaning: "Emitting light; bright.", sentence: "The luminous stars lit up the night sky." },
      { word: "Meticulous", phonetic: "[məˈtɪkjʊləs]", meaning: "Showing great attention to detail.", sentence: "She is meticulous in her work." },
      { word: "Nurture", phonetic: "[ˈnɜːrtʃər]", meaning: "To care for and encourage growth.", sentence: "Parents nurture their children." },
      { word: "Obsolete", phonetic: "[ˈɒbsəliːt]", meaning: "No longer in use; out of date.", sentence: "Typewriters are now obsolete." },
      { word: "Prudent", phonetic: "[ˈpruːdnt]", meaning: "Acting with or showing care and thought for the future.", sentence: "It is prudent to save money for emergencies." },
      { word: "Quaint", phonetic: "[kweɪnt]", meaning: "Attractively unusual or old-fashioned.", sentence: "The village has many quaint cottages." },
      { word: "Resilient", phonetic: "[rɪˈzɪliənt]", meaning: "Able to recover quickly from difficulties.", sentence: "Children are often very resilient." },
      { word: "Scrutinize", phonetic: "[ˈskruːtənaɪz]", meaning: "To examine closely and thoroughly.", sentence: "The detective scrutinized the evidence." },
      { word: "Serene", phonetic: "[]", meaning: "Calm, peaceful and untroubled; tranquil.\nAn expanse of clear sky or calm sea.", sentence: "Her eyes were closed and she looked very serene.\nNot a cloud obscured the deep serene."}

          ]}];

let username = "";
let progress = {};
let currentDateIdx = 0;
let currentCardIdx = 0;

function saveProgress() {
  localStorage.setItem("vocab_progress_" + username, JSON.stringify(progress));
}

function loadProgress() {
  const raw = localStorage.getItem("vocab_progress_" + username);
  if (raw) progress = JSON.parse(raw);
  else progress = {};
}

function updateCatalog() {
  const dateList = document.getElementById("date-list");
  dateList.innerHTML = "";
  data.forEach((day, idx) => {
    const li = document.createElement("li");
    li.textContent = day.date;
    li.className = idx === currentDateIdx ? "active" : "";
    let dayProg = (progress[day.date] || []).length;
    let total = day.cards.length;
    const progSpan = document.createElement("span");
    progSpan.className = "progress";
    progSpan.textContent = `${dayProg}/${total}`;
    if (dayProg === total && total > 0) {
      const tick = document.createElement("span");
      tick.className = "done";
      tick.textContent = "✓";
      progSpan.appendChild(tick);
    }
    li.appendChild(progSpan);
    li.addEventListener("click", () => {
      currentDateIdx = idx;
      currentCardIdx = 0;
      updateCatalog();
      updateCard();
    });
    dateList.appendChild(li);
  });
}

function markReviewed() {
  const dateObj = data[currentDateIdx];
  const cardObj = dateObj.cards[currentCardIdx];
  if (!progress[dateObj.date]) progress[dateObj.date] = [];
  const reviewedWords = progress[dateObj.date];
  if (!reviewedWords.includes(cardObj.word)) {
    reviewedWords.push(cardObj.word);
    saveProgress();
  }
  updateCatalog();
}

function updateCard() {
  const dateObj = data[currentDateIdx];
  const cardObj = dateObj.cards[currentCardIdx];
  document.getElementById("word").textContent = cardObj.word;
  document.getElementById("phonetic").textContent = cardObj.phonetic || "";
  document.getElementById("meaning").textContent = cardObj.meaning;
  document.getElementById("sentence").textContent = cardObj.sentence;
  document.getElementById("date-label").textContent = dateObj.date;
  document.getElementById("catalog-text").textContent = `${currentCardIdx + 1}/${dateObj.cards.length}`;
  document.getElementById("prev-btn").disabled = currentCardIdx === 0;
  document.getElementById("next-btn").disabled = currentCardIdx === dateObj.cards.length - 1;
  markReviewed();
}

document.getElementById("prev-btn").addEventListener("click", function () {
  if (currentCardIdx > 0) {
    currentCardIdx--;
    updateCard();
  }
});

document.getElementById("next-btn").addEventListener("click", function () {
  if (currentCardIdx < data[currentDateIdx].cards.length - 1) {
    currentCardIdx++;
    updateCard();
  }
});

document.getElementById("user-form").addEventListener("submit", function (e) {
  e.preventDefault();
  username = document.getElementById("username").value.trim();
  if (!username) return;
  document.getElementById("user-form").style.display = "none";
  document.getElementById("main-content").style.display = "block";
  loadProgress();
  updateCatalog();
  updateCard();
});

