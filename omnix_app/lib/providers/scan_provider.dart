import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import '../models/detected_product.dart';
import '../models/evidence_pack.dart';
import '../models/origin_pin.dart';
import '../models/eco_score.dart';
import '../services/api_service.dart';
import 'auth_provider.dart';

final apiServiceProvider = Provider<ApiService>((ref) {
  return ApiService(ref.watch(authServiceProvider));
});

enum ScanStep {
  idle,
  capturing,
  analyzing,
  researching,
  scoring,
  complete,
  error,
}

class ScanState {
  final ScanStep step;
  final String? imagePath;
  final String? imageBase64;
  final DetectedProduct? product;
  final EvidencePack? evidencePack;
  final List<OriginPin>? originPins;
  final EcoScore? ecoScore;
  final String? errorMessage;

  const ScanState({
    this.step = ScanStep.idle,
    this.imagePath,
    this.imageBase64,
    this.product,
    this.evidencePack,
    this.originPins,
    this.ecoScore,
    this.errorMessage,
  });

  ScanState copyWith({
    ScanStep? step,
    String? imagePath,
    String? imageBase64,
    DetectedProduct? product,
    EvidencePack? evidencePack,
    List<OriginPin>? originPins,
    EcoScore? ecoScore,
    String? errorMessage,
  }) {
    return ScanState(
      step: step ?? this.step,
      imagePath: imagePath ?? this.imagePath,
      imageBase64: imageBase64 ?? this.imageBase64,
      product: product ?? this.product,
      evidencePack: evidencePack ?? this.evidencePack,
      originPins: originPins ?? this.originPins,
      ecoScore: ecoScore ?? this.ecoScore,
      errorMessage: errorMessage,
    );
  }

  bool get isLoading => step != ScanStep.idle && 
                        step != ScanStep.complete && 
                        step != ScanStep.error;

  String get stepMessage {
    switch (step) {
      case ScanStep.idle: return 'Ready to scan';
      case ScanStep.capturing: return 'Capturing image...';
      case ScanStep.analyzing: return 'Analyzing product with AI...';
      case ScanStep.researching: return 'Researching sustainability...';
      case ScanStep.scoring: return 'Calculating eco score...';
      case ScanStep.complete: return 'Analysis complete!';
      case ScanStep.error: return errorMessage ?? 'An error occurred';
    }
  }
}

class ScanNotifier extends StateNotifier<ScanState> {
  final ApiService _apiService;
  final ImagePicker _imagePicker = ImagePicker();

  ScanNotifier(this._apiService) : super(const ScanState());

  void reset() {
    state = const ScanState();
  }

  Future<void> captureFromCamera() async {
    await _captureImage(ImageSource.camera);
  }

  Future<void> pickFromGallery() async {
    await _captureImage(ImageSource.gallery);
  }

  Future<void> _captureImage(ImageSource source) async {
    try {
      state = state.copyWith(step: ScanStep.capturing);

      final XFile? image = await _imagePicker.pickImage(
        source: source,
        maxWidth: 1024,
        maxHeight: 1024,
        imageQuality: 85,
      );

      if (image == null) {
        state = const ScanState(); // User cancelled
        return;
      }

      final bytes = await image.readAsBytes();
      final base64 = base64Encode(bytes);

      state = state.copyWith(
        imagePath: image.path,
        imageBase64: base64,
        step: ScanStep.analyzing,
      );

      await _runAnalysis(base64);
    } catch (e) {
      state = state.copyWith(
        step: ScanStep.error,
        errorMessage: 'Failed to capture image: $e',
      );
    }
  }

  Future<void> _runAnalysis(String imageBase64) async {
    try {
      // Step 1: Analyze image
      final product = await _apiService.analyzeImage(imageBase64);
      state = state.copyWith(
        product: product,
        step: ScanStep.researching,
      );

      // Step 2: Live research
      final research = await _apiService.liveResearch(product);
      state = state.copyWith(
        evidencePack: research.evidencePack,
        originPins: research.originPins,
        step: ScanStep.scoring,
      );

      // Step 3: Calculate eco score
      final ecoScore = await _apiService.getEcoScore(
        product: product,
        evidencePack: research.evidencePack,
        originPins: research.originPins,
      );

      state = state.copyWith(
        ecoScore: ecoScore,
        step: ScanStep.complete,
      );
    } catch (e) {
      state = state.copyWith(
        step: ScanStep.error,
        errorMessage: e.toString(),
      );
    }
  }
}

final scanProvider = StateNotifierProvider<ScanNotifier, ScanState>((ref) {
  return ScanNotifier(ref.watch(apiServiceProvider));
});
