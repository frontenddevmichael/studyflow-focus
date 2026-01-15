// Core data types for StudyFlow

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type SessionType = 'lecture' | 'personal' | 'revision';

export type StudyIntensity = 'light' | 'medium' | 'heavy';

export interface StudySession {
  id: string;
  courseName: string;
  day: DayOfWeek;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  type: SessionType;
  intensity: StudyIntensity;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface TimeSlot {
  hour: number;
  minute: number;
  display: string;
}

export interface DayStats {
  totalMinutes: number;
  sessionCount: number;
  status: 'free' | 'light' | 'balanced' | 'heavy' | 'overloaded';
}

export interface WeekStats {
  totalMinutes: number;
  totalSessions: number;
  averagePerDay: number;
  busiestDay: DayOfWeek | null;
  lightestDay: DayOfWeek | null;
  status: 'light' | 'balanced' | 'heavy' | 'overloaded';
}

export interface TimeConflict {
  session1: StudySession;
  session2: StudySession;
  overlapMinutes: number;
}

// Days array for iteration
export const DAYS_OF_WEEK: DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
];

export const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun'
};

export const DAY_FULL_LABELS: Record<DayOfWeek, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday'
};

export const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  lecture: 'Lecture',
  personal: 'Personal Study',
  revision: 'Revision'
};

export const INTENSITY_LABELS: Record<StudyIntensity, string> = {
  light: 'Light',
  medium: 'Medium',
  heavy: 'Heavy'
};
