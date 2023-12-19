import { Computer } from './equipment/Computer';
import { Hub } from './equipment/Hub';
import { NetworkCable } from './equipment/NetworkCable';

export async function test() {
  console.log('DEBUG: ', 'start');
  const frequency = 1;
  const accuracy = 1;

  // 集线器
  let hub1 = new Hub(4);
  let hub2 = new Hub(4);

  // 搞几条网线
  let cable1 = new NetworkCable(frequency, accuracy);
  let cable2 = new NetworkCable(frequency, accuracy);
  let cable3 = new NetworkCable(frequency, accuracy);
  let cable4 = new NetworkCable(frequency, accuracy);
  let cable5 = new NetworkCable(frequency, accuracy);
  let cable6 = new NetworkCable(frequency, accuracy);
  let cable7 = new NetworkCable(frequency, accuracy);

  // 搞几个计算机
  let cpt1 = new Computer();
  let cpt2 = new Computer();
  let cpt3 = new Computer();
  let cpt4 = new Computer();
  let cpt5 = new Computer();
  let cpt6 = new Computer();

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
  hub1.linkPort(cable3, 3);

  hub2.linkPort(cable4, 1);
  hub2.linkPort(cable5, 2);
  hub2.linkPort(cable6, 3);

  hub1.linkPort(cable7, 4);
  hub2.linkPort(cable7, 4);

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
  cpt1.sendMsg('我是一号机');
  cpt3.sendMsg('我是三号机');
  cpt4.sendMsg('我是四号机');
  cpt6.sendMsg('我是六号机');
}
