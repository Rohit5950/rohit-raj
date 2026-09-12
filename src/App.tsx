import { useEffect, useRef, useState, type FormEvent, type MouseEvent, type ReactNode } from 'react';
import { AlertCircle, ArrowLeft, ArrowUpRight, BarChart3, CheckCircle2, Code2, Database, Download, ExternalLink, Github, Linkedin, Mail, MapPin, Menu, Phone, X } from 'lucide-react';
import { BrowserRouter, Link, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { impactStats, projects, skills, timeline, type Project, type TimelineEntry } from '@/data/portfolio';

const queryClient = new QueryClient();
// Supply the user's Formspree form endpoint through VITE_FORMSPREE_ENDPOINT in the environment.
const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT as string | undefined;

function useScrollReveals() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12 });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

function SmoothLink({ id, children, className = '', onClick }: { id: string; children: ReactNode; className?: string; onClick?: () => void }) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', `/#${id}`);
    onClick?.();
  };
  return <Link to={`/#${id}`} onClick={handleClick} className={className} data-testid={`link-${id}`}>{children}</Link>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="sticky top-0 z-40 border-b border-[#dfd4c8]/80 bg-[#faf7f2]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-4 lg:px-10">
        <Link to="/" className="group flex items-center gap-3" data-testid="link-home"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#49352b] font-serif text-lg text-[#faf7f2]">R</span><span className="font-semibold tracking-[-0.03em] text-[#332820]">Rohit Raj<span className="text-[#a35035]">.</span></span></Link>
        <nav className="hidden items-center gap-8 text-sm text-[#6f5c4d] md:flex" aria-label="Main navigation"><SmoothLink id="about" className="nav-link">About</SmoothLink><SmoothLink id="work" className="nav-link">Work</SmoothLink><SmoothLink id="journey" className="nav-link">Journey</SmoothLink><SmoothLink id="contact" className="nav-link">Contact</SmoothLink></nav>
        <div className="hidden md:block"><a href="/resume.pdf" download className="inline-flex items-center gap-2 rounded-full border border-[#49352b] px-4 py-2 text-xs font-semibold text-[#49352b] transition hover:bg-[#49352b] hover:text-[#faf7f2]" data-testid="link-download-resume"><Download size={14} /> Resume</a></div>
        <button type="button" onClick={() => setOpen(!open)} className="rounded-full p-2 text-[#49352b] md:hidden" aria-label={open ? 'Close menu' : 'Open menu'} data-testid="button-mobile-menu">{open ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
      {open && <nav className="border-t border-[#dfd4c8] px-5 pb-5 pt-3 md:hidden" aria-label="Mobile navigation"><div className="flex flex-col gap-1 text-sm">{['about', 'work', 'journey', 'contact'].map((id) => <SmoothLink key={id} id={id} className="rounded-md px-2 py-3 capitalize text-[#49352b] hover:bg-[#f0e8de]" onClick={close}>{id}</SmoothLink>)}</div><a href="/resume.pdf" download onClick={close} className="mt-3 inline-flex items-center gap-2 px-2 py-3 text-sm font-semibold text-[#a35035]" data-testid="link-mobile-resume"><Download size={15} /> Download resume</a></nav>}
    </header>
  );
}

function AnimatedMetric({ value, suffix, label, note, index }: { value: number; suffix: string; label: string; note: string; index: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let frame = 0;
    let started = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started) return;
      started = true;
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / 1000, 1);
        setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
      observer.disconnect();
    }, { threshold: 0.4 });
    observer.observe(element);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [value]);
  return <div ref={ref} className="border-t border-[#cdbca9] pt-5" data-testid={`metric-${index}`}><div className="impact-number display-serif text-[3.25rem] leading-none text-[#a35035] md:text-[4.15rem]">{display}{suffix}</div><p className="mt-3 max-w-[200px] text-sm leading-6 text-[#49352b]">{label}</p><p className="mono mt-4 text-[0.62rem] uppercase tracking-[0.15em] text-[#8b7867]">{note}</p></div>;
}

