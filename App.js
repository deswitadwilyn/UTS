import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  StatusBar,
  SafeAreaView,
} from 'react-native';

// =============================================
// Expense Tracker App - UTS React Native
// =============================================

export default function App() {
  // --- STATE ---
  const [transaksi, setTransaksi] = useState([
    { id: '1', ket: 'Uang Saku', nominal: 500000, tipe: 'masuk' },
    { id: '2', ket: 'Beli Cilok', nominal: 10000, tipe: 'keluar' },
  ]);
  const [inputKet, setInputKet] = useState('');
  const [inputNominal, setInputNominal] = useState('');

  // --- LOGIKA HITUNG SALDO ---
  const saldo = transaksi.reduce((total, item) => {
    if (item.tipe === 'masuk') {
      return total + item.nominal;
    } else {
      return total - item.nominal;
    }
  }, 0);

  const totalMasuk = transaksi
    .filter((t) => t.tipe === 'masuk')
    .reduce((total, t) => total + t.nominal, 0);

  const totalKeluar = transaksi
    .filter((t) => t.tipe === 'keluar')
    .reduce((total, t) => total + t.nominal, 0);

  // --- FORMAT RUPIAH ---
  const formatRupiah = (angka) => {
    return 'Rp ' + angka.toLocaleString('id-ID');
  };

  // --- TAMBAH TRANSAKSI ---
  const tambahTransaksi = (tipe) => {
    // Validasi input
    if (!inputKet.trim()) {
      Alert.alert('Peringatan', 'Deskripsi tidak boleh kosong!');
      return;
    }
    const nominal = parseFloat(inputNominal);
    if (!inputNominal || isNaN(nominal) || nominal <= 0) {
      Alert.alert('Peringatan', 'Masukkan nominal yang valid!');
      return;
    }

    // Buat transaksi baru
    const transaksiBarut = {
      id: Date.now().toString(), // ID unik pakai timestamp
      ket: inputKet.trim(),
      nominal: nominal,
      tipe: tipe, // 'masuk' atau 'keluar'
    };

    // Update state - tambahkan ke array
    setTransaksi([transaksiBarut, ...transaksi]);

    // Reset input form
    setInputKet('');
    setInputNominal('');
  };

  // --- HAPUS TRANSAKSI ---
  const hapusTransaksi = (id) => {
    Alert.alert('Konfirmasi', 'Hapus transaksi ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => {
          setTransaksi(transaksi.filter((t) => t.id !== id));
        },
      },
    ]);
  };

  // --- RENDER ITEM FLATLIST ---
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemCard}
      onLongPress={() => hapusTransaksi(item.id)}
      activeOpacity={0.7}
    >
      {/* Indikator warna kiri */}
      <View
        style={[
          styles.itemIndicator,
          item.tipe === 'masuk'
            ? styles.indicatorMasuk
            : styles.indicatorKeluar,
        ]}
      />

      {/* Isi item */}
      <View style={styles.itemBody}>
        <Text style={styles.itemKet}>{item.ket}</Text>
        <Text style={styles.itemTipe}>
          {item.tipe === 'masuk' ? '↑ Pemasukan' : '↓ Pengeluaran'}
        </Text>
      </View>

      {/* Nominal - warna kondisional (HIJAU/MERAH) */}
      <Text
        style={[
          styles.itemNominal,
          item.tipe === 'masuk' ? styles.nominalMasuk : styles.nominalKeluar,
        ]}
      >
        {item.tipe === 'masuk' ? '+' : '-'}
        {formatRupiah(item.nominal)}
      </Text>
    </TouchableOpacity>
  );

  // --- KOMPONEN UTAMA ---
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      {/* ==================== HEADER SALDO ==================== */}
      <View style={styles.saldoCard}>
        <Text style={styles.saldoLabel}>Saldo Saat Ini</Text>
        <Text
          style={[
            styles.saldoValue,
            saldo >= 0 ? styles.saldoPositif : styles.saldoNegatif,
          ]}
        >
          {formatRupiah(saldo)}
        </Text>

        {/* Sub-total masuk & keluar */}
        <View style={styles.subTotalRow}>
          <View style={styles.subTotalBox}>
            <Text style={styles.subTotalLabel}>Pemasukan</Text>
            <Text style={[styles.subTotalValue, styles.nominalMasuk]}>
              {formatRupiah(totalMasuk)}
            </Text>
          </View>
          <View style={styles.subTotalDivider} />
          <View style={styles.subTotalBox}>
            <Text style={styles.subTotalLabel}>Pengeluaran</Text>
            <Text style={[styles.subTotalValue, styles.nominalKeluar]}>
              {formatRupiah(totalKeluar)}
            </Text>
          </View>
        </View>
      </View>

      {/* ==================== FORM INPUT ==================== */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Tambah Transaksi</Text>

        {/* Input Deskripsi */}
        <TextInput
          style={styles.input}
          placeholder="Deskripsi (contoh: Beli Makan)"
          placeholderTextColor="#9CA3AF"
          value={inputKet}
          onChangeText={setInputKet}
          maxLength={50}
        />

        {/* Input Nominal */}
        <TextInput
          style={styles.input}
          placeholder="Nominal (contoh: 50000)"
          placeholderTextColor="#9CA3AF"
          value={inputNominal}
          onChangeText={setInputNominal}
          keyboardType="numeric"
        />

        {/* Tombol Aksi */}
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={[styles.btn, styles.btnMasuk]}
            onPress={() => tambahTransaksi('masuk')}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>+ Pemasukan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.btnKeluar]}
            onPress={() => tambahTransaksi('keluar')}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>- Pengeluaran</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ==================== LIST HISTORY ==================== */}
      <Text style={styles.historyLabel}>
        Riwayat ({transaksi.length} transaksi)
      </Text>

      <FlatList
        data={transaksi}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Belum ada transaksi.</Text>
            <Text style={styles.emptySubtext}>
              Tambahkan pemasukan atau pengeluaran di atas!
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

