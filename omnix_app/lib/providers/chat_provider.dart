import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'scan_provider.dart';

class ChatState {
  final List<ChatMessage> messages;
  final bool isLoading;
  final String? error;

  const ChatState({
    this.messages = const [],
    this.isLoading = false,
    this.error,
  });

  ChatState copyWith({
    List<ChatMessage>? messages,
    bool? isLoading,
    String? error,
  }) {
    return ChatState(
      messages: messages ?? this.messages,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

class ChatNotifier extends StateNotifier<ChatState> {
  final Ref _ref;

  ChatNotifier(this._ref) : super(const ChatState());

  void reset() {
    state = const ChatState();
  }

  Future<void> sendMessage(String message) async {
    if (message.trim().isEmpty) return;

    final scanState = _ref.read(scanProvider);
    if (scanState.product == null || 
        scanState.ecoScore == null || 
        scanState.evidencePack == null) {
      state = state.copyWith(error: 'No scan data available');
      return;
    }

    // Add user message
    final userMessage = ChatMessage(role: 'user', content: message);
    state = state.copyWith(
      messages: [...state.messages, userMessage],
      isLoading: true,
      error: null,
    );

    try {
      final apiService = _ref.read(apiServiceProvider);
      final response = await apiService.sendChatMessage(
        product: scanState.product!,
        ecoScore: scanState.ecoScore!,
        evidencePack: scanState.evidencePack!,
        message: message,
        history: state.messages,
      );

      final assistantMessage = ChatMessage(
        role: 'assistant',
        content: response.answer,
        citations: response.citations,
        followups: response.followups,
      );

      state = state.copyWith(
        messages: [...state.messages, assistantMessage],
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: 'Failed to get response: $e',
      );
    }
  }
}

final chatProvider = StateNotifierProvider<ChatNotifier, ChatState>((ref) {
  return ChatNotifier(ref);
});
