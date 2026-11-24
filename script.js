
const root = document.documentElement;
const clockEl = document.getElementById("clock");
const yearEl = document.getElementById("year");
const statCount = document.getElementById("statCount");
const statTime = document.getElementById("statTime");
const statWidth = document.getElementById("statWidth");

const stored = localStorage.getItem("aurora-theme");
if (stored) root.dataset.theme = stored;

document.getElementById("themeToggle").addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  localStorage.setItem("aurora-theme", next);
});

const pad = (n) => String(n).padStart(2, "0");
function tickClock() {
  const d = new Date();
  clockEl.textContent = pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
}
tickClock();
setInterval(tickClock, 1000);

const startedAt = Date.now();
setInterval(() => {
  statTime.textContent = ((Date.now() - startedAt) / 1000).toFixed(1) + "s";
}, 100);

function readWidth() { statWidth.textContent = window.innerWidth + "px"; }
readWidth();
window.addEventListener("resize", readWidth);

const counterValue = document.getElementById("counterValue");
let count = 0;
let clicks = 0;

function renderCount(bump) {
  counterValue.textContent = count;
  statCount.textContent = clicks;
  if (bump) {
    counterValue.classList.add("bump");
    setTimeout(() => counterValue.classList.remove("bump"), 180);
  }
}

document.getElementById("inc").addEventListener("click", () => { count++; clicks++; renderCount(true); });
document.getElementById("dec").addEventListener("click", () => { count--; clicks++; renderCount(true); });
document.getElementById("reset").addEventListener("click", () => { count = 0; clicks++; renderCount(true); });

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add("in"), i * 90);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const form = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const formMsg = document.getElementById("formMsg");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  formMsg.classList.remove("error");
  nameInput.classList.remove("invalid");
  emailInput.classList.remove("invalid");

  if (nameInput.value.trim().length < 2) {
    nameInput.classList.add("invalid");
    formMsg.textContent = "Please type your name first.";
    formMsg.classList.add("error");
    nameInput.focus();
    return;
  }

  if (!emailPattern.test(emailInput.value.trim())) {
    emailInput.classList.add("invalid");
    formMsg.textContent = "That email doesn't look right.";
    formMsg.classList.add("error");
    emailInput.focus();
    return;
  }

  formMsg.textContent = "Thanks, " + nameInput.value.trim() + " - your message was accepted.";
  form.reset();
});

yearEl.textContent = new Date().getFullYear();