// =============================================
// STYLES
// =============================================
const HIJAU = '#27A06A';    // Warna pemasukan (hijau)
const MERAH = '#E24B4A';    // Warna pengeluaran (merah)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  // --- Saldo Card ---
  saldoCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginBottom: 8,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  saldoLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  saldoValue: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 16,
  },
  saldoPositif: {
    color: HIJAU,
  },
  saldoNegatif: {
    color: MERAH,
  },
  subTotalRow: {
    flexDirection: 'row',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  subTotalBox: {
    flex: 1,
    alignItems: 'center',
  },
  subTotalDivider: {
    width: 1,
    backgroundColor: '#F3F4F6',
  },
  subTotalLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  subTotalValue: {
    fontSize: 14,
    fontWeight: '600',
  },

  // --- Form Card ---
  formCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  formTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#F9FAFB',
    marginBottom: 10,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnMasuk: {
    backgroundColor: HIJAU,
  },
  btnKeluar: {
    backgroundColor: MERAH,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // --- History List ---
  historyLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginHorizontal: 16,
    marginBottom: 6,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 6,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  itemIndicator: {
    width: 4,
    alignSelf: 'stretch',
  },
  indicatorMasuk: {
    backgroundColor: HIJAU,
  },
  indicatorKeluar: {
    backgroundColor: MERAH,
  },
  itemBody: {
    flex: 1,
    padding: 12,
  },
  itemKet: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  itemTipe: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  itemNominal: {
    fontSize: 14,
    fontWeight: '700',
    paddingRight: 12,
  },

  // Warna Nominal - INI PENTING sesuai requirement!
  nominalMasuk: {
    color: HIJAU,   // HIJAU untuk pemasukan ✓
  },
  nominalKeluar: {
    color: MERAH,   // MERAH untuk pengeluaran ✓
  },

  // --- Empty State ---
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 4,
  },
});
