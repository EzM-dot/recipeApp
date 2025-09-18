export default function AppFooter() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Ingredients ni zipi. AI-powered recipe generation.
        </p>
        <p className="text-xs mt-1">
          Disclaimer: Recipes are AI-generated and should be used with discretion. Always verify cooking times and ingredient safety.
        </p>
      </div>
    </footer>
  );
}
