import 'package:flutter/material.dart';
import '../config/theme.dart';
import '../models/eco_score.dart';

class EcoScoreCard extends StatelessWidget {
  final EcoScore ecoScore;

  const EcoScoreCard({super.key, required this.ecoScore});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // Main score circle
            Row(
              children: [
                _ScoreCircle(
                  score: ecoScore.total,
                  grade: ecoScore.grade,
                  label: ecoScore.gradeDescription,
                ),
                const SizedBox(width: 24),
                Expanded(
                  child: Column(
                    children: [
                      _SubScoreBar(
                        label: 'Sourcing',
                        value: ecoScore.sourcing,
                        maxValue: 40,
                        color: Colors.blue,
                      ),
                      const SizedBox(height: 12),
                      _SubScoreBar(
                        label: 'Transparency',
                        value: ecoScore.transparency,
                        maxValue: 30,
                        color: Colors.purple,
                      ),
                      const SizedBox(height: 12),
                      _SubScoreBar(
                        label: 'Repairability',
                        value: ecoScore.repairability,
                        maxValue: 30,
                        color: Colors.teal,
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            // Summary
            Text(
              ecoScore.summary,
              style: const TextStyle(
                color: AppTheme.textSecondary,
                height: 1.4,
              ),
            ),
            // Rationale bullets
            if (ecoScore.rationaleBullets.isNotEmpty) ...[
              const SizedBox(height: 16),
              ...ecoScore.rationaleBullets.map((bullet) => Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      margin: const EdgeInsets.only(top: 6),
                      width: 6,
                      height: 6,
                      decoration: const BoxDecoration(
                        color: AppTheme.primaryColor,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        bullet,
                        style: const TextStyle(
                          color: AppTheme.textSecondary,
                          fontSize: 13,
                          height: 1.3,
                        ),
                      ),
                    ),
                  ],
                ),
              )),
            ],
          ],
        ),
      ),
    );
  }
}

class _ScoreCircle extends StatelessWidget {
  final int score;
  final String grade;
  final String label;

  const _ScoreCircle({
    required this.score,
    required this.grade,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 100,
      height: 100,
      child: Stack(
        fit: StackFit.expand,
        children: [
          CircularProgressIndicator(
            value: score / 100,
            strokeWidth: 8,
            backgroundColor: AppTheme.surfaceColor,
            color: _getColor(score),
          ),
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  '$score',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: _getColor(score),
                  ),
                ),
                Text(
                  grade,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: _getColor(score),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Color _getColor(int score) {
    if (score >= 70) return AppTheme.primaryColor;
    if (score >= 50) return Colors.orange;
    if (score >= 30) return Colors.deepOrange;
    return AppTheme.errorColor;
  }
}

class _SubScoreBar extends StatelessWidget {
  final String label;
  final int value;
  final int maxValue;
  final Color color;

  const _SubScoreBar({
    required this.label,
    required this.value,
    required this.maxValue,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              label,
              style: const TextStyle(
                color: AppTheme.textSecondary,
                fontSize: 12,
              ),
            ),
            Text(
              '$value/$maxValue',
              style: TextStyle(
                color: color,
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
        const SizedBox(height: 4),
        ClipRRect(
          borderRadius: BorderRadius.circular(4),
          child: LinearProgressIndicator(
            value: value / maxValue,
            backgroundColor: AppTheme.surfaceColor,
            color: color,
            minHeight: 6,
          ),
        ),
      ],
    );
  }
}
