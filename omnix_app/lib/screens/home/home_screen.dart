import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../config/theme.dart';
import '../../providers/auth_provider.dart';
import '../../providers/scan_provider.dart';
import '../results/results_screen.dart';
import '../history/history_screen.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(currentUserProvider);
    final scanState = ref.watch(scanProvider);

    ref.listen(scanProvider, (_, state) {
      if (state.step == ScanStep.complete) {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => const ResultsScreen()),
        );
      }
    });

    final mainContent = Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          // Welcome message
          if (user != null) ...[
            Text(
              'Welcome back!',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                color: AppTheme.textPrimary,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              user.email ?? '',
              style: const TextStyle(color: AppTheme.textSecondary),
            ),
            const SizedBox(height: 32),
          ],

          // Main scan area
          Expanded(
            child: Container(
              width: double.infinity,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                      AppTheme.cardColor,
                      AppTheme.cardColor.withAlpha((0.8 * 255).round()),
                  ],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(
                  color: scanState.isLoading
                      ? AppTheme.primaryColor
                      : AppTheme.textMuted.withAlpha((0.3 * 255).round()),
                  width: 2,
                ),
              ),
              child: _buildScanContent(context, ref, scanState),
            ),
          ),
          const SizedBox(height: 24),

          // Action buttons
          if (!scanState.isLoading) ...[
            Row(
              children: [
                Expanded(
                  child: _ActionButton(
                    icon: Icons.camera_alt,
                    label: 'Camera',
                    onPressed: () {
                      ref.read(scanProvider.notifier).captureFromCamera();
                    },
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _ActionButton(
                    icon: Icons.photo_library,
                    label: 'Gallery',
                    onPressed: () {
                      ref.read(scanProvider.notifier).pickFromGallery();
                    },
                  ),
                ),
              ],
            ),
          ] else ...[
            SizedBox(
              width: double.infinity,
              height: 56,
              child: OutlinedButton.icon(
                onPressed: () {
                  ref.read(scanProvider.notifier).reset();
                },
                icon: const Icon(Icons.close),
                label: const Text('Cancel'),
              ),
            ),
          ],
        ],
      ),
    );

    return Scaffold(
      appBar: AppBar(
        title: const Text('Omnix'),
        leading: Padding(
          padding: const EdgeInsets.all(8),
          child: Container(
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [AppTheme.gradientStart, AppTheme.gradientEnd],
              ),
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(Icons.eco, color: Colors.black),
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.history),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const HistoryScreen()),
              );
            },
            tooltip: 'History',
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await ref.read(authNotifierProvider.notifier).signOut();
              ref.invalidate(authStateProvider);
            },
            tooltip: 'Sign out',
          ),
        ],
      ),
      body: LayoutBuilder(
        builder: (context, constraints) {
          final isWide = constraints.maxWidth >= 1000;
          if (isWide) {
            return Row(
              children: [
                NavigationRail(
                  selectedIndex: 0,
                  labelType: NavigationRailLabelType.all,
                  destinations: const [
                    NavigationRailDestination(icon: Icon(Icons.home), label: Text('Home')),
                    NavigationRailDestination(icon: Icon(Icons.history), label: Text('History')),
                    NavigationRailDestination(icon: Icon(Icons.eco), label: Text('Results')),
                  ],
                  onDestinationSelected: (i) {
                    if (i == 1) {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const HistoryScreen()),
                      );
                    } else if (i == 2) {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const ResultsScreen()),
                      );
                    }
                  },
                ),
                const VerticalDivider(width: 1),
                Expanded(child: mainContent),
              ],
            );
          }

          return mainContent;
        },
      ),
    );
  }

  Widget _buildScanContent(BuildContext context, WidgetRef ref, ScanState state) {
    if (state.isLoading) {
      return Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Show image if captured
          if (state.imagePath != null)
            Container(
              width: 150,
              height: 150,
              margin: const EdgeInsets.only(bottom: 24),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(16),
                image: DecorationImage(
                  image: FileImage(File(state.imagePath!)),
                  fit: BoxFit.cover,
                ),
              ),
            ),
          
          // Loading indicator
          Stack(
            alignment: Alignment.center,
            children: [
              SizedBox(
                width: 80,
                height: 80,
                child: CircularProgressIndicator(
                  strokeWidth: 3,
                  color: AppTheme.primaryColor.withAlpha((0.3 * 255).round()),
                ),
              ),
              const Icon(
                Icons.eco,
                size: 32,
                color: AppTheme.primaryColor,
              ),
            ],
          ),
          const SizedBox(height: 24),
          Text(
            state.stepMessage,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w500,
              color: AppTheme.textPrimary,
            ),
          ),
          const SizedBox(height: 8),
          _ProgressSteps(currentStep: state.step),
        ],
      );
    }

    if (state.step == ScanStep.error) {
      return Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.error_outline, size: 64, color: AppTheme.errorColor),
          const SizedBox(height: 16),
          Text(
            state.errorMessage ?? 'An error occurred',
            textAlign: TextAlign.center,
            style: const TextStyle(color: AppTheme.textSecondary),
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () {
              ref.read(scanProvider.notifier).reset();
            },
            child: const Text('Try Again'),
          ),
        ],
      );
    }

    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          width: 120,
          height: 120,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: RadialGradient(
              colors: [
                AppTheme.primaryColor.withAlpha((0.2 * 255).round()),
                Colors.transparent,
              ],
            ),
          ),
          child: const Icon(
            Icons.qr_code_scanner,
            size: 56,
            color: AppTheme.primaryColor,
          ),
        ),
        const SizedBox(height: 24),
        const Text(
          'Scan Your Device',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: AppTheme.textPrimary,
          ),
        ),
        const SizedBox(height: 12),
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 32),
          child: Text(
            'Take a photo of any electronic device to analyze its sustainability impact',
            textAlign: TextAlign.center,
            style: TextStyle(
              color: AppTheme.textSecondary,
              fontSize: 14,
            ),
          ),
        ),
      ],
    );
  }
}

