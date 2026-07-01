import React, { Suspense } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    BrainCircuit,
    Sparkles,
    ShieldCheck,
    LineChart,
    Rocket,
    CheckCircle2,
    ArrowRight,
    Zap,
    Target,
    TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/landing/ThemeToggle';
import HeroScene3D from '../components/landing/HeroScene3D';

const featureCards = [
    {
        icon: BrainCircuit,
        title: 'AI Spending Coach',
        description: 'Smart insights, trend detection, and actionable guidance from your real spending data.',
    },
    {
        icon: LineChart,
        title: 'Real-time Analytics',
        description: 'Category breakdowns, monthly momentum, and financial health scores at a glance.',
    },
    {
        icon: ShieldCheck,
        title: 'Secure by Design',
        description: 'JWT authentication and role-aware access keep your financial data protected.',
    },
];

const landingStats = [
    { value: '92%', label: 'improve monthly discipline', icon: TrendingUp },
    { value: '24/7', label: 'AI financial guidance', icon: Zap },
    { value: '10x', label: 'faster decisions', icon: Target },
];

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
    }),
};

const Landing = () => {
    const { token } = useAuth();
    const { theme } = useTheme();

    if (token) {
        return <Navigate to="/app" replace />;
    }

    return (
        <div className="min-h-screen bg-white text-slate-800 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
            <div className="relative overflow-hidden">
                <div className="pointer-events-none absolute -top-32 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-emerald-100/80 blur-3xl dark:bg-emerald-500/20" />
                <div className="pointer-events-none absolute right-0 top-24 h-80 w-80 rounded-full bg-cyan-50 blur-3xl dark:bg-cyan-500/15" />
                <div className="pointer-events-none absolute -left-24 top-52 h-72 w-72 rounded-full bg-violet-50 blur-3xl dark:bg-violet-500/15" />

                <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between border-b border-slate-100 px-6 py-5 dark:border-slate-800">
                    <motion.div
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3"
                    >
                        <div className="rounded-xl bg-emerald-50 p-2 ring-1 ring-emerald-100 dark:bg-white/10 dark:ring-white/20">
                            <BrainCircuit className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                        </div>
                        <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">SpendWise AI</span>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3"
                    >
                        <ThemeToggle size={38} />
                        <Link
                            to="/login"
                            className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 sm:inline-block dark:border-white/20 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10"
                        >
                            Sign in
                        </Link>
                        <Link
                            to="/register"
                            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-emerald-500/25 transition hover:bg-emerald-600"
                        >
                            Get started
                        </Link>
                    </motion.div>
                </header>

                <main className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 px-6 pb-16 pt-10 lg:grid-cols-2 lg:items-center lg:gap-14 lg:pb-24 lg:pt-14">
                    <section className="space-y-8">
                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            custom={0}
                            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-200"
                        >
                            <Sparkles className="h-3.5 w-3.5" />
                            AI powered personal finance
                        </motion.div>

                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            custom={1}
                            className="space-y-5"
                        >
                            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
                                Your next-gen{' '}
                                <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-cyan-400">
                                    money command
                                </span>{' '}
                                center.
                            </h1>
                            <p className="max-w-xl text-base text-slate-500 dark:text-slate-300 sm:text-lg">
                                SpendWise combines budgeting, analytics, and AI intelligence so you reduce wasteful spending and build better habits — automatically.
                            </p>
                        </motion.div>

                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            custom={2}
                            className="flex flex-wrap items-center gap-3"
                        >
                            <Link
                                to="/register"
                                className="group inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-600"
                            >
                                Create free account
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                            >
                                Existing user login
                            </Link>
                        </motion.div>

                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            custom={3}
                            className="grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3"
                        >
                            {landingStats.map(({ value, label, icon: Icon }) => (
                                <div
                                    key={label}
                                    className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-4 shadow-sm dark:border-white/10 dark:bg-white/5"
                                >
                                    <div className="mb-2 flex items-center gap-2">
                                        <Icon className="h-3.5 w-3.5 text-emerald-500" />
                                        <p className="text-xl font-bold text-emerald-600 dark:text-emerald-300">{value}</p>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                                </div>
                            ))}
                        </motion.div>
                    </section>

                    <motion.section
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={2}
                        className="relative"
                    >
                        <div className="relative h-[22rem] overflow-hidden rounded-3xl border border-slate-100 bg-gradient-to-br from-white via-slate-50 to-emerald-50/40 shadow-xl shadow-slate-200/60 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/40 dark:shadow-black/40 sm:h-[26rem] lg:h-[32rem]">
                            <Suspense
                                fallback={
                                    <div className="flex h-full items-center justify-center">
                                        <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
                                    </div>
                                }
                            >
                                <HeroScene3D
                                    primaryColor="#10B981"
                                    secondaryColor="#6366F1"
                                    backgroundColor={theme === 'dark' ? '#0f172a' : '#ffffff'}
                                    rotationSpeed={0.3}
                                    floatIntensity={1}
                                    parallaxStrength={0.35}
                                    simplifyOnMobile
                                />
                            </Suspense>
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white/90 to-transparent dark:from-slate-900/90" />
                            <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-xs font-medium text-slate-500 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-white/80">
                                Live 3D preview
                            </div>
                        </div>
                    </motion.section>
                </main>

                <section className="relative z-10 mx-auto w-full max-w-7xl border-t border-slate-100 px-6 py-20 dark:border-slate-800">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="mb-10 flex items-end justify-between"
                    >
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Why teams choose SpendWise</h2>
                            <p className="mt-2 text-slate-500 dark:text-slate-400">Everything you need to take control of your finances.</p>
                        </div>
                        <Rocket className="hidden h-6 w-6 text-emerald-500 sm:block" />
                    </motion.div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {featureCards.map(({ icon: Icon, title, description }, i) => (
                            <motion.div
                                key={title}
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                custom={i}
                                className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-500/5 dark:border-white/10 dark:bg-white/5 dark:hover:border-emerald-400/30"
                            >
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="rounded-xl bg-emerald-50 p-2.5 transition group-hover:bg-emerald-100 dark:bg-emerald-400/10 dark:group-hover:bg-emerald-400/20">
                                        <Icon className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                                    </div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-300">{description}</p>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="mt-8 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-cyan-50 p-6 dark:border-emerald-400/20 dark:from-emerald-400/10 dark:to-cyan-400/10"
                    >
                        <p className="font-semibold text-emerald-800 dark:text-emerald-100">What you get on day one</p>
                        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                            {[
                                'Personalized AI recommendations',
                                'Automated budget-health tracking',
                                'Unified dashboard for expenses & goals',
                            ].map((item) => (
                                <li key={item} className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-50">
                                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </section>
            </div>
        </div>
    );
};

export default Landing;
