import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../config/theme.dart';
import '../../models/evidence_pack.dart';
import '../../models/scan.dart';
import '../../providers/scan_provider.dart';

class EvidenceTab extends ConsumerWidget {
  final Scan? loadedScan;

  const EvidenceTab({super.key, this.loadedScan});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final scanState = ref.watch(scanProvider);
    final evidencePack = scanState.evidencePack;

    // For loaded scans, we don't have full evidence pack in history
    if (loadedScan != null) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.source_outlined, size: 64, color: AppTheme.textMuted),
            SizedBox(height: 16),
            Text(
              'Evidence not stored in history',
              style: TextStyle(color: AppTheme.textSecondary),
            ),
            SizedBox(height: 8),
            Text(
              'Perform a new scan to see full evidence',
              style: TextStyle(color: AppTheme.textMuted, fontSize: 12),
            ),
          ],
        ),
      );
    }

    if (evidencePack == null) {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Confidence indicator
          _ConfidenceHeader(confidence: evidencePack.overallConfidence),
          const SizedBox(height: 24),

          // Sources section
          if (evidencePack.sources.isNotEmpty) ...[
            const Text(
              'Sources',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: AppTheme.textPrimary,
              ),
            ),
            const SizedBox(height: 12),
            ...evidencePack.sources.map((s) => _SourceCard(source: s)),
            const SizedBox(height: 24),
          ],

          // Claims section
          if (evidencePack.claims.isNotEmpty) ...[
            const Text(
              'Key Findings',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: AppTheme.textPrimary,
              ),
            ),
            const SizedBox(height: 12),
            ...evidencePack.claims.map((c) => _ClaimCard(claim: c)),
          ],
        ],
      ),
    );
  }
}

class _ConfidenceHeader extends StatelessWidget {
  final double confidence;

  const _ConfidenceHeader({required this.confidence});

  @override
  Widget build(BuildContext context) {
    final percentage = (confidence * 100).toInt();
    
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            SizedBox(
              width: 60,
              height: 60,
              child: Stack(
                fit: StackFit.expand,
                children: [
                  CircularProgressIndicator(
                    value: confidence,
                    strokeWidth: 6,
                    backgroundColor: AppTheme.surfaceColor,
                    color: _getColor(confidence),
                  ),
                  Center(
                    child: Text(
                      '$percentage%',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: _getColor(confidence),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Evidence Confidence',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: AppTheme.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    _getDescription(confidence),
                    style: const TextStyle(
                      color: AppTheme.textSecondary,
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Color _getColor(double confidence) {
    if (confidence >= 0.7) return AppTheme.primaryColor;
    if (confidence >= 0.4) return Colors.orange;
    return AppTheme.errorColor;
  }

  String _getDescription(double confidence) {
    if (confidence >= 0.7) {
      return 'Strong evidence from multiple reliable sources';
    }
    if (confidence >= 0.4) {
      return 'Moderate evidence with some verified claims';
    }
    return 'Limited evidence - findings should be verified';
  }
}

class _SourceCard extends StatelessWidget {
  final Source source;

  const _SourceCard({required this.source});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: AppTheme.surfaceColor,
          child: Text(
            source.domain.isNotEmpty ? source.domain[0].toUpperCase() : '?',
            style: const TextStyle(color: AppTheme.textPrimary),
          ),
        ),
        title: Text(
          source.title,
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
          style: const TextStyle(
            color: AppTheme.textPrimary,
            fontSize: 14,
          ),
        ),
        subtitle: Text(
          source.domain,
          style: const TextStyle(color: AppTheme.textMuted, fontSize: 12),
        ),
        trailing: IconButton(
          icon: const Icon(Icons.open_in_new, size: 20),
          onPressed: () async {
            final uri = Uri.parse(source.url);
            if (await canLaunchUrl(uri)) {
              await launchUrl(uri, mode: LaunchMode.externalApplication);
            }
          },
        ),
        onTap: () async {
          final uri = Uri.parse(source.url);
          if (await canLaunchUrl(uri)) {
            await launchUrl(uri, mode: LaunchMode.externalApplication);
          }
        },
      ),
    );
  }
}

class _ClaimCard extends StatelessWidget {
  final Claim claim;

  const _ClaimCard({required this.claim});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                _ClaimTypeBadge(type: claim.type),
                const Spacer(),
                Text(
                  '${(claim.confidence * 100).toInt()}% confidence',
                  style: const TextStyle(
                    color: AppTheme.textMuted,
                    fontSize: 11,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              claim.text,
              style: const TextStyle(
                color: AppTheme.textPrimary,
                height: 1.4,
              ),
            ),
            if (claim.materials.isNotEmpty || claim.places.isNotEmpty) ...[
              const SizedBox(height: 12),
              Wrap(
                spacing: 6,
                runSpacing: 6,
                children: [
                  ...claim.materials.map((m) => _SmallChip(
                    label: m,
                    icon: Icons.science_outlined,
                  )),
                  ...claim.places.map((p) => _SmallChip(
                    label: p,
                    icon: Icons.place_outlined,
                  )),
                ],
              ),
            ],
            if (claim.citationUrl.isNotEmpty) ...[
              const SizedBox(height: 12),
              InkWell(
                onTap: () async {
                  final uri = Uri.parse(claim.citationUrl);
                  if (await canLaunchUrl(uri)) {
                    await launchUrl(uri, mode: LaunchMode.externalApplication);
                  }
                },
                child: Text(
                  'View source →',
                  style: TextStyle(
                    color: AppTheme.primaryColor,
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _ClaimTypeBadge extends StatelessWidget {
  final String type;

  const _ClaimTypeBadge({required this.type});

  @override
  Widget build(BuildContext context) {
    final (color, icon) = switch (type) {
      'sourcing' => (Colors.blue, Icons.local_shipping),
      'policy' => (Colors.green, Icons.policy),
      'controversy' => (Colors.orange, Icons.warning),
      'recycling' => (Colors.teal, Icons.recycling),
      _ => (Colors.grey, Icons.info),
    };

    final label = switch (type) {
      'sourcing' => 'Sourcing',
      'policy' => 'Policy',
      'controversy' => 'Controversy',
      'recycling' => 'Recycling',
      _ => type,
    };

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.2),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: color),
          const SizedBox(width: 4),
          Text(
            label,
            style: TextStyle(
              color: color,
              fontSize: 12,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}

class _SmallChip extends StatelessWidget {
  final String label;
  final IconData icon;

  const _SmallChip({required this.label, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: AppTheme.textMuted),
          const SizedBox(width: 4),
          Text(
            label,
            style: const TextStyle(
              color: AppTheme.textSecondary,
              fontSize: 11,
            ),
          ),
        ],
      ),
    );
  }
}
