import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { PlatformLogo } from "../components/PlatformLogo";

const logos = ["LeetCode", "GFG", "Codeforces", "HackerRank", "CodeChef", "SPOJ", "AtCoder"];

export const Landing = () => (
  <div className="mx-auto max-w-6xl px-6 pb-20 pt-16">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="grid gap-12 md:grid-cols-[1.2fr_0.8fr]"
    >
      <div>
        <Badge variant="info" className="mb-4">Canonical-First Progress Engine</Badge>
        <h1 className="text-4xl font-semibold text-white md:text-5xl">
          A unified coding-progress platform that speaks in canonical questions.
        </h1>
        <p className="mt-4 text-lg text-slate-300">
          Stop guessing whether problems match. DSA Compass maps Striver-style canonical
          questions to every platform, compares them side-by-side, and verifies solves
          with an extension-backed badge.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button asChild size="lg">
            <Link to="/signup">Start Tracking</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/dashboard">View Demo</Link>
          </Button>
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          {logos.map((logo) => (
            <PlatformLogo key={logo} platform={logo} className="h-8" />
          ))}
        </div>
      </div>
      <Card className="glass-hover gradient-border relative overflow-hidden bg-card-glow">
        <div className="absolute right-6 top-6 text-xs uppercase tracking-[0.3em] text-slate-400">Live View</div>
        <h3 className="text-xl font-semibold text-white">Canonical Match Dashboard</h3>
        <p className="mt-3 text-sm text-slate-300">
          Compare the same question across platforms with match scores, verified badges,
          and coverage metrics.
        </p>
        <div className="mt-6 space-y-3">
          {["Two Sum", "Reverse Linked List", "Longest Palindromic Substring"].map((item) => (
            <div key={item} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <span className="text-sm text-white">{item}</span>
              <span className="text-xs text-emerald-300">Verified</span>
            </div>
          ))}
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
