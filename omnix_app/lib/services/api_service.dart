import 'dart:convert';
import 'dart:typed_data';
import 'package:http/http.dart' as http;
import '../config/constants.dart';
import '../models/detected_product.dart';
import '../models/evidence_pack.dart';
import '../models/origin_pin.dart';
import '../models/eco_score.dart';
import '../models/chat_message.dart';
import 'auth_service.dart';

class ApiService {
  final AuthService _authService;
  
  ApiService(this._authService);

  Future<Map<String, String>> _getHeaders() async {
    final token = await _authService.getIdToken();
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  Future<DetectedProduct> analyzeImage(String imageBase64) async {
    final response = await http.post(
      Uri.parse('${AppConstants.apiBaseUrl}${AppConstants.analyzeImageEndpoint}'),
      headers: await _getHeaders(),
      body: jsonEncode({'imageBase64': imageBase64}),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to analyze image: ${response.body}');
    }

    return DetectedProduct.fromJson(jsonDecode(response.body));
  }

  Future<({EvidencePack evidencePack, List<OriginPin> originPins})> liveResearch(
    DetectedProduct product,
  ) async {
    final response = await http.post(
      Uri.parse('${AppConstants.apiBaseUrl}${AppConstants.liveResearchEndpoint}'),
      headers: await _getHeaders(),
      body: jsonEncode(product.toJson()),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to perform research: ${response.body}');
    }

    final data = jsonDecode(response.body);
    return (
      evidencePack: EvidencePack.fromJson(data['evidencePack']),
      originPins: (data['originPins'] as List)
          .map((p) => OriginPin.fromJson(p))
          .toList(),
    );
  }

  Future<EcoScore> getEcoScore({
    required DetectedProduct product,
    required EvidencePack evidencePack,
    required List<OriginPin> originPins,
  }) async {
    final response = await http.post(
      Uri.parse('${AppConstants.apiBaseUrl}${AppConstants.ecoScoreEndpoint}'),
      headers: await _getHeaders(),
      body: jsonEncode({
        'detectedProduct': product.toJson(),
        'evidencePack': evidencePack.toJson(),
        'originPins': originPins.map((p) => p.toJson()).toList(),
      }),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to calculate eco score: ${response.body}');
    }

    return EcoScore.fromJson(jsonDecode(response.body));
  }

  Future<ChatResponse> sendChatMessage({
    required DetectedProduct product,
    required EcoScore ecoScore,
    required EvidencePack evidencePack,
    required String message,
    required List<ChatMessage> history,
  }) async {
    final response = await http.post(
      Uri.parse('${AppConstants.apiBaseUrl}${AppConstants.chatEndpoint}'),
      headers: await _getHeaders(),
      body: jsonEncode({
        'scanContext': {
          'detectedProduct': product.toJson(),
          'ecoScore': ecoScore.toJson(),
          'evidencePack': evidencePack.toJson(),
        },
        'message': message,
        'history': history.map((m) => m.toJson()).toList(),
      }),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to get chat response: ${response.body}');
    }

    return ChatResponse.fromJson(jsonDecode(response.body));
  }

  Future<Uint8List> synthesizeVoice(String text) async {
    final response = await http.post(
      Uri.parse('${AppConstants.apiBaseUrl}${AppConstants.voiceEndpoint}'),
      headers: await _getHeaders(),
      body: jsonEncode({'text': text}),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to synthesize voice: ${response.body}');
    }

    return response.bodyBytes;
  }
}
