import { NetworkCableState } from '../equipment/NetworkCable';

export class StringTranslate {
  stringToMsg(str: string): NetworkCableState[] {
    let res: NetworkCableState[] = [];
    for (let i = 0; i < str.length; i++) {
      let num = str.charCodeAt(i);
      let bstr = num.toString(2);
      while (bstr.length < 8) {
        bstr = '0' + bstr;
      }
      let barr = bstr.split('').map(c => (c === '1' ? 1 : 0));
      res.push(...barr);
    }
    return res;
  }

  msgToString(msg: NetworkCableState[]): string {
    let res: string[] = [];

    for (let i = 0; i < msg.length; i += 8) {
      let barr = [];
      for (let j = 0; j < 8; j++) {
        barr.push(msg[i + j]);
      }
      let bstr = barr.join('');
      let num = parseInt(bstr, 2);
      let char = String.fromCharCode(num);
      res.push(char);
    }

    return res.join('');
  }
}
