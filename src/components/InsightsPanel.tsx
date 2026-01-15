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
  // --- WEEK STATUS MESSAGE ---
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

  // --- DAY STATUS LABEL ---
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

  const statusInfo = getStatusMessage(weekStats?.status);
  const StatusIcon = statusInfo.icon;

  // Calculate weekly percentage (assuming 25h/week)
  const recommendedMinutes = 25 * 60;
  const percentage = Math.min((weekStats?.totalMinutes ?? 0) / recommendedMinutes * 100, 100);

  // --- SAFETY WRAPPERS ---
  const safeGetDayStats = (day: DayOfWeek) => getDayStats?.(day) ?? { totalMinutes: 0, sessionCount: 0, status: 'free' };

  return (
    <div className="w-full max-w-sm sm:w-72 flex-shrink space-y-4 animate-slide-in">
      {/* ---------- WEEKLY SUMMARY CARD ---------- */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Weekly Overview
        </h3>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
          {/* --- Progress Circle --- */}
          <div className="relative w-24 h-24 sm:w-16 sm:h-16 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
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
                  weekStats?.status === 'light' && 'stroke-intensity-light',
                  weekStats?.status === 'balanced' && 'stroke-primary',
                  weekStats?.status === 'heavy' && 'stroke-intensity-medium',
                  weekStats?.status === 'overloaded' && 'stroke-intensity-heavy'
                )}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-base sm:text-lg font-semibold">
                {formatDuration(weekStats?.totalMinutes ?? 0).split(' ')[0]}
              </span>
            </div>
          </div>

          {/* --- Weekly Stats --- */}
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              {formatDuration(weekStats?.totalMinutes ?? 0)}
            </p>
            <p className="text-xs text-muted-foreground">
              {weekStats?.totalSessions ?? 0} session{(weekStats?.totalSessions ?? 0) !== 1 ? 's' : ''} total
            </p>
            <div className={cn('flex items-center gap-1 mt-1 text-xs', statusInfo.color)}>
              <StatusIcon className="h-3 w-3" />
              <span>{statusInfo.text}</span>
            </div>
          </div>
        </div>

        {/* --- Daily Breakdown --- */}
        <div className="space-y-2">
          <h4 className="text-[9px] sm:text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            Daily Breakdown
          </h4>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1">
            {DAYS_OF_WEEK.map((day) => {
              const stats = safeGetDayStats(day);
              const isToday = day === currentDay;
              const maxHeight = 48; // px
              const barHeight = stats.totalMinutes > 0
                ? Math.max((stats.totalMinutes / 480) * maxHeight, 6)
                : 4;

              return (
                <div key={day} className="flex flex-col items-center gap-1">
                  <div className="relative w-full flex items-end justify-center" style={{ height: `${maxHeight}px` }}>
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
                    'text-[8px] sm:text-[9px] uppercase',
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

      {/* ---------- TODAY'S FOCUS CARD ---------- */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          Today's Load
        </h3>

        {(() => {
          const todayStats = safeGetDayStats(currentDay);
          return (
            <div>
              <div className="flex flex-wrap items-baseline gap-2 mb-1">
                <span className="text-xl sm:text-2xl font-semibold">
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
              <p className="text-[9px] sm:text-xs text-muted-foreground">
                {todayStats.sessionCount === 0
                  ? 'No sessions scheduled'
                  : `${todayStats.sessionCount} session${todayStats.sessionCount !== 1 ? 's' : ''} planned`}
              </p>
            </div>
          );
        })()}
      </div>

      {/* ---------- BUSIEST DAY CARD ---------- */}
      {weekStats?.busiestDay && (
        <div className="bg-card rounded-lg border border-border p-4">
          <h3 className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Busiest Day
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-base font-medium capitalize">
              {weekStats.busiestDay}
            </span>
            <span className="text-[9px] sm:text-xs text-muted-foreground">
              {formatDuration(safeGetDayStats(weekStats.busiestDay).totalMinutes)}
            </span>
          </div>
        </div>
      )}

      {/* ---------- DAILY AVERAGE CARD ---------- */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
          Daily Average
        </h3>
        <p className="text-lg sm:text-xl font-semibold">
          {formatDuration(Math.round(weekStats?.averagePerDay ?? 0))}
        </p>
        <p className="text-[9px] sm:text-xs text-muted-foreground">per day</p>
      </div>
    </div>
  );
}
