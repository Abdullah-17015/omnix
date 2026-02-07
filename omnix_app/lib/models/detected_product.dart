class DetectedProduct {
  final String category;
  final String brand;
  final String model;
  final double confidence;
  final List<String> identifiers;
  final List<Component> components;
  final List<String> materialsUsed;

  DetectedProduct({
    required this.category,
    required this.brand,
    required this.model,
    required this.confidence,
    required this.identifiers,
    required this.components,
    required this.materialsUsed,
  });

  factory DetectedProduct.fromJson(Map<String, dynamic> json) {
    return DetectedProduct(
      category: json['category'] as String? ?? 'generic_electronics',
      brand: json['brand'] as String? ?? 'Unknown',
      model: json['model'] as String? ?? 'Unknown Model',
      confidence: (json['confidence'] as num?)?.toDouble() ?? 0.5,
      identifiers: List<String>.from(json['identifiers'] ?? []),
      components: (json['components'] as List<dynamic>?)
          ?.map((c) => Component.fromJson(c as Map<String, dynamic>))
          .toList() ?? [],
      materialsUsed: List<String>.from(json['materialsUsed'] ?? []),
    );
  }

  Map<String, dynamic> toJson() => {
    'category': category,
    'brand': brand,
    'model': model,
    'confidence': confidence,
    'identifiers': identifiers,
    'components': components.map((c) => c.toJson()).toList(),
    'materialsUsed': materialsUsed,
  };
  
  String get displayName => '$brand $model';
  
  String get categoryDisplayName {
    switch (category) {
      case 'smartphone': return 'Smartphone';
      case 'laptop': return 'Laptop';
      case 'smartwatch': return 'Smartwatch';
      case 'headphones': return 'Headphones';
      case 'tablet': return 'Tablet';
      case 'camera': return 'Camera';
      case 'console': return 'Gaming Console';
      default: return 'Electronics';
    }
  }
}

class Component {
  final String name;
  final List<String> materials;

  Component({
    required this.name,
    required this.materials,
  });

  factory Component.fromJson(Map<String, dynamic> json) {
    return Component(
      name: json['name'] as String? ?? '',
      materials: List<String>.from(json['materials'] ?? []),
    );
  }

  Map<String, dynamic> toJson() => {
    'name': name,
    'materials': materials,
  };
}
