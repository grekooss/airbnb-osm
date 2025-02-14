import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { Models, Query } from 'react-native-appwrite';
import { database } from '../lib/appwrite';

interface Listing extends Models.Document {
  osm_id: string;
  name: string;
  operator: string;
  brand: string;
  addr_housename: string;
  addr_housenumber: string;
  amenity: string;
  barrier: string;
  building: string;
  landuse: string;
  leisure: string;
  natural: string;
  sport: string;
  surface: string;
  way_area: number;
  center_point: string;
  way: string;
}

const Listings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        console.log(
          'Database ID:',
          process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID
        );
        const response = await database.listDocuments<Listing>(
          process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
          'landings',
          [Query.limit(10)]
        );
        console.log('Response:', response);
        setListings(response.documents);
      } catch (error) {
        console.error('Błąd podczas pobierania danych:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg">Ładowanie...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 px-4 py-2">
      <FlatList
        data={listings}
        keyExtractor={item => item.$id}
        className="space-y-4"
        renderItem={({ item }) => (
          <View className="rounded-xl bg-white p-4 shadow-md">
            <Text className="mb-2 text-xl font-bold">
              {item.name || 'Brak nazwy'}
            </Text>
            {item.amenity && (
              <Text className="mb-2 text-base text-gray-600">
                Typ: {item.amenity}
              </Text>
            )}
            {item.addr_housenumber && (
              <Text className="text-gray-600">
                Adres: {item.addr_housename} {item.addr_housenumber}
              </Text>
            )}
            {item.way_area && (
              <Text className="text-gray-600">
                Powierzchnia: {item.way_area.toFixed(2)} m²
              </Text>
            )}
          </View>
        )}
      />
    </View>
  );
};

export default Listings;
