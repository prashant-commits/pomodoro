import {
  getFont,
  getPrimaryColor,
  FONTS,
  PRIMARY_COLORS,
  defaultSettings,
} from "./utils.js";
import { Ticker } from "./ticker.js";
import { Timer } from "./timer.js";

let timer = null;
const splashScreen = document.querySelector(".splash-screen");
const settingsButton = document.querySelector(".settings-btn");
const settingsModal = document.querySelector(".settings-modal");
const modalCloseButton = settingsModal.querySelector(".modal-close-btn");
const settingsForm = settingsModal.querySelector(".settings-form");
const durationInputs = settingsForm.querySelectorAll(
  ".form-item .duration input[type=number]"
);
const tabs = document.querySelectorAll(".tabs input[name=tab");

settingsForm.addEventListener("submit", function (event) {
  event.preventDefault();
  var formData = new FormData(event.target);
  const settings = {
    pomodoroTime: parseInt(formData.get("pomodoroTime")),
    shortBreakTime: parseInt(formData.get("shortBreakTime")),
    longBreakTime: parseInt(formData.get("longBreakTime")),
    font: formData.get("font"),
    primaryColor: formData.get("color"),
  };
  const settingsEvent = new CustomEvent("settingsChanged", {
    detail: settings,
  });
  window.dispatchEvent(settingsEvent);
  modalCloseButton.click();
});

durationInputs.forEach((input) => {
  input.addEventListener("beforeinput", function (event) {
    const valueBeforeInput = event.target.value;
    event.target.addEventListener(
      "input",
      () => {
        const value = parseInt(event.target.value);
        if (value < 1 || value > 99 || isNaN(value)) {
          event.target.value = valueBeforeInput;
        }
      },
      { once: true }
    );
  });
});

settingsButton.addEventListener("click", function () {
  setFormValues();
  settingsModal.showModal();
});

modalCloseButton.addEventListener("click", function () {
  settingsModal.classList.add("animate-close");
  settingsModal.addEventListener(
    "animationend",
    function () {
      settingsModal.classList.remove("animate-close");
      settingsModal.close();
    },
    { once: true }
  );
});

window.addEventListener("settingsChanged", function (event) {
  const prevSettings = getSettings();
  const settings = event.detail;
  const body = document.documentElement;

  if (!settings) {
    throw new Error("Settings not found");
  }

  localStorage.setItem("settings", JSON.stringify(settings));
  body.style.setProperty("--font-family", getFont(settings.font));
  body.style.setProperty(
    "--primary-color",
    getPrimaryColor(settings.primaryColor)
  );
  tabs.forEach((tabInput) => {
    if (tabInput.checked) {
      if(prevSettings[tabInput.value] === settings[tabInput.value] && timer) return;
      const countdown = settings[tabInput.value] * 60 * 1000;
      timer = new Timer(countdown, caller);
    }
  });
});

window.addEventListener("DOMContentLoaded", function () {
  const settings = getSettings();
  const settingsEvent = new CustomEvent("settingsChanged", {
    detail: settings,
  });
  window.dispatchEvent(settingsEvent);
  splashScreen.addEventListener("transitionend", function () {
    splashScreen.remove();
  });
  splashScreen.style.transform = "translateY(-100vh)";
});

/**
 *
 * @return {{pomodoroTime: number;shortBreakTime: number;longBreakTime: number;font: string;primaryColor: string;}}
 */
const getSettings = () => {
  let settings = JSON.parse(localStorage.getItem("settings"));
  if (!settings) {
    settings = defaultSettings;
  }
  return settings;
};
const setFormValues = () => {
  const settings = getSettings();
  const pomodoroDurationInput = settingsForm.querySelector(
    ".pomodoro-duration input"
  );
  const shortBreakDurationInput = settingsForm.querySelector(
    ".short-break-duration input"
  );
  const longBreakDurationInput = settingsForm.querySelector(
    ".long-break-duration input"
  );
  const fontInputs = settingsForm.querySelectorAll(
    ".fonts-group input[name=font]"
  );
  const colorInputs = settingsForm.querySelectorAll(
    ".colors-group input[name=color]"
  );
  pomodoroDurationInput.setAttribute("value", settings.pomodoroTime);
  pomodoroDurationInput.value = settings.pomodoroTime;
  shortBreakDurationInput.setAttribute("value", settings.shortBreakTime);
  shortBreakDurationInput.value = settings.shortBreakTime;
  longBreakDurationInput.setAttribute("value", settings.longBreakTime);
  longBreakDurationInput.value = settings.longBreakTime;
  fontInputs.forEach((input) => {
    if (input.value === settings.font) {
      input.checked = true;
    }
  });
  colorInputs.forEach((input) => {
    if (input.value === settings.primaryColor) {
      input.checked = true;
    }
  });
};

const countdownContainer = document.querySelector(".countdown");
const timeDisplay = countdownContainer.querySelector(".time-display");
const seconds2Display = timeDisplay.querySelector(".seconds2");
const seconds1Display = timeDisplay.querySelector(".seconds1");
const minutes2Display = timeDisplay.querySelector(".minutes2");
const minutes1Display = timeDisplay.querySelector(".minutes1");
const controlButton = countdownContainer.querySelector(".control-btn");

const seconds2Ticker = new Ticker(0, seconds2Display);
const seconds1Ticker = new Ticker(0, seconds1Display);
const minutes2Ticker = new Ticker(0, minutes2Display);
const minutes1Ticker = new Ticker(0, minutes1Display);

const circumference = 2 * Math.PI * 46;

const caller = (distance = 0, countdown = 0) => {
  if (distance <= 0) {
    distance = 0;
    controlButton.textContent = "RESTART";
  }
  countdownContainer.style.setProperty(
    "--circumference-offset",
    (distance / countdown) * circumference
  );
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
  seconds2Ticker.tick(seconds % 10);
  seconds1Ticker.tick(Math.floor(seconds / 10));
  minutes2Ticker.tick(minutes % 10);
  minutes1Ticker.tick(Math.floor(minutes / 10));
};

tabs.forEach((tabInput) => {
  tabInput.addEventListener("change", function tabChangeCallback(event) {
    if (timer.state === "running") {
      return;
    }
    const settings = getSettings();
    const countdown = settings[event.target.value] * 60 * 1000;
    timer = new Timer(countdown, caller);
  });
});

controlButton.addEventListener("click", function () {
  if(!timer) return;
  if (timer.state === "finished") {
    timer.restart();
    controlButton.textContent = "START";
  } else if (timer.state === "running") {
    timer.stop();
    controlButton.textContent = "START";
  } else {
    timer.start();
    controlButton.textContent = "PAUSE";
  }
});
