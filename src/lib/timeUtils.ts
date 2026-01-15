import { TimeSlot } from '@/types/study';

// Generate time slots from 6 AM to 11 PM
export function generateTimeSlots(intervalMinutes: number = 30): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const startHour = 6;
  const endHour = 23;

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      if (hour === endHour && minute > 0) break;
      
      const display = formatTime(hour, minute);
      slots.push({ hour, minute, display });
    }
  }

  return slots;
}

export function formatTime(hour: number, minute: number): string {
  const h = hour.toString().padStart(2, '0');
  const m = minute.toString().padStart(2, '0');
  return `${h}:${m}`;
}

export function formatTimeDisplay(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  }
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}m`;
}

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return formatTime(hours, minutes);
}

// Calculate the vertical position and height for a session in the timetable
export function calculateSessionPosition(
  startTime: string,
  endTime: string,
  gridStartHour: number = 6,
  hourHeight: number = 60
): { top: number; height: number } {
  const startMinutes = timeToMinutes(startTime) - gridStartHour * 60;
  const endMinutes = timeToMinutes(endTime) - gridStartHour * 60;
  
  const top = (startMinutes / 60) * hourHeight;
  const height = ((endMinutes - startMinutes) / 60) * hourHeight;
  
  return { top, height: Math.max(height, 24) }; // Minimum height of 24px
}

// Get current time as string
export function getCurrentTime(): string {
  const now = new Date();
  return formatTime(now.getHours(), now.getMinutes());
}

// Check if a time is in the past today
export function isTimePast(time: string): boolean {
  const now = getCurrentTime();
  return timeToMinutes(time) < timeToMinutes(now);
}

// Get time options for select inputs
export function getTimeOptions(): { value: string; label: string }[] {
  const slots = generateTimeSlots(15);
  return slots.map((slot) => ({
    value: formatTime(slot.hour, slot.minute),
    label: formatTimeDisplay(formatTime(slot.hour, slot.minute))
  }));
}
