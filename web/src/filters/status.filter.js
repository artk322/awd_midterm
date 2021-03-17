import { statusTypes } from '@/store/ui_post.js';

export default function statusFilter(value) {
  const [temp] = statusTypes.filter(it => it.id == value);
  return temp.name;
}
