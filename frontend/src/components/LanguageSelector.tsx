import React, { useState } from 'react';
import { List, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import i18n, { changeLanguage } from '../i18n/i18n';

const LanguageSelector = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState(i18n.language);

  const select = (lang: string) => {
    changeLanguage(lang);
    setSelected(lang);
    setExpanded(false);
  };

  return (
    <List.Accordion
      title={t('profile.language')}
      expanded={expanded}
      onPress={() => setExpanded(!expanded)}
      titleStyle={{ color: theme.colors.onSurface }}
    >
      <List.Item
        title="Русский"
        onPress={() => select('ru')}
        right={() => (selected === 'ru' ? <List.Icon icon="check" /> : null)}
      />
      <List.Item
        title="English"
        onPress={() => select('en')}
        right={() => (selected === 'en' ? <List.Icon icon="check" /> : null)}
      />
    </List.Accordion>
  );
};

export default LanguageSelector;
