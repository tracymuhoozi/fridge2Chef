import React from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RecipeCard from '../components/RecipeCard';
import { useSaved } from '../lib/store';
import { colors } from '../theme';

export default function SavedScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { saved, isSaved, toggleSave } = useSaved();

  return (
    <FlatList
      style={{ backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 20, paddingTop: insets.top + 16, flexGrow: 1 }}
      data={saved}
      keyExtractor={(r) => r.id}
      ListHeaderComponent={<Text style={s.title}>Saved recipes</Text>}
      ListEmptyComponent={
        <View style={s.empty}>
          <Text style={{ fontSize: 56 }}>🍽️</Text>
          <Text style={s.emptyTitle}>Nothing saved yet</Text>
          <Text style={s.emptySub}>Tap the heart on any recipe to keep it here.</Text>
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
  title: { fontSize: 28, fontWeight: '900', color: colors.ink, marginBottom: 18 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: colors.ink, marginTop: 12 },
  emptySub: { color: colors.muted, marginTop: 4 },
});
