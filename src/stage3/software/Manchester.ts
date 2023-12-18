import { NetData, NetworkPort } from '../equipment/NetworkPort';
import { getNetData } from '../utils/getNetData';
import { LastMessageControllerPlugin, ListenMessageCallback } from './MessageController';

const preData: NetData[] = getNetData('0000001100110011');
const endData: NetData[] = getNetData('00000000');

export class Manchester implements LastMessageControllerPlugin {
  createMessage(data: NetData[]): NetData[] {
    let now: NetData = 0;
    let res: NetData[] = [...preData];
    for (let i = 0; i < data.length; i++) {
      res.push(now);
      if (data[i]) {
        now = now === 1 ? 0 : 1;
      }
      res.push(now);
      now = now === 1 ? 0 : 1;
    }
    if (now === 1) {
      res.push(1, 1);
    }
    res.push(...endData);
    return res;
  }

  private translate(data: NetData[]): NetData[] {
    let res: NetData[] = [];
    for (let i = 0; i < data.length; i += 2) {
      if (i > 0 && data[i] === data[i - 1]) {
        // return [];
        break;
      }
      if (data[i] === data[i + 1]) {
        res.push(0);
      } else {
        res.push(1);
      }
    }
    return res;
  }

  listenMessage(port: NetworkPort, cb: ListenMessageCallback) {
    let pre: NetData[] = getNetData('00110011');
    let last: NetData[] = getNetData('000000');
    let now = 0;
    let res: NetData[] = [];
    let flag = false;
    let resFun = port.onReceiveData(state => {
      if (flag) {
        res.push(state);
        if (state === last[now]) {
          now++;
          if (now === last.length) {
            flag = false;
            now = 0;
            cb(this.translate(res));
            res = [];
          }
        } else {
          now = 0;
          if (state === last[now]) {
            now++;
          }
        }
      } else {
        if (state === pre[now]) {
          now++;
          if (now === pre.length) {
            flag = true;
            now = 0;
          }
        } else {
          now = 0;
          if (state === pre[now]) {
            now++;
          }
        }
      }
    });
    return resFun;
  }
}
