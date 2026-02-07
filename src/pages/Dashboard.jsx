import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import api from "../lib/api";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../components/ui/accordion";
import { PlatformLogo } from "../components/PlatformLogo";
import { Button } from "../components/ui/button";

const platformOrder = ["LeetCode", "GFG", "Codeforces", "HackerRank", "CodeChef", "SPOJ", "AtCoder"];

const solveToKey = (solve) => `${solve.canonicalQuestionId}_${solve.platform}`;

export const Dashboard = ({ isDemo = false }) => {
  const [questions, setQuestions] = useState([]);
  const [solves, setSolves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      if (isDemo) {
        try {
          // Fetch all real questions public endpoint
          const { data } = await api.get("/questions");
          setQuestions(data.questions);

          // Generate some fake solves for the demo experience
          if (data.questions.length > 0) {
            const fakeSolves = data.questions.slice(0, 3).flatMap(q => {
              // solving 1st platform for first 3 questions
              const p = q.platforms[0];
              return p ? [{
                canonicalQuestionId: q._id,
                platform: p.platform,
                verified: true
              }] : [];
            });
            setSolves(fakeSolves);
          } else {
            setSolves([]);
          }
        } catch (err) {
          setError("Failed to load demo data. Ensure backend is running.");
        } finally {
          setLoading(false);
        }
        return;
      }

      try {
        const { data } = await api.get("/questions/with-solves");
        setQuestions(data.questions);
        setSolves(data.solves);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isDemo]);

  const solveMap = useMemo(() => {
    const map = new Map();
    solves.forEach((solve) => map.set(solveToKey(solve), solve));
    return map;
  }, [solves]);

  const stats = useMemo(() => {
    const total = questions.length;
    const solvedCount = new Set(solves.map((solve) => solve.canonicalQuestionId)).size;
    const coverage = total ? Math.round((solvedCount / total) * 100) : 0;
    return { total, solvedCount, coverage };
  }, [questions, solves]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20 text-slate-300">Loading dashboard...</div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20 text-rose-300">{error}</div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid gap-6 md:grid-cols-3"
      >
        {[{ label: "Total Questions", value: stats.total }, { label: "Solved", value: stats.solvedCount }, { label: "Coverage", value: `${stats.coverage}%` }].map((stat) => (
          <Card key={stat.label} className="glass-hover gradient-border">
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold text-white">{stat.value}</p>
          </Card>
        ))}
      </motion.div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-white">Canonical Question Library</h2>
        <p className="mt-2 text-sm text-slate-300">Expand a question to compare it across platforms.</p>

        <Accordion type="single" collapsible className="mt-6 space-y-4">
          {questions.map((question, idx) => (
            <AccordionItem key={question._id} value={question._id} className="glass-hover gradient-border">
              <AccordionTrigger>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Q{idx + 1}</p>
                  <p className="text-xl font-semibold text-white">{question.canonicalTitle}</p>
                  <p className="text-sm text-slate-400">{question.topic.join(", ")}</p>
                </div>
                <Badge variant="info">Match {question.overallMatch}%</Badge>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  {platformOrder.map((platform) => {
                    const entry = question.platforms.find((item) => item.platform === platform);
                    const solve = entry ? solveMap.get(`${question._id}_${platform}`) : null;
                    if (!entry) {
                      return (
                        <div key={platform} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                          <div className="flex items-center gap-3">
                            <PlatformLogo platform={platform} className="h-6" />
                            <span className="text-sm text-slate-300">Not available</span>
                          </div>
                          <Badge variant="warning">Not available</Badge>
                        </div>
                      );
                    }
                    return (
                      <div key={platform} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                        <div className="flex items-center gap-3">
                          <PlatformLogo platform={platform} className="h-6" />
                          <div>
                            <p className="text-sm font-semibold text-white">{entry.name}</p>
                            <a className="text-xs text-sky-300" href={entry.link} target="_blank" rel="noreferrer">Open problem</a>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="info">Score {entry.score}%</Badge>
                          {solve ? (
                            <Badge variant={solve.verified ? "success" : "warning"}>
                              {solve.verified ? "Verified" : "Self-marked"}
                            </Badge>
                          ) : (
                            <Badge>Not solved</Badge>
                          )}
                          {!solve && (
                            <Button
                              variant="subtle"
                              size="sm"
                              onClick={() => api.post("/solve/manual", { canonicalQuestionId: question._id, platform, questionTitle: entry.name })
                                .then((resp) => setSolves((prev) => [...prev.filter((s) => !(s.canonicalQuestionId === question._id && s.platform === platform)), resp.data.solve]))}
                            >
                              Mark Solved
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};
