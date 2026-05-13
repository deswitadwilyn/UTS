import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [keterangan, setKeterangan] = useState('');
  const [nominal, setNominal] = useState('');

  // Hitung total pemasukan dan pengeluaran
  const totalPemasukan = transactions
    .filter((t) => t.tipe === 'masuk')
    .reduce((sum, t) => sum + t.nominal, 0);

  const totalPengeluaran = transactions
    .filter((t) => t.tipe === 'keluar')
    .reduce((sum, t) => sum + t.nominal, 0);

  const saldo = totalPemasukan - totalPengeluaran;

  // Format angka ke Rupiah
  const formatRupiah = (angka) => {
    return 'Rp ' + angka.toLocaleString('id-ID');
  };

  // Handler tambah transaksi
  const tambahTransaksi = (tipe) => {
    if (!keterangan.trim()) {
      Alert.alert('Oops!', 'Nama transaksi nggak boleh kosong, Bro!');
      return;
    }
    const nominalAngka = parseInt(nominal.replace(/\D/g, ''), 10);
    if (!nominalAngka || nominalAngka <= 0) {
      Alert.alert('Oops!', 'Nominal harus lebih dari 0, Bro!');
      return;
    }

    const transaksiBarু = {
      id: Date.now().toString(),
      ket: keterangan.trim(),
      nominal: nominalAngka,
      tipe: tipe, // 'masuk' atau 'keluar'
    };

    setTransactions([transaksiBarু, ...transactions]);
    setKeterangan('');
    setNominal('');
  };

  // Render tiap item transaksi
  const renderItem = ({ item, index }) => (
    <View style={[styles.itemCard, index === 0 && styles.itemCardFirst]}>
      <View style={styles.itemLeft}>
        <View
          style={[
            styles.itemIcon,
            item.tipe === 'masuk' ? styles.iconMasuk : styles.iconKeluar,
          ]}
        >
          <Text style={styles.iconText}>
            {item.tipe === 'masuk' ? '↑' : '↓'}
          </Text>
        </View>
        <View>
          <Text style={styles.itemKet}>{item.ket}</Text>
          <Text style={styles.itemTipe}>
            {item.tipe === 'masuk' ? 'Pemasukan' : 'Pengeluaran'}
          </Text>
        </View>
      </View>
      <Text
        style={[
          styles.itemNominal,
          item.tipe === 'masuk' ? styles.nominalMasuk : styles.nominalKeluar,
        ]}
      >
        {item.tipe === 'masuk' ? '+' : '-'} {formatRupiah(item.nominal)}
      </Text>
    </View>
  );

  // Komponen header saldo
  const ListHeader = () => (
    <>
      {/* Dashboard Saldo */}
      <View style={styles.saldoCard}>
        <Text style={styles.saldoLabel}>Saldo Kamu</Text>
        <Text style={styles.saldoNominal}>{formatRupiah(saldo)}</Text>
        <View style={styles.saldoRow}>
          <View style={styles.saldoItem}>
            <Text style={styles.saldoSubLabel}>💰 Pemasukan</Text>
            <Text style={styles.saldoPemasukan}>
              {formatRupiah(totalPemasukan)}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.saldoItem}>
            <Text style={styles.saldoSubLabel}>🛍️ Pengeluaran</Text>
            <Text style={styles.saldoPengeluaran}>
              {formatRupiah(totalPengeluaran)}
            </Text>
          </View>
        </View>
      </View>

      {/* Form Input */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Tambah Transaksi</Text>
        <TextInput
          style={styles.input}
          placeholder="Nama transaksi (cth: Beli Kopi)"
          placeholderTextColor="#aaa"
          value={keterangan}
          onChangeText={setKeterangan}
        />
        <TextInput
          style={styles.input}
          placeholder="Nominal (Rp)"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
          value={nominal}
          onChangeText={setNominal}
        />
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.buttonMasuk]}
            onPress={() => tambahTransaksi('masuk')}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>+ Pemasukan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonKeluar]}
            onPress={() => tambahTransaksi('keluar')}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>- Pengeluaran</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Label riwayat */}
      <Text style={styles.riwayatLabel}>📋 Riwayat Transaksi</Text>
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        {/* App Header */}
        <View style={styles.appHeader}>
          <Text style={styles.appTitle}>💼 DompetKu</Text>
          <Text style={styles.appSubtitle}>Catat, Kontrol, Tenang!</Text>
        </View>

        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🗂️</Text>
              <Text style={styles.emptyText}>
                Belum ada transaksi, Bro!
              </Text>
              <Text style={styles.emptySubText}>
                Yuk mulai catat keuanganmu sekarang.
              </Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },

  // --- App Header ---
  appHeader: {
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a4e',
  },
  appTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  appSubtitle: {
    fontSize: 13,
    color: '#8888bb',
    marginTop: 2,
  },

  // --- List ---
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    backgroundColor: '#f0f2f8',
  },

  // --- Saldo Card ---
  saldoCard: {
    backgroundColor: '#16213e',
    borderRadius: 20,
    padding: 24,
    marginTop: 16,
    marginBottom: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saldoLabel: {
    fontSize: 14,
    color: '#8888bb',
    marginBottom: 6,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  saldoNominal: {
    fontSize: 36,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  saldoRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  saldoItem: { alignItems: 'center', flex: 1 },
  saldoSubLabel: { fontSize: 12, color: '#8888bb', marginBottom: 4 },
  saldoPemasukan: { fontSize: 16, fontWeight: '700', color: '#4ade80' },
  saldoPengeluaran: { fontSize: 16, fontWeight: '700', color: '#f87171' },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: '#2a2a4e',
  },

  // --- Form Card ---
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 14,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#e0e0f0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1a1a2e',
    marginBottom: 10,
    backgroundColor: '#f8f9ff',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  button: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonMasuk: { backgroundColor: '#22c55e' },
  buttonKeluar: { backgroundColor: '#ef4444' },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.3,
  },

  // --- Riwayat Label ---
  riwayatLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 10,
  },

  // --- Item Card ---
  itemCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  itemCardFirst: {
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconMasuk: { backgroundColor: '#dcfce7' },
  iconKeluar: { backgroundColor: '#fee2e2' },
  iconText: { fontSize: 18 },
  itemKet: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 2,
  },
  itemTipe: { fontSize: 12, color: '#888' },
  itemNominal: {
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
  nominalMasuk: { color: '#22c55e' },
  nominalKeluar: { color: '#ef4444' },

  // --- Empty State ---
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyIcon: { fontSize: 52, marginBottom: 14 },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#444',
    marginBottom: 6,
  },
  emptySubText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
  },
});