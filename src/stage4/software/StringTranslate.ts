import { NetData } from '../equipment/NetworkPort';

// 字符串转二进制 01 数组，里面两个函数是给 GPT 写的
export class StringTranslate {
  stringToMsg(str: string): NetData[] {
    const encoder = new TextEncoder();
    const encodedArray = encoder.encode(str);
    const binaryArray: NetData[] = [];
    for (let i = 0; i < encodedArray.length; i++) {
      let byte = encodedArray[i];
      for (let j = 7; j >= 0; j--) {
        binaryArray.push(((byte >> j) & 1) as NetData);
      }
    }
    return binaryArray;
  }

  msgToString(data: NetData[]): string {
    const binaryArray = new Uint8Array(data);
    const encodedArray = new Uint8Array(Math.ceil(binaryArray.length / 8));
    for (let i = 0; i < binaryArray.length; i += 8) {
      let byte = 0;
      for (let j = 0; j < 8; j++) {
        byte = (byte << 1) | binaryArray[i + j];
      }
      encodedArray[i / 8] = byte;
    }
    const decoder = new TextDecoder();
    const decodedString = decoder.decode(encodedArray);
    return decodedString;
  }
}
