import { NetData } from '../equipment/NetworkPort';

export function getNetData(str: string): NetData[] {
  return str.split('').map(x => (x === '1' ? 1 : 0));
}
