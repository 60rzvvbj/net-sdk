import { PromiseContext, getPromise } from '../utils/promise';

export enum NetworkCableState {
  High = 'High',
  Low = 'Low',
}

// 网线
export class NetworkCable {
  private state: NetworkCableState;
  private statePromise: PromiseContext<NetworkCableState>;
  private changeStatePromise: PromiseContext<NetworkCableState>;
  private changeStateList: NetworkCableState[] = [];

  constructor(frequency: number, accuracy: number) {
    this.state = NetworkCableState.Low;
    this.statePromise = getPromise<NetworkCableState>();
    this.changeStatePromise = getPromise<NetworkCableState>();

    setInterval(() => {
      const resolve = this.statePromise.resolve;
      this.statePromise = getPromise<NetworkCableState>();
      if (this.changeStateList.length > 0) {
        let random = Math.floor(Math.random() * this.changeStateList.length);
        let state = this.changeStateList[random];
        this.changeStatePromise.resolve(state);
        this.changeStatePromise = getPromise<NetworkCableState>();
        if (Math.random() < accuracy) {
          this.state = state;
        }
        this.changeStateList = [];
      }
      resolve(this.state);
    }, frequency);
  }

  async changeState(state: NetworkCableState) {
    this.changeStateList.push(state);
    return this.changeStatePromise.promise;
  }

  async getState() {
    return this.statePromise.promise;
  }
}
