
export interface FeedbackItem {
  UUID_Number: number;
  Feedback_Title?: string;
  Product_Name?: string;
  Sales_Sender?: string;
  Market?: string;
  Summary?: string;
  Type?: string;
  Full_Message?: string;
  Tags?: string;
  Status?: string;
  Replied?: boolean;
  Solved?: boolean;
  Creation_Date?: string;
}

export type FeedbackStatus = 'Unread' | 'Read' | 'Replied' | 'Solved';
export type FeedbackType = 'Bug' | 'Feature Request' | 'Question' | 'Feedback' | 'Other';
