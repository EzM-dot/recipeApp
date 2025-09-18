import { ChefHat } from 'lucide-react';
import Link from 'next/link';

export default function AppLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
      <ChefHat size={32} />
      <h1 className="text-3xl font-headline tracking-tight">Ingredients ni zipi</h1>
    </Link>
  );
}
