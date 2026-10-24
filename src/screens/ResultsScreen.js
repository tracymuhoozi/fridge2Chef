import React from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import RecipeCard from '../components/RecipeCard';
import { useSaved } from '../lib/store';
import { colors } from '../theme';

export default function ResultsScreen({ route, navigation }) {
  const { recipes, ingredients } = route.params;
  const { isSaved, toggleSave } = useSaved();

  return (
    <FlatList
      style={{ backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 20 }}
      data={recipes}
      keyExtractor={(r) => r.id}
      ListHeaderComponent={
        <View style={{ marginBottom: 16 }}>
          <Text style={s.title}>Dinner is sorted </Text>
          <Text style={s.sub}>Made with: {ingredients.join(', ')}</Text>
        </View>
      }
      renderItem={({ item }) => (
        <RecipeCard
          recipe={item}
          saved={isSaved(item.id)}
          onToggleSave={() => toggleSave(item)}
          onPress={() => navigation.navigate('Detail', { recipe: item })}
        />
      )}
    />
  );
}

const s = StyleSheet.create({
  title: { fontSize: 26, fontWeight: '900', color: colors.ink },
  sub: { fontSize: 14, color: colors.muted, marginTop: 4 },
});
