import { Computer } from './equipment/Computer';
import { Hub } from './equipment/Hub';
import { NetworkCable } from './equipment/NetworkCable';
import { Switch } from './equipment/Switch';
import { sleep } from './utils/sleep';

export async function test() {
  console.log('DEBUG: ', 'start');
  const frequency = 1;
  const accuracy = 1;

  // 搞几条网线
  let cable1 = new NetworkCable(frequency, accuracy);
  let cable2 = new NetworkCable(frequency, accuracy);
  let cable3 = new NetworkCable(frequency, accuracy);
  let cable4 = new NetworkCable(frequency, accuracy);
  let cable5 = new NetworkCable(frequency, accuracy);
  let cable6 = new NetworkCable(frequency, accuracy);
  let cable7 = new NetworkCable(frequency, accuracy);
  let cable8 = new NetworkCable(frequency, accuracy);
  let cable9 = new NetworkCable(frequency, accuracy);

  // 搞几个计算机
  let cpt1 = new Computer();
  let cpt2 = new Computer();
  let cpt3 = new Computer();
  let cpt4 = new Computer();
  let cpt5 = new Computer();
  let cpt6 = new Computer();

  // 集线器
  let hub1 = new Hub(3);
  let hub2 = new Hub(3);
  let hub3 = new Hub(3);

  // 计算机和网线连起来
  cpt1.linkCable(cable1);
  cpt2.linkCable(cable2);
  cpt3.linkCable(cable3);
  cpt4.linkCable(cable4);
  cpt5.linkCable(cable5);
  cpt6.linkCable(cable6);

  // 集线器和网线连起来
  hub1.linkPort(cable1, 1);
  hub1.linkPort(cable2, 2);
  hub1.linkPort(cable7, 3);

  hub2.linkPort(cable3, 1);
  hub2.linkPort(cable4, 2);
  hub2.linkPort(cable8, 3);

  hub3.linkPort(cable5, 1);
  hub3.linkPort(cable6, 2);
  hub3.linkPort(cable9, 3);

  // 交换机
  let sw = new Switch(3);
  sw.linkCable(cable7, 1);
  sw.linkCable(cable8, 2);
  sw.linkCable(cable9, 3);

  // 计算机监听信息
  cpt1.listenMsg(s => {
    console.log('DEBUG: ', 'cpt1 收到消息', s);
  });
  cpt2.listenMsg(s => {
    console.log('DEBUG: ', 'cpt2 收到消息', s);
  });
  cpt3.listenMsg(s => {
    console.log('DEBUG: ', 'cpt3 收到消息', s);
  });
  cpt4.listenMsg(s => {
    console.log('DEBUG: ', 'cpt4 收到消息', s);
  });
  cpt5.listenMsg(s => {
    console.log('DEBUG: ', 'cpt5 收到消息', s);
  });
  cpt6.listenMsg(s => {
    console.log('DEBUG: ', 'cpt6 收到消息', s);
  });

  // 计算机发送信息
  cpt1.sendMsg('二号机好，我是一号机', cpt2.getMacAddress());
  cpt1.sendMsg('三号机好，我是一号机', cpt3.getMacAddress());
  cpt1.sendMsg('四号机好，我是一号机', cpt4.getMacAddress());
  cpt1.sendMsg('五号机好，我是一号机', cpt5.getMacAddress());
  cpt1.sendMsg('六号机好，我是一号机', cpt6.getMacAddress());
  await sleep(1000 * 6);
  cpt3.sendMsg('一号机好，我是三号机', cpt1.getMacAddress());
  cpt4.sendMsg('一号机好，我是四号机', cpt1.getMacAddress());
  await sleep(1000 * 20);
  cpt2.sendMsg('六号机好，我是二号机', cpt6.getMacAddress());
  await sleep(1000 * 6);
  cpt6.sendMsg('四号机好，我是六号机', cpt4.getMacAddress());
  await sleep(1000 * 6);
  cpt6.sendMsg('三号机好，我是六号机', cpt3.getMacAddress());
  await sleep(1000 * 6);
  cpt6.sendMsg('二号机好，我是六号机', cpt2.getMacAddress());
}
