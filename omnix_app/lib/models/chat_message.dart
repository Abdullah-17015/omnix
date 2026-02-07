class ChatMessage {
  final String role;
  final String content;
  final List<String>? citations;
  final List<String>? followups;

  ChatMessage({
    required this.role,
    required this.content,
    this.citations,
    this.followups,
  });

  factory ChatMessage.fromJson(Map<String, dynamic> json) {
    return ChatMessage(
      role: json['role'] as String? ?? 'assistant',
      content: json['content'] as String? ?? '',
      citations: json['citations'] != null
          ? List<String>.from(json['citations'])
          : null,
      followups: json['followups'] != null
          ? List<String>.from(json['followups'])
          : null,
    );
  }

  Map<String, dynamic> toJson() => {
    'role': role,
    'content': content,
    if (citations != null) 'citations': citations,
  };

  bool get isUser => role == 'user';
  bool get isAssistant => role == 'assistant';
}

class ChatResponse {
  final String answer;
  final List<String> citations;
  final List<String> followups;

  ChatResponse({
    required this.answer,
    required this.citations,
    required this.followups,
  });

  factory ChatResponse.fromJson(Map<String, dynamic> json) {
    return ChatResponse(
      answer: json['answer'] as String? ?? '',
      citations: List<String>.from(json['citations'] ?? []),
      followups: List<String>.from(json['followups'] ?? []),
    );
  }
}
