export class Timer {
  /**
   * @type {"ideal" | "running" | "paused" | "finished"}
   */
  state = "ideal";
  /**
   *
   * @param {number} countdown
   * @param {(balance: number, countdown, number) => void} callback
   */
  constructor(countdown, callback) {
    this.countdown = countdown;

    this.interval = null;
    this.callback = callback;
    callback(countdown, countdown);
  }

  start() {
    if (this.state === "ideal") {
      this.timer = Date.now() + this.countdown;
    }
    if (this.state === "paused") {
      this.timer = Date.now() + this.distance;
    }
    this.state = "running";
    this.interval = setInterval(() => {
      const distance = this.timer - Date.now();
      this.distance = distance;
      this.callback(distance, this.countdown);
      if (distance <= 0) {
        this.state = "finished";
        clearInterval(this.interval);
        return;
      }
    }, 100);
  }

  stop() {
    this.state = "paused";
    clearInterval(this.interval);
  }

  restart() {
    this.state = "ideal";
    this.callback(this.countdown, this.countdown);
  }
}
