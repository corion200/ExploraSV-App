import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  StatusBar,
  Dimensions
} from 'react-native';
import tw from './tw';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const colors = {
  primary: '#101C5D',
  secondary: '#569298',
  complementary: '#D4AF37',
  neutralLight: '#F5F5F5',
  neutralDark: '#333333',
  vibrant: '#F97C7C',
};

const SettingsScreen = () => {
  const { t, i18n } = useTranslation();

  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  // 🔹 Cargar idioma guardado
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const lang = await AsyncStorage.getItem('appLanguage');
        if (lang) {
          setSelectedLanguage(lang);
          i18n.changeLanguage(lang);
        }
      } catch (error) {
        console.error('Error loading language:', error);
      }
    };
    loadLanguage();
  }, []);

  const handleLanguageSelect = async (languageCode) => {
    setSelectedLanguage(languageCode);
    i18n.changeLanguage(languageCode);
    await AsyncStorage.setItem('appLanguage', languageCode);

    const selectedLang = languages.find(lang => lang.code === languageCode);
    Alert.alert(t('Idioma cambiado'), t('Has seleccionado: {{name}}', { name: selectedLang?.name }));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const SettingCard = ({ children, style }) => (
    <View style={[tw`rounded-2xl p-1 shadow-sm mb-6`, {
      backgroundColor: isDarkMode ? colors.neutralDark : '#FFFFFF',
      shadowColor: isDarkMode ? colors.primary : colors.neutralDark,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 4,
      borderWidth: 1,
      borderColor: isDarkMode ? `${colors.secondary}20` : `${colors.primary}08`
    }, style]}>
      {children}
    </View>
  );

  const SectionHeader = ({ title, subtitle }) => (
    <View style={tw`mb-4`}>
      <Text style={[tw`text-sm font-bold`, { color: isDarkMode ? colors.neutralLight : colors.primary }]}>
        {t(title)}
      </Text>
      {subtitle && (
        <Text style={[tw`text-sm mt-1`, { color: isDarkMode ? `${colors.neutralLight}80` : `${colors.neutralDark}70` }]}>
          {t(subtitle)}
        </Text>
      )}
    </View>
  );

  const ToggleOption = ({ title, subtitle, value, onToggle, color = colors.secondary }) => (
    <View style={tw`flex-row items-center justify-between p-4`}>
      <View style={tw`flex-1 pr-4`}>
        <Text style={[tw`text-text-sm font-medium`, { color: isDarkMode ? colors.neutralLight : colors.primary }]}>
          {t(title)}
        </Text>
        {subtitle && (
          <Text style={[tw`text-sm mt-1`, { color: isDarkMode ? `${colors.neutralLight}70` : `${colors.neutralDark}70` }]}>
            {t(subtitle)}
          </Text>
        )}
      </View>
      <Switch
        trackColor={{
          false: isDarkMode ? `${colors.neutralDark}50` : `${colors.neutralDark}20`,
          true: `${color}80`
        }}
        thumbColor={value ? color : colors.neutralLight}
        ios_backgroundColor={isDarkMode ? `${colors.neutralDark}50` : `${colors.neutralDark}20`}
        onValueChange={onToggle}
        value={value}
        style={[tw`scale-110`, { transform: [{ scale: 1.1 }] }]}
      />
    </View>
  );

  const Divider = () => (
    <View style={[tw`h-px mx-4`, { backgroundColor: isDarkMode ? `${colors.secondary}30` : `${colors.primary}15` }]} />
  );

  return (
    <View style={[tw`flex-1`, { backgroundColor: isDarkMode ? colors.primary : colors.neutralLight }]}>
      <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-8`}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
        <View style={tw`px-6 pt-8`}>

          {/* Header */}
          <View style={tw`mb-8`}>
            <Text style={[tw`text-lg font-bold mb-2 pt-10`, { color: isDarkMode ? colors.complementary : colors.primary }]}>
              {t('Configuraciones')}
            </Text>
          </View>

          {/* Idioma */}
          <SectionHeader title="Idioma y Región" subtitle="Selecciona tu idioma preferido" />
          <SettingCard>
            <View style={tw`p-2`}>
              {languages.map((language, index) => (
                <View key={language.code}>
                  <TouchableOpacity
                    style={[tw`flex-row items-center justify-between p-4 rounded-xl`, {
                      backgroundColor: selectedLanguage === language.code ? `${colors.complementary}15` : 'transparent'
                    }]}
                    onPress={() => handleLanguageSelect(language.code)}
                    activeOpacity={0.7}
                  >
                    <View style={tw`flex-row items-center flex-1`}>
                      <Text style={[tw`text-sm mr-3`, { opacity: selectedLanguage === language.code ? 1 : 0.6 }]}>
                        {language.flag}
                      </Text>
                      <Text style={[tw`text-base`, {
                        color: selectedLanguage === language.code
                          ? (isDarkMode ? colors.complementary : colors.primary)
                          : (isDarkMode ? colors.neutralLight : colors.neutralDark),
                        fontWeight: selectedLanguage === language.code ? '600' : '400'
                      }]}>
                        {language.name}
                      </Text>
                    </View>
                    {selectedLanguage === language.code && (
                      <View style={[tw`w-3 h-3 rounded-full`, { backgroundColor: colors.complementary }]} />
                    )}
                  </TouchableOpacity>
                  {index < languages.length - 1 && <Divider />}
                </View>
              ))}
            </View>
          </SettingCard>

          {/* Apariencia */}
          <SectionHeader title="Apariencia" subtitle="Personaliza tu experiencia visual" />
          <SettingCard>
            <ToggleOption
              title="Modo Oscuro"
              subtitle="Activa el tema oscuro para reducir la fatiga visual"
              value={isDarkMode}
              onToggle={toggleDarkMode}
              color={colors.primary}
            />
          </SettingCard>

        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
