let count = 0;
let now = 0;

function getMacAddress() {
  let date = Date.now();
  if (now === date) {
    count++;
  } else {
    now = date;
    count = 0;
  }
  return `mac-${now}-${count}`;
}

export abstract class NetEquip {
  private equipMacAddress: string;
  constructor() {
    this.equipMacAddress = getMacAddress();
  }

  getMacAddress() {
    return this.equipMacAddress;
  }
}
