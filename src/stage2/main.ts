import { Computer } from './equipment/Computer3';
import { NetworkCable } from './equipment/NetworkCable';

export async function test() {
  console.log('DEBUG: ', 'start');
  let cable = new NetworkCable();
  let cpt1 = new Computer();
  let cpt2 = new Computer();
  cpt1.linkCable(cable);
  cpt2.linkCable(cable);
  cpt1.listenMsg(s => {
    console.log('DEBUG: 1', s);
  });
  cpt2.listenMsg(s => {
    console.log('DEBUG: 2', s);
  });
  await cpt1.sendMsg('abc');
  await cpt2.sendMsg('def');
}
