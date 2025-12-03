/**
 * Location Service
 * Handles geolocation capture
 */

/**
 * Get the user's current location using browser geolocation API
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000, // 10 seconds
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        let errorMessage = 'Unable to retrieve location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        
        reject(new Error(errorMessage));
      },
      options
    );
  });
};

/**
 * Get location coordinates (no reverse geocoding)
 * @returns {Promise<{latitude: number, longitude: number, error?: string}>}
 */
export const getCompleteLocation = async () => {
  try {
    // First, get coordinates
    const coords = await getCurrentLocation();

    return {
      latitude: coords.latitude,
      longitude: coords.longitude,
    };
  } catch (locationError) {
    // Return error if location capture fails
    return {
      latitude: null,
      longitude: null,
      error: locationError.message
    };
  }
};