function Hero() {
  return <section className="editorial-grid relative mx-auto grid max-w-[1240px] gap-14 px-5 pb-24 pt-20 lg:grid-cols-[1.12fr_0.88fr] lg:gap-16 lg:px-10 lg:pb-32 lg:pt-28" data-testid="section-hero"><div className="relative z-10"><div className="eyebrow mb-7 flex items-center gap-3"><span className="h-px w-9 bg-[#a35035]" /> Available for data analyst opportunities</div><h1 className="display-serif max-w-[760px] text-[4rem] leading-[0.94] text-[#332820] sm:text-[5.8rem] lg:text-[7.4rem]">Rohit<br /><span className="text-[#a35035]">Raj.</span></h1><p className="mt-8 max-w-[500px] text-xl leading-8 text-[#685546] sm:text-2xl">Turning data into decisions — one dataset at a time.</p><p className="mt-5 max-w-[475px] text-sm leading-7 text-[#806d5d]">Data analyst with an operations instinct. I find the useful story in messy, real-world data and make it clear enough to act on.</p><div className="mt-9 flex flex-wrap items-center gap-3"><SmoothLink id="work" className="group inline-flex items-center gap-3 rounded-full bg-[#a35035] px-5 py-3 text-sm font-semibold text-[#fffaf4] transition hover:bg-[#7e3c29]">View selected work <ArrowUpRight size={16} /></SmoothLink><a href="/resume.pdf" download className="inline-flex items-center gap-2 rounded-full border border-[#cdbca9] px-5 py-3 text-sm font-semibold text-[#49352b] transition hover:border-[#a35035] hover:text-[#a35035]" data-testid="link-hero-resume"><Download size={15} /> Download resume</a></div><div className="mt-12 flex flex-wrap items-center gap-5 text-xs text-[#806d5d]"><span className="mono uppercase tracking-[0.12em]">Connect</span><a href="mailto:rohitraj7576@gmail.com" className="transition hover:text-[#a35035]" aria-label="Email Rohit Raj" data-testid="link-hero-email"><Mail size={17} /></a><a href="https://www.linkedin.com/in/rohitrajme/" target="_blank" rel="noreferrer" aria-label="Rohit Raj on LinkedIn" className="transition hover:text-[#a35035]" data-testid="link-hero-linkedin"><Linkedin size={17} /></a><a href="https://github.com/Rohit5950" target="_blank" rel="noreferrer" aria-label="Rohit Raj on GitHub" className="transition hover:text-[#a35035]" data-testid="link-hero-github"><Github size={17} /></a></div></div><div className="relative flex min-h-[390px] items-center justify-center lg:min-h-[530px]"><div className="hero-orbit relative h-[290px] w-[290px] rounded-full border border-[#d8c5b2] sm:h-[370px] sm:w-[370px]"><div className="absolute inset-[14%] rounded-full border border-dashed border-[#bb8e6d]" /><div className="absolute -right-3 top-[18%] h-14 w-14 rounded-full bg-[#d99b75]" /><div className="absolute bottom-[15%] -left-6 h-8 w-8 rounded-full bg-[#5b827d]" /><div className="absolute left-[19%] top-[15%] h-3 w-3 rounded-full bg-[#a35035]" /><div className="absolute inset-0 flex items-center justify-center"><div className="relative w-[190px] rotate-[-7deg] bg-[#49352b] p-7 text-[#fffaf4] shadow-[14px_16px_0_#d6a27e] sm:w-[230px] sm:p-9"><div className="mono text-[0.62rem] uppercase tracking-[0.15em] text-[#dfb89c]">Field notes / 01</div><div className="mt-8 font-serif text-5xl leading-none">Data<br /><span className="text-[#dfb89c]">with</span><br />context.</div><div className="mt-8 border-t border-[#846b5e] pt-4 text-xs leading-5 text-[#e8d8c8]">SQL · Python · Power BI<br />Operations · Insight · Action</div></div></div></div><span className="mono absolute bottom-5 right-3 rotate-90 text-[0.62rem] uppercase tracking-[0.2em] text-[#a38d7b]">Scroll to explore</span></div></section>;
}

