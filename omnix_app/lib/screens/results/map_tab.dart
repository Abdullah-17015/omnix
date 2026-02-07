import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../config/theme.dart';
import '../../config/constants.dart';
import '../../models/origin_pin.dart';
import '../../models/scan.dart';
import '../../providers/scan_provider.dart';

class MapTab extends ConsumerStatefulWidget {
  final Scan? loadedScan;

  const MapTab({super.key, this.loadedScan});

  @override
  ConsumerState<MapTab> createState() => _MapTabState();
}

class _MapTabState extends ConsumerState<MapTab> {
  GoogleMapController? _mapController;
  OriginPin? _selectedPin;
  int _animatedPinCount = 0;

  List<OriginPin> get _originPins {
    if (widget.loadedScan != null) {
      return widget.loadedScan!.originPins;
    }
    return ref.read(scanProvider).originPins ?? [];
  }

  Set<Marker> get _markers {
    final pins = _originPins.take(_animatedPinCount).toList();
    return pins.map((pin) {
      final hue = _getHueForConfidence(pin.confidence);
      return Marker(
        markerId: MarkerId('${pin.material}_${pin.place}'),
        position: LatLng(pin.lat, pin.lng),
        icon: BitmapDescriptor.defaultMarkerWithHue(hue),
        infoWindow: InfoWindow(
          title: pin.material,
          snippet: pin.place,
        ),
        onTap: () {
          setState(() => _selectedPin = pin);
          _showPinDetails();
        },
      );
    }).toSet();
  }

  double _getHueForConfidence(double confidence) {
    if (confidence >= 0.8) return BitmapDescriptor.hueGreen;
    if (confidence >= 0.5) return BitmapDescriptor.hueYellow;
    return BitmapDescriptor.hueOrange;
  }

  @override
  void initState() {
    super.initState();
    // Animate pins appearing one by one
    Timer.periodic(const Duration(milliseconds: 500), (timer) {
      if (!mounted) {
        timer.cancel();
        return;
      }
      if (_animatedPinCount < _originPins.length) {
        setState(() => _animatedPinCount++);
        _flyToNextPin();
      } else {
        timer.cancel();
      }
    });
  }

  void _flyToNextPin() {
    if (_mapController == null || _animatedPinCount == 0) return;
    if (_animatedPinCount > _originPins.length) return;

    final pin = _originPins[_animatedPinCount - 1];
    _mapController?.animateCamera(
      CameraUpdate.newCameraPosition(
        CameraPosition(
          target: LatLng(pin.lat, pin.lng),
          zoom: 4,
          tilt: AppConstants.defaultMapTilt,
          bearing: AppConstants.defaultMapBearing,
        ),
      ),
    );
  }

  void _showPinDetails() {
    if (_selectedPin == null) return;

    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.cardColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => _PinDetailsSheet(pin: _selectedPin!),
    );
  }

  void _resetView() {
    _mapController?.animateCamera(
      CameraUpdate.newCameraPosition(
        CameraPosition(
          target: const LatLng(20, 0),
          zoom: AppConstants.defaultMapZoom,
          tilt: AppConstants.defaultMapTilt,
          bearing: 0,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_originPins.isEmpty) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.map_outlined, size: 64, color: AppTheme.textMuted),
            SizedBox(height: 16),
            Text(
              'No origin data available',
              style: TextStyle(color: AppTheme.textSecondary),
            ),
          ],
        ),
      );
    }

    return Stack(
      children: [
        GoogleMap(
          initialCameraPosition: CameraPosition(
            target: const LatLng(20, 0),
            zoom: AppConstants.defaultMapZoom,
            tilt: AppConstants.defaultMapTilt,
          ),
          markers: _markers,
          onMapCreated: (controller) {
            _mapController = controller;
            // Apply dark map style
            controller.setMapStyle(_darkMapStyle);
          },
          mapType: MapType.normal,
          zoomControlsEnabled: false,
          compassEnabled: true,
          myLocationButtonEnabled: false,
        ),

        // Legend
        Positioned(
          top: 16,
          left: 16,
          child: Card(
            color: AppTheme.cardColor.withOpacity(0.9),
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text(
                    'Material Origins',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: AppTheme.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '${_markers.length} of ${_originPins.length} shown',
                    style: const TextStyle(
                      color: AppTheme.textSecondary,
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),

        // Reset view button
        Positioned(
          bottom: 16,
          right: 16,
          child: FloatingActionButton.small(
            onPressed: _resetView,
            backgroundColor: AppTheme.primaryColor,
            child: const Icon(Icons.center_focus_strong, color: Colors.black),
          ),
        ),
      ],
    );
  }
}

class _PinDetailsSheet extends StatelessWidget {
  final OriginPin pin;

  const _PinDetailsSheet({required this.pin});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.primaryColor.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(
                  Icons.location_on,
                  color: AppTheme.primaryColor,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      pin.material,
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.textPrimary,
                      ),
                    ),
                    Text(
                      pin.place,
                      style: const TextStyle(
                        color: AppTheme.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: _getConfidenceColor(pin.confidence).withOpacity(0.2),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  '${pin.confidenceLabel} confidence',
                  style: TextStyle(
                    color: _getConfidenceColor(pin.confidence),
                    fontWeight: FontWeight.w500,
                    fontSize: 12,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          if (pin.citationUrl.isNotEmpty)
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () async {
                  final uri = Uri.parse(pin.citationUrl);
                  if (await canLaunchUrl(uri)) {
                    await launchUrl(uri, mode: LaunchMode.externalApplication);
                  }
                },
                icon: const Icon(Icons.open_in_new),
                label: const Text('View Source'),
              ),
            ),
        ],
      ),
    );
  }

  Color _getConfidenceColor(double confidence) {
    if (confidence >= 0.8) return AppTheme.primaryColor;
    if (confidence >= 0.5) return Colors.orange;
    return AppTheme.errorColor;
  }
}

const String _darkMapStyle = '''
[
  {
    "elementType": "geometry",
    "stylers": [{"color": "#242f3e"}]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{"color": "#746855"}]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{"color": "#242f3e"}]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{"color": "#17263c"}]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [{"color": "#515c6d"}]
  }
]
''';
