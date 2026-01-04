
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search, CheckCircle, Database, Server, Globe, Terminal } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
    const navigate = useNavigate();
    const container = useRef(null);

    useGSAP(() => {
        // --- Hero Animations ---
        const tl = gsap.timeline();

        tl.from('.hero-text-line', {
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power4.out',
        })
            .from('.hero-sub', {
                y: 20,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out',
            }, '-=0.5')
            .from('.hero-btn', {
                scale: 0.8,
                opacity: 0,
                duration: 0.5,
                ease: 'back.out(1.7)',
            }, '-=0.3');

        // --- Feature Animations ---
        gsap.from('.feature-card', {
            scrollTrigger: {
                trigger: '.features-section',
                start: 'top 80%',
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
        });

        // --- Testimonial/Community ---
        gsap.from('.community-content', {
            scrollTrigger: {
                trigger: '.community-section',
                start: 'top 75%',
            },
            y: 30,
            opacity: 0,
            duration: 1,
            ease: 'power2.out',
        });

        // --- Footer ---
        gsap.from('.footer-content', {
            scrollTrigger: {
                trigger: 'footer',
                start: 'top 90%',
            },
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
        });

    }, { scope: container });

    return (
        <div ref={container} className="min-h-screen bg-black text-white font-primary relative overflow-x-hidden flex flex-col selection:bg-primary selection:text-black">
            {/* --- Global Background Grids --- */}
            <div className="fixed inset-0 bg-grid-pattern opacity-30 pointer-events-none z-0" />

            {/* --- Navigation --- */}
            <nav className="relative z-50 flex items-center justify-between px-6 py-6 w-full max-w-7xl mx-auto">
                <div className="text-2xl font-bold tracking-widest border border-white/20 px-2 py-1 cursor-pointer flex items-center gap-2" onClick={() => navigate('/')}>
                    <Terminal size={20} />
                    AGENT MSA
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400 uppercase tracking-wide">
                    {['Features', 'Community'].map((item) => (
                        <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors">{item}</a>
                    ))}
                </div>
                <button onClick={() => navigate('/chat')} className="hidden md:block px-6 py-2 rounded-full border border-[#ccff00] text-[#ccff00] hover:bg-[#ccff00] hover:text-black transition-all uppercase text-xs font-bold tracking-widest">
                    Get Started
                </button>
                <button onClick={() => navigate('/chat')} className="md:hidden text-primary uppercase font-bold text-xs border border-primary/50 px-3 py-1 rounded-full">
                    Start
                </button>
            </nav>

            {/* --- HERO SECTION --- */}
            <header className="relative z-10 w-full max-w-7xl mx-auto px-6 min-h-screen flex flex-col justify-between items-center text-center py-20">

                {/* Center Content: Typography & Button */}
                <div className="flex-1 flex flex-col justify-center items-center w-full relative z-20">
                    {/* Main Typography */}
                    <div className="mb-12 relative">
                        <h1 className="text-6xl md:text-[8rem] lg:text-[10rem] font-medium tracking-tighter leading-[0.9] text-white flex flex-col items-center">
                            <span className="hero-text-line block">Microservice</span>
                            <span className="hero-text-line block font-serif italic font-light relative px-8 my-4 md:my-0 text-[#ccff00]">
                                Architecture
                                {/* Orbit SVG Decoration */}
                                <svg className="absolute -top-6 -left-4 w-[120%] h-[150%] pointer-events-none text-white/90" viewBox="0 0 200 100" preserveAspectRatio="none">
                                    <ellipse cx="100" cy="50" rx="90" ry="25" fill="none" stroke="currentColor" strokeWidth="0.5" transform="rotate(-10 100 50)" />
                                    {/* Stars on Orbit */}
                                    <path d="M190 40 L195 45 L190 50 L185 45 Z" fill="white" className="animate-pulse" />
                                    <path d="M20 60 L24 64 L20 68 L16 64 Z" fill="#ccff00" className="animate-pulse" style={{ animationDelay: '1s' }} />
                                </svg>
                                <span className="absolute -top-4 right-[-30px] text-4xl not-italic text-white">✦</span>
                            </span>
                            <span className="hero-text-line block">Verified.</span>
                        </h1>
                    </div>

                    {/* CTA Button */}
                    <div className="relative mb-8 pt-8">
                        <button
                            onClick={() => navigate('/chat')}
                            className="hero-btn px-12 py-4 rounded-full border border-[#ccff00] text-white bg-black/40 backdrop-blur-sm shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:shadow-[0_0_40px_rgba(204,255,0,0.6)] hover:scale-105 transition-all duration-300 group tracking-widest text-sm uppercase font-bold flex items-center gap-3"
                        >
                            Get Started <ArrowRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Bottom Description & Green Horizon Glow */}
                <div className="relative w-full flex flex-col items-center z-20 pt-10 hero-sub">
                    {/* Green Horizon Arc Background */}
                    <div className="absolute bottom-[-50%] left-1/2 -translate-x-1/2 w-[100vw] h-[50vh] bg-[#ccff00] rounded-[100%] blur-[120px] opacity-20 pointer-events-none z-0" />

                    <p className="text-gray-300 font-serif text-lg md:text-xl max-w-4xl leading-relaxed text-center relative z-10">
                        <span className="text-white uppercase font-sans tracking-[0.2em] text-xs mr-3 font-bold block md:inline mb-4 md:mb-0">AGENT MSA</span>
                        provides instant access to <span className="italic text-white font-bold">VERIFIED</span> Stack Overflow solutions for developers building complex <span className="italic text-white font-bold">DISTRIBUTED SYSTEMS</span>.
                    </p>
                </div>
            </header>

            {/* --- FEATURES SECTION --- */}
            <section id="features" className="features-section relative z-10 w-full px-6 py-20 bg-gradient-to-b from-transparent to-black/50">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center mb-16 space-y-4">
                    <h2 className="text-5xl md:text-7xl font-medium tracking-tight">
                        Built for <br />
                        System <span className="font-serif italic text-[#ccff00]">Architects</span>
                    </h2>
                    <p className="text-gray-400 text-lg font-serif italic opacity-80">
                        Curated knowledge from the world's best <span className="text-white not-italic">engineering communities</span>.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Feature 1: Verified Sources */}
                    <div className="feature-card bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 flex flex-col h-[400px] group hover:border-[#ccff00]/30 transition-colors relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                            <CheckCircle size={100} />
                        </div>
                        <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center mb-6 text-[#ccff00]">
                            <CheckCircle size={24} />
                        </div>
                        <h3 className="text-2xl font-serif mb-4">Verified Sources</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-8">
                            Every answer is sourced directly from accepted Stack Overflow solutions, vetted by the community and filtered for relevance.
                        </p>
                        <div className="mt-auto">
                            <div className="text-4xl font-bold text-white mb-1">10k+</div>
                            <div className="text-[10px] uppercase tracking-wider text-gray-500">Verified Solutions</div>
                        </div>
                    </div>

                    {/* Feature 2: Microservice Focus */}
                    <div className="feature-card bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 flex flex-col h-[400px] group hover:border-[#ccff00]/30 transition-colors relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                            <Server size={100} />
                        </div>
                        <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center mb-6 text-[#ccff00]">
                            <Server size={24} />
                        </div>
                        <h3 className="text-2xl font-serif mb-4">Microservice First</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-8">
                            Specialized content for distributed systems, containerization, orchestration, and inter-service communication patterns.
                        </p>
                        <div className="mt-auto">
                            <div className="text-4xl font-bold text-white mb-1">50+</div>
                            <div className="text-[10px] uppercase tracking-wider text-gray-500">Architecture Patterns</div>
                        </div>
                    </div>

                    {/* Feature 3: Time Saver */}
                    <div className="feature-card bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 flex flex-col h-[400px] group hover:border-[#ccff00]/30 transition-colors relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                            <Search size={100} />
                        </div>
                        <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center mb-6 text-[#ccff00]">
                            <Search size={24} />
                        </div>
                        <h3 className="text-2xl font-serif mb-4">Instant Answers</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-8">
                            Stop scrolling through endless threads. Get the accepted answer immediately and get back to coding.
                        </p>
                        <div className="mt-auto">
                            <div className="text-4xl font-bold text-white mb-1">0s</div>
                            <div className="text-[10px] uppercase tracking-wider text-gray-500">Wasted Time</div>
                        </div>
                    </div>

                </div>
            </section>

            {/* --- COMMUNITY SECTION (Previously Testimonials) --- */}
            <section id="community" className="community-section relative z-10 w-full px-6 py-32 bg-black border-t border-white/5">
                <div className="community-content max-w-4xl mx-auto flex flex-col items-center text-center relative">
                    {/* Abstract Line Decoration */}
                    <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] opacity-20 pointer-events-none" viewBox="0 0 800 400">
                        <path d="M50 200 Q 200 50 400 200 T 750 200" fill="none" stroke="#ccff00" strokeWidth="2" />
                    </svg>

                    <h2 className="text-4xl md:text-5xl font-serif mb-12">Empowering the <span className="italic text-gray-400">Next Gen</span> of Builders.</h2>

                    <div className="uppercase tracking-widest text-xs font-bold mb-8 text-gray-500">Stack Overflow Community</div>

                    <blockquote className="text-xl md:text-3xl font-serif italic leading-relaxed text-gray-200 mb-10 max-w-2xl">
                        "The most reliable source for resolving complex dependency injection issues in distributed .NET environments."
                    </blockquote>

                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-orange-500 rounded-full mb-3 flex items-center justify-center text-white font-bold text-xl">S</div>
                        <cite className="not-italic font-bold text-sm">Senior Backend Dev</cite>
                        <span className="text-xs text-gray-500 uppercase tracking-wider">Verified User</span>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="footer-content relative z-10 w-full px-6 pt-20 pb-10 bg-black flex flex-col items-center text-center overflow-hidden">
                {/* Bottom Gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-[400px] bg-gradient-to-t from-[#ccff00]/20 to-transparent pointer-events-none" />

                <div className="mb-10 w-16 h-16 bg-[#ccff00] rounded-full flex items-center justify-center animate-bounce">
                    <Terminal className="text-black" size={32} />
                </div>

                <div className="flex flex-col md:flex-row w-full max-w-5xl justify-between items-start text-left mb-20 gap-10 relative z-20">
                    <div className="flex-1">
                        <div className="border border-white text-xs px-2 py-0.5 inline-block mb-4 uppercase tracking-widest">Agent MSA</div>
                        <h2 className="text-4xl md:text-5xl font-serif mb-8">
                            Ready to build <br /> scalable systems?
                        </h2>
                        <form className="flex w-full max-w-md border-b border-white/30 pb-2 focus-within:border-white transition-colors" onSubmit={(e) => { e.preventDefault(); navigate('/chat') }}>
                            <input type="email" placeholder="Enter your email for updates" className="bg-transparent border-none outline-none text-white placeholder-gray-500 flex-1 h-10" />
                            <button type="submit" className="text-white hover:text-[#ccff00] transition-colors">
                                <ArrowRight />
                            </button>
                        </form>
                    </div>

                    <div className="flex gap-20 text-sm font-medium text-gray-400">
                        <div className="flex flex-col gap-4">
                            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-2">Topics</h4>
                            <a href="#" className="hover:text-[#ccff00] transition-colors">Microservices</a>
                            <a href="#" className="hover:text-[#ccff00] transition-colors">Docker & K8s</a>
                            <a href="#" className="hover:text-[#ccff00] transition-colors">Event Sourcing</a>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-2">Company</h4>
                            <a href="#" className="hover:text-[#ccff00] transition-colors">About</a>
                            <a href="#" className="hover:text-[#ccff00] transition-colors">API</a>
                            <a href="#" className="hover:text-[#ccff00] transition-colors">Contact</a>
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-7xl mx-auto flex flex-col items-center gap-4 relative z-20">
                    <p className="text-xs text-center text-gray-500 uppercase tracking-widest">©2026 Agent MSA</p>
                    <Globe className="text-white animate-spin-slow" size={24} />
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
