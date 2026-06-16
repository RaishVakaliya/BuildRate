import { useState, useEffect } from "react";
import * as Location from "expo-location";

export interface LocationState {
  area: string | null;
  city: string | null;
  loading: boolean;
  permissionDenied: boolean;
}

// Extracts the most specific locality from a geocoded address.
function extractArea(geocode: Location.LocationGeocodedAddress): {
  area: string | null;
  city: string | null;
} {
  const city = geocode.city || geocode.subregion || geocode.region || null;

  const area = geocode.district || geocode.subregion || geocode.name || city;

  return { area: area ?? null, city: city ?? null };
}

export interface LocationState {
  area: string | null;
  city: string | null;
  loading: boolean;
  permissionDenied: boolean;
  requestLocation: () => Promise<void>;
}

export function useLocation(): LocationState {
  const [state, setState] = useState<{
    area: string | null;
    city: string | null;
    loading: boolean;
    permissionDenied: boolean;
  }>({
    area: null,
    city: null,
    loading: true,
    permissionDenied: false,
  });

  const fetchLocation = async () => {
    setState((prev) => ({ ...prev, loading: true, permissionDenied: false }));
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setState({
          area: null,
          city: null,
          loading: false,
          permissionDenied: true,
        });
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const geocodes = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      if (geocodes.length > 0) {
        const { area, city } = extractArea(geocodes[0]);
        setState({ area, city, loading: false, permissionDenied: false });
      } else {
        setState({
          area: null,
          city: null,
          loading: false,
          permissionDenied: false,
        });
      }
    } catch {
      setState({
        area: null,
        city: null,
        loading: false,
        permissionDenied: false,
      });
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  return { ...state, requestLocation: fetchLocation };
}
