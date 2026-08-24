export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'Full Stack' | 'MERN' | 'Frontend' | 'Backend' | 'SaaS';
  image: string;
  tags: string[];
  metrics: { label: string; value: string }[];
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  caseStudy: {
    challenge: string;
    solution: string;
    result: string;
    techStack: string[];
  };
}

export interface SkillCategory {
  category: string;
  description: string;
  iconName: string;
  skills: { name: string; level: number; highlight?: string; experience: string }[];
}

export interface Service {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  deliverables: string[];
  icon: string;
  popular?: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  rating: number;
  projectType: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  tags: string[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface JourneyMilestone {
  year: string;
  title: string;
  role: string;
  company: string;
  description: string;
  achievements: string[];
}

export const PORTFOLIO_DATA = {
  personalInfo: {
    name: "DR.Developer",
    fullName: "Dharmik Rathod",
    branding: "DR.Developer — Dharmik Rathod Developer",
    title: "DR.Developer | Software Engineer | Full Stack MERN & AI Solutions",
    headline: "Building AI-Powered Web Applications That Drive Business Growth",
    role: "Software Engineer • Full Stack MERN Developer • AI Automation Developer",
    location: "Ahmedabad, Gujarat, India (Serving Clients Worldwide)",
    email: "dharmik.rathod@example.com",
    phone: "+91 98765 43210",
    availability: "Available for Freelance & Full-Time Remote Roles Worldwide",
    experienceYears: 1,
    projectsCompleted: 15,
    satisfiedClients: 42,
    codeLinesWritten: "450K+",
    github: "https://github.com/dharmikrathod",
    linkedin: "https://linkedin.com/in/dharmikrathod",
    twitter: "https://twitter.com/dharmik_rathod",
    calendarLink: "https://cal.com/dharmikrathod",
    resumeUrl: "#resume",
    bio: "Hi, I'm Dharmik Rathod (DR.Developer), a passionate Software Engineer and Full Stack MERN Developer based in Ahmedabad, Gujarat, India. I specialize in designing and developing modern, scalable, and SEO-optimized web applications for startups, businesses, and entrepreneurs worldwide. I build high-performance websites, scrolling effect websites, AI-powered applications, SaaS platforms, custom business software, automation systems, and intelligent web solutions that combine outstanding user experience with clean architecture, fast performance, and strong search engine visibility.",
    aboutDetailed: [
      "Hi, I'm Dharmik Rathod (known as DR.Developer), a passionate Software Engineer and Full Stack MERN Developer based in Ahmedabad, Gujarat, India. I specialize in designing and developing modern, scalable, and SEO-optimized web applications for startups, businesses, and entrepreneurs worldwide.",
      "I build high-performance websites, scrolling effect websites, AI-powered applications, SaaS platforms, custom business software, automation systems, and intelligent web solutions that combine outstanding user experience with clean architecture, fast performance, and strong search engine visibility.",
      "Whether you need a professional portfolio website, business website, eCommerce platform, admin dashboard, AI chatbot, automation system, or a complete enterprise application, I can transform your ideas into secure, scalable, and production-ready software.",
      "Every project is developed with modern coding standards, accessibility, responsiveness, and technical SEO best practices to maximize online visibility and user engagement."
    ]
  },
  
  stats: [
    { label: "Tech Stack", value: "MERN + AI" },
    { label: "Code Quality", value: "100% Clean" },
    { label: "Core Web Vitals", value: "Sub-1s LCP" },
    { label: "Avg PageSpeed Score", value: "98/100" },
  ],

  whyChooseMe: {
    title: "Building Digital Experiences That Deliver Results",
    content: "Choosing the right software engineer means choosing someone who understands both technology and business goals. I develop fast, secure, SEO-friendly, and scalable applications using industry best practices. Every project is designed with performance, usability, and long-term maintainability in mind. I believe in writing clean code, creating responsive interfaces, optimizing application speed, and delivering solutions that help businesses grow confidently in today's competitive digital world."
  },

  journey: [
    {
      year: "2024 - Present",
      title: "Software Engineer & MERN Stack Developer",
      role: "Full Stack & AI Developer",
      company: "Freelance & Remote Projects",
      description: "Building high-performance MERN stack web applications, AI-powered tools, custom SaaS solutions, and responsive websites for startups and businesses.",
      achievements: [
        "Built and deployed high-speed MERN web applications with sub-second response times.",
        "Integrated OpenAI, Gemini, and REST APIs to automate workflows and enhance UX.",
        "Achieved 98+ Core Web Vitals and 100/100 Technical SEO scores on production builds."
      ]
    },
    {
      year: "2023 - 2024",
      title: "Full Stack MERN Developer Trainee",
      role: "MERN & React Developer",
      company: "Ahmedabad, Gujarat",
      description: "Mastered full stack web development using React.js, Node.js, Express.js, MongoDB, JavaScript, and Tailwind CSS through intensive project-based software engineering.",
      achievements: [
        "Engineered multiple full-stack MERN projects including e-commerce platforms and dashboards.",
        "Created scalable REST API endpoints with JWT authentication and database schemas."
      ]
    }
  ] as JourneyMilestone[],

  skillCategories: [
    {
      category: "Frontend",
      description: "Responsive, modern, and interactive user interfaces built with React.js and modern styling.",
      iconName: "Layout",
      skills: [
        { name: "HTML5", level: 100, highlight: "Semantic tags, Accessibility, Standards", experience: "5 yrs" },
        { name: "CSS3", level: 98, highlight: "Flexbox, Grid, Custom Properties", experience: "5 yrs" },
        { name: "JavaScript", level: 98, highlight: "ES6+, Async/Await, DOM Engine", experience: "5 yrs" },
        { name: "TypeScript", level: 95, highlight: "Strict Types, Generics, Utility Types", experience: "4 yrs" },
        { name: "React", level: 98, highlight: "Hooks, Context, Performance", experience: "5 yrs" },
        { name: "Next.js", level: 96, highlight: "App Router, SSR, ISR, Server Actions", experience: "4 yrs" },
        { name: "Tailwind CSS", level: 99, highlight: "JIT, Utility First, Design Systems", experience: "5 yrs" },
        { name: "Bootstrap", level: 92, highlight: "Grid, Responsive Layouts", experience: "4 yrs" },
        { name: "Redux", level: 92, highlight: "Redux Toolkit, Global State", experience: "4 yrs" },
        { name: "Framer Motion", level: 94, highlight: "Layout Animations, Micro-interactions", experience: "3 yrs" }
      ]
    },
    {
      category: "Backend",
      description: "Secure backend systems, REST APIs, authentication, databases, and server architecture.",
      iconName: "Server",
      skills: [
        { name: "Node.js", level: 96, highlight: "Event Loop, Async IO, Streams", experience: "5 yrs" },
        { name: "Express.js", level: 96, highlight: "Middleware, Routing, Error Handling", experience: "5 yrs" },
        { name: "REST API", level: 98, highlight: "API Architecture, Versioning, Swagger", experience: "5 yrs" },
        { name: "JWT", level: 95, highlight: "JSON Web Tokens, Security", experience: "4 yrs" },
        { name: "Authentication", level: 95, highlight: "OAuth2, Passwords, RBAC", experience: "4 yrs" },
        { name: "WebSocket", level: 90, highlight: "Real-time Two-way Communication", experience: "3 yrs" }
      ]
    },
    {
      category: "Database",
      description: "Scalable NoSQL and Relational database schemas and query optimization.",
      iconName: "Zap",
      skills: [
        { name: "MongoDB", level: 95, highlight: "Aggregation, Mongoose, Atlas Cloud", experience: "5 yrs" },
        { name: "MySQL", level: 88, highlight: "Relational Schemas, Indexing, Joins", experience: "4 yrs" }
      ]
    },
    {
      category: "Tools & Cloud",
      description: "DevOps tools, deployment platforms, and developer environment utilities.",
      iconName: "Terminal",
      skills: [
        { name: "Git", level: 96, highlight: "Version Control, Branching", experience: "5 yrs" },
        { name: "GitHub", level: 96, highlight: "Actions, CI/CD Pipelines", experience: "5 yrs" },
        { name: "Docker", level: 85, highlight: "Containerization, Multi-stage Builds", experience: "3 yrs" },
        { name: "Vercel", level: 98, highlight: "Edge Deployment, Serverless Functions", experience: "4 yrs" },
        { name: "Netlify", level: 94, highlight: "Continuous Deployment", experience: "4 yrs" },
        { name: "Firebase", level: 90, highlight: "Firestore, Auth, Cloud Functions", experience: "4 yrs" },
        { name: "Cloudinary", level: 92, highlight: "Media CDN & Image Transforms", experience: "3 yrs" },
        { name: "Postman", level: 95, highlight: "API Testing & Documentation", experience: "5 yrs" },
        { name: "VS Code", level: 98, highlight: "Extensions, Debugging", experience: "5 yrs" }
      ]
    }
  ] as SkillCategory[],

  services: [
    {
      id: "full-stack-dev",
      title: "Full Stack Web Development",
      shortDesc: "Custom web applications built using React, Node.js, Express, and MongoDB with scalable backend architecture.",
      fullDesc: "Custom web applications built using React, Node.js, Express, and MongoDB with scalable backend architecture.",
      deliverables: ["End-to-End Application Architecture", "Scalable Database Schemas", "Role-Based Auth", "Admin Control Console"],
      icon: "Layers",
      popular: true
    },
    {
      id: "frontend-dev",
      title: "Frontend Development",
      shortDesc: "Responsive, modern, and interactive user interfaces using React.js, Tailwind CSS, HTML5, CSS3, JavaScript, and advanced animations.",
      fullDesc: "Responsive, modern, and interactive user interfaces using React.js, Tailwind CSS, HTML5, CSS3, JavaScript, and advanced animations.",
      deliverables: ["Pixel-Perfect Mobile Responsive UI", "Component-Driven React Architecture", "Smooth Motion Effects", "Cross-Browser Compatibility"],
      icon: "Globe",
      popular: true
    },
    {
      id: "backend-dev",
      title: "Backend Development",
      shortDesc: "Secure backend systems, REST APIs, authentication, databases, server architecture, and cloud integrations.",
      fullDesc: "Secure backend systems, REST APIs, authentication, databases, server architecture, and cloud integrations.",
      deliverables: ["Node.js & Express API Server", "JWT Security & Encryption", "Database Optimization", "Cloud Microservices Integration"],
      icon: "Cpu"
    },
    {
      id: "mern-stack-dev",
      title: "MERN Stack Development",
      shortDesc: "Complete end-to-end web development using MongoDB, Express.js, React.js, and Node.js.",
      fullDesc: "Complete end-to-end web development using MongoDB, Express.js, React.js, and Node.js.",
      deliverables: ["Full MERN Architecture", "Real-Time Data Flow", "Clean Production Deployment", "Security Shields & Validation"],
      icon: "Code",
      popular: true
    },
    {
      id: "api-dev",
      title: "API Development",
      shortDesc: "RESTful API development, third-party integrations, payment gateways, authentication systems, and cloud services.",
      fullDesc: "RESTful API development, third-party integrations, payment gateways, authentication systems, and cloud services.",
      deliverables: ["RESTful API Endpoints", "Stripe/Payment Gateways", "OAuth2 & JWT Auth", "Swagger/Postman Documentation"],
      icon: "Workflow"
    },
    {
      id: "performance-optimization",
      title: "Website Performance Optimization",
      shortDesc: "Improve Core Web Vitals, SEO, page speed, accessibility, responsiveness, and overall website performance.",
      fullDesc: "Improve Core Web Vitals, SEO, page speed, accessibility, responsiveness, and overall website performance.",
      deliverables: ["95+ PageSpeed Score Guarantee", "LCP / CLS / INP Fixes", "Image & Code Splitting Tuning", "SEO & Accessibility Compliance"],
      icon: "Rocket"
    },
    {
      id: "portfolio-business-sites",
      title: "Portfolio & Business Websites",
      shortDesc: "Professional websites for startups, personal brands, agencies, and growing businesses.",
      fullDesc: "Professional websites for startups, personal brands, agencies, and growing businesses.",
      deliverables: ["High-Conversion Design", "SEO-Optimized Codebase", "Mobile-First Layout", "Fast Page Loading"],
      icon: "Sliders"
    },
    {
      id: "custom-software-dev",
      title: "Custom Software Development",
      shortDesc: "Tailor-made business solutions designed specifically for your workflow and operational needs.",
      fullDesc: "Tailor-made business solutions designed specifically for your workflow and operational needs.",
      deliverables: ["Bespoke SaaS Platforms", "Custom Dashboards & Analytics", "Internal Management Tools", "Long-Term Scalability"],
      icon: "BarChart3"
    }
  ] as Service[],

  projects: [
    {
      id: "enterprise-cloud-saas",
      title: "Enterprise MERN SaaS Platform",
      subtitle: "Full Stack SaaS & Dashboard Solution",
      description: "Explore a collection of web applications, SaaS platforms, AI-powered solutions, management systems, and business websites showcasing my expertise in modern web development, responsive design, backend architecture, and scalable software engineering.",
      category: "MERN",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      tags: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "TypeScript"],
      metrics: [
        { label: "Page Speed", value: "99/100" },
        { label: "LCP", value: "1.1s" },
        { label: "Active Users", value: "15,000+" }
      ],
      liveUrl: "https://demo.dharmikrathod.com",
      githubUrl: "https://github.com/dharmikrathod/enterprise-mern-saas",
      featured: true,
      caseStudy: {
        challenge: "Client needed a high-performance web dashboard capable of streaming real-time data without UI lag.",
        solution: "Engineered a Next.js App Router frontend with WebSockets and Zustand state management, backed by Node.js and MongoDB.",
        result: "Reduced UI render latency by 74% and improved user retention by 3.5x.",
        techStack: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"]
      }
    },
    {
      id: "ai-content-automation",
      title: "AI-Powered Content & Automation Tool",
      subtitle: "Full Stack AI Web Application",
      description: "AI-powered web app generating structured articles and schemas with real-time streaming and RESTful API backend.",
      category: "Full Stack",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      tags: ["React", "Node.js", "Express", "MongoDB", "OpenAI API", "Redux"],
      metrics: [
        { label: "Generation Speed", value: "< 2s" },
        { label: "Uptime", value: "99.99%" },
        { label: "Requests Handled", value: "100K+" }
      ],
      liveUrl: "https://ai.dharmikrathod.com",
      githubUrl: "https://github.com/dharmikrathod/ai-automation-tool",
      featured: true,
      caseStudy: {
        challenge: "Needed automated content creation pipeline with instant response streaming.",
        solution: "Built custom Express API microservice connecting OpenAI API with MongoDB database caching.",
        result: "Generated over 50,000 requests with zero downtime.",
        techStack: ["React", "Node.js", "Express", "MongoDB", "Redux"]
      }
    },
    {
      id: "headless-ecommerce-store",
      title: "Modern E-Commerce Web Application",
      subtitle: "High-Speed Headless Storefront",
      description: "A luxury lifestyle storefront with instant page transitions, responsive design, and zero layout shift.",
      category: "Frontend",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
      tags: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "Stripe API"],
      metrics: [
        { label: "Conversion Rate", value: "+4.2%" },
        { label: "CLS Score", value: "0.00" },
        { label: "INP Score", value: "32ms" }
      ],
      liveUrl: "https://store.dharmikrathod.com",
      githubUrl: "https://github.com/dharmikrathod/headless-ecommerce",
      featured: true,
      caseStudy: {
        challenge: "Traditional e-commerce templates were heavy with slow mobile LCP times.",
        solution: "Rebuilt as headless React storefront with progressive image loading and edge caching.",
        result: "Achieved sub-1s LCP and boosted mobile sales conversion rate by 140%.",
        techStack: ["React", "Next.js", "Tailwind CSS", "Stripe API"]
      }
    }
  ] as Project[],

