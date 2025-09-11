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
    ]
  },
  {
    date: "11/09/2025",
    cards: [
      { word: "Keen", phonetic: "[kiːn]", meaning: "Having a sharp edge or point; eager.", sentence: "I have a keen interest in psychology." },
      { word: "Luminous", phonetic: "[ˈluːmɪnəs]", meaning: "Emitting light; bright.", sentence: "The luminous stars lit up the night sky." },
      { word: "Meticulous", phonetic: "[məˈtɪkjʊləs]", meaning: "Showing great attention to detail.", sentence: "She is meticulous in her work." },
      { word: "Nurture", phonetic: "[ˈnɜːrtɚ]", meaning: "To care for and encourage growth.", sentence: "Parents nurture their children." },
      { word: "Obsolete", phonetic: "[ˌɑbsəˈlit]", meaning: "No longer in use; out of date.", sentence: "Typewriters are now obsolete." },
      { word: "Prudent", phonetic: "[ˈpruːdənt]", meaning: "Acting with care for the future.", sentence: "It is prudent to save money for emergencies." },
      { word: "Quaint", phonetic: "[kweɪnt]", meaning: "Attractively unusual or old-fashioned.", sentence: "The village has many quaint cottages." },
      { word: "Resilient", phonetic: "[rɪˈzɪljənt]", meaning: "Able to recover quickly.", sentence: "Children are very resilient." },
      { word: "Scrutinize", phonetic: "[ˈskruːtəˌnaɪz]", meaning: "To examine closely.", sentence: "The detective scrutinized the evidence." },
      { word: "Serene", phonetic: "[səˈriːn]", meaning: "Calm, peaceful, and tranquil.\nAn expanse of clear sky or calm sea.", sentence: "Her eyes were closed and she looked very serene.\nNot a cloud obscured the deep serene." }
    ]
  }
];

let username = "";
let progress = {};
let currentDateIdx = 0;
let currentCardIdx = 0;

// Ensure no duplicates in progress arrays before saving
function saveProgress() {
  for (const date in progress) {
    if (Array.isArray(progress[date])) {
      progress[date] = [...new Set(progress[date])];
    }
  }
  localStorage.setItem('vocab_progress_' + username, JSON.stringify(progress));
}

// Load and sanitize progress from localStorage
function loadProgress() {
  const raw = localStorage.getItem('vocab_progress_' + username);
  if (raw) {
    progress = JSON.parse(raw);
    for (const date in progress) {
      if (Array.isArray(progress[date])) {
        progress[date] = [...new Set(progress[date])];
      }
    }
  } else {
    progress = {};
  }
}

// Update the catalog panel with dates and progress
function updateCatalog() {
  const catalog = document.getElementById('catalog');
  const list = document.getElementById('date-list');
  list.innerHTML = '';
  data.forEach((day, idx) => {
    const li = document.createElement('li');
    li.textContent = day.date;
    li.className = idx === currentDateIdx ? 'active' : '';
    const reviewed = progress[day.date] || [];
    const uniqueReviewed = [...new Set(reviewed)];
    const progressSpan = document.createElement('span');
    progressSpan.className = 'progress';
    progressSpan.textContent = `${uniqueReviewed.length}/${day.cards.length}`;
    if (uniqueReviewed.length === day.cards.length) {
      const tick = document.createElement('span');
      tick.className = 'done';
      tick.textContent = '✓';
      progressSpan.appendChild(tick);
    }
    li.appendChild(progressSpan);
    li.addEventListener('click', () => {
      currentDateIdx = idx;
      currentCardIdx = 0;
      updateCatalog();
      updateCard();
    });
    list.appendChild(li);
  });
}

// Mark current card as reviewed (if not already)
function markReviewed() {
  const day = data[currentDateIdx];
  const word = day.cards[currentCardIdx].word;
  if (!progress[day.date]) progress[day.date] = [];
  if (!progress[day.date].includes(word)) {
    progress[day.date].push(word);
    saveProgress();
  }
  updateCatalog();
}

// Helper to render multi-line strings with proper <br>
function renderMultiline(text) {
  if (!text) return '';
  return text.replace(/\n/g, '<br>');
}

// Show the current flashcard's data on screen
function updateCard() {
  const day = data[currentDateIdx];
  const card = day.cards[currentCardIdx];

  document.getElementById('word').textContent = card.word;
  document.getElementById('phonetic').textContent = card.phonetic || '';
  document.getElementById('meaning').innerHTML = renderMultiline(card.meaning);
  document.getElementById('sentence').innerHTML = renderMultiline(card.sentence);

  document.getElementById('date-label').textContent = day.date;
  document.getElementById('catalog-text').textContent = `${currentCardIdx + 1}/${day.cards.length}`;

  document.getElementById('prev-btn').disabled = currentCardIdx === 0;
  document.getElementById('next-btn').disabled = currentCardIdx === day.cards.length - 1;

  markReviewed();
}

document.getElementById('prev-btn').addEventListener('click', () => {
  if (currentCardIdx > 0) {
    currentCardIdx--;
    updateCard();
  }
});

document.getElementById('next-btn').addEventListener('click', () => {
  const day = data[currentDateIdx];
  if (currentCardIdx < day.cards.length - 1) {
    currentCardIdx++;
    updateCard();
  }
});

document.getElementById('user-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('username').value.trim();
  if (!input) return;
  username = input;
  document.getElementById('user-form').style.display = 'none';
  document.getElementById('main-content').style.display = 'block';
  loadProgress();
  updateCatalog();
  updateCard();
});

