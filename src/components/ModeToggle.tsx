
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from "@/components/ui/button";

export const ModeToggle: React.FC = () => {
  const [dark, setDark] = React.useState(false);

  React.useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setDark((prev) => !prev)}
      aria-label="Toggle dark mode"
      className="mr-1"
    >
      {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </Button>
  );
};

export default ModeToggle;
