class EvidencePack {
  final List<Source> sources;
  final List<Claim> claims;
  final double overallConfidence;

  EvidencePack({
    required this.sources,
    required this.claims,
    required this.overallConfidence,
  });

  factory EvidencePack.fromJson(Map<String, dynamic> json) {
    return EvidencePack(
      sources: (json['sources'] as List<dynamic>?)
          ?.map((s) => Source.fromJson(s as Map<String, dynamic>))
          .toList() ?? [],
      claims: (json['claims'] as List<dynamic>?)
          ?.map((c) => Claim.fromJson(c as Map<String, dynamic>))
          .toList() ?? [],
      overallConfidence: (json['overallConfidence'] as num?)?.toDouble() ?? 0.5,
    );
  }

  Map<String, dynamic> toJson() => {
    'sources': sources.map((s) => s.toJson()).toList(),
    'claims': claims.map((c) => c.toJson()).toList(),
    'overallConfidence': overallConfidence,
  };
}

class Source {
  final String title;
  final String url;
  final String domain;
  final String snippet;

  Source({
    required this.title,
    required this.url,
    required this.domain,
    required this.snippet,
  });

  factory Source.fromJson(Map<String, dynamic> json) {
    return Source(
      title: json['title'] as String? ?? '',
      url: json['url'] as String? ?? '',
      domain: json['domain'] as String? ?? '',
      snippet: json['snippet'] as String? ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
    'title': title,
    'url': url,
    'domain': domain,
    'snippet': snippet,
  };
}

class Claim {
  final String type;
  final String text;
  final List<String> materials;
  final List<String> places;
  final String citationUrl;
  final double confidence;

  Claim({
    required this.type,
    required this.text,
    required this.materials,
    required this.places,
    required this.citationUrl,
    required this.confidence,
  });

  factory Claim.fromJson(Map<String, dynamic> json) {
    return Claim(
      type: json['type'] as String? ?? 'sourcing',
      text: json['text'] as String? ?? '',
      materials: List<String>.from(json['materials'] ?? []),
      places: List<String>.from(json['places'] ?? []),
      citationUrl: json['citationUrl'] as String? ?? '',
      confidence: (json['confidence'] as num?)?.toDouble() ?? 0.5,
    );
  }

  Map<String, dynamic> toJson() => {
    'type': type,
    'text': text,
    'materials': materials,
    'places': places,
    'citationUrl': citationUrl,
    'confidence': confidence,
  };
  
  String get typeDisplayName {
    switch (type) {
      case 'sourcing': return 'Material Sourcing';
      case 'policy': return 'Company Policy';
      case 'controversy': return 'Controversy';
      case 'recycling': return 'Recycling';
      default: return type;
    }
  }
}
