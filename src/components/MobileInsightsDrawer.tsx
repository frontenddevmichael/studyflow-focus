import { BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { InsightsPanel } from './InsightsPanel';
import { WeekStats, DayStats, DayOfWeek } from '@/types/study';

interface MobileInsightsDrawerProps {
  weekStats: WeekStats;
  getDayStats: (day: DayOfWeek) => DayStats;
  currentDay: DayOfWeek;
}

export function MobileInsightsDrawer({
  weekStats,
  getDayStats,
  currentDay
}: MobileInsightsDrawerProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg bg-card border-border z-40 lg:hidden"
        >
          <BarChart3 className="h-6 w-6 text-primary" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="pb-0">
          <DrawerTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Weekly Insights
          </DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-8">
          <InsightsPanel
            weekStats={weekStats}
            getDayStats={getDayStats}
            currentDay={currentDay}
            isMobile
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
