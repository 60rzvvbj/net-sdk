import { PureMacFrameHandler } from './PureMacFrameHandler';
import { MacFrame } from './type';

export class SwitchMacFrameHandler extends PureMacFrameHandler {
  getMacFrameByString(str: string) {
    return this.stringToMacFrame(str);
  }

  toString(mac: MacFrame) {
    return this.macFrameToString(mac);
  }
}
