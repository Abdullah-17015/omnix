import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/scan.dart';
import 'auth_provider.dart';

final firestoreProvider = Provider<FirebaseFirestore>((ref) {
  return FirebaseFirestore.instance;
});

final historyProvider = StreamProvider<List<Scan>>((ref) {
  final user = ref.watch(currentUserProvider);
  if (user == null) {
    return Stream.value([]);
  }

  final firestore = ref.watch(firestoreProvider);
  return firestore
      .collection('scans')
      .where('uid', isEqualTo: user.uid)
      .orderBy('createdAt', descending: true)
      .limit(50)
      .snapshots()
      .map((snapshot) => snapshot.docs.map((doc) => Scan.fromFirestore(doc)).toList());
});

class HistoryNotifier extends StateNotifier<AsyncValue<void>> {
  final Ref _ref;

  HistoryNotifier(this._ref) : super(const AsyncValue.data(null));

  Future<String?> saveScan(Scan scan) async {
    state = const AsyncValue.loading();
    try {
      final firestore = _ref.read(firestoreProvider);
      final docRef = await firestore.collection('scans').add(scan.toFirestore());
      state = const AsyncValue.data(null);
      return docRef.id;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      return null;
    }
  }

  Future<void> deleteScan(String scanId) async {
    state = const AsyncValue.loading();
    try {
      final firestore = _ref.read(firestoreProvider);
      await firestore.collection('scans').doc(scanId).delete();
      state = const AsyncValue.data(null);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}

final historyNotifierProvider = StateNotifierProvider<HistoryNotifier, AsyncValue<void>>((ref) {
  return HistoryNotifier(ref);
});
