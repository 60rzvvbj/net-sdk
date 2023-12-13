export type NetworkCableState = 0 | 1;

export type NetworkCableStateCallback = (state: NetworkCableState) => void;

export enum NetworkCableEnd {
  First = 'First',
  Second = 'Second',
}

export interface NetworkCableLinkContext {
  changeState: (state: NetworkCableState) => void;
  onStateChange: (cb: NetworkCableStateCallback) => void;
  unlink: () => void;
}

// 网线
export class NetworkCable {
  private state: NetworkCableState;
  private linked1: boolean;
  private linked2: boolean;
  private cb1: NetworkCableStateCallback | null;
  private cb2: NetworkCableStateCallback | null;

  constructor() {
    this.state = 0;
    this.linked1 = false;
    this.linked2 = false;
    this.cb1 = null;
    this.cb2 = null;
  }

  private link1() {
    if (this.linked1) {
      return null;
    }
    this.linked1 = true;
    return {
      changeState: (state: NetworkCableState) => {
        this.state = state;
        this.cb2?.(this.state);
      },
      onStateChange: (cb: NetworkCableStateCallback) => {
        this.cb1 = cb;
      },
      unlink: () => {
        this.linked1 = false;
        this.cb1 = null;
      },
    };
  }

  private link2() {
    if (this.linked2) {
      return null;
    }
    this.linked2 = true;
    return {
      changeState: (state: NetworkCableState) => {
        this.state = state;
        this.cb1?.(this.state);
      },
      onStateChange: (cb: NetworkCableStateCallback) => {
        this.cb2 = cb;
      },
      unlink: () => {
        this.linked2 = false;
        this.cb2 = null;
      },
    };
  }

  link(end: NetworkCableEnd): NetworkCableLinkContext | null {
    if (end === NetworkCableEnd.First) {
      return this.link1();
    } else {
      return this.link2();
    }
  }
}
