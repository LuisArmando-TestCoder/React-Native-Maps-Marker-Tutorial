import React, {useState, useEffect} from "react";
import {Text, Dimensions} from "react-native";
import {Grid, Row} from "react-native-easy-grid";
import { Magnetometer } from 'expo-sensors';

const {height, width} = Dimensions.get("window");

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
  const setMagnetometer = sensorData => setMagnetometerState(getAngle(sensorData));

  useEffect(() => {
    Magnetometer.setUpdateInterval(16);

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
            fontSize: height / 27,
            width: width,
            position: "absolute",
            textAlign: "center",
          }}
        >
          {getDegree(magnetometer)}°
        </Text>
      </Row>
    </Grid>
  );
}
