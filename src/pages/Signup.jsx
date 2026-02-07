import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../lib/api";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

const handleFields = [
  { key: "leetcode", label: "LeetCode" },
  { key: "gfg", label: "GFG" },
  { key: "codeforces", label: "Codeforces" },
  { key: "hackerrank", label: "HackerRank" },
  { key: "codechef", label: "CodeChef" },
  { key: "spoj", label: "SPOJ" },
  { key: "atcoder", label: "AtCoder" }
];

export const Signup = ({ onAuth }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    handles: {}
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateHandle = (key, value) => {
    setForm((prev) => ({ ...prev, handles: { ...prev.handles, [key]: value } }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/signup", form);
      localStorage.setItem("cc_token", data.token);
      onAuth?.(data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="glass-hover gradient-border">
          <h2 className="text-2xl font-semibold text-white">Create your DSA Compass profile</h2>
          <p className="mt-2 text-sm text-slate-300">Add your public handles to connect verified solves.</p>
          <form onSubmit={submit} className="mt-8 grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <input
                className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white"
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white"
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white"
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {handleFields.map((field) => (
                <input
                  key={field.key}
                  className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white"
                  placeholder={`${field.label} handle`}
                  value={form.handles[field.key] || ""}
                  onChange={(e) => updateHandle(field.key, e.target.value)}
                />
              ))}
            </div>
            {error && <p className="text-sm text-rose-300">{error}</p>}
            <Button type="submit" size="lg" disabled={loading}>
              {loading ? "Creating..." : "Create account"}
            </Button>
            <p className="text-sm text-slate-400">
              Already have an account? <Link className="text-white" to="/login">Log in</Link>
            </p>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};
