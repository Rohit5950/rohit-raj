import { ArrowLeft, Compass } from 'lucide-react';
import { Link } from 'wouter';

export default function NotFound() {
  return (
    <main className="site-shell flex min-h-[100dvh] items-center justify-center px-5">
      <div className="max-w-lg border border-[#d8cbbf] bg-[#fffaf4] p-8 shadow-[12px_12px_0_#d6a27e] sm:p-12">
        <div className="eyebrow flex items-center gap-2"><Compass size={15} /> 404 / Missing page</div>
        <h1 className="display-serif mt-5 text-5xl leading-none text-[#332820]">This page took a wrong turn.</h1>
        <p className="mt-5 text-sm leading-7 text-[#806d5d]">The analysis you were looking for is not in this dataset. Head back to Rohit’s portfolio and keep exploring.</p>
        <Link href="/" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#49352b] px-5 py-3 text-sm font-semibold text-[#fffaf4] transition hover:bg-[#a35035]" data-testid="link-not-found-home"><ArrowLeft size={16} /> Back to portfolio</Link>
      </div>
    </main>
  );
}