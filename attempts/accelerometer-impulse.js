import React, {useState, useEffect} from 'react';
import { StyleSheet, View } from 'react-native';
import { Gyroscope, Accelerometer } from 'expo-sensors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 5,
    height: 5,
    backgroundColor: '#f00',
    borderRadius: '50%',
    position: 'relative'
  }
});

export default function App() {
  const [gyroscope, setGyroscope] = useState(null);
  const [turns, setTurns] = useState({ y: 0 });
  const [accelerometer, setAccelerometer] = useState(null);

  useEffect(() => {
    Gyroscope.setUpdateInterval(100);
    Gyroscope.addListener(setGyroscope);
    Accelerometer.setUpdateInterval(100);
    Accelerometer.addListener(setAccelerometer);
  }, []);

  useEffect(() => {
    const sensitivity = 20;

    setTurns({
      y: turns.y - (
        Math.sign(
          (accelerometer?.x * sensitivity) >> 0
        ) || 0
      )
    });
  }, [gyroscope, accelerometer]);

  return (
    <View style={styles.container}>
      <View style={{
        ...styles.circle,
        top: Math.sin(-turns?.y / 20) * 100,
        left: Math.cos(-turns?.y / 20) * 100
      }}/>
    </View>
  );
}
