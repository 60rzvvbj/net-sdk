export type NetworkCableState = 0 | 1;

// 网线
export class NetworkCable {
  private state: NetworkCableState;

  constructor() {
    this.state = 0;
  }

  changeState(state: NetworkCableState) {
    this.state = state;
  }

  getState() {
    return this.state;
  }
}