class _ActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onPressed;

  const _ActionButton({
    required this.icon,
    required this.label,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 64,
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: AppTheme.primaryColor,
          foregroundColor: Colors.black,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon),
            const SizedBox(width: 8),
            Text(label),
          ],
        ),
      ),
    );
  }
}

class _ProgressSteps extends StatelessWidget {
  final ScanStep currentStep;

  const _ProgressSteps({required this.currentStep});

  @override
  Widget build(BuildContext context) {
    final steps = ['Identify', 'Research', 'Score'];
    final currentIndex = switch (currentStep) {
      ScanStep.analyzing => 0,
      ScanStep.researching => 1,
      ScanStep.scoring => 2,
      _ => -1,
    };

    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(steps.length, (index) {
        final isActive = index <= currentIndex;
        final isCurrent = index == currentIndex;

        return Row(
          children: [
            Container(
              width: 28,
              height: 28,
              decoration: BoxDecoration(
                color: isActive ? AppTheme.primaryColor : AppTheme.cardColor,
                shape: BoxShape.circle,
                border: Border.all(
                  color: isActive ? AppTheme.primaryColor : AppTheme.textMuted,
                  width: 2,
                ),
              ),
              child: Center(
                child: isCurrent
                    ? const SizedBox(
                        width: 12,
                        height: 12,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: Colors.black,
                        ),
                      )
                    : isActive
                        ? const Icon(Icons.check, size: 16, color: Colors.black)
                        : Text(
                            '${index + 1}',
                            style: const TextStyle(
                              color: AppTheme.textMuted,
                              fontSize: 12,
                            ),
                          ),
              ),
            ),
            if (index < steps.length - 1)
              Container(
                width: 32,
                height: 2,
                color: isActive ? AppTheme.primaryColor : AppTheme.textMuted,
              ),
          ],
        );
      }),
    );
  }
}
