import AppLogo from './AppLogo';

export default function AppHeader() {
  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <AppLogo />
        {/* Navigation items can be added here if needed */}
      </div>
    </header>
  );
}
