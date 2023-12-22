import { PromiseContext, getPromise } from '../utils/promise';

export enum NetworkCableState {
  High = 'High',
  Low = 'Low',
}

// 网线
export class NetworkCable {
  private state: NetworkCableState;
  private statePromise: PromiseContext<NetworkCableState>;
  private changeStateList: { p: PromiseContext<boolean>; v: NetworkCableState }[] = [];

  constructor(frequency: number, accuracy: number) {
    this.state = NetworkCableState.Low;
    this.statePromise = getPromise<NetworkCableState>();

    setInterval(() => {
      const resolve = this.statePromise.resolve;
      this.statePromise = getPromise<NetworkCableState>();
      if (this.changeStateList.length > 0) {
        let random = Math.floor(Math.random() * this.changeStateList.length);
        let state = this.changeStateList[random].v;
        for (let i = 0; i < this.changeStateList.length; i++) {
          this.changeStateList[i].p.resolve(i === random);
        }
        if (Math.random() < accuracy) {
          this.state = state;
        }
        this.changeStateList = [];
      }
      resolve(this.state);
    }, frequency);
  }

  async changeState(state: NetworkCableState) {
    const p = getPromise<boolean>();
    this.changeStateList.push({ p, v: state });
    return p.promise;
  }

  async getState() {
    return this.statePromise.promise;
  }
}
