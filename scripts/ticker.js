export class Ticker {
  tickMain = document.createElement("span");
  tickSlider = document.createElement("span");
  ticker = document.createElement("span");
  /**
   *
   * @param {number} initialValue
   * @param {HTMLElement} parentElement
   * @param {(val: number) => number} nextValueCallback
   */
  constructor(initialValue = 0, parentElement, nextValueCallback) {
    this.value = initialValue;
    this.parentElement = parentElement;
    this.nextValueCallback = nextValueCallback;
    this.#privateInitElements();
  }

  #privateInitElements() {
    this.tickMain.textContent = this.value;
    this.tickSlider.textContent = this.value;

    this.ticker.classList.add("ticker");
    this.tickMain.classList.add("ticker-item", "ticker-main");
    this.tickSlider.classList.add("ticker-item", "ticker-slider");
    this.ticker.appendChild(this.tickMain);
    this.ticker.appendChild(this.tickSlider);
    this.parentElement.appendChild(this.ticker);

    this.tickMain.addEventListener(
      "animationend",
      this.#privateTickerMainAnimationEnd.bind(this)
    );
  }

  #privateTickerMainAnimationEnd() {
    this.tickMain.textContent = this.value;
    this.tickMain.classList.remove("ticker-item-animation");
    this.tickSlider.classList.remove("ticker-item-animation");
  }

  /**
   *
   * @param {number} value
   */
  tick(value) {
    if (this.value === value) return;
    this.#privateSetNext(value);
    this.value = value;
    this.tickMain.classList.add("ticker-item-animation");
    this.tickSlider.classList.add("ticker-item-animation");
  }

  /**
   *
   * @param {number} value
   */
  #privateSetNext(value) {
    this.tickSlider.textContent = value;
  }
}
