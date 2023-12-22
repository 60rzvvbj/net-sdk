import { Protocol } from '../ProtocolManager';
import { MacFrame } from './type';

export class PureMacFrameHandler {
  protected macFrameToString(mf: MacFrame): string {
    return JSON.stringify(mf);
  }

  protected stringToMacFrame(str: string): MacFrame | null {
    try {
      const mf = JSON.parse(str) as MacFrame;
      if (!mf.protocol || !mf.fromAddress || !mf.toAddress || !mf.data || mf.protocol !== Protocol.MAC) {
        console.log('DEBUG: ', 'Mac 帧数据错误');
        throw new Error('Mac 帧数据错误');
      }
      return mf;
    } catch (e) {
      return null;
    }
  }
}
