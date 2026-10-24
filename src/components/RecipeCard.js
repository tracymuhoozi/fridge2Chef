import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow } from '../theme';

export default function RecipeCard({ recipe, onPress, saved, onToggleSave }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.card, pressed && { transform: [{ scale: 0.98 }] }]}>
      <View style={s.emojiBox}>
        <Text style={s.emoji}>{recipe.emoji || '🍽️'}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.title} numberOfLines={2}>{recipe.title}</Text>
        <Text style={s.desc} numberOfLines={2}>{recipe.description}</Text>
        <View style={s.metaRow}>
          <View style={s.pill}>
            <Ionicons name="time-outline" size={13} color={colors.green} />
            <Text style={s.pillText}>{recipe.time}</Text>
          </View>
          <View style={s.pill}>
            <Ionicons name="flame-outline" size={13} color={colors.green} />
            <Text style={s.pillText}>{recipe.difficulty}</Text>
          </View>
        </View>
      </View>
      {onToggleSave && (
        <Pressable hitSlop={10} onPress={onToggleSave}>
          <Ionicons name={saved ? 'heart' : 'heart-outline'} size={24} color={colors.primary} />
        </Pressable>
      )}
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 14,
    ...shadow,
  },
  emojiBox: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colors.chip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 32 },
  title: { fontSize: 17, fontWeight: '800', color: colors.ink },
  desc: { fontSize: 13, color: colors.muted, marginTop: 2 },
  metaRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.greenSoft,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  pillText: { fontSize: 12, fontWeight: '700', color: colors.green },
});
