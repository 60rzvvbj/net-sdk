type CrcData = ('0' | '1')[];

export function crc(data: string, key: string): string {
  let d: CrcData = data.split('') as CrcData;
  for (let i = 0; i < key.length - 1; i++) {
    d.push('0');
  }

  for (let i = 0; i < data.length; i++) {
    if (d[i] === '1') {
      for (let j = 0; j < key.length; j++) {
        d[i + j] = d[i + j] === key[j] ? '0' : '1';
      }
    }
  }

  return d.slice(data.length).join('');
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
