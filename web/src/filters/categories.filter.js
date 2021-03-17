import { categoriesTypes } from '@/store/ui_post.js';

export function categoriesAbbr(value) {
  const abbrs = categoriesTypes.reduce((acc, it) => {
    if (value.includes(it.id)) {
      acc.push(it.abbr);
    }
    return acc;
  }, []);
  return abbrs.join(', ');
}

export function categoriesFull(value) {
  const temp = categoriesTypes.reduce((acc, it) => {
    if (value.includes(it.id)) {
      acc.push(it.name);
    }
    return acc;
  }, []);
  return temp.join(', ');
}
