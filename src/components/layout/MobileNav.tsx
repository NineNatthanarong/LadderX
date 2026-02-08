'use client';

import { useNavigation } from '@/components/providers/NavigationContext';
import { Menu } from 'lucide-react';

export function MobileNavTrigger() {
  const { toggleSidebar } = useNavigation();

  return (
    <button
      onClick={toggleSidebar}
      aria-label="Open sidebar"
      className="p-2 -ml-2 text-muted-foreground hover:bg-accent rounded-md lg:hidden"
    >
      <Menu className="h-6 w-6" />
    </button>
  );
}
