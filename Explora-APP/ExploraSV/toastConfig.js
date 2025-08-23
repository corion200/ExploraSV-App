// toastConfig.js
import React from 'react';
import { View, Text, Image } from 'react-native';

const COLORS = {
  primary: '#101C5D',
  secondary: '#569298',
  gold: '#D4AF37',
  lightGray: '#F5F5F5',
  darkGray: '#333333',
  coral: '#F97C7C',
  white: '#FFFFFF'
};

const ToruToast = ({ type, text1, text2 }) => {
  const getBorderColor = () => {
    switch (type) {
      case 'success': return COLORS.secondary;
      case 'error': return COLORS.coral;
      case 'info': return COLORS.gold;
      default: return COLORS.primary;
    }
  };

  const getIndicatorColor = () => {
    switch (type) {
      case 'success': return COLORS.secondary;
      case 'error': return COLORS.coral;
      case 'info': return COLORS.gold;
      default: return COLORS.primary;
    }
  };

  return (
    <View style={{
      height: 80,
      width: '90%',
      backgroundColor: COLORS.white,
      borderRadius: 15,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
      marginHorizontal: 20,
      shadowColor: COLORS.darkGray,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
      borderLeftWidth: 5,
      borderLeftColor: getBorderColor(),
    }}>
      {/* Avatar de Toru */}
      <View style={{
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        borderWidth: 2,
        borderColor: getBorderColor(),
      }}>
        <Image 
          source={require('./assets/Favicon25.png')} 
          style={{ width: 40, height: 40 }}
          resizeMode="contain"
        />
      </View>

      {/* Contenido */}
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={{
          fontSize: 16,
          fontWeight: 'bold',
          color: COLORS.primary,
          marginBottom: 2,
        }}>
          {text1}
        </Text>
        <Text style={{
          fontSize: 13,
          color: COLORS.darkGray,
          lineHeight: 18,
          flexWrap: 'wrap',
        }}>
          {text2}
        </Text>
      </View>

      {/* Indicador */}
      <View style={{
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: getIndicatorColor(),
        marginLeft: 10,
      }} />
    </View>
  );
};

export const toastConfig = {
  success: (props) => <ToruToast type="success" {...props} />,
  error: (props) => <ToruToast type="error" {...props} />,
  info: (props) => <ToruToast type="info" {...props} />,
};
