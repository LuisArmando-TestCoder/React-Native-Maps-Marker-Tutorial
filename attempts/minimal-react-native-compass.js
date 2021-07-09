import React, {useState, useEffect} from "react";
import {magnetometer as Magnetometer, SensorTypes, setUpdateIntervalForType} from "react-native-sensors";

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
    setUpdateIntervalForType(SensorTypes.magnetometer, 16);

    setSubscriptions([
      ...subscriptions,
      Magnetometer.subscribe({
        complete: setMagnetometer,
      })
    ]);

    return () => {
      subscriptions.forEach(subscription => subscription.unsubscribe())
    }
  }, [])

  return (
    <Text>{getDegree(magnetometer)}°</Text>
  );
}
