import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, addDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { ai, MODELS } from "../lib/gemini";
import { Calendar as CalendarIcon, Clock, Zap, CheckCircle2, Download, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

interface StudyPlannerProps {
  user: any;
}

export default function StudyPlanner({ user }: StudyPlannerProps) {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, "subjects"), where("userId", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setSubjects(data);
      if (data.length > 0 && !selectedSubjectId) setSelectedSubjectId(data[0].id);
    });
    return () => unsub();
  }, [user.uid]);

  useEffect(() => {
    if (!selectedSubjectId) return;
    const q = query(collection(db, "studyPlans"), where("subjectId", "==", selectedSubjectId));
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        setPlan(snap.docs[0].data().plan || []);
      } else {
        setPlan([]);
      }
    });
    return () => unsub();
  }, [selectedSubjectId]);

  const generatePlan = async () => {
    if (!selectedSubjectId) return;
    setIsGenerating(true);

    try {
      // 1. Get subject context
      const sub = subjects.find(s => s.id === selectedSubjectId);
      
      // 2. Get analyzed topics
      const papersQ = query(collection(db, "papers"), where("subjectId", "==", selectedSubjectId));
      const papersSnap = await getDocs(papersQ);
      const topics = papersSnap.docs.flatMap(d => (d.data().topics || []));

      const prompt = `Generate a 7-day optimized study plan for the subject "${sub.name}".
      Based on analyzed topics: ${JSON.stringify(topics)}
      The plan should prioritize high-yield topics first.
      
      Return JSON:
      {
        "plan": [
          { "day": 1, "topic": "...", "tasks": ["Task 1", "Task 2"], "difficulty": "High" },
          ...
        ]
      }`;

      const response = await ai.models.generateContent({
        model: MODELS.flash,
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const result = JSON.parse(response.text || "{}");
      
      // 3. Save to Firestore (replace old plan if exists)
      const existingQ = query(collection(db, "studyPlans"), where("subjectId", "==", selectedSubjectId));
      const existingSnap = await getDocs(existingQ);
      
      if (existingSnap.empty) {
        await addDoc(collection(db, "studyPlans"), {
          userId: user.uid,
          subjectId: selectedSubjectId,
          plan: result.plan,
          createdAt: Date.now()
        });
      } else {
        // Simple overwrite logic for MVP
        await updateDoc(doc(db, "studyPlans", existingSnap.docs[0].id), {
          plan: result.plan,
          updatedAt: Date.now()
        });
      }

    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-bold font-display tracking-tight text-white mb-1">
            Study Architect
          </h1>
          <p className="text-slate-400 text-sm">Dynamic AI scheduling optimized for high-yield topic coverage.</p>
        </div>

        <div className="flex items-center gap-4">
          <select 
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-200 outline-none focus:border-indigo-500 transition-all min-w-[220px] shadow-lg"
          >
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name.toUpperCase()}</option>)}
          </select>
          <button
            onClick={generatePlan}
            disabled={isGenerating || !selectedSubjectId}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Synthesize Roadmap
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {plan.length > 0 ? (
           plan.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="professional-card overflow-hidden flex flex-col h-full bg-[#0a0a0f] group hover:border-indigo-500/30 transition-all cursor-default shadow-xl"
              >
                <div className="h-1.5 w-full bg-linear-to-r from-indigo-600 to-purple-600 opacity-80" />
                <div className="p-6 flex flex-col h-full">
                   <div className="flex items-center justify-between mb-6">
                      <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">
                        Day {String(item.day).padStart(2, '0')}
                      </div>
                      <span className={cn(
                        "text-[8px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-md shadow-sm",
                        item.difficulty === 'High' ? "bg-red-400/10 text-red-400 border border-red-400/20" : "bg-indigo-400/10 text-indigo-400 border border-indigo-400/20"
                      )}>
                        {item.difficulty} Focus
                      </span>
                   </div>
                   
                   <h3 className="text-lg font-bold font-display mb-6 group-hover:text-indigo-400 transition-colors uppercase tracking-tight leading-tight text-slate-200">
                     {item.topic}
                   </h3>

                   <div className="space-y-3 flex-1 mb-8">
                      {item.tasks.map((task: string, j: number) => (
                        <div key={j} className="flex items-start gap-4">
                           <div className="w-4 h-4 rounded-full border-2 border-white/10 mt-0.5 flex items-center justify-center group-hover:border-indigo-500/30 transition-all shrink-0">
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-all" />
                           </div>
                           <p className="text-[11px] text-slate-500 leading-relaxed font-medium group-hover:text-slate-400 transition-colors">{task}</p>
                        </div>
                      ))}
                   </div>

                   <button className="flex items-center justify-center gap-3 w-full py-2.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white text-slate-400 transition-all duration-300">
                      Engage Module
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
              </motion.div>
           ))
         ) : (
            <div className="lg:col-span-4 professional-card p-32 text-center flex flex-col items-center gap-8 border-dashed border-white/5 bg-transparent opacity-40">
               <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border border-white/5 shadow-2xl">
                  <CalendarIcon className="w-12 h-12 text-slate-600" />
               </div>
               <div className="max-w-md space-y-3">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">Architect ready</h3>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    Select a subject and click "Synthesize Roadmap" to let our AI create a custom 7-day schedule for you.
                  </p>
               </div>
            </div>
         )}
      </div>

      <div className="p-10 professional-card bg-linear-to-r from-indigo-600/10 to-transparent border-indigo-500/10 flex flex-col md:flex-row items-center justify-between gap-10">
         <div className="flex items-center gap-8">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-600/30">
               <Download className="w-8 h-8 text-white" />
            </div>
            <div>
               <h4 className="text-2xl font-black font-display text-white tracking-tight">Export Schedule</h4>
               <p className="text-sm text-slate-500 font-medium tracking-tight mt-1">Download your study plan as a high-fidelity PDF with active checklists.</p>
            </div>
         </div>
         <button className="px-10 py-4 bg-white text-indigo-700 rounded-xl font-black uppercase tracking-[0.2em] text-[11px] hover:scale-105 active:scale-95 transition-all shadow-2xl">
            Download PDF
         </button>
      </div>
    </div>
  );
}

const updateDoc = async (ref: any, data: any) => {
  const { updateDoc: fbUpdateDoc } = await import("firebase/firestore");
  return fbUpdateDoc(ref, data);
};
