export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
}

export interface Subject {
  id: string;
  name: string;
  userId: string;
  syllabusText?: string;
  createdAt: number;
}

export interface ExamPaper {
  id: string;
  subjectId: string;
  userId: string;
  fileName: string;
  year?: number;
  extractedText: string;
  topics: string[];
  createdAt: number;
}

export interface TopicFrequency {
  name: string;
  count: number;
  importance: number; // 0-100
  yearTrend: { year: number; weight: number }[];
}

export interface Analysis {
  id: string; // subjectId
  topicFrequency: TopicFrequency[];
  predictedQuestions: string[];
  lastUpdated: number;
}

export interface StudyPlanDay {
  day: number;
  topic: string;
  tasks: string[];
}

export interface StudyPlan {
  id: string;
  subjectId: string;
  userId: string;
  plan: StudyPlanDay[];
  createdAt: number;
}
