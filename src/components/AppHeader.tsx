import { useState } from 'react';
import { cn } from '@/lib/utils';
import { BookOpen, Eye, EyeOff, Filter, Plus, RotateCcw, Menu, X } from 'lucide-react';
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="container flex items-center justify-between h-14 px-3 sm:px-4">
        {/* Logo / Brand */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <BookOpen className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-semibold text-foreground tracking-tight">
              StudyFlow
            </h1>
            <p className="text-[10px] text-muted-foreground -mt-0.5 hidden sm:block">
              Weekly Study Planner
            </p>
          </div>
        </div>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-2">
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

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-2">
          {/* Add Session Button - Always visible on mobile */}
          <Button
            onClick={onAddSession}
            size="sm"
            className="h-9 w-9 p-0 sm:h-8 sm:px-3 sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
            <span className="hidden sm:inline ml-1.5 text-xs">Add</span>
          </Button>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-card">
              <SheetHeader>
                <SheetTitle>Settings</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-6">
                {/* Course Filter */}
                {courseNames.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filter by Course
                    </label>
                    <Select
                      value={selectedCourse || 'all'}
                      onValueChange={(v) => {
                        onCourseChange(v === 'all' ? null : v);
                      }}
                    >
                      <SelectTrigger className="w-full bg-secondary border-border">
                        <SelectValue placeholder="All courses" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="all">All courses</SelectItem>
                        {courseNames.map((name) => (
                          <SelectItem key={name} value={name}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Focus Mode Toggle */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    {focusMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    Focus Mode
                  </label>
                  <Button
                    variant={focusMode ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => {
                      onToggleFocusMode();
                    }}
                  >
                    {focusMode ? 'Focus Mode On' : 'Focus Mode Off'}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    {focusMode 
                      ? 'Other days are dimmed' 
                      : 'Dim other days to focus on today'
                    }
                  </p>
                </div>

                {/* Clear All */}
                {sessionCount > 0 && (
                  <div className="space-y-2 pt-4 border-t border-border">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        onClearAll();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Clear All Sessions
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