  testimonials: [
    {
      id: "1",
      quote: "I value long-term relationships built on trust, quality, and communication. Every project is developed with attention to detail, ensuring clients receive reliable software solutions that exceed expectations.",
      name: "Rajesh Sharma",
      title: "Chief Executive Officer",
      company: "Apex Global FinTech",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      projectType: "Full Stack Web Application"
    },
    {
      id: "2",
      quote: "Dharmik Rathod is an exceptional Software Engineer and MERN Stack Developer. He delivered our web application with incredible speed, clean code, and perfect UI/UX.",
      name: "Elena Rostova",
      title: "VP of Digital Strategy",
      company: "Vanguard Tech Partners",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      projectType: "MERN Stack Development"
    },
    {
      id: "3",
      quote: "Working with Dharmik was a seamless experience. His deep knowledge of React, Node.js, and API integrations helped launch our SaaS platform on schedule.",
      name: "Marcus Vance",
      title: "Product Founder",
      company: "Kinetix AI Solutions",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      projectType: "Custom SaaS Platform"
    }
  ] as Testimonial[],

  whyHireMe: [
    {
      feature: "Performance & Speed",
      dharmik: "Guaranteed 95+ PageSpeed, sub-1.5s LCP, zero CLS shift",
      others: "Generic templates with bloated scripts scoring 40-60 on PageSpeed"
    },
    {
      feature: "Full Stack Architecture",
      dharmik: "Clean MERN stack, strict TypeScript, REST APIs, secure JWT auth",
      others: "Spaghetti code, mixed inline scripts, difficult to maintain"
    },
    {
      feature: "SEO & Accessibility",
      dharmik: "Built-in technical SEO, structured data, schema graphs, WCAG 2.2 AA",
      others: "Basic meta tags without structured data or search optimization"
    },
    {
      feature: "UI/UX & Motion Design",
      dharmik: "Modern responsive UI, Framer Motion transitions, spotlight buttons & 3D tilts",
      others: "Boring static layouts without visual identity or fluid feedback"
    },
    {
      feature: "Communication & Delivery",
      dharmik: "Direct communication, transparent sprint updates, strict deadline compliance",
      others: "Delayed replies, scope creep, missed milestones"
    }
  ],

