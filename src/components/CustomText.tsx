import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

interface CustomTextProps extends TextProps {
  children: React.ReactNode;
}

export default function CustomText({ children, style, ...props }: CustomTextProps) {
  return (
    <Text style={[styles.defaultText, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  defaultText: {
    fontSize: 14,
    color: '#333',
  },
});
