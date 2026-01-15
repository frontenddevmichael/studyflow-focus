import { cn } from '@/lib/utils';
import { BookOpen, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onAddSession: () => void;
  onLoadSamples: () => void;
}

export function EmptyState({ onAddSession, onLoadSamples }: EmptyStateProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="text-center max-w-sm pointer-events-auto animate-fade-in">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Plan Your Study Week
        </h2>
        
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          Create your first study session to start organizing your academic schedule.
          Track hours, avoid conflicts, and stay balanced.
        </p>

        <div className="flex flex-col gap-2">
          <Button
            onClick={onAddSession}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Create First Session
          </Button>
          
          <Button
            variant="outline"
            onClick={onLoadSamples}
            className="w-full border-border hover:bg-secondary gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Load Sample Schedule
          </Button>
        </div>
        
        <p className="text-[10px] text-muted-foreground/60 mt-4">
          Your data is saved locally in your browser
        </p>
      </div>
    </div>
  );
}
