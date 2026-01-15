import { cn } from '@/lib/utils';
import { WeekStats, DayStats, DAYS_OF_WEEK, DAY_LABELS, DayOfWeek } from '@/types/study';
import { formatDuration } from '@/lib/timeUtils';
import { TrendingUp, TrendingDown, BarChart3, Clock, Target, AlertTriangle } from 'lucide-react';

interface InsightsPanelProps {
  weekStats: WeekStats;
  getDayStats: (day: DayOfWeek) => DayStats;
  currentDay: DayOfWeek;
}

export function InsightsPanel({ weekStats, getDayStats, currentDay }: InsightsPanelProps) {
  const getStatusMessage = (status: WeekStats['status']) => {
    switch (status) {
      case 'light':
        return { text: 'Light week – room to add more', icon: TrendingDown, color: 'text-intensity-light' };
      case 'balanced':
        return { text: 'Balanced workload', icon: Target, color: 'text-primary' };
      case 'heavy':
        return { text: 'Heavy week – pace yourself', icon: TrendingUp, color: 'text-intensity-medium' };
      case 'overloaded':
        return { text: 'Overloaded – consider reducing', icon: AlertTriangle, color: 'text-intensity-heavy' };
      default:
        return { text: 'No data', icon: BarChart3, color: 'text-muted-foreground' };
    }
  };

  const getDayStatusLabel = (status: DayStats['status']) => {
    switch (status) {
      case 'free': return 'Free';
      case 'light': return 'Light';
      case 'balanced': return 'Balanced';
      case 'heavy': return 'Heavy';
      case 'overloaded': return 'Overloaded';
      default: return '';
    }
  };

  const statusInfo = getStatusMessage(weekStats.status);
  const StatusIcon = statusInfo.icon;

  // Calculate percentage of "recommended" study hours (assuming 25 hours/week is ideal)
  const recommendedMinutes = 25 * 60; // 1500 minutes
  const percentage = Math.min((weekStats.totalMinutes / recommendedMinutes) * 100, 100);

  return (
    <div className="w-72 flex-shrink-0 space-y-4 animate-slide-in">
      {/* Weekly Summary Card */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Weekly Overview
        </h3>

        {/* Progress circle */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="28"
                strokeWidth="4"
                fill="none"
                className="stroke-muted"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${percentage * 1.76} 176`}
                strokeLinecap="round"
                className={cn(
                  'transition-all duration-500',
                  weekStats.status === 'light' && 'stroke-intensity-light',
                  weekStats.status === 'balanced' && 'stroke-primary',
                  weekStats.status === 'heavy' && 'stroke-intensity-medium',
                  weekStats.status === 'overloaded' && 'stroke-intensity-heavy'
                )}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-semibold">
                {formatDuration(weekStats.totalMinutes).split(' ')[0]}
              </span>
            </div>
          </div>

          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              {formatDuration(weekStats.totalMinutes)}
            </p>
            <p className="text-xs text-muted-foreground">
              {weekStats.totalSessions} sessions total
            </p>
            <div className={cn('flex items-center gap-1 mt-1 text-xs', statusInfo.color)}>
              <StatusIcon className="h-3 w-3" />
              <span>{statusInfo.text}</span>
            </div>
          </div>
        </div>

        {/* Daily breakdown */}
        <div className="space-y-2">
          <h4 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            Daily Breakdown
          </h4>
          <div className="grid grid-cols-7 gap-1">
            {DAYS_OF_WEEK.map((day) => {
              const stats = getDayStats(day);
              const isToday = day === currentDay;
              const maxHeight = 48;
              const barHeight = stats.totalMinutes > 0 
                ? Math.max((stats.totalMinutes / 480) * maxHeight, 8)
                : 4;

              return (
                <div key={day} className="flex flex-col items-center gap-1">
                  <div 
                    className="relative w-full flex items-end justify-center"
                    style={{ height: `${maxHeight}px` }}
                  >
                    <div
                      className={cn(
                        'w-full max-w-[20px] rounded-t transition-all duration-300',
                        stats.status === 'free' && 'bg-muted/50',
                        stats.status === 'light' && 'bg-intensity-light/60',
                        stats.status === 'balanced' && 'bg-primary/60',
                        stats.status === 'heavy' && 'bg-intensity-medium/60',
                        stats.status === 'overloaded' && 'bg-intensity-heavy/60',
                        isToday && 'ring-1 ring-primary ring-offset-1 ring-offset-card'
                      )}
                      style={{ height: `${barHeight}px` }}
                    />
                  </div>
                  <span className={cn(
                    'text-[9px] uppercase',
                    isToday ? 'text-primary font-semibold' : 'text-muted-foreground'
                  )}>
                    {DAY_LABELS[day].charAt(0)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Today's Focus Card */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          <Clock className="h-3.5 w-3.5" />
          Today's Load
        </h3>

        {(() => {
          const todayStats = getDayStats(currentDay);
          return (
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl font-semibold">
                  {formatDuration(todayStats.totalMinutes)}
                </span>
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded-full',
                  todayStats.status === 'free' && 'bg-muted text-muted-foreground',
                  todayStats.status === 'light' && 'bg-intensity-light/20 text-intensity-light',
                  todayStats.status === 'balanced' && 'bg-primary/20 text-primary',
                  todayStats.status === 'heavy' && 'bg-intensity-medium/20 text-intensity-medium',
                  todayStats.status === 'overloaded' && 'bg-intensity-heavy/20 text-intensity-heavy'
                )}>
                  {getDayStatusLabel(todayStats.status)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {todayStats.sessionCount === 0 
                  ? 'No sessions scheduled'
                  : `${todayStats.sessionCount} session${todayStats.sessionCount !== 1 ? 's' : ''} planned`
                }
              </p>
            </div>
          );
        })()}
      </div>

      {/* Busiest Day Insight */}
      {weekStats.busiestDay && (
        <div className="bg-card rounded-lg border border-border p-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Busiest Day
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium capitalize">
              {weekStats.busiestDay}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDuration(getDayStats(weekStats.busiestDay).totalMinutes)}
            </span>
          </div>
        </div>
      )}

      {/* Average Study Time */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
          Daily Average
        </h3>
        <p className="text-lg font-semibold">
          {formatDuration(Math.round(weekStats.averagePerDay))}
        </p>
        <p className="text-xs text-muted-foreground">per day</p>
      </div>
    </div>
  );
}
