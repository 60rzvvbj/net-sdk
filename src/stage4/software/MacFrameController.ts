export enum SpecialMacAddress {
  Broadcast = 'Broadcast',
}

export interface MacFrame {
  id?: string;
  fromAddress: string;
  toAddress: string | SpecialMacAddress;
  data: string;
}

export class MacFrameController {
  macFrameToString(mf: MacFrame): string {
    if (!mf.id) {
      mf.id = `${Math.floor(Math.random() * 100000)}_${Math.random()}`;
    }
    return JSON.stringify(mf);
  }

  stringToMacFrame(str: string): MacFrame | null {
    try {
      const mf = JSON.parse(str) as MacFrame;
      if (!mf.fromAddress || !mf.toAddress || !mf.data || !mf.id) {
        throw new Error('Mac 帧数据错误');
      }
      return mf;
    } catch (e) {
      return null;
    }
  }
}
