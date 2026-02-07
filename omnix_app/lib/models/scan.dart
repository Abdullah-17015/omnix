import 'package:cloud_firestore/cloud_firestore.dart';
import 'detected_product.dart';
import 'eco_score.dart';
import 'origin_pin.dart';

class Scan {
  final String? id;
  final String uid;
  final DateTime createdAt;
  final DetectedProduct detectedProduct;
  final EcoScore ecoScore;
  final List<OriginPin> originPins;

  Scan({
    this.id,
    required this.uid,
    required this.createdAt,
    required this.detectedProduct,
    required this.ecoScore,
    required this.originPins,
  });

  factory Scan.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return Scan(
      id: doc.id,
      uid: data['uid'] as String? ?? '',
      createdAt: (data['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
      detectedProduct: DetectedProduct.fromJson(
        data['detectedProduct'] as Map<String, dynamic>? ?? {},
      ),
      ecoScore: EcoScore.fromJson(
        data['ecoScore'] as Map<String, dynamic>? ?? {},
      ),
      originPins: (data['originPins'] as List<dynamic>?)
          ?.map((p) => OriginPin.fromJson(p as Map<String, dynamic>))
          .toList() ?? [],
    );
  }

  Map<String, dynamic> toFirestore() => {
    'uid': uid,
    'createdAt': FieldValue.serverTimestamp(),
    'detectedProduct': detectedProduct.toJson(),
    'ecoScore': ecoScore.toJson(),
    'originPins': originPins.map((p) => p.toJson()).toList(),
  };

  String get formattedDate {
    final now = DateTime.now();
    final diff = now.difference(createdAt);
    
    if (diff.inMinutes < 1) return 'Just now';
    if (diff.inHours < 1) return '${diff.inMinutes}m ago';
    if (diff.inDays < 1) return '${diff.inHours}h ago';
    if (diff.inDays < 7) return '${diff.inDays}d ago';
    
    return '${createdAt.month}/${createdAt.day}/${createdAt.year}';
  }
}
