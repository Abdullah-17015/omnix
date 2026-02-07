class AppConstants {
  // API Configuration - UPDATE THIS WITH YOUR BACKEND URL
  static const String apiBaseUrl = 'http://localhost:8080';
  
  // For production Cloud Run deployment, use:
  // static const String apiBaseUrl = 'https://omnix-backend-XXXXX.run.app';
  
  // API Endpoints
  static const String analyzeImageEndpoint = '/api/analyze-image';
  static const String liveResearchEndpoint = '/api/live-research';
  static const String ecoScoreEndpoint = '/api/eco-score';
  static const String chatEndpoint = '/api/chat';
  static const String voiceEndpoint = '/api/voice';
  
  // Suggested chat questions
  static const List<String> suggestedQuestions = [
    'Where do the key materials come from?',
    'Is this brand ethically sourcing minerals?',
    'How can I reduce my footprint with this device?',
    'What are known controversies about this product?',
    'Does this brand have a recycling program?',
  ];
  
  // Product categories
  static const List<String> productCategories = [
    'smartphone',
    'laptop',
    'smartwatch',
    'headphones',
    'tablet',
    'camera',
    'console',
    'generic_electronics',
  ];

  // Map default camera settings
  static const double defaultMapTilt = 45.0;
  static const double defaultMapBearing = 30.0;
  static const double defaultMapZoom = 2.0;
}
