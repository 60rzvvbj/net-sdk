import { NetData } from '../../equipment/NetworkPort';
import { MessageHandlerPlugin } from './MessageHandler';

export class CrcCheck implements MessageHandlerPlugin {
  private key: NetData[];

  constructor(key: NetData[]) {
    this.key = key;
  }

  createMessage(data: NetData[]): NetData[] {
    const mod = crc(data, this.key);
    return [...data, ...mod];
  }

  analysisMessage(data: NetData[]): NetData[] | null {
    const len = this.key.length - 1;
    const d = data.slice(0, data.length - len);
    const mod = data.slice(data.length - len);
    const nowMod = crc(d, this.key);

    if (nowMod.join('') === mod.join('')) {
      return d;
    } else {
      console.log('DEBUG: ', 'Crc 检测不通过');
      return null;
    }
  }
}

function crc(data: NetData[], key: NetData[]): NetData[] {
  let d = [...data];
  for (let i = 0; i < key.length - 1; i++) {
    d.push(0);
  }

  for (let i = 0; i < data.length; i++) {
    if (d[i] === 1) {
      for (let j = 0; j < key.length; j++) {
        d[i + j] = d[i + j] === key[j] ? 0 : 1;
      }
    }
  }

  return d.slice(data.length);
}

// 10010110110
// 1011

// 10010110110 000
// 1011
//   100110110 000
//   1011
//     1010110 000
//     1011
//        1110 000
//        1011
//         101 000
//         101 1
//             100

// 100
