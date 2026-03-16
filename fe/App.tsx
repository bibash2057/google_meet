import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  const [joinUrl, setJoinUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = 'http://192.168.1.201:4000/join-meeting';

  useEffect(() => {
    prepareAndJoin();
  }, []);

  const prepareAndJoin = async () => {
    const hasPermission = await requestPermissions();
    if (hasPermission) {
      await getMeetingLink();
    } else {
      Alert.alert(
        'Permission Denied',
        'Camera and Mic are required for calls.',
      );
      setLoading(false);
    }
  };

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
      return (
        granted['android.permission.CAMERA'] === 'granted' &&
        granted['android.permission.RECORD_AUDIO'] === 'granted'
      );
    }
    return true;
  };

  const getMeetingLink = async () => {
    try {
      console.log('api hit1');
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: 'room01',
          userName: 'Bibash',
          userId: `user-${Date.now()}`,
          isHost: true,
        }),
      });
      console.log('api hit2');
      const data = await response.json();
       console.log('api hit3', data);
      if (data.joinUrl) {
        setJoinUrl(data.joinUrl);
      }
    } catch (err) {
      Alert.alert('Error', 'Could not connect to backend server.');
    } finally {
      setLoading(false);
    }
  };
  console.log('joinUrl', joinUrl);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10 }}>Setting up meeting...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {joinUrl ? (
        <WebView
          source={{ uri: joinUrl }}
          originWhitelist={['*']}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          mediaCapturePermissionGrantType="grantIfSameHostElsePrompt"
          style={{ opacity: 0.99, minHeight: 1 }}
        />
      ) : (
        <View style={styles.center}>
          <Text>Failed to load meeting.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