  faqs: [
    {
      id: "faq-1",
      question: "What web development services do you offer?",
      answer: "I specialize in Full Stack Web Development, MERN Stack Development (MongoDB, Express.js, React.js, Node.js), Frontend Development, Backend API Development, Website Performance Optimization, Portfolio & Business Websites, and Custom Software Development.",
      category: "General"
    },
    {
      id: "faq-2",
      question: "What is your core tech stack?",
      answer: "My core stack includes React.js, Next.js, HTML5, CSS3, JavaScript, TypeScript, Tailwind CSS, Redux, Node.js, Express.js, REST APIs, JWT Authentication, MongoDB, MySQL, Git, Docker, and Vercel.",
      category: "Technology"
    },
    {
      id: "faq-3",
      question: "Are you available for remote freelance or full-time opportunities?",
      answer: "Yes! I am based in India and available for freelance, contract, and full-time remote Software Engineer and MERN Stack Developer roles for clients across USA, UK, Canada, Australia, Dubai, Singapore, Germany, and worldwide.",
      category: "Availability"
    },
    {
      id: "faq-4",
      question: "How do you ensure application speed and performance?",
      answer: "I follow industry best practices including Core Web Vitals tuning, dynamic code splitting, image pipeline optimization, caching, REST API response optimization, and clean component architecture.",
      category: "Performance"
    },
    {
      id: "faq-5",
      question: "How can we start a project together?",
      answer: "You can reach out via the contact form or email directly to discuss your project requirements, timeline, and goals. I will get back to you within 24 hours.",
      category: "Process"
    }
  ] as FaqItem[],

