import { cn } from '@/lib/utils';
import { StudySession, SESSION_TYPE_LABELS, INTENSITY_LABELS } from '@/types/study';
import { formatTimeDisplay, formatDuration, timeToMinutes } from '@/lib/timeUtils';
import { Pencil, Trash2, Clock, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SessionCardProps {
  session: StudySession;
  onEdit: (session: StudySession) => void;
  onDelete: (id: string) => void;
  compact?: boolean;
  dimmed?: boolean;
  isUpcoming?: boolean;
}

export function SessionCard({
  session,
  onEdit,
  onDelete,
  compact = false,
  dimmed = false,
  isUpcoming = false
}: SessionCardProps) {
  const duration = timeToMinutes(session.endTime) - timeToMinutes(session.startTime);
  
  const typeClass = {
    lecture: 'session-lecture',
    personal: 'session-personal',
    revision: 'session-revision'
  }[session.type];

  const intensityClass = {
    light: 'intensity-light',
    medium: 'intensity-medium',
    heavy: 'intensity-heavy'
  }[session.intensity];

  return (
    <div
      className={cn(
        'group relative rounded-md p-3 transition-all duration-200',
        typeClass,
        intensityClass,
        dimmed && 'focus-dimmed',
        isUpcoming && 'ring-1 ring-primary/30 glow-primary',
        !compact && 'hover:translate-x-0.5 hover:shadow-card',
        compact && 'p-2'
      )}
    >
      {/* Intensity indicator dot */}
      <div 
        className={cn(
          'absolute top-3 right-3 w-2 h-2 rounded-full',
          session.intensity === 'light' && 'bg-intensity-light',
          session.intensity === 'medium' && 'bg-intensity-medium',
          session.intensity === 'heavy' && 'bg-intensity-heavy'
        )}
      />

      {/* Course name */}
      <h4 className={cn(
        'font-medium text-foreground pr-6 truncate',
        compact ? 'text-xs' : 'text-sm'
      )}>
        {session.courseName}
      </h4>

      {/* Time range */}
      <div className={cn(
        'flex items-center gap-1.5 text-muted-foreground mt-1',
        compact ? 'text-[10px]' : 'text-xs'
      )}>
        <Clock className={cn(compact ? 'w-2.5 h-2.5' : 'w-3 h-3')} />
        <span className="font-mono">
          {formatTimeDisplay(session.startTime)} – {formatTimeDisplay(session.endTime)}
        </span>
        <span className="text-muted-foreground/60">
          ({formatDuration(duration)})
        </span>
      </div>

      {/* Session type badge */}
      {!compact && (
        <div className="flex items-center gap-2 mt-2">
          <span className={cn(
            'inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full',
            'bg-background/50 text-muted-foreground'
          )}>
            <BookOpen className="w-2.5 h-2.5" />
            {SESSION_TYPE_LABELS[session.type]}
          </span>
          <span className="text-[10px] text-muted-foreground/70">
            {INTENSITY_LABELS[session.intensity]} intensity
          </span>
        </div>
      )}

      {/* Notes preview */}
      {!compact && session.notes && (
        <p className="text-xs text-muted-foreground/70 mt-2 line-clamp-2 italic">
          {session.notes}
        </p>
      )}

      {/* Action buttons - visible on touch/mobile, hover on desktop */}
      <div className={cn(
        'absolute right-2 bottom-2 flex gap-1 transition-opacity',
        'opacity-100 md:opacity-0 md:group-hover:opacity-100',
        compact && 'bottom-1 right-1'
      )}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-7 w-7 md:h-6 md:w-6 bg-background/80 hover:bg-primary/20 hover:text-primary',
                compact && 'h-6 w-6 md:h-5 md:w-5'
              )}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(session);
              }}
            >
              <Pencil className={cn(compact ? 'h-3 w-3 md:h-2.5 md:w-2.5' : 'h-3.5 w-3.5 md:h-3 md:w-3')} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs hidden md:block">Edit session</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-7 w-7 md:h-6 md:w-6 bg-background/80 hover:bg-destructive/20 hover:text-destructive',
                compact && 'h-6 w-6 md:h-5 md:w-5'
              )}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(session.id);
              }}
            >
              <Trash2 className={cn(compact ? 'h-3 w-3 md:h-2.5 md:w-2.5' : 'h-3.5 w-3.5 md:h-3 md:w-3')} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs hidden md:block">Delete session</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
