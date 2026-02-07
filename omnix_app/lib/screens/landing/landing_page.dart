import 'dart:ui';

import 'package:animated_text_kit/animated_text_kit.dart';
import 'package:flutter/material.dart';
import '../../config/theme.dart';

class LandingPage extends StatefulWidget {
  const LandingPage({super.key});

  @override
  State<LandingPage> createState() => _LandingPageState();
}

class _LandingPageState extends State<LandingPage> with SingleTickerProviderStateMixin {
  late final AnimationController _floatController;

  @override
  void initState() {
    super.initState();
    _floatController = AnimationController(vsync: this, duration: const Duration(seconds: 8))
      ..repeat(reverse: true);
  }

  @override
  void dispose() {
    _floatController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isWide = MediaQuery.of(context).size.width > 900;

    return Scaffold(
      body: Stack(
        children: [
          // Background gradient
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [AppTheme.gradientStart, AppTheme.gradientEnd],
              ),
            ),
          ),

          // Subtle dark overlay to emulate screenshot mood
          Container(color: Colors.black.withAlpha((0.45 * 255).round())),

          // Floating shapes
          Positioned.fill(
            child: AnimatedBuilder(
              animation: _floatController,
              builder: (context, child) {
                final t = _floatController.value;
                return CustomPaint(
                  painter: _BackgroundPainter(t),
                );
              },
            ),
          ),

          // Center content with glass card
          Center(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: ConstrainedBox(
                constraints: BoxConstraints(maxWidth: isWide ? 1100 : 800),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(20),
                  child: BackdropFilter(
                    filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 36, vertical: 64),
                      decoration: BoxDecoration(
                        color: Colors.white.withAlpha((0.06 * 255).round()),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: Colors.white.withAlpha((0.08 * 255).round())),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withAlpha((0.4 * 255).round()),
                            blurRadius: 30,
                            offset: const Offset(0, 10),
                          ),
                        ],
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          // Headline with typewriter
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Flexible(
                                child: DefaultTextStyle(
                                  style: Theme.of(context).textTheme.displayMedium!.copyWith(
                                        color: Colors.white,
                                        fontWeight: FontWeight.w800,
                                      ),
                                  child: AnimatedTextKit(
                                    isRepeatingAnimation: false,
                                    animatedTexts: [
                                          TypewriterAnimatedText(
                                            'The only ',
                                            speed: const Duration(milliseconds: 80),
                                            textStyle: Theme.of(context).textTheme.displayMedium!.copyWith(letterSpacing: -1.0),
                                          ),
                                    ],
                                    onFinished: () {},
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),

                              // Gradient word
                              ShaderMask(
                                shaderCallback: (bounds) => const LinearGradient(
                                  colors: [Colors.green, Colors.cyan, Colors.purple, Colors.orange],
                                ).createShader(bounds),
                                child: AnimatedTextKit(
                                  isRepeatingAnimation: false,
                                  animatedTexts: [
                                    TypewriterAnimatedText(
                                      'autonomous',
                                      speed: const Duration(milliseconds: 60),
                                      textStyle: Theme.of(context).textTheme.displayMedium!.copyWith(
                                            color: Colors.white,
                                            fontWeight: FontWeight.w900,
                                            letterSpacing: -1.5,
                                          ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),

                          const SizedBox(height: 12),

                          // Subtitle continued with typewriter
                          DefaultTextStyle(
                            style: Theme.of(context).textTheme.displaySmall!.copyWith(color: Colors.white70, fontWeight: FontWeight.w600, letterSpacing: -0.5),
                            child: AnimatedTextKit(
                              animatedTexts: [
                                TypewriterAnimatedText('project management tool', speed: const Duration(milliseconds: 60)),
                              ],
                              isRepeatingAnimation: false,
                            ),
                          ),

                          const SizedBox(height: 28),

                          // CTA row
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.white,
                                  foregroundColor: Colors.black,
                                  padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 14),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999)),
                                ),
                                onPressed: () {
                                  // Navigate into app
                                  Navigator.of(context).pushNamed('/app');
                                },
                                child: const Text('Enter App'),
                              ),
                              const SizedBox(width: 16),
                              OutlinedButton(
                                style: OutlinedButton.styleFrom(
                                  side: BorderSide(color: Colors.white.withAlpha((0.14 * 255).round())),
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 12),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999)),
                                ),
                                onPressed: () {},
                                child: const Text('Product Tour'),
                              ),
                            ],
                          ),

                          const SizedBox(height: 18),
                          const Text('Scroll on', style: TextStyle(color: Colors.white70)),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _BackgroundPainter extends CustomPainter {
  final double t;
  _BackgroundPainter(this.t);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..style = PaintingStyle.fill;

    // soft blobs
    final blobPaint = paint..color = Colors.white.withAlpha((0.03 * 255).round());
    final r = size.shortestSide * 0.45;
    canvas.drawCircle(Offset(size.width * (0.25 + 0.05 * t), size.height * 0.2), r * 0.6, blobPaint);
    canvas.drawCircle(Offset(size.width * (0.8 - 0.06 * t), size.height * 0.7), r * 0.85, blobPaint);
  }

  @override
  bool shouldRepaint(covariant _BackgroundPainter old) => old.t != t;
}
