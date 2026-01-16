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
import { Plus, ChevronLeft, ChevronRight, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileDayViewProps {
  sessions: StudySession[];
  getSessionsByDay: (day: DayOfWeek) => StudySession[];
  getDayStats: (day: DayOfWeek) => DayStats;
  currentDay: DayOfWeek;
  selectedDay: DayOfWeek;
  onSelectDay: (day: DayOfWeek) => void;
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

const GRID_ROW_HEIGHT = 56;

export function MobileDayView({
  getSessionsByDay,
  getDayStats,
  currentDay,
  selectedDay,
  onSelectDay,
  onAddSession,
  onEditSession,
  onDeleteSession,
  selectedCourse
}: MobileDayViewProps) {
  const currentTime = getCurrentTime();
  const currentHour = parseInt(currentTime.split(':')[0], 10);

  const daySessions = getSessionsByDay(selectedDay)
    .filter(s => !selectedCourse || s.courseName === selectedCourse);

  const stats = getDayStats(selectedDay);
  const isToday = selectedDay === currentDay;

  const currentDayIndex = DAYS_OF_WEEK.indexOf(selectedDay);

  const goToPreviousDay = () => {
    const prevIndex = currentDayIndex === 0 ? 6 : currentDayIndex - 1;
    onSelectDay(DAYS_OF_WEEK[prevIndex]);
  };

  const goToNextDay = () => {
    const nextIndex = currentDayIndex === 6 ? 0 : currentDayIndex + 1;
    onSelectDay(DAYS_OF_WEEK[nextIndex]);
  };

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

  return (
    <div className="flex flex-col h-full">
      {/* Day Selector Tabs */}
      <div className="flex items-center justify-between bg-card border-b border-border px-2 py-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={goToPreviousDay}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {DAYS_OF_WEEK.map((day) => {
            const dayStats = getDayStats(day);
            const isDayToday = day === currentDay;
            const isSelected = day === selectedDay;

            return (
              <button
                key={day}
                onClick={() => onSelectDay(day)}
                className={cn(
                  'flex flex-col items-center px-2.5 py-1.5 rounded-lg transition-all min-w-[40px]',
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : isDayToday
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-secondary text-muted-foreground'
                )}
              >
                <span className="text-[10px] font-medium">{DAY_LABELS[day]}</span>
                {dayStats.sessionCount > 0 && (
                  <div
                    className={cn(
                      'w-1.5 h-1.5 rounded-full mt-0.5',
                      isSelected ? 'bg-primary-foreground' : 'bg-primary'
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={goToNextDay}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Day Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-card/50 border-b border-border">
        <div>
          <h2 className={cn(
            'text-lg font-semibold',
            isToday ? 'text-primary' : 'text-foreground'
          )}>
            {DAY_FULL_LABELS[selectedDay]}
            {isToday && (
              <span className="ml-2 text-xs font-normal bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                Today
              </span>
            )}
          </h2>
          <p className={cn('text-xs', getStatusColor(stats.status))}>
            {stats.totalMinutes
              ? `${formatDuration(stats.totalMinutes)} · ${stats.sessionCount} session${stats.sessionCount > 1 ? 's' : ''}`
              : 'Free day'}
          </p>
        </div>

        <Button
          size="sm"
          className="h-8 gap-1.5 text-xs"
          onClick={() => onAddSession(selectedDay)}
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </Button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto">
        {daySessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground/60 py-12">
            <Coffee className="h-12 w-12 mb-3" />
            <p className="text-sm font-medium">No sessions</p>
            <p className="text-xs">Enjoy your free day!</p>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {daySessions
              .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))
              .map((session) => {
                const startMinutes = timeToMinutes(session.startTime);
                const currentMinutes = timeToMinutes(currentTime);
                const isNow =
                  isToday &&
                  startMinutes <= currentMinutes &&
                  timeToMinutes(session.endTime) > currentMinutes;

                return (
                  <div
                    key={session.id}
                    className={cn(
                      'relative',
                      isNow && 'ring-2 ring-primary rounded-lg'
                    )}
                  >
                    {isNow && (
                      <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
                    )}
                    <SessionCard
                      session={session}
                      onEdit={onEditSession}
                      onDelete={onDeleteSession}
                      compact={false}
                    />
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
