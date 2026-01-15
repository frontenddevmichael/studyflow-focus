import { StudySession, DayOfWeek } from '@/types/study';

// Generate sample sessions to demonstrate the app
export function generateSampleSessions(): StudySession[] {
  const now = Date.now();
  
  const samples: Omit<StudySession, 'id' | 'createdAt' | 'updatedAt'>[] = [
    // Monday
    {
      courseName: 'Linear Algebra',
      day: 'monday',
      startTime: '09:00',
      endTime: '10:30',
      type: 'lecture',
      intensity: 'medium',
      notes: 'Chapter 5: Eigenvalues and Eigenvectors'
    },
    {
      courseName: 'Data Structures',
      day: 'monday',
      startTime: '14:00',
      endTime: '15:30',
      type: 'lecture',
      intensity: 'heavy',
      notes: 'Binary trees and graph algorithms'
    },
    
    // Tuesday
    {
      courseName: 'Physics 201',
      day: 'tuesday',
      startTime: '08:00',
      endTime: '09:30',
      type: 'lecture',
      intensity: 'medium'
    },
    {
      courseName: 'Linear Algebra',
      day: 'tuesday',
      startTime: '11:00',
      endTime: '12:30',
      type: 'personal',
      intensity: 'light',
      notes: 'Practice problems from homework set 4'
    },
    
    // Wednesday
    {
      courseName: 'Data Structures',
      day: 'wednesday',
      startTime: '10:00',
      endTime: '12:00',
      type: 'revision',
      intensity: 'heavy',
      notes: 'Prepare for upcoming quiz'
    },
    {
      courseName: 'Technical Writing',
      day: 'wednesday',
      startTime: '14:00',
      endTime: '15:00',
      type: 'lecture',
      intensity: 'light'
    },
    
    // Thursday
    {
      courseName: 'Linear Algebra',
      day: 'thursday',
      startTime: '09:00',
      endTime: '10:30',
      type: 'lecture',
      intensity: 'medium'
    },
    {
      courseName: 'Physics 201',
      day: 'thursday',
      startTime: '13:00',
      endTime: '14:30',
      type: 'personal',
      intensity: 'medium',
      notes: 'Lab report preparation'
    },
    {
      courseName: 'Data Structures',
      day: 'thursday',
      startTime: '16:00',
      endTime: '17:30',
      type: 'personal',
      intensity: 'heavy',
      notes: 'Implement binary search tree project'
    },
    
    // Friday
    {
      courseName: 'Physics 201',
      day: 'friday',
      startTime: '10:00',
      endTime: '11:30',
      type: 'lecture',
      intensity: 'medium'
    },
    {
      courseName: 'Technical Writing',
      day: 'friday',
      startTime: '14:00',
      endTime: '15:30',
      type: 'revision',
      intensity: 'light',
      notes: 'Review essay draft'
    },
    
    // Saturday - Light study day
    {
      courseName: 'Linear Algebra',
      day: 'saturday',
      startTime: '10:00',
      endTime: '11:30',
      type: 'revision',
      intensity: 'light',
      notes: 'Weekly review of concepts'
    },
    
    // Sunday - Rest or light catch-up
    {
      courseName: 'Data Structures',
      day: 'sunday',
      startTime: '15:00',
      endTime: '16:30',
      type: 'personal',
      intensity: 'light',
      notes: 'Read ahead for next week'
    }
  ];

  return samples.map((session, index) => ({
    ...session,
    id: `sample-${index}-${now}`,
    createdAt: now - (samples.length - index) * 3600000,
    updatedAt: now - (samples.length - index) * 3600000
  }));
}
