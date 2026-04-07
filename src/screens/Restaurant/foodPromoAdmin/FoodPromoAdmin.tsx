import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../../navigation/authStack/AuthStack';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import { ShowToast } from '../../../config/constants';
import {
  useCreateFoodPromoMutation,
  useGetFoodPromosQuery,
} from '../../../redux/services/discountService';

const FoodPromoAdmin = () => {
  const navigation = useNavigation<NavigationPropType>();
  const { data, isLoading, refetch } = useGetFoodPromosQuery(undefined);
  const [createPromo, { isLoading: creating }] = useCreateFoodPromoMutation();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [minOrderAmount, setMinOrderAmount] = useState('');
  const [maxDiscountAmount, setMaxDiscountAmount] = useState('');
  const [usageLimit, setUsageLimit] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [moduleScope, setModuleScope] = useState<'food' | 'ride' | 'all'>('food');

  const payload = data as { data?: unknown } | undefined;
  const rows = payload?.data;
  const list = Array.isArray(rows) ? rows : [];

  const handleCreate = async () => {
    if (!name.trim() || !code.trim() || discount === '') {
      ShowToast('error', 'Name, code, and discount are required');
      return;
    }
    try {
      let expiresIso: string | null = null;
      const exp = expiresAt.trim();
      if (exp) {
        const d = new Date(`${exp}T23:59:59.999Z`);
        expiresIso = Number.isNaN(d.getTime()) ? null : d.toISOString();
      }
      await createPromo({
        name: name.trim(),
        code: code.trim(),
        discount: Number(discount),
        discountType,
        moduleScope,
        minOrderAmount: minOrderAmount ? Number(minOrderAmount) : null,
        maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : null,
        usageLimit: usageLimit ? Number(usageLimit) : null,
        expiresAt: expiresIso,
      }).unwrap();
      ShowToast('success', 'Promo created');
      setName('');
      setCode('');
      setDiscount('');
      setMinOrderAmount('');
      setMaxDiscountAmount('');
      setUsageLimit('');
      setExpiresAt('');
      refetch();
    } catch (e: any) {
      const msg = e?.data?.message || e?.error || 'Could not create promo';
      ShowToast('error', typeof msg === 'string' ? msg : 'Could not create promo');
    }
  };

  return (
    <WrapperContainer navigation={navigation} title="Food promos (admin)">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionTitle}>Create promo</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.typeBtn, moduleScope === 'food' && styles.typeBtnActive]}
            onPress={() => setModuleScope('food')}
          >
            <Text style={[styles.typeBtnText, moduleScope === 'food' && styles.typeBtnTextActive]}>Food</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeBtn, moduleScope === 'ride' && styles.typeBtnActive]}
            onPress={() => setModuleScope('ride')}
          >
            <Text style={[styles.typeBtnText, moduleScope === 'ride' && styles.typeBtnTextActive]}>Ride</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeBtn, moduleScope === 'all' && styles.typeBtnActive]}
            onPress={() => setModuleScope('all')}
          >
            <Text style={[styles.typeBtnText, moduleScope === 'all' && styles.typeBtnTextActive]}>Both</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor={colors.c_666666}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Code (e.g. EAT20)"
          placeholderTextColor={colors.c_666666}
          value={code}
          onChangeText={setCode}
          autoCapitalize="characters"
        />
        <TextInput
          style={styles.input}
          placeholder={discountType === 'percentage' ? 'Percent off (e.g. 15)' : 'Fixed amount off'}
          placeholderTextColor={colors.c_666666}
          value={discount}
          onChangeText={setDiscount}
          keyboardType="decimal-pad"
        />
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.typeBtn, discountType === 'percentage' && styles.typeBtnActive]}
            onPress={() => setDiscountType('percentage')}
          >
            <Text style={[styles.typeBtnText, discountType === 'percentage' && styles.typeBtnTextActive]}>%</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeBtn, discountType === 'fixed' && styles.typeBtnActive]}
            onPress={() => setDiscountType('fixed')}
          >
            <Text style={[styles.typeBtnText, discountType === 'fixed' && styles.typeBtnTextActive]}>Fixed</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Min order (optional)"
          placeholderTextColor={colors.c_666666}
          value={minOrderAmount}
          onChangeText={setMinOrderAmount}
          keyboardType="decimal-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Max discount cap for % (optional)"
          placeholderTextColor={colors.c_666666}
          value={maxDiscountAmount}
          onChangeText={setMaxDiscountAmount}
          keyboardType="decimal-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Usage limit (optional)"
          placeholderTextColor={colors.c_666666}
          value={usageLimit}
          onChangeText={setUsageLimit}
          keyboardType="number-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Expires YYYY-MM-DD (optional, ends 23:59 UTC)"
          placeholderTextColor={colors.c_666666}
          value={expiresAt}
          onChangeText={setExpiresAt}
        />
        <TouchableOpacity
          style={[styles.createBtn, creating && styles.createBtnDisabled]}
          onPress={handleCreate}
          disabled={creating}
        >
          {creating ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.createBtnText}>Create</Text>
          )}
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Existing promos</Text>
        {isLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: 16 }} />
        ) : (
          <FlatList
            scrollEnabled={false}
            data={list}
            keyExtractor={(item: any) => String(item.id)}
            renderItem={({ item }: { item: any }) => (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardMeta}>
                  {item.code} · {item.type === 'percentage' ? `${item.discount}%` : item.discount}{' '}
                  · used {item.usageCount ?? 0}
                  {item.usageLimit != null ? ` / ${item.usageLimit}` : ''}
                </Text>
                <Text style={styles.cardMeta}>
                  {item.moduleScope === 'ride'
                    ? 'Ride'
                    : item.moduleScope === 'all'
                      ? 'Food & ride'
                      : 'Food'}{' '}
                  · {item.isActive ? 'Active' : 'Inactive'}
                </Text>
              </View>
            )}
          />
        )}
      </ScrollView>
    </WrapperContainer>
  );
};

export default FoodPromoAdmin;

const styles = StyleSheet.create({
  scroll: { paddingBottom: 40 },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.semibold,
    color: colors.black,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.c_DDDDDD,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    fontFamily: fonts.normal,
    color: colors.black,
  },
  row: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  typeBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.c_F3F3F3,
  },
  typeBtnActive: {
    backgroundColor: colors.c_0162C0,
  },
  typeBtnText: {
    fontFamily: fonts.semibold,
    color: colors.black,
  },
  typeBtnTextActive: {
    color: colors.white,
  },
  createBtn: {
    backgroundColor: colors.c_0162C0,
    borderRadius: 100,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  createBtnDisabled: { opacity: 0.6 },
  createBtnText: {
    color: colors.white,
    fontFamily: fonts.semibold,
    fontSize: 16,
  },
  card: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.c_F3F3F3,
    marginBottom: 10,
  },
  cardTitle: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.black,
  },
  cardMeta: {
    fontFamily: fonts.normal,
    fontSize: 13,
    color: colors.c_666666,
    marginTop: 4,
  },
});
