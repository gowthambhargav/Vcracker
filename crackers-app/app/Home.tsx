import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import Main from '@/components/Main';
import Footer from '@/components/Footer';
import { useNavigation } from 'expo-router';

export default function Home() {
  const navigation = useNavigation();
  navigation.reset({
    index: 0,
    routes: [{ name: 'Home' }],
  });
  useEffect(() => {


  }, [])
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Header />
      </View>
      <View style={styles.main}>
        <Main />
      </View>
      <View style={styles.footer}>
        <Footer />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 10,
  },
  header: {
    flex: 0,
  },
  main: {
    flex: 1,
  },
  footer: {
    flex: 0,
  },
});