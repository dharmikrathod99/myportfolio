import React from 'react';
import Link from 'next/link';
import HeroSection from '@/components/sections/HeroSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import {
  Sparkles,
  CheckCircle2,
  Brain,
  Layers,
  Globe2,
  Cpu,
  Zap,
  Search,
  Code2,
  Server,
  Cloud,
  Rocket,
  ShieldCheck,
  Building2,
  ArrowRight,
  Mail,
  MapPin
} from 'lucide-react';
import { LiquidMetal } from '@/components/ui/animate-ui/liquid-metal';

export default function Home() {
  const focusAreas = [
    "AI-Powered Web Applications",
    "MERN Stack Development",
    "Business Website Development",
    "Portfolio Website Development",
    "SaaS Application Development",
    "AI Chatbot Integration",
    "API Development & Integration",
    "Admin Dashboard Development",
    "SEO Optimized Website Development",
    "Responsive UI/UX Design",
    "Performance Optimization",
    "Database Architecture",
    "Authentication & Security"
  ];

  const businessSolutions = [
    { title: "AI Business Platforms", desc: "Intelligent platforms leveraging LLMs, automated data pipelines, and custom AI agents." },
    { title: "CRM Systems", desc: "Tailored customer relationship management tools designed for high-converting sales teams." },
    { title: "ERP Solutions", desc: "Unified enterprise resource planning software to streamline operations and inventory." },
    { title: "Restaurant Websites", desc: "High-speed restaurant portals with interactive menus, online reservations, and ordering." },
    { title: "Real Estate Websites", desc: "Dynamic real estate platforms featuring property filtering, interactive maps, and lead funnels." },
    { title: "Healthcare Platforms", desc: "HIPAA-conscious appointment booking, patient portals, and telemetry dashboards." },
    { title: "Educational Portals", desc: "Interactive LMS systems, student dashboards, online course delivery, and progress tracking." },
    { title: "Booking Systems", desc: "Automated calendar scheduling, payment gateway integrations, and instant notifications." },
    { title: "E-Commerce Stores", desc: "Ultra-fast headless online stores optimized for sub-1s checkout speeds and high conversion." },
    { title: "AI Automation Tools", desc: "Custom workflow automation scripts connecting APIs, AI models, and cloud webhooks." },
    { title: "Dashboard Applications", desc: "Real-time analytics dashboards with telemetry graphs, data exports, and role permissions." },
    { title: "Custom Business Software", desc: "Bespoke full-stack web software built specifically to solve unique operational bottlenecks." }
  ];

  const benefitsChecklist = [
    "SEO-Friendly Website Architecture",
    "Fast Loading & Core Web Vitals Optimized",
    "Mobile-First Responsive Design",
    "Clean & Maintainable Code",
    "Secure Authentication Systems",
    "AI Integration & Automation",
    "Modern UI/UX Design",
    "REST API Development",
    "Cloud Deployment Support",
    "Long-Term Scalability",
    "Performance Optimization",
    "End-to-End Development"
  ];

  const techCategories = [
    {
      category: "Frontend",
      icon: Code2,
      skills: ["React.js", "Next.js", "JavaScript", "TypeScript", "HTML5", "CSS3", "Tailwind CSS", "Bootstrap", "Framer Motion"]
    },
    {
      category: "Backend",
      icon: Server,
      skills: ["Node.js", "Express.js", "MongoDB", "Firebase", "JWT Authentication", "REST APIs"]
    },
    {
      category: "AI & Automation",
      icon: Brain,
      skills: ["OpenAI", "Google Gemini", "LLM Integration", "AI Chatbots", "Workflow Automation", "AI Agents"]
    },
    {
      category: "Deployment",
      icon: Cloud,
      skills: ["Vercel", "Netlify", "Cloudinary", "GitHub", "Git", "Docker"]
    }
  ];

  const indiaLocations = [
    "Ahmedabad", "Surat", "Vadodara", "Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chennai", "Kolkata"
  ];

  const internationalLocations = [
    "United States", "Canada", "United Kingdom", "Australia", "Germany", "Singapore", "Dubai", "Netherlands", "Europe"
  ];

  const searchedKeywords = [
    "AI Software Engineer", "Full Stack Developer", "MERN Stack Developer", "React Developer",
    "Node.js Developer", "JavaScript Developer", "Web Developer", "Website Developer",
    "AI Website Developer", "SEO Website Developer", "Portfolio Website Developer", "SaaS Developer",
    "Custom Software Developer", "AI Automation Developer", "API Integration Expert",
    "Business Website Developer", "Freelance Full Stack Developer", "Software Engineer in Ahmedabad",
    "MERN Developer in India", "AI Developer in India"
  ];

  return (
    <div className="relative z-10 space-y-24 overflow-x-hidden w-full pb-16">
      {/* 1. Main Hero Section */}
      <HeroSection />

      {/* 2. Intro & Professional Bio Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-dark-card/60 border border-white/10 backdrop-blur-2xl relative overflow-hidden shadow-2xl">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 space-y-6 max-w-4xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-mono text-accent font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Full Stack MERN & AI Engineer
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
              Building <span className="bg-gradient-to-r from-accent via-[#38BDF8] to-white bg-clip-text text-transparent">AI-Powered Web Applications</span> That Drive Business Growth
            </h2>
            
            <p className="text-base sm:text-lg text-customText-primary leading-relaxed">
              Hi, I'm <strong className="text-white font-bold">Dharmik Rathod</strong> (known as <strong className="text-accent font-bold">DR.Developer</strong>), a passionate <strong className="text-accent">Software Engineer</strong> and <strong className="text-white font-bold">Full Stack MERN Developer</strong> based in <strong className="text-white font-bold">Ahmedabad, Gujarat, India</strong>. I specialize in designing and developing modern, scalable, and SEO-optimized web applications for startups, businesses, and entrepreneurs worldwide.
            </p>

            <p className="text-sm sm:text-base text-customText-secondary leading-relaxed">
              I build high-performance websites, scrolling effect websites, AI-powered applications, SaaS platforms, custom business software, automation systems, and intelligent web solutions that combine outstanding user experience with clean architecture, fast performance, and strong search engine visibility.
            </p>

            <p className="text-sm sm:text-base text-customText-secondary leading-relaxed">
              Whether you need a professional portfolio website, business website, eCommerce platform, admin dashboard, AI chatbot, automation system, or a complete enterprise application, I can transform your ideas into secure, scalable, and production-ready software.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Professional Full Stack Developer & AI Engineer (Focus Areas Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono text-accent uppercase tracking-widest px-3 py-1 rounded-full bg-accent/10 border border-accent/20 inline-flex items-center gap-1.5 font-bold mb-4">
            <Cpu className="w-3.5 h-3.5" /> Development Expertise
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight">
            Professional <span className="bg-gradient-to-r from-accent via-[#38BDF8] to-white bg-clip-text text-transparent">Full Stack & AI Focus</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-customText-secondary">
            With expertise in React.js, Node.js, Express.js, MongoDB, TypeScript, AI APIs, and Cloud Deployment, every project is built for speed, security, and scalability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {focusAreas.map((item) => (
            <div
              key={item}
              className="p-5 rounded-2xl bg-dark-card/50 border border-white/10 hover:border-accent/40 transition-all duration-300 backdrop-blur-md flex items-center gap-3 group"
            >
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-dark-bg transition-colors shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-white group-hover:text-accent transition-colors">
                {item}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Helping Businesses Build Faster, Smarter & Better (Solutions Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono text-accent uppercase tracking-widest px-3 py-1 rounded-full bg-accent/10 border border-accent/20 inline-flex items-center gap-1.5 font-bold mb-4">
            <Building2 className="w-3.5 h-3.5" /> Business Solutions
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight">
            Helping Businesses <span className="bg-gradient-to-r from-accent via-[#38BDF8] to-white bg-clip-text text-transparent">Build Faster, Smarter & Better</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-customText-secondary">
            Today's businesses need digital products that generate leads, improve customer experience, and automate workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businessSolutions.map((sol) => (
            <div
              key={sol.title}
              className="p-6 rounded-2xl bg-dark-card/60 border border-white/10 backdrop-blur-xl hover:border-accent/40 transition-all duration-300 group"
            >
              <h3 className="text-lg font-extrabold text-white group-hover:text-accent transition-colors flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                {sol.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-customText-secondary leading-relaxed">
                {sol.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Why Work With Me? (Checkmark Benefits Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-dark-card/70 border border-white/10 relative overflow-hidden backdrop-blur-2xl shadow-2xl">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-mono text-accent uppercase tracking-widest px-3 py-1 rounded-full bg-accent/10 border border-accent/20 inline-flex items-center gap-1.5 font-bold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" /> Value Assurance
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              Why Work With Me?
            </h2>
            <p className="mt-2 text-sm sm:text-base text-customText-secondary">
              Choosing the right software engineer means choosing someone who understands both technology and business goals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefitsChecklist.map((item) => (
              <div
                key={item}
                className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0 font-extrabold text-xs">
                  ✓
                </div>
                <span className="text-xs sm:text-sm font-bold text-white">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Technologies I Work With */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono text-accent uppercase tracking-widest px-3 py-1 rounded-full bg-accent/10 border border-accent/20 inline-flex items-center gap-1.5 font-bold mb-4">
            <Layers className="w-3.5 h-3.5" /> Modern Stack Matrix
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight">
            Technologies <span className="bg-gradient-to-r from-accent via-[#38BDF8] to-white bg-clip-text text-transparent">I Work With</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {techCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.category}
                className="p-6 rounded-2xl bg-dark-card/60 border border-white/10 backdrop-blur-xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-extrabold text-white">{cat.category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-customText-primary hover:border-accent/40 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Serving Clients Across India & Worldwide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-dark-card/70 border border-white/10 backdrop-blur-2xl relative overflow-hidden">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-mono text-accent uppercase tracking-widest px-3 py-1 rounded-full bg-accent/10 border border-accent/20 inline-flex items-center gap-1.5 font-bold mb-3">
              <Globe2 className="w-3.5 h-3.5" /> Geographic Reach
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              Serving Clients Across <span className="text-accent">India & Worldwide</span>
            </h2>
            <p className="mt-2 text-sm sm:text-base text-customText-secondary">
              Although I'm based in <strong className="text-white">Ahmedabad, Gujarat</strong>, I work remotely with businesses globally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* India Locations */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-accent" /> India Locations
              </h3>
              <div className="flex flex-wrap gap-2">
                {indiaLocations.map((loc) => (
                  <span
                    key={loc}
                    className="px-3 py-1 rounded-full bg-dark-bg/80 border border-white/10 text-xs font-mono text-customText-secondary"
                  >
                    {loc}
                  </span>
                ))}
              </div>
            </div>

            {/* International Locations */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2 mb-4">
                <Globe2 className="w-4 h-4 text-accent" /> International Clients
              </h3>
              <div className="flex flex-wrap gap-2">
                {internationalLocations.map((loc) => (
                  <span
                    key={loc}
                    className="px-3 py-1 rounded-full bg-dark-bg/80 border border-white/10 text-xs font-mono text-customText-secondary"
                  >
                    {loc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Frequently Searched Services (SEO Keyword Tag Cloud) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-dark-card/50 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-6">
            <Search className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-extrabold text-white">Frequently Searched Services & Keywords</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchedKeywords.map((kw) => (
              <span
                key={kw}
                className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-customText-muted hover:text-accent hover:border-accent/30 transition-colors"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Client Testimonials */}
      <TestimonialsSection />

      {/* 10. Let's Build Something Extraordinary (CTA Banner) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 border border-accent/30 bg-dark-card/90 text-center">
          <LiquidMetal
            colorBack="#070A0F"
            colorTint="#3A86FF"
            speed={0.4}
            className="absolute inset-0 opacity-25 pointer-events-none"
          />
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-mono text-accent uppercase tracking-widest px-3 py-1 rounded-full bg-accent/10 border border-accent/20 inline-flex items-center gap-1.5 font-bold">
              <Rocket className="w-3.5 h-3.5" /> Start Your Project
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
              Let's Build Something <span className="bg-gradient-to-r from-accent via-[#38BDF8] to-white bg-clip-text text-transparent">Extraordinary</span>
            </h2>
            <p className="text-sm sm:text-base text-customText-secondary leading-relaxed">
              If you're looking for a professional <strong className="text-white">AI Software Engineer</strong>, <strong className="text-white">Full Stack MERN Developer</strong>, or <strong className="text-white">Custom Software Developer</strong> who can build modern, scalable, and SEO-optimized digital products, I'd love to help.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="relative group cursor-pointer border-none bg-transparent p-0 outline-none transition-transform hover:scale-105 active:scale-95"
              >
                <div className="relative rounded-full overflow-hidden p-[2px] shadow-[0_4px_22px_rgba(14,165,233,0.35)] hover:shadow-[0_6px_32px_rgba(14,165,233,0.6)] transition-all duration-300">
                  <LiquidMetal
                    colorBack="#001F33"
                    colorTint="#0EA5E9"
                    speed={0.8}
                    repetition={4}
                    distortion={0.3}
                    scale={1.2}
                    className="absolute inset-0 z-0 rounded-full"
                  />
                  <div className="relative z-10 rounded-full px-8 py-3.5 bg-[#0F172A] text-white keep-white flex items-center gap-2.5 overflow-hidden">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full z-10 bg-gradient-to-b from-white/15 via-white/5 to-transparent" />
                    <div className="pointer-events-none absolute inset-0 rounded-full z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-1px_2px_rgba(0,0,0,0.8)]" />
                    <Mail className="w-4 h-4 text-accent relative z-30" />
                    <span className="relative z-30 text-white keep-white font-extrabold uppercase tracking-wider text-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                      Let's Work Together
                    </span>
                    <ArrowRight className="w-4 h-4 text-accent relative z-30" />
                  </div>
                </div>
              </Link>

              <Link
                href="/projects"
                className="relative group cursor-pointer border-none bg-transparent p-0 outline-none transition-transform hover:scale-105 active:scale-95"
              >
                <div className="relative rounded-full overflow-hidden p-[2px] shadow-[0_4px_18px_rgba(14,165,233,0.25)] hover:shadow-[0_6px_28px_rgba(14,165,233,0.5)] transition-all duration-300">
                  <LiquidMetal
                    colorBack="#001F33"
                    colorTint="#0EA5E9"
                    speed={0.6}
                    repetition={3}
                    distortion={0.25}
                    scale={1.2}
                    className="absolute inset-0 z-0 rounded-full opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="relative z-10 rounded-full px-8 py-3.5 bg-[#0F172A] text-white keep-white flex items-center gap-2 overflow-hidden">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full z-10 bg-gradient-to-b from-white/15 via-white/5 to-transparent" />
                    <div className="pointer-events-none absolute inset-0 rounded-full z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-1px_2px_rgba(0,0,0,0.8)]" />
                    <span className="relative z-30 text-white keep-white font-extrabold uppercase tracking-wider text-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                      Explore Projects
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
