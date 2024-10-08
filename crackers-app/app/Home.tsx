import { View, StyleSheet, BackHandler } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import Header from '@/components/Header';
import Main from '@/components/Main';
import Footer from '@/components/Footer';

export default function Home({ route }) {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (route.params?.user) {
      setUser(route.params.user);
    }
  }, [route.params?.user]);



  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Header user={user} />
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
    // padding: 10,
  },
  header: {
    flex: 0,
  },
  main: {
    flex: 1,
    marginTop: 50,
  },
  footer: {
    flex: 0,
  },
});