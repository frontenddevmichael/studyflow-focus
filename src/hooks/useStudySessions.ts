import { useMemo, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import {
  StudySession,
  DayOfWeek,
  DayStats,
  WeekStats,
  TimeConflict,
  DAYS_OF_WEEK
} from '@/types/study';

const STORAGE_KEY = 'studyflow_sessions';

// Helper to parse time string to minutes from midnight
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// Helper to calculate session duration in minutes
function getSessionDuration(session: StudySession): number {
  return timeToMinutes(session.endTime) - timeToMinutes(session.startTime);
}

// Check if two time ranges overlap
function checkOverlap(
  start1: number,
  end1: number,
  start2: number,
  end2: number
): number {
  const overlapStart = Math.max(start1, start2);
  const overlapEnd = Math.min(end1, end2);
  return Math.max(0, overlapEnd - overlapStart);
}

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function useStudySessions() {
  const [sessions, setSessions, clearSessions] = useLocalStorage<StudySession[]>(
    STORAGE_KEY,
    []
  );

  // Get sessions for a specific day
  const getSessionsByDay = useCallback(
    (day: DayOfWeek): StudySession[] => {
      return sessions
        .filter((s) => s.day === day)
        .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
    },
    [sessions]
  );

  // Check for conflicts with a new/updated session
  const findConflicts = useCallback(
    (session: Omit<StudySession, 'id' | 'createdAt' | 'updatedAt'>, excludeId?: string): TimeConflict[] => {
      const conflicts: TimeConflict[] = [];
      const newStart = timeToMinutes(session.startTime);
      const newEnd = timeToMinutes(session.endTime);

      const daySessions = sessions.filter(
        (s) => s.day === session.day && s.id !== excludeId
      );

      for (const existing of daySessions) {
        const existingStart = timeToMinutes(existing.startTime);
        const existingEnd = timeToMinutes(existing.endTime);
        const overlap = checkOverlap(newStart, newEnd, existingStart, existingEnd);

        if (overlap > 0) {
          conflicts.push({
            session1: existing,
            session2: { ...session, id: excludeId || 'new', createdAt: 0, updatedAt: 0 } as StudySession,
            overlapMinutes: overlap
          });
        }
      }

      return conflicts;
    },
    [sessions]
  );

  // Add a new session
  const addSession = useCallback(
    (sessionData: Omit<StudySession, 'id' | 'createdAt' | 'updatedAt'>): {
      success: boolean;
      session?: StudySession;
      conflicts?: TimeConflict[];
    } => {
      const conflicts = findConflicts(sessionData);
      
      if (conflicts.length > 0) {
        return { success: false, conflicts };
      }

      const now = Date.now();
      const newSession: StudySession = {
        ...sessionData,
        id: generateId(),
        createdAt: now,
        updatedAt: now
      };

      setSessions((prev) => [...prev, newSession]);
      return { success: true, session: newSession };
    },
    [findConflicts, setSessions]
  );

  // Update an existing session
  const updateSession = useCallback(
    (
      id: string,
      updates: Partial<Omit<StudySession, 'id' | 'createdAt' | 'updatedAt'>>
    ): { success: boolean; session?: StudySession; conflicts?: TimeConflict[] } => {
      const existing = sessions.find((s) => s.id === id);
      if (!existing) {
        return { success: false };
      }

      const updatedData = { ...existing, ...updates };
      const conflicts = findConflicts(updatedData, id);

      if (conflicts.length > 0) {
        return { success: false, conflicts };
      }

      const updatedSession: StudySession = {
        ...updatedData,
        updatedAt: Date.now()
      };

      setSessions((prev) =>
        prev.map((s) => (s.id === id ? updatedSession : s))
      );

      return { success: true, session: updatedSession };
    },
    [sessions, findConflicts, setSessions]
  );

  // Delete a session
  const deleteSession = useCallback(
    (id: string): boolean => {
      const exists = sessions.some((s) => s.id === id);
      if (!exists) return false;

      setSessions((prev) => prev.filter((s) => s.id !== id));
      return true;
    },
    [sessions, setSessions]
  );

  // Calculate stats for a specific day
  const getDayStats = useCallback(
    (day: DayOfWeek): DayStats => {
      const daySessions = getSessionsByDay(day);
      const totalMinutes = daySessions.reduce(
        (sum, s) => sum + getSessionDuration(s),
        0
      );

      let status: DayStats['status'];
      if (totalMinutes === 0) {
        status = 'free';
      } else if (totalMinutes < 120) {
        status = 'light';
      } else if (totalMinutes <= 300) {
        status = 'balanced';
      } else if (totalMinutes <= 420) {
        status = 'heavy';
      } else {
        status = 'overloaded';
      }

      return {
        totalMinutes,
        sessionCount: daySessions.length,
        status
      };
    },
    [getSessionsByDay]
  );

  // Calculate weekly stats
  const weekStats = useMemo((): WeekStats => {
    let totalMinutes = 0;
    let totalSessions = 0;
    let busiestDay: DayOfWeek | null = null;
    let lightestDay: DayOfWeek | null = null;
    let maxMinutes = 0;
    let minMinutes = Infinity;

    for (const day of DAYS_OF_WEEK) {
      const stats = getDayStats(day);
      totalMinutes += stats.totalMinutes;
      totalSessions += stats.sessionCount;

      if (stats.totalMinutes > maxMinutes) {
        maxMinutes = stats.totalMinutes;
        busiestDay = day;
      }

      if (stats.totalMinutes < minMinutes) {
        minMinutes = stats.totalMinutes;
        lightestDay = day;
      }
    }

    const averagePerDay = totalMinutes / 7;

    let status: WeekStats['status'];
    if (totalMinutes < 600) {
      status = 'light';
    } else if (totalMinutes <= 1500) {
      status = 'balanced';
    } else if (totalMinutes <= 2100) {
      status = 'heavy';
    } else {
      status = 'overloaded';
    }

    return {
      totalMinutes,
      totalSessions,
      averagePerDay,
      busiestDay: maxMinutes > 0 ? busiestDay : null,
      lightestDay: minMinutes < Infinity && minMinutes > 0 ? lightestDay : null,
      status
    };
  }, [getDayStats]);

  // Get unique course names for filtering
  const courseNames = useMemo(() => {
    const names = new Set(sessions.map((s) => s.courseName));
    return Array.from(names).sort();
  }, [sessions]);

  // Get today's sessions
  const todaysSessions = useMemo(() => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as DayOfWeek;
    return getSessionsByDay(today);
  }, [getSessionsByDay]);

  // Get current day of week
  const currentDay = useMemo((): DayOfWeek => {
    return new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as DayOfWeek;
  }, []);

  return {
    sessions,
    getSessionsByDay,
    addSession,
    updateSession,
    deleteSession,
    findConflicts,
    getDayStats,
    weekStats,
    courseNames,
    todaysSessions,
    currentDay,
    clearSessions
  };
}
