import { cn } from '@/lib/utils';
import { DayOfWeek, DAYS_OF_WEEK, DAY_LABELS, DAY_FULL_LABELS, StudySession } from '@/types/study';
import { DayStats } from '@/types/study';
import { SessionCard } from './SessionCard';
import { formatDuration, timeToMinutes, getCurrentTime } from '@/lib/timeUtils';
import { Plus, Calendar, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
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

const TIME_SLOTS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

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
  const currentHour = parseInt(currentTime.split(':')[0]);

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
    <div className="flex-1 overflow-x-auto">
      <div className="min-w-[900px]">
        {/* Header row with days */}
        <div className="grid grid-cols-[60px_repeat(7,1fr)] gap-px bg-border/50 rounded-t-lg overflow-hidden">
          {/* Time column header */}
          <div className="bg-card p-3 flex items-center justify-center">
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* Day headers */}
          {DAYS_OF_WEEK.map((day) => {
            const stats = getDayStats(day);
            const isToday = day === currentDay;

            return (
              <div
                key={day}
                className={cn(
                  'bg-card p-3 text-center transition-colors',
                  isToday && 'bg-primary/5 border-b-2 border-primary',
                  focusMode && day !== currentDay && 'opacity-50'
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className={cn(
                      'text-xs uppercase tracking-wider',
                      isToday ? 'text-primary font-semibold' : 'text-muted-foreground'
                    )}>
                      {DAY_LABELS[day]}
                    </span>
                    {isToday && (
                      <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary">
                        Today
                      </span>
                    )}
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:bg-primary/20 hover:text-primary"
                        onClick={() => onAddSession(day)}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="text-xs">
                      Add session on {DAY_FULL_LABELS[day]}
                    </TooltipContent>
                  </Tooltip>
                </div>

                {/* Day stats */}
                <div className={cn(
                  'mt-1.5 text-[10px] inline-flex items-center gap-1 px-2 py-0.5 rounded-full',
                  getStatusBg(stats.status)
                )}>
                  <span className={getStatusColor(stats.status)}>
                    {stats.totalMinutes > 0 
                      ? `${formatDuration(stats.totalMinutes)} · ${stats.sessionCount} session${stats.sessionCount !== 1 ? 's' : ''}`
                      : 'No sessions'
                    }
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Time grid */}
        <div className="grid grid-cols-[60px_repeat(7,1fr)] bg-border/30 rounded-b-lg overflow-hidden">
          {/* Time labels column */}
          <div className="bg-card/50">
            {TIME_SLOTS.map((hour) => (
              <div
                key={hour}
                className={cn(
                  'h-16 border-b border-border/30 flex items-start justify-end pr-2 pt-1',
                  hour === currentHour && 'bg-primary/5'
                )}
              >
                <span className={cn(
                  'text-[10px] font-mono',
                  hour === currentHour ? 'text-primary' : 'text-muted-foreground'
                )}>
                  {hour.toString().padStart(2, '0')}:00
                </span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {DAYS_OF_WEEK.map((day) => {
            const daySessions = getSessionsByDay(day)
              .filter(s => !selectedCourse || s.courseName === selectedCourse);
            const isToday = day === currentDay;
            const stats = getDayStats(day);

            return (
              <div
                key={day}
                className={cn(
                  'relative bg-card/30',
                  isToday && 'bg-primary/[0.02]',
                  focusMode && day !== currentDay && 'focus-dimmed'
                )}
              >
                {/* Hour grid lines */}
                {TIME_SLOTS.map((hour) => (
                  <div
                    key={hour}
                    className={cn(
                      'h-16 border-b border-border/20 transition-colors',
                      hour === currentHour && isToday && 'bg-primary/5'
                    )}
                  />
                ))}

                {/* Current time indicator */}
                {isToday && currentHour >= 6 && currentHour <= 22 && (
                  <div
                    className="absolute left-0 right-0 h-0.5 bg-primary/60 z-10"
                    style={{
                      top: `${((currentHour - 6) * 64) + (parseInt(currentTime.split(':')[1]) / 60 * 64)}px`
                    }}
                  >
                    <div className="absolute -left-1 -top-1 w-2 h-2 rounded-full bg-primary" />
                  </div>
                )}

                {/* Sessions */}
                <div className="absolute inset-0 p-1 overflow-hidden">
                  {daySessions.map((session) => {
                    const startHour = parseInt(session.startTime.split(':')[0]);
                    const startMin = parseInt(session.startTime.split(':')[1]);
                    const endHour = parseInt(session.endTime.split(':')[0]);
                    const endMin = parseInt(session.endTime.split(':')[1]);

                    const top = ((startHour - 6) * 64) + (startMin / 60 * 64);
                    const height = ((endHour - startHour) * 64) + ((endMin - startMin) / 60 * 64);

                    // Check if this session is upcoming (within next 2 hours today)
                    const isUpcoming = isToday && 
                      timeToMinutes(session.startTime) > timeToMinutes(currentTime) &&
                      timeToMinutes(session.startTime) <= timeToMinutes(currentTime) + 120;

                    return (
                      <div
                        key={session.id}
                        className="absolute left-1 right-1 animate-fade-in"
                        style={{ top: `${top}px`, height: `${Math.max(height - 4, 32)}px` }}
                      >
                        <SessionCard
                          session={session}
                          onEdit={onEditSession}
                          onDelete={onDeleteSession}
                          compact={height < 80}
                          isUpcoming={isUpcoming}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Empty state for the day */}
                {daySessions.length === 0 && stats.status === 'free' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-muted-foreground/40">
                      <Coffee className="h-6 w-6 mx-auto mb-1 opacity-50" />
                      <p className="text-[10px]">Free day</p>
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