function About() {
  return <section id="about" className="mx-auto max-w-[1240px] scroll-mt-20 px-5 py-24 lg:px-10 lg:py-32" data-testid="section-about"><div className="grid gap-12 lg:grid-cols-[0.42fr_1fr] lg:gap-24"><div data-reveal><div className="eyebrow">01 / About the work</div><div className="mt-5 h-px w-14 bg-[#a35035]" /></div><div data-reveal><h2 className="display-serif max-w-[800px] text-4xl leading-[1.05] text-[#332820] sm:text-6xl">Curious about the signal, <em className="font-normal text-[#a35035]">useful</em> in the room.</h2><div className="mt-8 grid gap-8 text-[1.03rem] leading-8 text-[#685546] sm:grid-cols-2"><p>I'm a BBA graduate now specializing in Data Science &amp; Analytics at Scaler (2024–2026). My work sits at the intersection of business questions, operational reality, and the data that connects them.</p><p>As an Associate at Physics Wallah, I drive data-informed academic operations. Before that, I worked in hospital operations — experiences that taught me to make analysis clear, timely, and grounded in how people actually work.</p></div><div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-[#49352b]"><span className="inline-flex items-center gap-2"><MapPin size={15} className="text-[#a35035]" /> Bangalore, India</span><span className="inline-flex items-center gap-2"><Database size={15} className="text-[#a35035]" /> SQL-first, people-aware</span></div></div></div></section>;
}

function Impact() {
  return <section className="border-y border-[#d9cbbd] bg-[#f1e8dd]" data-testid="section-impact"><div className="mx-auto max-w-[1240px] px-5 py-20 lg:px-10 lg:py-24"><div className="mb-12 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]"><div data-reveal><div className="eyebrow">02 / Proof, not promise</div><h2 className="display-serif mt-4 max-w-sm text-4xl leading-tight text-[#332820]">Numbers that made the work matter.</h2></div><p className="max-w-lg self-end text-sm leading-7 text-[#806d5d]" data-reveal>Every metric here came from work close to a real operation: a program that needed fewer delays, a hospital that needed more efficiency, or a team that needed a better way to see its data.</p></div><div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-4">{impactStats.map((stat, index) => <AnimatedMetric key={stat.label} {...stat} index={index} />)}</div></div></section>;
}

function Skills() {
  return <section className="mx-auto max-w-[1240px] px-5 py-24 lg:px-10 lg:py-32" data-testid="section-skills"><div className="grid gap-12 lg:grid-cols-[0.42fr_1fr] lg:gap-24"><div data-reveal><div className="eyebrow">03 / The toolkit</div><h2 className="display-serif mt-4 text-4xl leading-tight text-[#332820]">Tools for the question at hand.</h2></div><div className="grid gap-8 sm:grid-cols-2" data-reveal>{skills.map((group) => <div key={group.label} className="border-t border-[#cdbca9] pt-4"><p className="mono text-[0.65rem] uppercase tracking-[0.14em] text-[#a35035]">{group.label}</p><div className="mt-4 flex flex-wrap gap-2">{group.items.map((item) => <span key={item} className="rounded-full border border-[#d7c8b8] bg-[#fffaf4] px-3 py-1.5 text-sm text-[#49352b]">{item}</span>)}</div></div>)}</div></div></section>;
}

