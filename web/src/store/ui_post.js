export const categoriesTypes = [
  {
    id: 'selhoz',
    name: 'Товарное сельское хозяйство',
    abbr: 'ТСХ',
  },
  {
    id: 'mzs',
    name: 'Многоэтажное жилищное строительство',
    abbr: 'МЖС',
  },
  {
    id: 'izs',
    name: 'Индивидуальное жилищное строительство',
    abbr: 'ИЖС',
  },
  {
    id: 'commercial',
    name: 'Коммерческое',
    abbr: 'Ком-ое',
  },
];

export const filterCategories = [
  {
    id: 'all',
    name: 'Все',
    abbr: 'Все',
  },
  ...categoriesTypes,
];

export const statusTypes = [
  {
    id: 'approved',
    name: 'Одобрен',
  },
  {
    id: 'not approved',
    name: 'Не одобрен',
  },
  {
    id: 'hidden',
    name: 'Скрыт',
  },
  {
    id: 'archived',
    name: 'Архивирован',
  },
];

export const filterStatus = [
  {
    id: 'all',
    name: 'Все',
  },
  ...statusTypes,
];

export const controls = [
  {
    name: 'Редактировать',
    action: 'edit',
    admin_control: false,
  },
  {
    name: 'Архивировать',
    action: 'archive',
    admin_control: true,
  },
  {
    name: 'Скрыть',
    action: 'hide',
    admin_control: true,
  },
  {
    name: 'Одобрить',
    action: 'approve',
    admin_control: true,
  },
  {
    name: 'Отклонить',
    action: 'deny',
    admin_control: true,
  },
  {
    name: 'Удалить',
    action: 'delete',
    admin_control: false,
  },
];
