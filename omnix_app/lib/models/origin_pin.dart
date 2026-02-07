class OriginPin {
  final String material;
  final String place;
  final double lat;
  final double lng;
  final String citationUrl;
  final double confidence;

  OriginPin({
    required this.material,
    required this.place,
    required this.lat,
    required this.lng,
    required this.citationUrl,
    required this.confidence,
  });

  factory OriginPin.fromJson(Map<String, dynamic> json) {
    return OriginPin(
      material: json['material'] as String? ?? '',
      place: json['place'] as String? ?? '',
      lat: (json['lat'] as num?)?.toDouble() ?? 0.0,
      lng: (json['lng'] as num?)?.toDouble() ?? 0.0,
      citationUrl: json['citationUrl'] as String? ?? '',
      confidence: (json['confidence'] as num?)?.toDouble() ?? 0.5,
    );
  }

  Map<String, dynamic> toJson() => {
    'material': material,
    'place': place,
    'lat': lat,
    'lng': lng,
    'citationUrl': citationUrl,
    'confidence': confidence,
  };

  String get confidenceLabel {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.5) return 'Medium';
    return 'Low';
  }
}
