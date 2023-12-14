import { Computer } from './equipment/Computer';
import { NetworkCable, NetworkCableEnd } from './equipment/NetworkCable';

export function test() {
  console.log('DEBUG: ', 'start');
  let cable = new NetworkCable();
  let cpt1 = new Computer();
  let cpt2 = new Computer();
  cpt1.linkCable(cable, NetworkCableEnd.First);
  cpt2.linkCable(cable, NetworkCableEnd.Second);
  cpt1.listenMsg(s => {
    console.log('DEBUG: 1', s);
  });
  cpt2.listenMsg(s => {
    console.log('DEBUG: 2', s);
  });
  cpt1.sendMsg([0, 1, 1, 0, 0, 1, 0, 1, 0]);
  cpt2.sendMsg([1, 1, 0, 0, 1, 0, 1, 1, 0]);
}

test();
