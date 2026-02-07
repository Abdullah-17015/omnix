import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../config/theme.dart';
import '../../models/detected_product.dart';
import '../../models/eco_score.dart';
import '../../models/scan.dart';
import '../../providers/scan_provider.dart';
import '../../services/audio_service.dart';
import '../../widgets/eco_score_card.dart';
import '../../widgets/gemma_tips.dart';

class OverviewTab extends ConsumerStatefulWidget {
  final DetectedProduct product;
  final EcoScore ecoScore;
  final Scan? loadedScan;

  const OverviewTab({
    super.key,
    required this.product,
    required this.ecoScore,
    this.loadedScan,
  });

  @override
  ConsumerState<OverviewTab> createState() => _OverviewTabState();
}

class _OverviewTabState extends ConsumerState<OverviewTab> {
  final AudioService _audioService = AudioService();
  bool _isGeneratingVoice = false;
  bool _isPlaying = false;
  Uint8List? _audioBytes;

  @override
  void dispose() {
    _audioService.dispose();
    super.dispose();
  }

  Future<void> _playVoiceSummary() async {
    if (_isPlaying) {
      await _audioService.pause();
      setState(() => _isPlaying = false);
      return;
    }

    if (_audioBytes != null) {
      await _audioService.playFromBytes(_audioBytes!);
      setState(() => _isPlaying = true);
      return;
    }

    setState(() => _isGeneratingVoice = true);

    try {
      final apiService = ref.read(apiServiceProvider);
      final product = widget.product;
      final score = widget.ecoScore;
      final scanState = ref.read(scanProvider);
      final originPins = widget.loadedScan?.originPins ?? scanState.originPins ?? [];

      // Generate voice script
      final originHighlights = originPins.take(2)
          .map((p) => '${p.material} from ${p.place}')
          .join(' and ');
      
      final scoreDescription = score.total >= 70 ? 'an excellent' :
          score.total >= 50 ? 'a moderate' :
          score.total >= 30 ? 'a below average' : 'a low';

      final script = 'This ${product.brand} ${product.model} ${product.categoryDisplayName} '
          'received $scoreDescription eco score of ${score.total} out of 100. '
          '${originHighlights.isNotEmpty ? 'Key materials include $originHighlights.' : ''} '
          'Check the detailed breakdown for more information.';

      _audioBytes = await apiService.synthesizeVoice(script);
      await _audioService.playFromBytes(_audioBytes!);
      setState(() => _isPlaying = true);

      // Listen for playback completion
      _audioService.playingStream.listen((isPlaying) {
        if (mounted && !isPlaying) {
          setState(() => _isPlaying = false);
        }
      });
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to generate voice: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isGeneratingVoice = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final product = widget.product;
    final ecoScore = widget.ecoScore;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Product Info Card
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: AppTheme.primaryColor.withAlpha((0.2 * 255).round()),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          product.categoryDisplayName,
                          style: const TextStyle(
                            color: AppTheme.primaryColor,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                      const Spacer(),
                      _ConfidenceBadge(confidence: product.confidence),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    '${product.brand} ${product.model}',
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.textPrimary,
                    ),
                  ),
                  if (product.materialsUsed.isNotEmpty) ...[
                    const SizedBox(height: 12),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: product.materialsUsed.take(6).map((m) {
                        return Chip(
                          label: Text(m),
                          backgroundColor: AppTheme.surfaceColor,
                          side: BorderSide.none,
                          labelStyle: const TextStyle(
                            color: AppTheme.textSecondary,
                            fontSize: 12,
                          ),
                        );
                      }).toList(),
                    ),
                  ],
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Eco Score Card
          EcoScoreCard(ecoScore: ecoScore),
          const SizedBox(height: 16),

          // Gemma Tips
          GemmaTips(tips: ecoScore.gemmaTips),
          const SizedBox(height: 16),

          // Voice Summary Button
          SizedBox(
            width: double.infinity,
            height: 56,
            child: ElevatedButton.icon(
              onPressed: _isGeneratingVoice ? null : _playVoiceSummary,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.surfaceColor,
                foregroundColor: AppTheme.primaryColor,
              ),
              icon: _isGeneratingVoice
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : Icon(_isPlaying ? Icons.pause : Icons.play_arrow),
              label: Text(
                _isGeneratingVoice
                    ? 'Generating voice...'
                    : _isPlaying
                        ? 'Pause Voice Summary'
                        : 'Play Voice Summary',
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ConfidenceBadge extends StatelessWidget {
  final double confidence;

  const _ConfidenceBadge({required this.confidence});

  @override
  Widget build(BuildContext context) {
    final percentage = (confidence * 100).toInt();
    final color = confidence >= 0.8
        ? AppTheme.primaryColor
        : confidence >= 0.5
            ? Colors.orange
            : AppTheme.errorColor;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withAlpha((0.2 * 255).round()),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.verified, size: 16, color: color),
          const SizedBox(width: 4),
          Text(
            '$percentage%',
            style: TextStyle(
              color: color,
              fontWeight: FontWeight.w600,
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }
}
