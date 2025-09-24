// Quiz Questions
const quizData = [
  {
    question: "What does HTML stand for?",
    a: "Hyper Text Markup Language",
    b: "Home Tool Markup Language",
    c: "Hyperlinks and Text Markup Language",
    d: "Hyperlinking Textual Management Language",
    correct: "a",
  },
  {
    question: "Which language is used for styling web pages?",
    a: "HTML",
    b: "CSS",
    c: "Python",
    d: "Java",
    correct: "b",
  },
  {
    question: "Which is the scripting language?",
    a: "HTML",
    b: "CSS",
    c: "JavaScript",
    d: "SQL",
    correct: "c",
  }
];

// DOM Elements
const authContainer = document.getElementById("auth-container");
const signupContainer = document.getElementById("signup-container");
const quizContainer = document.getElementById("quiz-container");
const answerEls = document.querySelectorAll(".answer");
const questionEl = document.getElementById("question");
const a_text = document.getElementById("a_text");
const b_text = document.getElementById("b_text");
const c_text = document.getElementById("c_text");
const d_text = document.getElementById("d_text");
const submitBtn = document.getElementById("submit");
const progress = document.getElementById("progress");
const timeEl = document.getElementById("time");
const leaderboardEl = document.getElementById("leaderboard");
const leaderboardList = document.getElementById("leaderboard-list");

let currentQuiz = 0;
let score = 0;
let timeLeft = 15;
let timer;

// ------------------ AUTH ------------------
function toggleAuth(mode) {
  if (mode === "signup") {
    authContainer.style.display = "none";
    signupContainer.style.display = "block";
  } else {
    signupContainer.style.display = "none";
    authContainer.style.display = "block";
  }
}

function signup() {
  const newUsername = document.getElementById("newUsername").value.trim();
  const newPassword = document.getElementById("newPassword").value.trim();

  if (!newUsername || !newPassword) {
    alert("Please fill all fields");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.find(u => u.username === newUsername)) {
    alert("Username already exists");
    return;
  }

  users.push({ username: newUsername, password: newPassword });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Signup successful! Please login now.");
  toggleAuth("login");
}

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let user = users.find(u => u.username === username && u.password === password);

  if (user) {
    localStorage.setItem("currentUser", username);
    authContainer.style.display = "none";
    quizContainer.style.display = "block";
    loadQuiz();
  } else {
    alert("Invalid credentials");
  }
}

function logout() {
  localStorage.removeItem("currentUser");
  location.reload();
}

// ------------------ QUIZ ------------------
function loadQuiz() {
  deselectAnswers();
  const currentQuizData = quizData[currentQuiz];
  questionEl.innerText = currentQuizData.question;
  a_text.innerText = currentQuizData.a;
  b_text.innerText = currentQuizData.b;
  c_text.innerText = currentQuizData.c;
  d_text.innerText = currentQuizData.d;

  progress.style.width = `${((currentQuiz + 1) / quizData.length) * 100}%`;

  clearInterval(timer);
  timeLeft = 15;
  timeEl.innerText = timeLeft;
  timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
  timeLeft--;
  timeEl.innerText = timeLeft;
  if (timeLeft === 0) {
    clearInterval(timer);
    nextQuestion();
  }
}

function deselectAnswers() {
  answerEls.forEach(el => (el.checked = false));
}

function getSelected() {
  let answer;
  answerEls.forEach(el => {
    if (el.checked) answer = el.id;
  });
  return answer;
}

submitBtn.addEventListener("click", () => {
  const answer = getSelected();
  if (answer) {
    if (answer === quizData[currentQuiz].correct) score++;
    nextQuestion();
  }
});

function nextQuestion() {
  currentQuiz++;
  if (currentQuiz < quizData.length) {
    loadQuiz();
  } else {
    showResult();
  }
}

function showResult() {
  clearInterval(timer);
  quizContainer.innerHTML = `
    <div class="card result">
      <h2>You scored ${score}/${quizData.length}</h2>
      <p>${Math.round((score / quizData.length) * 100)}% correct</p>
      <button onclick="saveScore()">Save Score</button>
      <button onclick="location.reload()">Play Again</button>
    </div>
  `;
}

function saveScore() {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) return;

  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.push({ name: currentUser, score });
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 5);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  showLeaderboard();
}

function showLeaderboard() {
  quizContainer.style.display = "none";
  leaderboardEl.style.display = "block";

  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboardList.innerHTML = "";
  leaderboard.forEach((entry) => {
    const li = document.createElement("li");
    li.innerText = `${entry.name} - ${entry.score}`;
    leaderboardList.appendChild(li);
  });
}
