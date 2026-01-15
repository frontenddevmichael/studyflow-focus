import { cn } from '@/lib/utils';
import {
  DayOfWeek,
  DAYS_OF_WEEK,
  DAY_LABELS,
  DAY_FULL_LABELS,
  StudySession
} from '@/types/study';
import { DayStats } from '@/types/study';
import { SessionCard } from './SessionCard';
import {
  formatDuration,
  timeToMinutes,
  getCurrentTime
} from '@/lib/timeUtils';
import { Plus, Calendar, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface WeeklyTimetableProps {
  sessions: StudySession[];
  getSessionsByDay: (day: DayOfWeek) => StudySession[];
  getDayStats: (day: DayOfWeek) => DayStats;
  currentDay: DayOfWeek;
  focusMode: boolean;
  onAddSession: (day: DayOfWeek) => void;
  onEditSession: (session: StudySession) => void;
  onDeleteSession: (id: string) => void;
  selectedCourse: string | null;
}

const TIME_SLOTS = [
  6, 7, 8, 9, 10, 11, 12,
  13, 14, 15, 16, 17, 18,
  19, 20, 21, 22
];

const GRID_ROW_HEIGHT = 64;
const GRID_TOTAL_HEIGHT = TIME_SLOTS.length * GRID_ROW_HEIGHT;

export function WeeklyTimetable({
  getSessionsByDay,
  getDayStats,
  currentDay,
  focusMode,
  onAddSession,
  onEditSession,
  onDeleteSession,
  selectedCourse
}: WeeklyTimetableProps) {
  const currentTime = getCurrentTime();
  const currentHour = parseInt(currentTime.split(':')[0], 10);

  const getStatusColor = (status: DayStats['status']) => {
    switch (status) {
      case 'free': return 'text-muted-foreground';
      case 'light': return 'text-intensity-light';
      case 'balanced': return 'text-primary';
      case 'heavy': return 'text-intensity-medium';
      case 'overloaded': return 'text-intensity-heavy';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBg = (status: DayStats['status']) => {
    switch (status) {
      case 'free': return 'bg-muted/20';
      case 'light': return 'bg-intensity-light/10';
      case 'balanced': return 'bg-primary/10';
      case 'heavy': return 'bg-intensity-medium/10';
      case 'overloaded': return 'bg-intensity-heavy/10';
      default: return 'bg-muted/20';
    }
  };

  return (
    <div className="relative w-full overflow-x-auto">
      <div className="w-[980px]">

        {/* HEADER */}
        <div
          className="grid"
          style={{ gridTemplateColumns: '64px repeat(7, 1fr)' }}
        >
          <div className="bg-card flex items-center justify-center h-12 border-b">
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </div>

          {DAYS_OF_WEEK.map(day => {
            const stats = getDayStats(day);
            const isToday = day === currentDay;

            return (
              <div
                key={day}
                className={cn(
                  'bg-card px-2 py-1 border-b',
                  isToday && 'bg-primary/5 border-primary',
                  focusMode && day !== currentDay && 'opacity-50'
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      'text-xs font-medium',
                      isToday ? 'text-primary' : 'text-muted-foreground'
                    )}
                  >
                    {DAY_LABELS[day]}
                  </span>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => onAddSession(day)}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Add session on {DAY_FULL_LABELS[day]}
                    </TooltipContent>
                  </Tooltip>
                </div>

                <div
                  className={cn(
                    'mt-1 text-[10px] px-2 py-0.5 rounded-full inline-block',
                    getStatusBg(stats.status),
                    getStatusColor(stats.status)
                  )}
                >
                  {stats.totalMinutes
                    ? `${formatDuration(stats.totalMinutes)}`
                    : 'Free'}
                </div>
              </div>
            );
          })}
        </div>

        {/* BODY */}
        <div
          className="grid relative"
          style={{
            gridTemplateColumns: '64px repeat(7, 1fr)',
            height: GRID_TOTAL_HEIGHT
          }}
        >
          {/* TIME COLUMN */}
          <div className="bg-card/60 border-r">
            {TIME_SLOTS.map(hour => (
              <div
                key={hour}
                className="flex items-start justify-end pr-2 pt-1 border-b text-[10px] font-mono"
                style={{ height: GRID_ROW_HEIGHT }}
              >
                {hour.toString().padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {/* DAYS */}
          {DAYS_OF_WEEK.map(day => {
            const daySessions = getSessionsByDay(day)
              .filter(s => !selectedCourse || s.courseName === selectedCourse);

            const isToday = day === currentDay;

            return (
              <div
                key={day}
                className={cn(
                  'relative border-r bg-card/30',
                  isToday && 'bg-primary/[0.03]'
                )}
                style={{ height: GRID_TOTAL_HEIGHT }}
              >
                {TIME_SLOTS.map(hour => (
                  <div
                    key={hour}
                    className="border-b"
                    style={{ height: GRID_ROW_HEIGHT }}
                  />
                ))}

                {/* CURRENT TIME LINE */}
                {isToday && currentHour >= 6 && currentHour <= 22 && (
                  <div
                    className="absolute left-0 right-0 h-0.5 bg-primary z-10"
                    style={{
                      top:
                        (currentHour - 6) * GRID_ROW_HEIGHT +
                        (parseInt(currentTime.split(':')[1], 10) / 60) *
                        GRID_ROW_HEIGHT
                    }}
                  />
                )}

                {/* SESSIONS */}
                {daySessions.map(session => {
                  const start = timeToMinutes(session.startTime);
                  const end = timeToMinutes(session.endTime);

                  const top =
                    ((start - 360) / 60) * GRID_ROW_HEIGHT;
                  const height =
                    ((end - start) / 60) * GRID_ROW_HEIGHT;

                  return (
                    <div
                      key={session.id}
                      className="absolute left-1 right-1"
                      style={{
                        top,
                        height: Math.max(height, 32)
                      }}
                    >
                      <SessionCard
                        session={session}
                        onEdit={onEditSession}
                        onDelete={onDeleteSession}
                        compact={height < 80}
                      />
                    </div>
                  );
                })}

                {daySessions.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/40">
                    <div className="text-center">
                      <Coffee className="h-6 w-6 mx-auto mb-1" />
                      <span className="text-[10px]">Free day</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
