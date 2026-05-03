import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Plus, BookOpen, Clock, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { Subject } from "../types";
import UploadModal from "../components/dashboard/UploadModal";

interface DashboardProps {
  user: any;
}

export default function Dashboard({ user }: DashboardProps) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "subjects"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const subs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Subject[];
      setSubjects(subs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user.uid]);

  const stats = [
    { label: "Total Papers", value: 12, trend: "+3 since last week", color: "text-indigo-400" },
    { label: "Topic Coverage", value: "74%", trend: "74% complete", progress: 74, color: "text-indigo-400" },
    { label: "High Yield Topics", value: "09", trend: "3 NEWLY DETECTED", color: "text-green-400" },
    { label: "Prediction Confidence", value: "92%", trend: "Gemini AI Optimized", color: "text-indigo-400", isPremium: true },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-display tracking-tight text-white mb-1">
            Dashboard
          </h1>
          <p className="text-slate-400 text-sm">Welcome back, {user.displayName?.split(' ')[0]}. Here's your exam readiness report.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-5 h-5" />
          Add New Subject
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "professional-card p-6",
              stat.isPremium && "ring-1 ring-indigo-500/50"
            )}
          >
            <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-2">{stat.label}</p>
            <h3 className="text-3xl font-bold text-white font-display mb-1">{stat.value}</h3>
            {stat.progress ? (
              <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-indigo-500" style={{ width: `${stat.progress}%` }} />
              </div>
            ) : (
              <p className={cn("text-[9px] font-mono tracking-wide mt-2 uppercase font-bold", stat.color)}>
                {stat.trend}
              </p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Subjects Grid */}
      <section>
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500 flex items-center gap-3">
            Academic Portfolio
            <div className="px-2 py-0.5 bg-white/5 rounded border border-white/10 text-[9px]">
              {subjects.length} Total
            </div>
          </h2>
          <button className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Manage All</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, i) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="professional-card p-6 cursor-pointer group hover:border-indigo-500/30 bg-[#0a0a0f] hover:bg-indigo-500/[0.02]"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="text-[9px] font-mono font-bold text-slate-600 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">
                  {new Date(subject.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors font-display tracking-tight text-slate-200">
                {subject.name}
              </h3>
              <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/5">
                 <div className="flex -space-x-2">
                    {[1, 2, 3].map((num) => (
                      <div key={num} className="w-6 h-6 rounded-full bg-slate-800 border-2 border-[#0a0a0f] flex items-center justify-center text-[7px] font-bold text-slate-400">
                        P{num}
                      </div>
                    ))}
                 </div>
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex-1">Analysis Pending</span>
                 <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          ))}

          {/* Add Subject Placeholder */}
          <button 
             onClick={() => setIsModalOpen(true)}
             className="border-2 border-dashed border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all text-slate-600 hover:text-indigo-400 group"
          >
            <div className="w-10 h-10 rounded-full border-2 border-dashed border-current flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Add Module</span>
          </button>
        </div>
      </section>

      <UploadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        userId={user.uid}
      />
    </div>
  );
}
