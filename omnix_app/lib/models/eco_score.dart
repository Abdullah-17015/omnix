class EcoScore {
  final int total;
  final int sourcing;
  final int transparency;
  final int repairability;
  final List<String> rationaleBullets;
  final String summary;
  final List<String> gemmaTips;

  EcoScore({
    required this.total,
    required this.sourcing,
    required this.transparency,
    required this.repairability,
    required this.rationaleBullets,
    required this.summary,
    required this.gemmaTips,
  });

  factory EcoScore.fromJson(Map<String, dynamic> json) {
    return EcoScore(
      total: (json['total'] as num?)?.toInt() ?? 0,
      sourcing: (json['sourcing'] as num?)?.toInt() ?? 0,
      transparency: (json['transparency'] as num?)?.toInt() ?? 0,
      repairability: (json['repairability'] as num?)?.toInt() ?? 0,
      rationaleBullets: List<String>.from(json['rationaleBullets'] ?? []),
      summary: json['summary'] as String? ?? '',
      gemmaTips: List<String>.from(json['gemmaTips'] ?? []),
    );
  }

  Map<String, dynamic> toJson() => {
    'total': total,
    'sourcing': sourcing,
    'transparency': transparency,
    'repairability': repairability,
    'rationaleBullets': rationaleBullets,
    'summary': summary,
    'gemmaTips': gemmaTips,
  };

  String get grade {
    if (total >= 80) return 'A';
    if (total >= 60) return 'B';
    if (total >= 40) return 'C';
    if (total >= 20) return 'D';
    return 'F';
  }

  String get gradeDescription {
    if (total >= 80) return 'Excellent';
    if (total >= 60) return 'Good';
    if (total >= 40) return 'Average';
    if (total >= 20) return 'Below Average';
    return 'Poor';
  }
}
