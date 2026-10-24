import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, ScrollView, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, shadow, gradients } from '../theme';
import { generateRecipes } from '../lib/ai';

const QUICK = ['🥚 eggs', '🥬 spinach', '🍚 rice', '🧀 cheese', '🍅 tomato', '🧅 onion', '🍗 chicken', '🍞 bread', '🥔 potato', '🧄 garlic'];

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const add = (raw) => {
    const clean = raw.replace(/[^\p{L}\p{N}\s-]/gu, '').trim().toLowerCase();
    if (!clean || items.includes(clean) || items.length >= 20) return;
    setItems([...items, clean]);
  };

  const submit = () => {
    text.split(',').forEach(add);
    setText('');
  };

  const go = async () => {
    const final = text.trim() ? [...items, text.trim().toLowerCase()] : items;
    if (final.length === 0) return;
    setLoading(true);
    try {
      const recipes = await generateRecipes(final);
      navigation.navigate('Results', { recipes, ingredients: final });
    } catch (e) {
      Alert.alert('Oops', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} keyboardShouldPersistTaps="handled">
        <LinearGradient colors={gradients.hero} style={[s.hero, { paddingTop: insets.top + 24 }]}>
          <Text style={s.brand}>Fridge2Chef 🍳</Text>
          <Text style={s.headline}>What's hiding in your fridge?</Text>
          <Text style={s.sub}>Tell us what you've got. We'll turn it into dinner.</Text>
        </LinearGradient>

        <View style={s.body}>
          <View style={s.inputWrap}>
            <Ionicons name="search" size={20} color={colors.muted} />
            <TextInput
              style={s.input}
              placeholder="Add an ingredient..."
              placeholderTextColor={colors.muted}
              value={text}
              onChangeText={setText}
              onSubmitEditing={submit}
              returnKeyType="done"
              autoCapitalize="none"
            />
            <Pressable onPress={submit} style={s.addBtn}>
              <Ionicons name="add" size={22} color="#fff" />
            </Pressable>
          </View>

          {items.length > 0 && (
            <>
              <Text style={s.label}>In your fridge</Text>
              <View style={s.chipWrap}>
                {items.map((i) => (
                  <Pressable key={i} onPress={() => setItems(items.filter((x) => x !== i))} style={s.chipOn}>
                    <Text style={s.chipOnText}>{i}</Text>
                    <Ionicons name="close" size={14} color="#fff" />
                  </Pressable>
                ))}
              </View>
            </>
          )}

          <Text style={s.label}>Quick add</Text>
          <View style={s.chipWrap}>
            {QUICK.map((q) => {
              const name = q.split(' ')[1];
              const on = items.includes(name);
              return (
                <Pressable key={q} onPress={() => add(name)} style={[s.chip, on && { opacity: 0.4 }]}>
                  <Text style={s.chipText}>{q}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={[s.footer, { paddingBottom: insets.bottom + 12 }]}>
        <Pressable
          onPress={go}
          disabled={loading || (items.length === 0 && !text.trim())}
          style={({ pressed }) => [{ opacity: items.length === 0 && !text.trim() ? 0.5 : 1 }, pressed && { transform: [{ scale: 0.98 }] }]}
        >
          <LinearGradient colors={gradients.green} style={s.cta}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="sparkles" size={20} color="#fff" />
                <Text style={s.ctaText}>Cook up recipes</Text>
              </>
            )}
          </LinearGradient>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  hero: { paddingHorizontal: 24, paddingBottom: 56, borderBottomLeftRadius: 36, borderBottomRightRadius: 36 },
  brand: { color: '#FFE3D3', fontWeight: '800', fontSize: 15, letterSpacing: 0.5 },
  headline: { color: '#fff', fontSize: 32, fontWeight: '900', marginTop: 10, lineHeight: 38 },
  sub: { color: '#FFEDE2', fontSize: 15, marginTop: 8 },
  body: { paddingHorizontal: 20, marginTop: -28 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.card,
    borderRadius: radius.pill, paddingLeft: 18, paddingRight: 8, paddingVertical: 8, ...shadow,
  },
  input: { flex: 1, fontSize: 16, color: colors.ink, paddingVertical: 8 },
  addBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 13, fontWeight: '800', color: colors.muted, textTransform: 'uppercase', letterSpacing: 1, marginTop: 24, marginBottom: 10 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { backgroundColor: colors.chip, paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.pill },
  chipText: { color: colors.primaryDark, fontWeight: '700', fontSize: 14 },
  chipOn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.green, paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.pill },
  chipOnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 12, backgroundColor: 'rgba(255,247,238,0.95)' },
  cta: { flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: radius.pill, ...shadow },
  ctaText: { color: '#fff', fontSize: 17, fontWeight: '800' },
});