function ProjectCard({ project }: { project: Project }) {
  return <Link to={`/projects/${project.slug}`} className={`project-card group relative flex min-h-[330px] flex-col justify-between overflow-hidden border border-[#d8cbbf] bg-[#fffaf4] p-6 ${project.placeholder ? 'border-dashed bg-[#f7f0e8]' : ''}`} data-testid={`card-project-${project.slug}`}><div className="flex items-start justify-between"><span className="mono text-[0.68rem] tracking-[0.16em] text-[#a35035]">{project.number}</span><ArrowUpRight size={18} className="text-[#a35035] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></div><div>{project.placeholder && <span className="mb-3 inline-flex rounded-full bg-[#e6d8c8] px-2 py-1 mono text-[0.56rem] uppercase tracking-[0.12em] text-[#806d5d]">Placeholder object</span>}<h3 className="display-serif text-3xl leading-tight text-[#332820]">{project.title}</h3><p className="mt-2 text-sm italic text-[#a35035]">{project.subtitle}</p><p className="mt-4 text-sm leading-6 text-[#806d5d]">{project.summary}</p><div className="mt-5 flex flex-wrap gap-2">{project.tools.slice(0, 4).map((tool) => <span key={tool} className="mono text-[0.59rem] uppercase tracking-[0.08em] text-[#8b7867]">{tool}</span>)}</div></div></Link>;
}

function Work() {
  return <section id="work" className="scroll-mt-20 border-t border-[#d9cbbd] bg-[#eee4d8]" data-testid="section-work"><div className="mx-auto max-w-[1240px] px-5 py-24 lg:px-10 lg:py-32"><div className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end" data-reveal><div><div className="eyebrow">04 / Selected work</div><h2 className="display-serif mt-4 max-w-xl text-5xl leading-[0.98] text-[#332820] sm:text-6xl">Questions first.<br /><span className="text-[#a35035]">Charts second.</span></h2></div><p className="max-w-xs text-sm leading-6 text-[#806d5d]">Three case studies in turning raw records into decisions — with room for what comes next.</p></div><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" data-reveal>{projects.map((project) => <ProjectCard key={project.slug} project={project} />)}</div></div></section>;
}

function TimelineItem({ entry, index }: { entry: TimelineEntry; index: number }) {
  const icon = entry.type === 'education' ? <Code2 size={15} /> : entry.type === 'work' ? <BarChart3 size={15} /> : <Database size={15} />;
  return <div className="relative grid gap-4 pl-10 md:grid-cols-[190px_1fr] md:gap-10 md:pl-0" data-reveal data-testid={`timeline-entry-${index}`}><div className="absolute left-[-5px] top-1 flex h-3 w-3 items-center justify-center rounded-full border-2 border-[#faf7f2] bg-[#a35035] ring-1 ring-[#bc9e88] md:left-[184px]" /><div className="mono text-[0.72rem] font-medium leading-5 tracking-[0.02em] text-[#a35035]">{entry.date}</div><div className="border-t border-[#d8cbbf] pt-4"><div className="mb-2 flex items-center gap-2 text-[0.63rem] uppercase tracking-[0.14em] text-[#8b7867]"><span className="text-[#a35035]">{icon}</span>{entry.type}</div><h3 className="display-serif text-2xl text-[#332820]">{entry.title}</h3><p className="mt-1 text-sm font-medium text-[#685546]">{entry.organization}</p><p className="mt-3 max-w-xl text-sm leading-6 text-[#806d5d]">{entry.detail}</p></div></div>;
}

function Journey() {
  return <section id="journey" className="mx-auto max-w-[1240px] scroll-mt-20 px-5 py-24 lg:px-10 lg:py-32" data-testid="section-journey"><div className="grid gap-12 lg:grid-cols-[0.42fr_1fr] lg:gap-24"><div data-reveal><div className="eyebrow">05 / The journey</div><h2 className="display-serif mt-4 text-4xl leading-tight text-[#332820]">A timeline of becoming useful.</h2></div><div className="relative space-y-10 border-l border-[#bc9e88] pb-4 md:space-y-12 md:border-l-0" data-testid="timeline">{timeline.map((entry, index) => <TimelineItem key={`${entry.date}-${entry.title}`} entry={entry} index={index} />)}</div></div></section>;
}

function Contact() {
  const [values, setValues] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const update = (field: keyof typeof values, value: string) => setValues((current) => ({ ...current, [field]: value }));
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!values.name.trim() || !values.email.trim() || !values.message.trim()) { setStatus('error'); setError('Please complete your name, email, and message.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) { setStatus('error'); setError('Please enter a valid email address.'); return; }
    if (!FORMSPREE_ENDPOINT) { setStatus('error'); setError('Contact form setup is incomplete. Add VITE_FORMSPREE_ENDPOINT to the portfolio environment, then try again.'); return; }
    setStatus('loading'); setError('');
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
      if (!response.ok) throw new Error('The form service returned an error.');
      setStatus('success'); setValues({ name: '', email: '', message: '' });
    } catch { setStatus('error'); setError('Something went wrong while sending. Please email Rohit directly at rohitraj7576@gmail.com.'); }
  };
  return <section id="contact" className="scroll-mt-20 bg-[#49352b] text-[#fffaf4]" data-testid="section-contact"><div className="mx-auto grid max-w-[1240px] gap-14 px-5 py-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24 lg:px-10 lg:py-32"><div data-reveal><div className="eyebrow !text-[#dfb89c]">06 / Start a conversation</div><h2 className="display-serif mt-5 text-5xl leading-[0.98] sm:text-6xl">Have a question worth measuring?</h2><p className="mt-7 max-w-sm text-sm leading-7 text-[#dbc8b8]">I’m open to data analyst roles, analytical projects, and conversations about making operations clearer.</p><div className="mt-10 space-y-4 text-sm"><a href="mailto:rohitraj7576@gmail.com" className="flex items-center gap-3 text-[#f6e8dc] transition hover:text-[#dfb89c]" data-testid="link-contact-email"><Mail size={16} /> rohitraj7576@gmail.com</a><a href="tel:7739665950" className="flex items-center gap-3 text-[#f6e8dc] transition hover:text-[#dfb89c]" data-testid="link-contact-phone"><Phone size={16} /> 7739665950</a><a href="https://www.linkedin.com/in/rohitrajme/" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[#f6e8dc] transition hover:text-[#dfb89c]" data-testid="link-contact-linkedin"><Linkedin size={16} /> linkedin.com/in/rohitrajme</a><a href="https://github.com/Rohit5950" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[#f6e8dc] transition hover:text-[#dfb89c]" data-testid="link-contact-github"><Github size={16} /> github.com/Rohit5950</a></div></div><form onSubmit={submit} className="rounded-sm border border-[#755d50] bg-[#564238] p-6 sm:p-8" noValidate data-testid="form-contact"><div className="grid gap-6 sm:grid-cols-2"><label className="grid gap-2 text-sm"><span className="text-[#dbc8b8]">Your name</span><input value={values.name} onChange={(event) => update('name', event.target.value)} className="border-b border-[#91786a] bg-transparent px-0 py-3 text-[#fffaf4] outline-none transition placeholder:text-[#a88f80] focus:border-[#dfb89c]" placeholder="Name" data-testid="input-contact-name" /></label><label className="grid gap-2 text-sm"><span className="text-[#dbc8b8]">Email address</span><input value={values.email} onChange={(event) => update('email', event.target.value)} type="email" className="border-b border-[#91786a] bg-transparent px-0 py-3 text-[#fffaf4] outline-none transition placeholder:text-[#a88f80] focus:border-[#dfb89c]" placeholder="you@company.com" data-testid="input-contact-email" /></label></div><label className="mt-7 grid gap-2 text-sm"><span className="text-[#dbc8b8]">What’s on your mind?</span><textarea value={values.message} onChange={(event) => update('message', event.target.value)} rows={5} className="resize-none border-b border-[#91786a] bg-transparent px-0 py-3 text-[#fffaf4] outline-none transition placeholder:text-[#a88f80] focus:border-[#dfb89c]" placeholder="Tell me a little about the question, role, or project." data-testid="textarea-contact-message" /></label><div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><button type="submit" disabled={status === 'loading'} className="inline-flex w-fit items-center gap-3 rounded-full bg-[#dfb89c] px-5 py-3 text-sm font-semibold text-[#49352b] transition hover:bg-[#f3d8c4] disabled:cursor-wait disabled:opacity-60" data-testid="button-submit-contact">{status === 'loading' ? 'Sending…' : 'Send message'} <ArrowUpRight size={16} /></button><div aria-live="polite" className="max-w-xs text-xs leading-5" data-testid="status-contact">{status === 'success' && <span className="flex items-start gap-2 text-[#d5e2d2]"><CheckCircle2 size={15} className="mt-0.5 shrink-0" /> Message sent. I’ll be in touch soon.</span>}{status === 'error' && <span className="flex items-start gap-2 text-[#f0b8a8]"><AlertCircle size={15} className="mt-0.5 shrink-0" /> {error}</span>}</div></div></form></div></section>;
}

function Footer() {
  return <footer className="bg-[#49352b] px-5 pb-8 text-[#cdb8a8] lg:px-10"><div className="mx-auto flex max-w-[1240px] flex-col gap-5 border-t border-[#755d50] pt-6 text-xs sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} Rohit Raj. Built with curiosity and care.</p><div className="flex gap-5"><SmoothLink id="about" className="transition hover:text-[#fffaf4]">About</SmoothLink><SmoothLink id="work" className="transition hover:text-[#fffaf4]">Work</SmoothLink><SmoothLink id="contact" className="transition hover:text-[#fffaf4]">Contact</SmoothLink></div></div></footer>;
}

function Home() {
  useScrollReveals();
  useEffect(() => { const id = window.location.hash.replace('#', ''); if (id) window.setTimeout(() => document.getElementById(id)?.scrollIntoView(), 80); }, []);
  return <div className="site-shell min-h-[100dvh]"><Header /><main><Hero /><About /><Impact /><Skills /><Work /><Journey /><Contact /></main><Footer /></div>;
}

function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((item) => item.slug === slug);
  useScrollReveals();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }); }, [slug]);
  if (!project) return <NotFound />;
  return <div className="site-shell min-h-[100dvh]"><Header /><main className="mx-auto max-w-[1240px] px-5 py-14 lg:px-10 lg:py-20"><Link to="/#work" className="mb-16 inline-flex items-center gap-2 text-sm text-[#806d5d] transition hover:text-[#a35035]" data-testid="link-back-work"><ArrowLeft size={16} /> Back to selected work</Link><section className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-24" data-testid="project-detail"><div data-reveal><div className="eyebrow">{project.number} / Case study</div><h1 className="display-serif mt-5 text-5xl leading-[0.96] text-[#332820] sm:text-7xl">{project.title}</h1><p className="mt-5 text-xl italic text-[#a35035]">{project.subtitle}</p><p className="mt-7 max-w-lg text-base leading-8 text-[#685546]">{project.description}</p><div className="mt-8 flex flex-wrap gap-2">{project.tools.map((tool) => <span key={tool} className="rounded-full border border-[#d7c8b8] bg-[#fffaf4] px-3 py-1.5 text-xs text-[#49352b]">{tool}</span>)}</div><a href={project.githubUrl} target="_blank" rel="noreferrer" className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#49352b] px-5 py-3 text-sm font-semibold text-[#fffaf4] transition hover:bg-[#a35035]" data-testid="link-project-github"><Github size={16} /> View on GitHub <ExternalLink size={14} /></a></div><div className="relative flex min-h-[400px] items-center justify-center bg-[#eee4d8] p-8" data-reveal><div className="w-full max-w-[380px] border border-[#c9b09a] bg-[#fffaf4] p-7 shadow-[12px_12px_0_#d6a27e]"><div className="mono text-[0.62rem] uppercase tracking-[0.15em] text-[#a35035]">Analysis note / {project.number}</div><div className="mt-7 flex h-40 items-end gap-3 border-b border-l border-[#cdbca9] px-4 pb-0">{[42, 68, 50, 82, 62, 93].map((height, index) => <div key={height} className="group relative flex-1 bg-[#a35035] transition hover:bg-[#5b827d]" style={{ height: `${height}%` }}><span className="absolute -top-5 left-1/2 -translate-x-1/2 mono text-[0.55rem] text-[#806d5d] opacity-0 group-hover:opacity-100">{index + 1}</span></div>)}</div><p className="mt-6 font-serif text-2xl leading-tight text-[#49352b]">The useful story is usually hiding in the comparison.</p></div></div></section><section className="mt-24 grid gap-10 border-t border-[#d8cbbf] pt-12 md:grid-cols-3" data-reveal><div><div className="eyebrow">The question</div><p className="mt-4 text-sm leading-7 text-[#685546]">{project.problem}</p></div><div><div className="eyebrow">The approach</div><p className="mt-4 text-sm leading-7 text-[#685546]">{project.approach}</p></div><div><div className="eyebrow">The outcome</div><ul className="mt-4 space-y-3 text-sm leading-6 text-[#685546]">{project.results.map((result) => <li key={result} className="flex gap-2"><CheckCircle2 size={16} className="mt-1 shrink-0 text-[#a35035]" />{result}</li>)}</ul></div></section></main><Footer /></div>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const location = useLocation();
  return <ErrorBoundary resetKey={`${location.pathname}${location.search}${location.hash}`}>{children}</ErrorBoundary>;
}

function Router() {
  return <RoutedErrorBoundary><Routes><Route path="/projects/:slug" element={<ProjectDetail />} /><Route path="/" element={<Home />} /><Route path="*" element={<NotFound />} /></Routes></RoutedErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><BrowserRouter><Router /></BrowserRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;