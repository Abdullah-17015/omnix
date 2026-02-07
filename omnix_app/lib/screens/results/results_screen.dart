import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/auth_provider.dart';
import '../../providers/scan_provider.dart';
import '../../providers/history_provider.dart';
import '../../models/scan.dart';
import 'overview_tab.dart';
import 'map_tab.dart';
import 'evidence_tab.dart';
import 'chat_tab.dart';

class ResultsScreen extends ConsumerStatefulWidget {
  final Scan? loadedScan;

  const ResultsScreen({super.key, this.loadedScan});

  @override
  ConsumerState<ResultsScreen> createState() => _ResultsScreenState();
}

class _ResultsScreenState extends ConsumerState<ResultsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  bool _saved = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _saveScan() async {
    if (_saved) return;

    final scanState = ref.read(scanProvider);
    if (scanState.product == null || 
        scanState.ecoScore == null ||
        scanState.originPins == null) {
      return;
    }

    final user = ref.read(currentUserProvider);
    if (user == null) return;

    final scan = Scan(
      uid: user.uid,
      createdAt: DateTime.now(),
      detectedProduct: scanState.product!,
      ecoScore: scanState.ecoScore!,
      originPins: scanState.originPins!,
    );

    await ref.read(historyNotifierProvider.notifier).saveScan(scan);
    setState(() => _saved = true);

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Scan saved to history!')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final scanState = ref.watch(scanProvider);
    final product = widget.loadedScan?.detectedProduct ?? scanState.product;
    final ecoScore = widget.loadedScan?.ecoScore ?? scanState.ecoScore;

    if (product == null || ecoScore == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Results')),
        body: const Center(child: Text('No scan data available')),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text('${product.brand} ${product.model}'),
        actions: [
          if (widget.loadedScan == null) ...[
            IconButton(
              icon: Icon(_saved ? Icons.bookmark : Icons.bookmark_border),
              onPressed: _saved ? null : _saveScan,
            ),
          ],
        ],
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(icon: Icon(Icons.dashboard), text: 'Overview'),
            Tab(icon: Icon(Icons.map), text: 'Map'),
            Tab(icon: Icon(Icons.source), text: 'Evidence'),
            Tab(icon: Icon(Icons.chat), text: 'Chat'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          OverviewTab(
            product: product,
            ecoScore: ecoScore,
            loadedScan: widget.loadedScan,
          ),
          MapTab(loadedScan: widget.loadedScan),
          EvidenceTab(loadedScan: widget.loadedScan),
          ChatTab(loadedScan: widget.loadedScan),
        ],
      ),
    );
  }
}
