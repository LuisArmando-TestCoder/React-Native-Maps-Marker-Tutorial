import React, {useState, useEffect} from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import MapView from 'react-native-maps'
import * as Location from 'expo-location';
import { Gyroscope, Accelerometer } from 'expo-sensors';
const {width, height} = Dimensions.get('screen')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapView: {
    width,
    height
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
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [gyroscope, setGyroscope] = useState(null);
  const [turns, setTurns] = useState({ y: 0 });
  const [accelerometer, setAccelerometer] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setMapRegion({
        ...location.coords,
        longitudeDelta: 0.922,
        latitudeDelta: 0.0421
      });
      setLocation(location);
    })();

    // 16 is fast
    Gyroscope.setUpdateInterval(100);
    Gyroscope.addListener(setGyroscope);
    Accelerometer.setUpdateInterval(100);
    Accelerometer.addListener(setAccelerometer);
  }, []);

  useEffect(() => {
    console.log(gyroscope)
    console.log(accelerometer)
    const sensitivity = 20
    setTurns({
      y: turns.y - (
        Math.sign(
          (accelerometer?.x * sensitivity) >> 0
        ) || 0
      )
    })
  }, [gyroscope, accelerometer]);

  return (
    <View style={styles.container}>
      <Text>hey</Text>
      <View style={{
        ...styles.circle,
        top: Math.sin(-turns?.y / 20) * 100,
        left: Math.cos(-turns?.y / 20) * 100
      }}></View>

      {/* <MapView
        camera={{
          heading: (gyroscope)
        }}
        rotateEnabled={true}
        style={styles.mapView}
        initialRegion={mapRegion}
      ></MapView> */}
    </View>
  );
}
