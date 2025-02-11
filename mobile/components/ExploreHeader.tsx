import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { categories } from '../../shared/constants/categories';

type Category = {
  label: string;
  description: string;
  icon: string;
};

const ExploreHeader = () => {
  return (
    <SafeAreaView>
      <View className="mx-5 mt-4">
        <Link href="/(root)/(modals)/booking" asChild>
          <TouchableOpacity className="flex-row items-center gap-2 rounded-full bg-white p-3 shadow-lg">
            <View className="pl-3">
              <Ionicons name="search" size={24} />
            </View>
            <View className="pl-1">
              <Text className="text-sm font-semibold">Where to?</Text>
              <Text className="text-xs text-gray-500">
                Anywhere · Any week · Add guests
              </Text>
            </View>

            <View className="ml-auto">
              <TouchableOpacity className="rounded-full border border-gray-200 p-2">
                <Ionicons name="options-outline" size={24} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Link>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="gap-4 px-5 pt-4"
      >
        {categories.map((item: Category, index: number) => (
          <TouchableOpacity key={index} className="items-center justify-center">
            <View className="items-center justify-center rounded-full bg-gray-100 p-2">
              <Ionicons name={item.icon as any} size={24} color="#000" />
            </View>
            <Text className="mt-1 text-xs text-gray-600">
              {item.description}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExploreHeader;
