import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface ListingsMapProps {
  onBoundsChange?: (bounds: MapBounds) => void;
  onMapStateChange?: (state: {
    center: [number, number];
    zoom: number;
  }) => void;
  initialState?: {
    center: [number, number];
    zoom: number;
  };
}

const ListingsMap = ({
  onBoundsChange,
  onMapStateChange,
  initialState = {
    center: [52.237049, 21.017532],
    zoom: 13,
  },
}: ListingsMapProps) => {
  const [mapType, setMapType] = useState<'carto' | 'standard' | 'satellite'>(
    'carto'
  );
  const webViewRef = useRef<WebView>(null);
  const [locationPermission, setLocationPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
    })();
  }, []);

  const updateLocation = async () => {
    if (!webViewRef.current || !locationPermission) return;

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      webViewRef.current?.injectJavaScript(`
        if (typeof updateUserLocation === 'function') {
          updateUserLocation(${location.coords.latitude}, ${location.coords.longitude}, ${location.coords.accuracy});
        }
        true;
      `);
    } catch (error) {
      console.error('Błąd lokalizacji:', error);
    }
  };

  const mapHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body { margin: 0; padding: 0; }
          #map { width: 100%; height: 100vh; }
          .custom-controls {
            position: absolute;
            top: 16px;
            left: 16px;
            z-index: 1000;
          }
          .custom-controls button {
            width: 40px;
            height: 40px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .location-marker {
            width: 24px;
            height: 24px;
            position: relative;
          }
          .location-marker::before {
            content: '';
            position: absolute;
            width: 24px;
            height: 24px;
            left: 0;
            top: 0;
            background: rgba(37, 99, 235, 0.2);
            border-radius: 50%;
            animation: pulse 2s infinite;
          }
          .location-marker::after {
            content: '';
            position: absolute;
            width: 12px;
            height: 12px;
            left: 6px;
            top: 6px;
            background: rgb(37, 99, 235);
            border: 2px solid white;
            border-radius: 50%;
          }
          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            100% {
              transform: scale(3);
              opacity: 0;
            }
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map', {
            zoomControl: false,
            attributionControl: false
          }).setView([${initialState.center[0]}, ${initialState.center[1]}], ${initialState.zoom});
          
          let currentLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            className: '[filter:contrast(85%)_brightness(105%)_saturate(95%)]'
          }).addTo(map);
          
          let standardLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
          let satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');
          let cartoLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            className: '[filter:contrast(85%)_brightness(105%)_saturate(95%)]'
          });

          // Dodaj kontrolki
          const controlsDiv = L.DomUtil.create('div', 'custom-controls');
          
          // Przycisk lokalizacji
          const locateBtn = L.DomUtil.create('button', '', controlsDiv);
          locateBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" style="transform: rotate(-45deg);"><path d="M4 4l16 8-16 8 4-8-4-8z" fill="#000000"/></svg>';
          locateBtn.style.padding = '8px';
          locateBtn.onclick = () => {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'requestLocation'
            }));
          };

          map.addControl(L.control.attribution({position: 'bottomright'}));
          document.body.appendChild(controlsDiv);

          let currentLocationMarker = null;
          let currentLocationCircle = null;

          // Funkcja do aktualizacji lokalizacji użytkownika
          window.updateUserLocation = function(lat, lng, accuracy) {
            if (currentLocationMarker) {
              map.removeLayer(currentLocationMarker);
            }
            if (currentLocationCircle) {
              map.removeLayer(currentLocationCircle);
            }

            const markerHtml = '<div class="location-marker"></div>';
            const customIcon = L.divIcon({
              html: markerHtml,
              className: '',
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            });

            currentLocationMarker = L.marker([lat, lng], {
              icon: customIcon,
              zIndexOffset: 1000
            }).addTo(map);

            currentLocationCircle = L.circle([lat, lng], {
              radius: accuracy,
              weight: 0,
              fillColor: '#2563eb',
              fillOpacity: 0.1
            }).addTo(map);

            map.setView([lat, lng], map.getZoom());
          };

          // Obsługa zdarzeń mapy
          map.on('moveend', () => {
            const bounds = map.getBounds();
            const center = map.getCenter();
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'mapState',
              bounds: {
                north: bounds.getNorth(),
                south: bounds.getSouth(),
                east: bounds.getEast(),
                west: bounds.getWest()
              },
              center: [center.lat, center.lng],
              zoom: map.getZoom()
            }));
          });

          // Nasłuchiwanie na wiadomości z React Native
          window.addEventListener('message', (e) => {
            const data = JSON.parse(e.data);
            if (data.type === 'changeMapType') {
              map.removeLayer(currentLayer);
              if (data.mapType === 'satellite') {
                currentLayer = satelliteLayer.addTo(map);
              } else if (data.mapType === 'standard') {
                currentLayer = standardLayer.addTo(map);
              } else {
                currentLayer = cartoLayer.addTo(map);
              }
            }
          });
        </script>
      </body>
    </html>
  `;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'mapState') {
        onBoundsChange?.(data.bounds);
        onMapStateChange?.({
          center: data.center,
          zoom: data.zoom,
        });
      } else if (data.type === 'requestLocation') {
        updateLocation();
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  };

  const toggleMapType = () => {
    const mapTypes: ('carto' | 'standard' | 'satellite')[] = [
      'carto',
      'standard',
      'satellite',
    ];
    const currentIndex = mapTypes.indexOf(mapType);
    const newType = mapTypes[(currentIndex + 1) % mapTypes.length];
    setMapType(newType);
    webViewRef.current?.injectJavaScript(`
      window.postMessage(JSON.stringify({
        type: 'changeMapType',
        mapType: '${newType}'
      }));
      true;
    `);
  };

  const getMapIcon = () => {
    switch (mapType) {
      case 'carto':
        return 'map';
      case 'standard':
        return 'map-outline';
      case 'satellite':
        return 'earth';
    }
  };

  return (
    <View className="flex-1 bg-white">
      <WebView
        ref={webViewRef}
        source={{ html: mapHTML }}
        className="flex-1"
        scrollEnabled={false}
        onMessage={handleMessage}
      />
      <TouchableOpacity
        className="absolute right-4 top-4 rounded-lg bg-white p-2 shadow-md"
        onPress={toggleMapType}
      >
        <Ionicons name={getMapIcon()} size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

export default ListingsMap;
