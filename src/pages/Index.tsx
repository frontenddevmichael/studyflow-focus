import { useState, useCallback, useEffect } from 'react';
import { useStudySessions } from '@/hooks/useStudySessions';
import { StudySession, DayOfWeek } from '@/types/study';
import { generateSampleSessions } from '@/lib/sampleData';
import { AppHeader } from '@/components/AppHeader';
import { WeeklyTimetable } from '@/components/WeeklyTimetable';
import { InsightsPanel } from '@/components/InsightsPanel';
import { SessionForm } from '@/components/SessionForm';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { EmptyState } from '@/components/EmptyState';
import { TodaysFocus } from '@/components/TodaysFocus';
import { toast } from 'sonner';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const Index = () => {
  const {
    sessions,
    getSessionsByDay,
    addSession,
    updateSession,
    deleteSession,
    getDayStats,
    weekStats,
    courseNames,
    currentDay,
    todaysSessions,
    clearSessions
  } = useStudySessions();

  // Track if samples have been loaded
  const [samplesLoaded, setSamplesLoaded] = useLocalStorage(
    'studyflow_samples_loaded',
    false
  );

  // UI State
  const [focusMode, setFocusMode] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [showInsights, setShowInsights] = useState(true);

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<StudySession | null>(null);
  const [defaultDay, setDefaultDay] = useState<DayOfWeek | undefined>(undefined);

  // Confirm dialogs
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    sessionId: string | null;
  }>({
    open: false,
    sessionId: null
  });

  const [clearConfirm, setClearConfirm] = useState(false);

  // Check if timetable is empty
  const isEmpty = sessions.length === 0;

  // Responsive insights handling
  useEffect(() => {
    const handleResize = () => {
      setShowInsights(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handlers
  const handleAddSession = useCallback(
    (day?: DayOfWeek) => {
      setEditingSession(null);
      setDefaultDay(day || currentDay);
      setFormOpen(true);
    },
    [currentDay]
  );

  const handleEditSession = useCallback((session: StudySession) => {
    setEditingSession(session);
    setDefaultDay(undefined);
    setFormOpen(true);
  }, []);

  const handleDeleteSession = useCallback((id: string) => {
    setDeleteConfirm({ open: true, sessionId: id });
  }, []);

  const confirmDelete = useCallback(() => {
    if (deleteConfirm.sessionId) {
      const session = sessions.find(
        s => s.id === deleteConfirm.sessionId
      );

      deleteSession(deleteConfirm.sessionId);

      toast.success('Session deleted', {
        description: session
          ? `"${session.courseName}" has been removed`
          : undefined
      });
    }

    setDeleteConfirm({ open: false, sessionId: null });
  }, [deleteConfirm.sessionId, sessions, deleteSession]);

  const handleFormSubmit = useCallback(
    (
      sessionData: Omit<
        StudySession,
        'id' | 'createdAt' | 'updatedAt'
      >
    ) => {
      if (editingSession) {
        const result = updateSession(
          editingSession.id,
          sessionData
        );

        if (result.success) {
          toast.success('Session updated', {
            description: `"${sessionData.courseName}" has been saved`
          });
        }

        return result;
      }

      const result = addSession(sessionData);

      if (result.success) {
        toast.success('Session added', {
          description: `"${sessionData.courseName}" has been scheduled`
        });
      }

      return result;
    },
    [editingSession, addSession, updateSession]
  );

  const handleClearAll = useCallback(() => {
    setClearConfirm(true);
  }, []);

  const confirmClearAll = useCallback(() => {
    clearSessions();
    setSamplesLoaded(false);

    toast.success('All sessions cleared', {
      description: 'Your timetable has been reset'
    });

    setClearConfirm(false);
  }, [clearSessions, setSamplesLoaded]);

  const handleLoadSamples = useCallback(() => {
    const sampleSessions = generateSampleSessions();
    let addedCount = 0;

    for (const session of sampleSessions) {
      const result = addSession(session);
      if (result.success) addedCount++;
    }

    setSamplesLoaded(true);

    toast.success('Sample schedule loaded', {
      description: `Added ${addedCount} study sessions to your timetable`
    });
  }, [addSession, setSamplesLoaded]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader
        focusMode={focusMode}
        onToggleFocusMode={() => setFocusMode(!focusMode)}
        selectedCourse={selectedCourse}
        onCourseChange={setSelectedCourse}
        courseNames={courseNames}
        onAddSession={() => handleAddSession()}
        onClearAll={handleClearAll}
        sessionCount={sessions.length}
      />

      <main className="flex-1 container relative py-4 px-2 sm:px-4">
        {!isEmpty && (
          <TodaysFocus
            sessions={todaysSessions}
            currentDay={currentDay}
          />
        )}

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Timetable */}
          <div className="flex-1 relative min-w-0 overflow-x-auto">
            <WeeklyTimetable
              sessions={sessions}
              getSessionsByDay={getSessionsByDay}
              getDayStats={getDayStats}
              currentDay={currentDay}
              focusMode={focusMode}
              onAddSession={handleAddSession}
              onEditSession={handleEditSession}
              onDeleteSession={handleDeleteSession}
              selectedCourse={selectedCourse}
            />

            {isEmpty && (
              <EmptyState
                onAddSession={() => handleAddSession()}
                onLoadSamples={handleLoadSamples}
              />
            )}
          </div>

          {/* Insights */}
          {showInsights && (
            <InsightsPanel
              weekStats={weekStats}
              getDayStats={getDayStats}
              currentDay={currentDay}
            />
          )}
        </div>
      </main>

      <SessionForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        initialData={editingSession || undefined}
        defaultDay={defaultDay}
      />

      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={open =>
          setDeleteConfirm({
            open,
            sessionId: open
              ? deleteConfirm.sessionId
              : null
          })
        }
        title="Delete Session"
        description="Are you sure you want to delete this study session? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
      />

      <ConfirmDialog
        open={clearConfirm}
        onOpenChange={setClearConfirm}
        title="Clear All Sessions"
        description="This will remove all study sessions from your timetable. This action cannot be undone."
        confirmLabel="Clear All"
        variant="destructive"
        onConfirm={confirmClearAll}
      />
    </div>
  );
};

export default Index;
