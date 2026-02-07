import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { PlatformLogo } from "../components/PlatformLogo";

const logos = ["LeetCode", "GFG", "Codeforces", "HackerRank", "CodeChef", "SPOJ", "AtCoder"];

const platformUrls = {
  LeetCode: "https://leetcode.com",
  GFG: "https://www.geeksforgeeks.org",
  Codeforces: "https://codeforces.com",
  HackerRank: "https://www.hackerrank.com",
  CodeChef: "https://www.codechef.com",
  SPOJ: "https://www.spoj.com",
  AtCoder: "https://atcoder.jp"
};

export const Landing = () => (
  <div className="mx-auto max-w-6xl px-6 pb-20 pt-16">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="grid gap-12 md:grid-cols-[1.2fr_0.8fr]"
    >
      <div>
        <Badge variant="info" className="mb-6 backdrop-blur-md bg-blue-500/10 border-blue-400/20 text-blue-300 px-4 py-1.5">
          ✨ Canonical-First Progress Engine
        </Badge>
        <h1 className="text-6xl font-bold tracking-tight md:text-8xl font-display">
          <span className="bg-gradient-to-r from-white via-blue-100 to-white/50 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            DSA Compass
          </span>
        </h1>
        <p className="mt-6 text-xl text-slate-400 font-light leading-relaxed max-w-lg">
          A unified coding platform that speaks in <span className="text-emerald-400 font-medium">canonical questions</span>.
          Stop guessing—map Striver-style problems to every platform instantly.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button asChild size="lg" className="h-14 px-8 text-lg bg-white text-navy-900 hover:bg-blue-50 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            <Link to="/signup">Start Tracking Now</Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="h-14 px-8 text-lg border-white/20 hover:bg-white/5 backdrop-blur-sm transition-all duration-300">
            <Link to="/demo">View Demo</Link>
          </Button>
        </div>
        <div className="mt-12 opacity-70 hover:opacity-100 transition-opacity duration-500">
          <p className="text-sm text-slate-500 mb-4 uppercase tracking-widest font-semibold">Trusted integrations with</p>
          <div className="flex flex-wrap gap-6 transition-all duration-500">
            {logos.map((logo) => (
              <a
                key={logo}
                href={platformUrls[logo]}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110"
              >
                <PlatformLogo platform={logo} className="h-7" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <Card className="glass-hover gradient-border relative overflow-hidden bg-card-glow p-0">
        <div className="absolute right-4 top-4 z-10 rounded-full bg-black/40 backdrop-blur-md px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/80 border border-white/10 shadow-lg">
          Live Visualization
        </div>
        <div className="relative h-full w-full group">
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-transparent to-transparent z-10" />
          <img
            src="/src/assets/platform_stack_v2.png"
            alt="Multi-platform compatibility dashboard"
            className="h-full w-full object-cover object-left-top scale-105 -translate-y-14 transition-transform duration-700 group-hover:scale-110 group-hover:-translate-y-16"
          />
          <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
            <h3 className="text-2xl font-bold text-white drop-shadow-lg">Unified Progress Tracking</h3>
            <p className="mt-2 text-sm text-blue-100/80 font-light leading-relaxed drop-shadow-md">
              Visualize your mastery across LeetCode, Codeforces, and more in one stunning, canonical view.
            </p>
          </div>
        </div>
      </Card>
    </motion.div>

    <div className="mt-20 grid gap-6 md:grid-cols-3">
      {[
        {
          title: "Canonical-first matching",
          desc: "Treat Striver-style canonical questions as truth and map them to every platform."
        },
        {
          title: "Side-by-side comparisons",
          desc: "See score, availability, and external links for each platform in one view."
        },
        {
          title: "Verified solve tracking",
          desc: "Chrome extension verifies accepted submissions without private scraping."
        }
      ].map((feature) => (
        <Card key={feature.title} className="glass-hover gradient-border">
          <h4 className="text-lg font-semibold text-white">{feature.title}</h4>
          <p className="mt-3 text-sm text-slate-300">{feature.desc}</p>
        </Card>
      ))}
    </div>
  </div>
);
