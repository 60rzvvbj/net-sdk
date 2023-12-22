import { Protocol } from '../ProtocolManager';

export enum SpecialMacAddress {
  Broadcast = 'Broadcast',
}

export type MacAddress = string;

export interface MacFrame {
  protocol: Protocol.MAC;
  fromAddress: MacAddress;
  toAddress: MacAddress | SpecialMacAddress;
  data: string;
  params?: { [key: string]: string };
}
