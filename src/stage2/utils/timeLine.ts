const interval = 10;

class TimeLine {
  private nextPromise: Promise<void>;
  private nextSendPromise: Promise<void>;

  private timer: number;

  constructor() {
    let rs: () => void;
    let r: () => void;

    this.nextSendPromise = new Promise(resolve => (rs = resolve));
    this.nextPromise = new Promise(resolve => (r = resolve));

    this.timer = setInterval(() => {
      rs();
      r();
      this.nextSendPromise = new Promise(resolve => (rs = resolve));
      this.nextPromise = new Promise(resolve => (r = resolve));
    }, interval);
  }

  next() {
    return this.nextPromise;
  }
  nextSend() {
    return this.nextSendPromise;
  }

  destroy() {
    clearInterval(this.timer);
    this.timer = 0;
  }
}

export const timeLine = new TimeLine();