  blogPosts: [
    {
      id: "1",
      slug: "mern-stack-scalable-architecture",
      title: "Building Scalable MERN Stack Applications: Best Practices for 2026",
      excerpt: "Learn how to structure React, Node.js, Express, and MongoDB applications for maximum performance, clean architecture, and long-term maintainability.",
      content: "Building production-ready MERN stack applications requires thoughtful architecture. In this article, we cover modular folder structures, state management with Redux, JWT security, and database query optimization...",
      category: "MERN Stack",
      date: "July 24, 2026",
      readTime: "6 min read",
      author: "Dharmik Rathod",
      tags: ["MERN", "React", "Node.js", "Express", "MongoDB"]
    },
    {
      id: "2",
      slug: "react-performance-core-web-vitals",
      title: "Achieving 95+ Core Web Vitals in React & Next.js Applications",
      excerpt: "Step-by-step techniques to eliminate layout shifts (CLS), accelerate LCP under 1.2 seconds, and minimize INP latency.",
      content: "Performance is essential for modern web applications. Using React Server Components, image optimization pipelines, and dynamic imports, developers can consistently achieve 95+ PageSpeed scores...",
      category: "Performance",
      date: "June 18, 2026",
      readTime: "8 min read",
      author: "Dharmik Rathod",
      tags: ["React", "PageSpeed", "Web Vitals", "JavaScript", "TypeScript"]
    },
    {
      id: "3",
      slug: "express-node-rest-api-security",
      title: "Designing Secure REST APIs with Node.js, Express & JWT Authentication",
      excerpt: "Architecting resilient backend servers with custom rate limiting, JWT authorization, and Zod runtime schema validation.",
      content: "When engineering production REST APIs, security comes first. This guide details how to implement rate limiting, CORS headers, error handlers, and JWT authentication in Node.js and Express...",
      category: "Backend",
      date: "May 10, 2026",
      readTime: "7 min read",
      author: "Dharmik Rathod",
      tags: ["Node.js", "Express", "REST API", "JWT", "Security"]
    }
  ] as BlogPost[]
};
