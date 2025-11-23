"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, TrendingUp, Zap, Globe, CheckCircle2 } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

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
            <div className="rounded-lg bg-primary p-1">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">Capify</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="#features" className="transition-colors hover:text-primary">
              Features
            </Link>
            <Link href="#how-it-works" className="transition-colors hover:text-primary">
              How it Works
            </Link>
            <Link href="#pricing" className="transition-colors hover:text-primary">
              Pricing
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

        {/* Features Section */}
        <section id="features" className="py-24 bg-muted/30 relative">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">Everything you need to raise capital</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Stop wasting time on spreadsheets and cold emails. Capify streamlines your entire fundraising process.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                {
                  title: "AI Matchmaking",
                  description: "Our algorithms analyze your startup profile to find investors who are actively looking for deals like yours.",
                  image: "/feature_ai.png",
                  color: "bg-blue-500/10 text-blue-500"
                },
                {
                  title: "Grant Discovery",
                  description: "Access a comprehensive database of non-dilutive funding opportunities tailored to your industry and stage.",
                  image: "/feature_grants.png",
                  color: "bg-green-500/10 text-green-500"
                },
                {
                  title: "CRM & Tracking",
                  description: "Manage your investor pipeline, track outreach, and automate follow-ups with our built-in CRM tools.",
                  image: "/feature_crm.png",
                  color: "bg-orange-500/10 text-orange-500"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                  className="group relative overflow-hidden rounded-2xl border bg-background hover:shadow-xl transition-all duration-300"
                >
                  <div className="aspect-video relative overflow-hidden bg-muted">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-80"></div>
                  </div>
                  <div className="p-6 relative">
                    <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
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
      <footer className="border-t bg-muted/20 py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="rounded-lg bg-primary p-1">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold">Capify</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs mb-6">
                The intelligent fundraising platform for modern startups. Connect, track, and close deals faster.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">Product</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Success Stories</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">Resources</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Guides</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">Company</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © 2024 Capify Inc. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
