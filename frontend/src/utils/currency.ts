export const EXCHANGE_RATE = 80;

import i18n from '../i18n/i18n';

export const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === 'string' ? Number(price) : price;
  const lang = i18n.language;
  const amount = lang === 'en' ? numPrice / EXCHANGE_RATE : numPrice;
  return `${amount.toFixed(2)} ${i18n.t('common.currency')}`;
};

