import { Computer } from './equipment/Computer';
import { NetworkCable } from './equipment/NetworkCable';

export async function test() {
  console.log('DEBUG: ', 'start');
  let cable = new NetworkCable(2, 0.999);
  let cpt1 = new Computer();
  let cpt2 = new Computer();
  cpt1.linkCable(cable);
  cpt2.linkCable(cable);
  cpt1.listenMsg(s => {
    console.log('DEBUG : cpt1 收到消息', s);
  });
  cpt2.listenMsg(s => {
    console.log('DEBUG : cpt2 收到消息', s);
  });
  cpt1.sendMsg('大家好，我是一号计算机');
  cpt2.sendMsg('大家好，这里是二号计算机');
}
