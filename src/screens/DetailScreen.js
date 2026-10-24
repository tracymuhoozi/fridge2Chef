import React from 'react';
import { View, Text, ScrollView, Pressable, Share, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSaved } from '../lib/store';
import { colors, radius, shadow, gradients } from '../theme';

export default function DetailScreen({ route }) {
  const { recipe } = route.params;
  const { isSaved, toggleSave } = useSaved();
  const saved = isSaved(recipe.id);

  const share = () => {
    const msg =
      `${recipe.emoji || ''} ${recipe.title}\n${recipe.time} · ${recipe.difficulty}\n\n` +
      `Ingredients:\n${recipe.ingredients.map((i) => `• ${i}`).join('\n')}\n\n` +
      `Steps:\n${recipe.steps.map((st, i) => `${i + 1}. ${st}`).join('\n')}\n\nMade with Fridge2Chef`;
    Share.share({ message: msg });
  };

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={{ paddingBottom: 40 }}>
      <LinearGradient colors={gradients.hero} style={s.hero}>
        <Text style={s.emoji}>{recipe.emoji || '🍽️'}</Text>
        <Text style={s.title}>{recipe.title}</Text>
        <Text style={s.desc}>{recipe.description}</Text>
        <View style={s.metaRow}>
          <Meta icon="time-outline" text={recipe.time} />
          <Meta icon="flame-outline" text={recipe.difficulty} />
        </View>
      </LinearGradient>

      <View style={s.actions}>
        <Pressable style={[s.btn, saved && { backgroundColor: colors.primary }]} onPress={() => toggleSave(recipe)}>
          <Ionicons name={saved ? 'heart' : 'heart-outline'} size={20} color={saved ? '#fff' : colors.primary} />
          <Text style={[s.btnText, saved && { color: '#fff' }]}>{saved ? 'Saved' : 'Save'}</Text>
        </Pressable>
        <Pressable style={s.btn} onPress={share}>
          <Ionicons name="share-outline" size={20} color={colors.primary} />
          <Text style={s.btnText}>Share</Text>
        </Pressable>
      </View>

      <View style={s.section}>
        <Text style={s.h}>Ingredients</Text>
        {recipe.ingredients.map((i, idx) => (
          <View key={idx} style={s.ingRow}>
            <View style={s.dot} />
            <Text style={s.ing}>{i}</Text>
          </View>
        ))}
      </View>

      <View style={s.section}>
        <Text style={s.h}>Method</Text>
        {recipe.steps.map((st, idx) => (
          <View key={idx} style={s.stepRow}>
            <View style={s.num}><Text style={s.numText}>{idx + 1}</Text></View>
            <Text style={s.step}>{st}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const Meta = ({ icon, text }) => (
  <View style={s.meta}>
    <Ionicons name={icon} size={15} color="#fff" />
    <Text style={s.metaText}>{text}</Text>
  </View>
);

const s = StyleSheet.create({
  hero: { padding: 24, paddingBottom: 40, borderBottomLeftRadius: 36, borderBottomRightRadius: 36 },
  emoji: { fontSize: 56 },
  title: { color: '#fff', fontSize: 28, fontWeight: '900', marginTop: 8 },
  desc: { color: '#FFEDE2', fontSize: 15, marginTop: 6 },
  metaRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.22)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill },
  metaText: { color: '#fff', fontWeight: '700' },
  actions: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginTop: -22 },
  btn: { flex: 1, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.card, paddingVertical: 14, borderRadius: radius.pill, ...shadow },
  btnText: { color: colors.primary, fontWeight: '800', fontSize: 15 },
  section: { backgroundColor: colors.card, marginHorizontal: 20, marginTop: 18, padding: 20, borderRadius: radius.lg, ...shadow },
  h: { fontSize: 20, fontWeight: '900', color: colors.ink, marginBottom: 12 },
  ingRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.green },
  ing: { flex: 1, fontSize: 15, color: colors.ink },
  stepRow: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  num: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  numText: { color: '#fff', fontWeight: '800' },
  step: { flex: 1, fontSize: 15, lineHeight: 22, color: colors.ink },
});
