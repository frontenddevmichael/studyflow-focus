import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  StudySession,
  SessionType,
  StudyIntensity,
  DayOfWeek,
  DAYS_OF_WEEK,
  DAY_FULL_LABELS,
  SESSION_TYPE_LABELS,
  INTENSITY_LABELS,
  TimeConflict
} from '@/types/study';
import { getTimeOptions, timeToMinutes, formatTimeDisplay, formatDuration } from '@/lib/timeUtils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Clock, BookOpen, Zap } from 'lucide-react';

interface SessionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (session: Omit<StudySession, 'id' | 'createdAt' | 'updatedAt'>) => {
    success: boolean;
    conflicts?: TimeConflict[];
  };
  initialData?: StudySession;
  defaultDay?: DayOfWeek;
}

const timeOptions = getTimeOptions();

export function SessionForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  defaultDay
}: SessionFormProps) {
  const [courseName, setCourseName] = useState('');
  const [day, setDay] = useState<DayOfWeek>(defaultDay || 'monday');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [type, setType] = useState<SessionType>('lecture');
  const [intensity, setIntensity] = useState<StudyIntensity>('medium');
  const [notes, setNotes] = useState('');
  const [conflicts, setConflicts] = useState<TimeConflict[]>([]);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!initialData;

  // Reset form when opened or initial data changes
  useEffect(() => {
    if (open) {
      if (initialData) {
        setCourseName(initialData.courseName);
        setDay(initialData.day);
        setStartTime(initialData.startTime);
        setEndTime(initialData.endTime);
        setType(initialData.type);
        setIntensity(initialData.intensity);
        setNotes(initialData.notes || '');
      } else {
        setCourseName('');
        setDay(defaultDay || 'monday');
        setStartTime('09:00');
        setEndTime('10:00');
        setType('lecture');
        setIntensity('medium');
        setNotes('');
      }
      setConflicts([]);
      setError(null);
    }
  }, [open, initialData, defaultDay]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConflicts([]);
    setError(null);

    // Validate times
    if (timeToMinutes(startTime) >= timeToMinutes(endTime)) {
      setError('End time must be after start time');
      return;
    }

    const sessionData = {
      courseName: courseName.trim(),
      day,
      startTime,
      endTime,
      type,
      intensity,
      notes: notes.trim() || undefined
    };

    const result = onSubmit(sessionData);

    if (result.success) {
      onOpenChange(false);
    } else if (result.conflicts) {
      setConflicts(result.conflicts);
    }
  };

  const duration = timeToMinutes(endTime) - timeToMinutes(startTime);
  const isValidDuration = duration > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            {isEditing ? 'Edit Study Session' : 'New Study Session'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Course Name */}
          <div className="space-y-2">
            <Label htmlFor="courseName" className="text-sm font-medium">
              Course / Subject
            </Label>
            <Input
              id="courseName"
              placeholder="e.g., Linear Algebra, History 101"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="bg-secondary border-border"
              required
              autoFocus
            />
          </div>

          {/* Day Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Day</Label>
            <Select value={day} onValueChange={(v) => setDay(v as DayOfWeek)}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {DAYS_OF_WEEK.map((d) => (
                  <SelectItem key={d} value={d}>
                    {DAY_FULL_LABELS[d]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                Start Time
              </Label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger className="bg-secondary border-border font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border max-h-[200px]">
                  {timeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="font-mono">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                End Time
              </Label>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger className="bg-secondary border-border font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border max-h-[200px]">
                  {timeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="font-mono">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Duration indicator */}
          {isValidDuration && (
            <p className="text-xs text-muted-foreground -mt-2">
              Duration: {formatDuration(duration)}
            </p>
          )}

          {/* Session Type & Intensity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Session Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as SessionType)}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {(Object.keys(SESSION_TYPE_LABELS) as SessionType[]).map((t) => (
                    <SelectItem key={t} value={t}>
                      <span className="flex items-center gap-2">
                        <span
                          className={cn(
                            'w-2 h-2 rounded-full',
                            t === 'lecture' && 'bg-session-lecture',
                            t === 'personal' && 'bg-session-personal',
                            t === 'revision' && 'bg-session-revision'
                          )}
                        />
                        {SESSION_TYPE_LABELS[t]}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-muted-foreground" />
                Intensity
              </Label>
              <Select value={intensity} onValueChange={(v) => setIntensity(v as StudyIntensity)}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {(Object.keys(INTENSITY_LABELS) as StudyIntensity[]).map((i) => (
                    <SelectItem key={i} value={i}>
                      <span className="flex items-center gap-2">
                        <span
                          className={cn(
                            'w-2 h-2 rounded-full',
                            i === 'light' && 'bg-intensity-light',
                            i === 'medium' && 'bg-intensity-medium',
                            i === 'heavy' && 'bg-intensity-heavy'
                          )}
                        />
                        {INTENSITY_LABELS[i]}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Notes <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Textarea
              id="notes"
              placeholder="Topics to cover, page numbers, reminders..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-secondary border-border resize-none h-20"
            />
          </div>

          {/* Error Messages */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Conflict Warning */}
          {conflicts.length > 0 && (
            <div className="space-y-2 p-3 rounded-md bg-warning/10 border border-warning/20">
              <div className="flex items-center gap-2 text-warning text-sm font-medium">
                <AlertCircle className="h-4 w-4" />
                Time Conflict Detected
              </div>
              {conflicts.map((conflict, idx) => (
                <p key={idx} className="text-xs text-muted-foreground ml-6">
                  Overlaps with "{conflict.session1.courseName}" ({formatTimeDisplay(conflict.session1.startTime)} – {formatTimeDisplay(conflict.session1.endTime)})
                  by {formatDuration(conflict.overlapMinutes)}
                </p>
              ))}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!courseName.trim() || !isValidDuration}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isEditing ? 'Save Changes' : 'Add Session'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
