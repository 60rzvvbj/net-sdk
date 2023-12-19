import { Computer } from './equipment/Computer';
import { NetworkCable } from './equipment/NetworkCable';
import { Repeater } from './equipment/Repeater';

export async function test() {
  console.log('DEBUG: ', 'start');
  const accuracy = 1;
  let cable1 = new NetworkCable(2, accuracy);
  let cable2 = new NetworkCable(2, accuracy);
  let repeater = new Repeater();
  repeater.linkPort1(cable1);
  repeater.linkPort2(cable2);
  let cpt1 = new Computer();
  let cpt2 = new Computer();
  cpt1.linkCable(cable1);
  cpt2.linkCable(cable2);
  cpt1.listenMsg(s => {
    console.log('DEBUG: cpt1 收到消息', s);
  });
  cpt2.listenMsg(s => {
    console.log('DEBUG: cpt2 收到消息', s);
  });
  cpt1.sendMsg('弟兄们好，我是一号计算机');
  cpt2.sendMsg('同志们好，我是二号计算机');
}
