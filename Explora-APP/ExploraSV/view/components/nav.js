import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import tw from 'twrnc';

/**
 * BottomNavBar con soporte i18n
 */
const BottomNavBar = ({
  initialTab = 'Index',
  onTabChange,
  activeColor = '#3FCFB0',
  inactiveColor = '#6b7280',
  iconSize = 26
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const navigation = useNavigation();
  const { t } = useTranslation(); // <-- Hook para traducciones

  const menuItems = [
    { id: 'Index', icon: 'home', label: t('Inicio') },
    { id: 'Search', icon: 'search', label: t('Explorar') },
    { id: 'ChatScreen', icon: 'chatbox-ellipses-outline', label: t('Asistente') },
    { id: 'MisReservas', icon: 'calendar', label: t('Reservar') },
    { id: 'Perfil', icon: 'person-circle-outline', label: t('Perfil') },
  ];

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      navigation.navigate(tabId); 
    }
  };

  const currentRoute = useNavigationState((state) => {
    const route = state.routes[state.index];
    return route.name;
  });

  return (
    <View style={[
      tw` bg-white border-t border-gray-200 flex-row justify-between items-center h-28 px-2`,
      styles.container
    ]}>
      {menuItems.map((item) => {
        const isActive = currentRoute === item.id;
        return (
          <TouchableOpacity
            key={item.id}
            style={tw`flex-1 justify-center items-center pb-5`}
            onPress={() => handleTabPress(item.id)}
          >
            <Icon 
              name={item.icon}
              size={iconSize} 
              color={isActive ? activeColor : inactiveColor} 
            />
            <Text 
              style={tw`text-xs mt-1 ${isActive ? 'text-[#3FCFB0] font-medium' : 'text-gray-500'}`}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  }
});

export default BottomNavBar;
