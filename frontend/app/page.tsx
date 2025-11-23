"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Globe,
  CheckCircle2,
  Zap,
  Users,
  BarChart3,
  Search,
  Mail,
  Star,
  Twitter,
  Linkedin,
  Github
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function LandingPage() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Capify" width={32} height={32} className="h-8 w-8" />
            <span className="text-xl font-bold tracking-tight">Capify</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="#features" className="transition-colors hover:text-primary">
              Features
            </Link>
            <Link href="#how-it-works" className="transition-colors hover:text-primary">
              How it Works
            </Link>
            <Link href="#testimonials" className="transition-colors hover:text-primary">
              Testimonials
            </Link>
            <Link href="#pricing" className="transition-colors hover:text-primary">
              Pricing
            </Link>
            <Link href="#faq" className="transition-colors hover:text-primary">
              FAQ
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.header>

      <main className="flex-1">
        {/* Hero Section */}
        <section ref={targetRef} className="relative overflow-hidden py-20 md:py-32 lg:py-40 min-h-[90vh] flex items-center">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-40"></div>

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="flex flex-col space-y-8 text-center lg:text-left"
              >
                <motion.div variants={fadeInUp} className="inline-flex items-center self-center lg:self-start rounded-full border bg-background/50 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                  <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                  Now available for early access
                </motion.div>

                <motion.h1 variants={fadeInUp} className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  Fund Your Startup <br />
                  <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Journey with AI
                  </span>
                </motion.h1>

                <motion.p variants={fadeInUp} className="text-lg text-muted-foreground md:text-xl max-w-[600px] mx-auto lg:mx-0">
                  Connect with the perfect investors, discover non-dilutive grants, and accelerate your growth using our AI-powered matchmaking engine.
                </motion.p>

                <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center lg:justify-start">
                  <Link href="/signup">
                    <Button size="lg" className="w-full sm:w-auto gap-2 text-base h-12 px-8 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">
                      Start Fundraising Free <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="#demo">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto text-base h-12 px-8">
                      View Demo
                    </Button>
                  </Link>
                </motion.div>

                <motion.div variants={fadeInUp} className="pt-4 flex items-center justify-center lg:justify-start gap-4 text-sm text-muted-foreground">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-muted overflow-hidden">
                        <Image src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" width={32} height={32} />
                      </div>
                    ))}
                  </div>
                  <p>Trusted by 500+ founders</p>
                </motion.div>
              </motion.div>

              {/* Hero Visual */}
              <motion.div
                style={{ opacity, scale }}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative mx-auto w-full max-w-lg lg:max-w-none"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-background/50 backdrop-blur-xl">
                  <div className="aspect-[4/3] relative">
                    {/* Using generated hero image */}
                    <Image
                      src="/hero_visual.png"
                      alt="AI Dashboard Interface"
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60"></div>
                  </div>

                  {/* Floating Elements */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="absolute -top-6 -right-6 p-4 bg-card rounded-xl shadow-xl border border-border/50 hidden md:block"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Match Score</p>
                        <p className="text-lg font-bold">98%</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-6 -left-6 p-4 bg-card rounded-xl shadow-xl border border-border/50 hidden md:block"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Investors</p>
                        <p className="text-lg font-bold">Global Reach</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="py-12 border-y bg-muted/20">
          <div className="container mx-auto px-4 md:px-6">
            <p className="text-center text-sm font-semibold text-muted-foreground mb-8 uppercase tracking-wider">
              Trusted by innovative teams at
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
              {['Acme Corp', 'GlobalTech', 'Nebula', 'Trio', 'FoxRun'].map((name, i) => (
                <div key={i} className="text-xl md:text-2xl font-bold flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-foreground/20"></div>
                  {name}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed Features Section (Zig-Zag) */}
        <section id="features" className="py-24 relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-6 space-y-32">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight md:text-5xl mb-6">Complete Fundraising OS</h2>
              <p className="text-xl text-muted-foreground">
                Everything you need to go from &quot;open for investment&quot; to &quot;round closed&quot; in one unified platform.
              </p>
            </div>

            {/* Feature 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-blue-500/10 text-blue-500">
                  <Sparkles className="mr-2 h-4 w-4" /> AI Matchmaking
                </div>
                <h3 className="text-3xl md:text-4xl font-bold">Find investors who actually care.</h3>
                <p className="text-lg text-muted-foreground">
                  Stop spraying and praying. Our AI analyzes your pitch deck, industry, and stage to match you with investors who are actively looking for deals just like yours.
                </p>
                <ul className="space-y-3">
                  {['Smart relevance scoring', 'Portfolio conflict checks', 'Warm intro pathways'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative rounded-2xl overflow-hidden border shadow-2xl bg-muted aspect-square lg:aspect-auto lg:h-[500px]"
              >
                <Image src="/feature_ai.png" alt="AI Matchmaking" fill className="object-cover" />
              </motion.div>
            </div>

            {/* Feature 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center lg:flex-row-reverse">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="space-y-6 lg:order-2"
              >
                <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-green-500/10 text-green-500">
                  <Search className="mr-2 h-4 w-4" /> Grant Discovery
                </div>
                <h3 className="text-3xl md:text-4xl font-bold">Non-dilutive capital at your fingertips.</h3>
                <p className="text-lg text-muted-foreground">
                  Don&apos;t give up equity if you don&apos;t have to. Access the world&apos;s largest database of startup grants, tax credits, and non-dilutive funding opportunities.
                </p>
                <ul className="space-y-3">
                  {['Auto-eligibility checking', 'Deadline reminders', 'Application assistance'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative rounded-2xl overflow-hidden border shadow-2xl bg-muted aspect-square lg:aspect-auto lg:h-[500px] lg:order-1"
              >
                <Image src="/feature_grants.png" alt="Grant Discovery" fill className="object-cover" />
              </motion.div>
            </div>

            {/* Feature 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-orange-500/10 text-orange-500">
                  <BarChart3 className="mr-2 h-4 w-4" /> CRM & Pipeline
                </div>
                <h3 className="text-3xl md:text-4xl font-bold">Close deals faster with built-in CRM.</h3>
                <p className="text-lg text-muted-foreground">
                  Manage your entire investor pipeline in one place. Track conversations, schedule follow-ups, and share your data room with a single link.
                </p>
                <ul className="space-y-3">
                  {['Kanban board view', 'Automated email sequences', 'Document engagement tracking'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative rounded-2xl overflow-hidden border shadow-2xl bg-muted aspect-square lg:aspect-auto lg:h-[500px]"
              >
                <Image src="/feature_crm.png" alt="CRM" fill className="object-cover" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { label: "Capital Raised", value: "$500M+" },
                { label: "Active Investors", value: "12,000+" },
                { label: "Startups Funded", value: "850+" },
                { label: "Avg. Time to Close", value: "3 Weeks" },
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                  <h4 className="text-4xl md:text-5xl font-bold">{stat.value}</h4>
                  <p className="text-primary-foreground/80 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">How Capify Works</h2>
              <p className="text-lg text-muted-foreground">
                From profile creation to term sheet in four simple steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { icon: Users, title: "Create Profile", desc: "Build your startup profile and upload your pitch deck." },
                { icon: Sparkles, title: "Get Matched", desc: "Our AI identifies the perfect investors for your round." },
                { icon: Mail, title: "Connect", desc: "Reach out directly with warm intro templates." },
                { icon: Zap, title: "Close", desc: "Manage due diligence and sign the deal." },
              ].map((step, i) => (
                <div key={i} className="relative flex flex-col items-center text-center space-y-4 p-6 bg-background rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                    <step.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.desc}</p>
                  {i < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-[2px] bg-border -translate-y-1/2 z-10" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">Loved by Founders</h2>
              <p className="text-lg text-muted-foreground">
                Don&apos;t just take our word for it. See what other founders are saying.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "Capify cut our fundraising time in half. The AI matches were incredibly accurate.",
                  author: "Sarah J.",
                  role: "CEO, TechFlow",
                  avatar: "https://i.pravatar.cc/100?img=5"
                },
                {
                  quote: "I found three grants I didn't even know existed. This platform pays for itself.",
                  author: "Michael C.",
                  role: "Founder, GreenEarth",
                  avatar: "https://i.pravatar.cc/100?img=8"
                },
                {
                  quote: "The CRM features are a game changer. No more messy spreadsheets.",
                  author: "Jessica L.",
                  role: "COO, DataMind",
                  avatar: "https://i.pravatar.cc/100?img=9"
                }
              ].map((testimonial, i) => (
                <div key={i} className="p-8 rounded-2xl bg-muted/20 border space-y-6">
                  <div className="flex gap-1 text-yellow-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-lg italic">&quot;{testimonial.quote}&quot;</p>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full overflow-hidden">
                      <Image src={testimonial.avatar} alt={testimonial.author} width={48} height={48} />
                    </div>
                    <div>
                      <p className="font-bold">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">Simple, Transparent Pricing</h2>
              <p className="text-lg text-muted-foreground">
                Choose the plan that fits your stage. No hidden fees.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  name: "Starter",
                  price: "$0",
                  desc: "Perfect for early-stage exploration.",
                  features: ["Basic Profile", "3 Investor Matches/mo", "Grant Database Access", "Community Support"],
                  cta: "Get Started",
                  popular: false
                },
                {
                  name: "Growth",
                  price: "$49",
                  desc: "For startups actively fundraising.",
                  features: ["Enhanced Profile", "Unlimited Matches", "CRM Access", "Email Templates", "Priority Support"],
                  cta: "Start Free Trial",
                  popular: true
                },
                {
                  name: "Scale",
                  price: "$199",
                  desc: "For teams needing advanced tools.",
                  features: ["White-label Data Room", "API Access", "Dedicated Account Manager", "Legal Templates", "Custom Integrations"],
                  cta: "Contact Sales",
                  popular: false
                }
              ].map((plan, i) => (
                <div key={i} className={`relative flex flex-col p-8 rounded-3xl border bg-background shadow-lg ${plan.popular ? 'border-primary ring-2 ring-primary/20 scale-105 z-10' : 'border-border'}`}>
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <p className="text-muted-foreground mt-2 text-sm">{plan.desc}</p>
                  </div>
                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm">
                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant={plan.popular ? "default" : "outline"} className="w-full">
                    {plan.cta}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about Capify.
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {[
                { q: "How does the AI matching work?", a: "Our AI analyzes over 50 data points from your startup profile and compares them against our database of investor preferences, past deals, and thesis to generate a compatibility score." },
                { q: "Is my data secure?", a: "Yes, we use bank-level encryption and never share your proprietary data without your explicit permission. You control who sees your pitch deck." },
                { q: "Can I cancel anytime?", a: "Absolutely. There are no long-term contracts. You can cancel your subscription at any time from your dashboard." },
                { q: "Do you take a success fee?", a: "No. We charge a flat monthly subscription fee. We do not take any equity or success fees from the capital you raise." },
              ].map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32 relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="relative rounded-3xl bg-primary px-6 py-16 md:px-16 md:py-24 text-center overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
              <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-[100px]"></div>
              <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-[100px]"></div>

              <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl md:text-5xl">
                  Ready to accelerate your fundraising?
                </h2>
                <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
                  Join thousands of founders who are closing rounds faster with Capify.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                  <Link href="/signup">
                    <Button size="lg" variant="secondary" className="h-14 px-8 text-lg w-full sm:w-auto shadow-lg hover:scale-105 transition-transform">
                      Get Started for Free
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10">
                      Schedule Demo
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/20 pt-16 pb-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Image src="/logo.png" alt="Capify" width={32} height={32} className="h-8 w-8" />
                <span className="text-lg font-bold">Capify</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs mb-6">
                The intelligent fundraising platform for modern startups. Connect, track, and close deals faster.
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Github className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">Product</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Success Stories</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Enterprise</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">Resources</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Guides</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">API Docs</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">Company</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Partners</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © 2024 Capify Inc. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
