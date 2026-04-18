import 'dart:async';
import 'dart:math';
import 'dart:ui';

import 'package:flutter/material.dart';

/// Premium bento widget: Global Freelancer + Live Developer Activity.
///
/// Built to sit inside a grid cell and fill all available space.
class GlobalFreelancerLiveStatsCard extends StatefulWidget {
  const GlobalFreelancerLiveStatsCard({
    super.key,
    this.githubHandle = 'AnasAli-2722',
    this.locationLabel = 'Taxila, PK',
    this.recentCommits = 47,
    this.currentStreak = 18,
    this.contributionCellCount = 84,
  });

  final String githubHandle;
  final String locationLabel;
  final int recentCommits;
  final int currentStreak;
  final int contributionCellCount;

  @override
  State<GlobalFreelancerLiveStatsCard> createState() =>
      _GlobalFreelancerLiveStatsCardState();
}

class _GlobalFreelancerLiveStatsCardState
    extends State<GlobalFreelancerLiveStatsCard> with SingleTickerProviderStateMixin {
  late final AnimationController _pulseController;
  late final Timer _minuteTimer;

  late DateTime _pktNow;
  late List<double> _activityIntensities;

  @override
  void initState() {
    super.initState();

    _pktNow = _pktTime();
    _activityIntensities = _generateContributionIntensities(widget.contributionCellCount);

    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1300),
    )..repeat(reverse: true);

    _minuteTimer = Timer.periodic(const Duration(minutes: 1), (_) {
      if (!mounted) return;
      setState(() => _pktNow = _pktTime());
    });
  }

  @override
  void dispose() {
    _minuteTimer.cancel();
    _pulseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    final cardBg = Color.alphaBlend(
      Colors.white.withValues(alpha: 0.02),
      scheme.surface,
    );

    final accent = scheme.secondary;
    final secondaryAccent = Color.lerp(accent, scheme.primary, 0.5) ?? accent;

    return ClipRRect(
      borderRadius: BorderRadius.circular(22),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 2.5, sigmaY: 2.5),
        child: Container(
          decoration: BoxDecoration(
            color: cardBg,
            borderRadius: BorderRadius.circular(22),
            border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
            boxShadow: const [
              BoxShadow(
                color: Color(0x4D04070D),
                blurRadius: 38,
                spreadRadius: 0,
                offset: Offset(0, 18),
              ),
            ],
          ),
          child: Column(
            children: [
              Expanded(
                flex: 5,
                child: _GlobalPresenceSection(
                  nowPkt: _pktNow,
                  locationLabel: widget.locationLabel,
                  pulseController: _pulseController,
                  accent: accent,
                  secondaryAccent: secondaryAccent,
                  textTheme: textTheme,
                ),
              ),
              Container(
                height: 1,
                margin: const EdgeInsets.symmetric(horizontal: 16),
                color: Colors.white.withValues(alpha: 0.07),
              ),
              Expanded(
                flex: 5,
                child: _DeveloperActivitySection(
                  githubHandle: widget.githubHandle,
                  accent: accent,
                  textTheme: textTheme,
                  intensities: _activityIntensities,
                  recentCommits: widget.recentCommits,
                  currentStreak: widget.currentStreak,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  static DateTime _pktTime() {
    // PKT is UTC+5 (no daylight saving).
    return DateTime.now().toUtc().add(const Duration(hours: 5));
  }

  static List<double> _generateContributionIntensities(int count) {
    final random = Random(2722);
    return List<double>.generate(count, (_) {
      final roll = random.nextDouble();
      if (roll < 0.15) return 0.08;
      if (roll < 0.42) return 0.2;
      if (roll < 0.72) return 0.35;
      if (roll < 0.9) return 0.55;
      return 0.85;
    });
  }
}

class _GlobalPresenceSection extends StatelessWidget {
  const _GlobalPresenceSection({
    required this.nowPkt,
    required this.locationLabel,
    required this.pulseController,
    required this.accent,
    required this.secondaryAccent,
    required this.textTheme,
  });

  final DateTime nowPkt;
  final String locationLabel;
  final AnimationController pulseController;
  final Color accent;
  final Color secondaryAccent;
  final TextTheme textTheme;

  @override
  Widget build(BuildContext context) {
    return Stack(
      fit: StackFit.expand,
      children: [
        const Positioned.fill(child: _DottedWorldBackground()),
        Padding(
          padding: const EdgeInsets.fromLTRB(18, 16, 18, 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  FadeTransition(
                    opacity: Tween<double>(begin: 0.45, end: 1).animate(
                      CurvedAnimation(
                        parent: pulseController,
                        curve: Curves.easeInOut,
                      ),
                    ),
                    child: ScaleTransition(
                      scale: Tween<double>(begin: 0.92, end: 1.08).animate(
                        CurvedAnimation(
                          parent: pulseController,
                          curve: Curves.easeInOut,
                        ),
                      ),
                      child: Container(
                        width: 8,
                        height: 8,
                        decoration: BoxDecoration(
                          color: accent,
                          shape: BoxShape.circle,
                          boxShadow: [
                            BoxShadow(
                              color: accent.withValues(alpha: 0.52),
                              blurRadius: 10,
                              spreadRadius: 1,
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    locationLabel,
                    style: textTheme.labelLarge?.copyWith(
                      color: Colors.white.withValues(alpha: 0.88),
                      fontWeight: FontWeight.w600,
                      letterSpacing: 0.2,
                    ),
                  ),
                ],
              ),
              const Spacer(),
              Text(
                _formatTime(nowPkt),
                style: textTheme.displaySmall?.copyWith(
                  color: Colors.white.withValues(alpha: 0.95),
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.8,
                  height: 1,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                'Pakistan Standard Time (PKT)',
                style: textTheme.bodySmall?.copyWith(
                  color: Colors.white.withValues(alpha: 0.66),
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 14),
              ClipRRect(
                borderRadius: BorderRadius.circular(999),
                child: BackdropFilter(
                  filter: ImageFilter.blur(sigmaX: 4, sigmaY: 4),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(999),
                      border: Border.all(
                        color: accent.withValues(alpha: 0.46),
                      ),
                      gradient: LinearGradient(
                        colors: [
                          secondaryAccent.withValues(alpha: 0.16),
                          accent.withValues(alpha: 0.08),
                        ],
                      ),
                    ),
                    child: Text(
                      'Available for Global Remote Work',
                      style: textTheme.labelMedium?.copyWith(
                        color: Colors.white.withValues(alpha: 0.9),
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  static String _formatTime(DateTime dt) {
    final hh = dt.hour.toString().padLeft(2, '0');
    final mm = dt.minute.toString().padLeft(2, '0');
    return '$hh:$mm';
  }
}

class _DeveloperActivitySection extends StatelessWidget {
  const _DeveloperActivitySection({
    required this.githubHandle,
    required this.accent,
    required this.textTheme,
    required this.intensities,
    required this.recentCommits,
    required this.currentStreak,
  });

  final String githubHandle;
  final Color accent;
  final TextTheme textTheme;
  final List<double> intensities;
  final int recentCommits;
  final int currentStreak;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(18, 14, 18, 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(
                'GitHub Activity',
                style: textTheme.labelLarge?.copyWith(
                  color: Colors.white.withValues(alpha: 0.9),
                  fontWeight: FontWeight.w600,
                ),
              ),
              const Spacer(),
              Text(
                githubHandle,
                style: textTheme.labelMedium?.copyWith(
                  color: accent.withValues(alpha: 0.95),
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Expanded(
            child: LayoutBuilder(
              builder: (context, constraints) {
                const columns = 21;
                const spacing = 4.0;
                final cell = ((constraints.maxWidth - ((columns - 1) * spacing)) / columns)
                    .clamp(6.0, 10.0);

                return Wrap(
                  spacing: spacing,
                  runSpacing: spacing,
                  children: intensities
                      .map(
                        (alpha) => Container(
                          width: cell,
                          height: cell,
                          decoration: BoxDecoration(
                            color: accent.withValues(alpha: alpha),
                            borderRadius: BorderRadius.circular(2.5),
                          ),
                        ),
                      )
                      .toList(),
                );
              },
            ),
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              Expanded(
                child: _StatCounter(
                  label: 'Recent Commits',
                  value: '$recentCommits',
                  accent: accent,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _StatCounter(
                  label: 'Current Streak',
                  value: '$currentStreak days',
                  accent: accent,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _StatCounter extends StatelessWidget {
  const _StatCounter({
    required this.label,
    required this.value,
    required this.accent,
  });

  final String label;
  final String value;
  final Color accent;

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
        color: Colors.white.withValues(alpha: 0.02),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            value,
            style: textTheme.titleSmall?.copyWith(
              color: accent,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 3),
          Text(
            label,
            style: textTheme.bodySmall?.copyWith(
              color: Colors.white.withValues(alpha: 0.7),
              fontWeight: FontWeight.w500,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}

class _DottedWorldBackground extends StatelessWidget {
  const _DottedWorldBackground();

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      painter: _DottedWorldPainter(
        dotColor: Colors.white.withValues(alpha: 0.06),
        accentColor: Theme.of(context).colorScheme.secondary.withValues(alpha: 0.08),
      ),
    );
  }
}

class _DottedWorldPainter extends CustomPainter {
  _DottedWorldPainter({required this.dotColor, required this.accentColor});

  final Color dotColor;
  final Color accentColor;

  @override
  void paint(Canvas canvas, Size size) {
    final dotPaint = Paint()..color = dotColor;
    const step = 16.0;

    for (double y = 8; y < size.height; y += step) {
      for (double x = 8; x < size.width; x += step) {
        canvas.drawCircle(Offset(x, y), 1.2, dotPaint);
      }
    }

    final accentPaint = Paint()..color = accentColor;
    final path = Path()
      ..moveTo(size.width * 0.08, size.height * 0.36)
      ..quadraticBezierTo(
        size.width * 0.26,
        size.height * 0.18,
        size.width * 0.48,
        size.height * 0.33,
      )
      ..quadraticBezierTo(
        size.width * 0.63,
        size.height * 0.45,
        size.width * 0.86,
        size.height * 0.31,
      )
      ..lineTo(size.width * 0.86, size.height * 0.68)
      ..quadraticBezierTo(
        size.width * 0.61,
        size.height * 0.85,
        size.width * 0.37,
        size.height * 0.69,
      )
      ..quadraticBezierTo(
        size.width * 0.2,
        size.height * 0.59,
        size.width * 0.08,
        size.height * 0.36,
      )
      ..close();

    canvas.drawPath(path, accentPaint);
  }

  @override
  bool shouldRepaint(covariant _DottedWorldPainter oldDelegate) {
    return oldDelegate.dotColor != dotColor ||
        oldDelegate.accentColor != accentColor;
  }
}
