import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../lib/api";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

export const Login = ({ onAuth }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("cc_token", data.token);
      onAuth?.(data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-6 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="glass-hover gradient-border">
          <h2 className="text-2xl font-semibold text-white">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-300">Login to continue tracking verified solves.</p>
          <form onSubmit={submit} className="mt-8 grid gap-4">
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
            {error && <p className="text-sm text-rose-300">{error}</p>}
            <Button type="submit" size="lg" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </Button>
            <p className="text-sm text-slate-400">
              New here? <Link className="text-white" to="/signup">Create an account</Link>
            </p>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};
