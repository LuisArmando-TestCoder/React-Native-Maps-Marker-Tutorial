import React, {useState, useEffect} from "react";
import {Text} from "react-native";
import {Grid, Row} from "react-native-easy-grid";
import { Magnetometer } from 'expo-sensors';
import MapView from 'react-native-maps'

function getAngle(magnetometer) {
  let angle = 0;

  if (magnetometer) {
    let {x, y} = magnetometer;

    if (Math.atan2(y, x) >= 0) {
      angle = Math.atan2(y, x) * (180 / Math.PI);
    } else {
      angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
    }
  }

  return Math.round(angle);
}

// Match the device top with pointer 0° degree. (By default 0° starts from the right of the device.)
function getDegree(magnetometer) {
  return magnetometer - 90 >= 0
    ? magnetometer - 90
    : magnetometer + 271;
}

export default () => {
  const [magnetometer, setMagnetometerState] = useState(0)
  const [subscriptions, setSubscriptions] = useState([])
  const [mapRegion, setMapRegion] = useState(null);
  const setMagnetometer = sensorData => setMagnetometerState(getAngle(sensorData));

  useEffect(() => {
    (async () => {
      const {status} = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        console.error('Permission to access location was denied');

        return;
      }

      const location = await Location.getCurrentPositionAsync({});

      setMapRegion({
        ...location.coords,
        longitudeDelta: 0.922,
        latitudeDelta: 0.0421
      });
    })();

    Magnetometer.setUpdateInterval(1);

    setSubscriptions([
      ...subscriptions,
      Magnetometer.addListener(
        setMagnetometer,
        error => console.error("The sensor is not available", error),
      )
    ]);

    return () => {
      subscriptions.forEach(subscription => subscription.unsubscribe())
    }
  }, [])

  return (
    <Grid style={{backgroundColor: "black"}}>
      <Row style={{alignItems: "center"}} size={2}>
        <Text
          style={{
            color: "#fff",
            fontSize: 16,
            width: '100%',
            position: "absolute",
            textAlign: "center",
            top: 0,
            zIndex: 1000,
          }}
        >
          {getDegree(magnetometer)}°
        </Text>
      </Row>
      <MapView
        camera={{
          heading: getDegree(magnetometer),
          center: {
            latitude: 9.995440,
            longitude: -84.113388,
          },
          altitude: 1000,
        }}
        rotateEnabled={true}
        style={{ top: 0, position: 'absolute', width: '100%', height: '100%'}}
        initialRegion={mapRegion}
      ></MapView>
    </Grid>
  );
}
