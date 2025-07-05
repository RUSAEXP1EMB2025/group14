/**
 * Message Entity - LINEメッセージを表現するドメインエンティティ
 */

export type MessageType = 'text' | 'image' | 'template' | 'flex' | 'quick_reply';

export interface MessageId {
  readonly value: string;
}

export interface UserId {
  readonly value: string;
}

export interface MessageContent {
  readonly text?: string;
  readonly template?: unknown;
  readonly flex?: unknown;
  readonly quickReply?: unknown;
}

export class Message {
  constructor(
    public readonly id: MessageId,
    public readonly userId: UserId,
    public readonly type: MessageType,
    public readonly content: MessageContent,
    public readonly timestamp: Date = new Date(),
    public readonly replyToken?: string
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.id.value.trim()) {
      throw new Error('Message ID cannot be empty');
    }
    if (!this.userId.value.trim()) {
      throw new Error('User ID cannot be empty');
    }
    if (this.type === 'text' && !this.content.text) {
      throw new Error('Text message must have text content');
    }
  }

  /**
   * テキストメッセージかどうか
   */
  isTextMessage(): boolean {
    return this.type === 'text';
  }

  /**
   * 返信可能かどうか
   */
  isReplyable(): boolean {
    return !!this.replyToken;
  }

  /**
   * メッセージの内容を取得
   */
  getText(): string | undefined {
    return this.content.text;
  }

  /**
   * メッセージの長さを取得
   */
  getTextLength(): number {
    return this.content.text?.length ?? 0;
  }

  /**
   * 特定のキーワードが含まれているかチェック
   */
  containsKeyword(keyword: string): boolean {
    if (!this.content.text) return false;
    return this.content.text.toLowerCase().includes(keyword.toLowerCase());
  }

  /**
   * 複数のキーワードのいずれかが含まれているかチェック
   */
  containsAnyKeyword(keywords: string[]): boolean {
    return keywords.some(keyword => this.containsKeyword(keyword));
  }

  /**
   * メッセージが古すぎるかどうかを判定
   */
  isStale(maxAgeMinutes = 60): boolean {
    const now = new Date();
    const ageMinutes = (now.getTime() - this.timestamp.getTime()) / (1000 * 60);
    return ageMinutes > maxAgeMinutes;
  }

  /**
   * 文字列表現
   */
  toString(): string {
    return `Message(${this.id.value}, ${this.type}, from: ${this.userId.value})`;
  }

  /**
   * 等価性の判定
   */
  equals(other: Message): boolean {
    return this.id.value === other.id.value;
  }
}
