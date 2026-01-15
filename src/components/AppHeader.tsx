import { cn } from '@/lib/utils';
import { SessionType, SESSION_TYPE_LABELS } from '@/types/study';
import { BookOpen, Eye, EyeOff, Filter, Plus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AppHeaderProps {
  focusMode: boolean;
  onToggleFocusMode: () => void;
  selectedCourse: string | null;
  onCourseChange: (course: string | null) => void;
  courseNames: string[];
  onAddSession: () => void;
  onClearAll: () => void;
  sessionCount: number;
}

export function AppHeader({
  focusMode,
  onToggleFocusMode,
  selectedCourse,
  onCourseChange,
  courseNames,
  onAddSession,
  onClearAll,
  sessionCount
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="container flex items-center justify-between h-14 px-4">
        {/* Logo / Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <BookOpen className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground tracking-tight">
              StudyFlow
            </h1>
            <p className="text-[10px] text-muted-foreground -mt-0.5">
              Weekly Study Planner
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Course Filter */}
          {courseNames.length > 0 && (
            <div className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <Select
                value={selectedCourse || 'all'}
                onValueChange={(v) => onCourseChange(v === 'all' ? null : v)}
              >
                <SelectTrigger className="w-[160px] h-8 text-xs bg-secondary border-border">
                  <SelectValue placeholder="All courses" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all" className="text-xs">
                    All courses
                  </SelectItem>
                  {courseNames.map((name) => (
                    <SelectItem key={name} value={name} className="text-xs">
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Focus Mode Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={focusMode ? "default" : "outline"}
                size="sm"
                className={cn(
                  'h-8 gap-1.5 text-xs',
                  focusMode && 'bg-primary text-primary-foreground'
                )}
                onClick={onToggleFocusMode}
              >
                {focusMode ? (
                  <>
                    <EyeOff className="h-3.5 w-3.5" />
                    Focus On
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5" />
                    Focus
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-xs">
              {focusMode 
                ? 'Show all days equally' 
                : 'Dim other days, focus on today'
              }
            </TooltipContent>
          </Tooltip>

          {/* Clear All */}
          {sessionCount > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={onClearAll}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="text-xs">Clear all sessions</TooltipContent>
            </Tooltip>
          )}

          {/* Add Session Button */}
          <Button
            onClick={onAddSession}
            size="sm"
            className="h-8 gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Session
          </Button>
        </div>
      </div>
    </header>
  );
}
