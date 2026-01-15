import { cn } from '@/lib/utils';
import { StudySession } from '@/types/study';
import { formatTimeDisplay, timeToMinutes, getCurrentTime, formatDuration } from '@/lib/timeUtils';
import { Clock, ArrowRight, Check, Coffee } from 'lucide-react';

interface TodaysFocusProps {
  sessions: StudySession[];
  currentDay: string;
}

export function TodaysFocus({ sessions }: TodaysFocusProps) {
  const currentTime = getCurrentTime();
  const currentMinutes = timeToMinutes(currentTime);

  // Find current and upcoming sessions
  const sortedSessions = [...sessions].sort(
    (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  );

  const currentSession = sortedSessions.find(
    (s) => 
      timeToMinutes(s.startTime) <= currentMinutes && 
      timeToMinutes(s.endTime) > currentMinutes
  );

  const upcomingSessions = sortedSessions.filter(
    (s) => timeToMinutes(s.startTime) > currentMinutes
  );

  const nextSession = upcomingSessions[0];

  const completedCount = sortedSessions.filter(
    (s) => timeToMinutes(s.endTime) <= currentMinutes
  ).length;

  if (sessions.length === 0) {
    return (
      <div className="bg-card/50 border border-border rounded-lg p-4 mb-4 animate-fade-in">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Coffee className="h-5 w-5" />
          <div>
            <p className="text-sm font-medium">No sessions today</p>
            <p className="text-xs text-muted-foreground/70">Enjoy your free time or add a study session</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card/50 border border-border rounded-lg p-4 mb-4 animate-fade-in">
      <div className="flex items-center justify-between">
        {/* Current/Next Session */}
        <div className="flex items-center gap-4">
          {currentSession ? (
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-primary animate-pulse-soft" />
              </div>
              <div>
                <p className="text-xs text-primary font-medium uppercase tracking-wide">
                  In Progress
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {currentSession.courseName}
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  Until {formatTimeDisplay(currentSession.endTime)}
                </p>
              </div>
            </div>
          ) : nextSession ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  Up Next
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {nextSession.courseName}
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  Starts at {formatTimeDisplay(nextSession.startTime)}
                  {' · '}
                  <span className="text-primary">
                    in {formatDuration(timeToMinutes(nextSession.startTime) - currentMinutes)}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                <Check className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-xs text-success font-medium uppercase tracking-wide">
                  All Done!
                </p>
                <p className="text-sm font-medium text-foreground">
                  You've completed all sessions for today
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Progress indicator */}
        <div className="text-right">
          <p className="text-xs text-muted-foreground">
            Today's Progress
          </p>
          <p className="text-lg font-semibold text-foreground">
            {completedCount}/{sessions.length}
          </p>
          <div className="w-24 h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / sessions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
