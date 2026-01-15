import { useMemo } from 'react';
import { DayOfWeek, StudySession, DAYS_OF_WEEK, DAY_FULL_LABELS } from '@/types/study';
import { timeToMinutes, formatTimeDisplay, formatDuration } from '@/lib/timeUtils';

export interface FreeTimeSlot {
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
}

const MIN_FREE_SLOT_MINUTES = 60; // Only show slots of 1 hour or more
const DAY_START = '08:00';
const DAY_END = '21:00';

export function useFreeTimeDetection(
  getSessionsByDay: (day: DayOfWeek) => StudySession[]
): FreeTimeSlot[] {
  return useMemo(() => {
    const freeSlots: FreeTimeSlot[] = [];
    const dayStartMinutes = timeToMinutes(DAY_START);
    const dayEndMinutes = timeToMinutes(DAY_END);

    for (const day of DAYS_OF_WEEK) {
      const sessions = getSessionsByDay(day).sort(
        (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
      );

      if (sessions.length === 0) {
        // Entire day is free
        freeSlots.push({
          day,
          startTime: DAY_START,
          endTime: DAY_END,
          duration: dayEndMinutes - dayStartMinutes
        });
        continue;
      }

      // Check gap before first session
      const firstSessionStart = timeToMinutes(sessions[0].startTime);
      if (firstSessionStart - dayStartMinutes >= MIN_FREE_SLOT_MINUTES) {
        freeSlots.push({
          day,
          startTime: DAY_START,
          endTime: sessions[0].startTime,
          duration: firstSessionStart - dayStartMinutes
        });
      }

      // Check gaps between sessions
      for (let i = 0; i < sessions.length - 1; i++) {
        const currentEnd = timeToMinutes(sessions[i].endTime);
        const nextStart = timeToMinutes(sessions[i + 1].startTime);
        const gap = nextStart - currentEnd;

        if (gap >= MIN_FREE_SLOT_MINUTES) {
          freeSlots.push({
            day,
            startTime: sessions[i].endTime,
            endTime: sessions[i + 1].startTime,
            duration: gap
          });
        }
      }

      // Check gap after last session
      const lastSessionEnd = timeToMinutes(sessions[sessions.length - 1].endTime);
      if (dayEndMinutes - lastSessionEnd >= MIN_FREE_SLOT_MINUTES) {
        freeSlots.push({
          day,
          startTime: sessions[sessions.length - 1].endTime,
          endTime: DAY_END,
          duration: dayEndMinutes - lastSessionEnd
        });
      }
    }

    // Sort by duration (largest first) and take top slots
    return freeSlots
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 5);
  }, [getSessionsByDay]);
}

// Format a free time slot for display
export function formatFreeSlot(slot: FreeTimeSlot): string {
  return `${DAY_FULL_LABELS[slot.day]}: ${formatTimeDisplay(slot.startTime)} – ${formatTimeDisplay(slot.endTime)} (${formatDuration(slot.duration)})`;
}
