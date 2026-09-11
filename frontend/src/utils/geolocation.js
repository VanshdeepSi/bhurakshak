export const NE_DISTRICT_COORDS = [
  { name: 'Darjeeling', state: 'West Bengal', lat: 27.04, lon: 88.26 },
  { name: 'Kalimpong', state: 'West Bengal', lat: 27.06, lon: 88.47 },
  { name: 'Mangan', state: 'Sikkim', lat: 27.51, lon: 88.53 },
  { name: 'North Sikkim', state: 'Sikkim', lat: 27.70, lon: 88.55 },
  { name: 'East Sikkim', state: 'Sikkim', lat: 27.33, lon: 88.61 },
  { name: 'South Sikkim', state: 'Sikkim', lat: 27.17, lon: 88.35 },
  { name: 'West Sikkim', state: 'Sikkim', lat: 27.28, lon: 88.23 },
  { name: 'Tawang', state: 'Arunachal Pradesh', lat: 27.58, lon: 91.86 },
  { name: 'Papum Pare', state: 'Arunachal Pradesh', lat: 27.15, lon: 93.75 },
  { name: 'Churachandpur', state: 'Manipur', lat: 24.33, lon: 93.66 },
  { name: 'Dima Hasao', state: 'Assam', lat: 25.18, lon: 93.02 },
  { name: 'East Khasi Hills', state: 'Meghalaya', lat: 25.57, lon: 91.89 },
  { name: 'Kohima', state: 'Nagaland', lat: 25.67, lon: 94.12 },
  { name: 'Aizawl', state: 'Mizoram', lat: 23.73, lon: 92.72 },
  { name: 'Kamrup', state: 'Assam', lat: 26.31, lon: 91.60 },
  { name: 'Dibrugarh', state: 'Assam', lat: 27.47, lon: 94.91 },
];

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function findClosestDistrict(lat, lon) {
  let closest = NE_DISTRICT_COORDS[0];
  let minDistance = Infinity;

  for (const district of NE_DISTRICT_COORDS) {
    const dist = calculateDistanceKm(lat, lon, district.lat, district.lon);
    if (dist < minDistance) {
      minDistance = dist;
      closest = district;
    }
  }

  return {
    ...closest,
    distanceKm: Math.round(minDistance)
  };
}

export function requestDeviceLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const closest = findClosestDistrict(latitude, longitude);
        resolve({
          latitude,
          longitude,
          accuracy: Math.round(accuracy),
          closestDistrict: closest.name,
          state: closest.state,
          distanceKm: closest.distanceKm
        });
      },
      (error) => {
        let msg = 'Unable to retrieve location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied by the user.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information is unavailable on this device.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out.';
        }
        reject(new Error(msg));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  });
}
