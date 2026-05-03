import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, addDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { ai, MODELS } from "../lib/gemini";
import { FileUp, Loader2, Brain, AlertCircle, TrendingUp, Calendar, ChevronDown, CheckCircle2, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
import { cn } from "../lib/utils";

interface AnalysisPageProps {
  user: any;
}

export default function Analysis({ user }: AnalysisPageProps) {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [papers, setPapers] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [view, setView] = useState<"upload" | "results">("upload");

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
    const q = query(collection(db, "papers"), where("subjectId", "==", selectedSubjectId));
    const unsub = onSnapshot(q, (snap) => {
      setPapers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [selectedSubjectId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedSubjectId) return;

    setIsProcessing(true);
    try {
      // 1. Convert file to Base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      const base64Data = await base64Promise;
      const cleanBase64 = base64Data.split(',')[1];

      // 2. Send to Gemini for topic extraction
      const prompt = `Analyze this exam paper (image/pdf). 
      1. Extract all questions.
      2. Identify the main topics and sub-topics for each question.
      3. Return a JSON object with:
         { 
           "subject": "Detected Subject Name",
           "topics": ["Topic A", "Topic B", ...],
           "questions": [{ "text": "...", "marks": 5, "topic": "..." }]
         }`;

      const response = await ai.models.generateContent({
        model: MODELS.flash,
        contents: [
          {
            parts: [
              { text: prompt },
              { inlineData: { data: cleanBase64, mimeType: file.type } }
            ]
          }
        ],
        config: { responseMimeType: "application/json" }
      });

      const result = JSON.parse(response.text || "{}");

      // 3. Save to Firestore
      await addDoc(collection(db, "papers"), {
        subjectId: selectedSubjectId,
        userId: user.uid,
        fileName: file.name,
        extractedText: response.text,
        topics: result.topics || [],
        questions: result.questions || [],
        createdAt: Date.now(),
      });

      setView("results");
    } catch (err) {
      console.error("Processing failed:", err);
      alert("Failed to analyze paper. Please try a clearer image or smaller PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Aggregated topic data for charts
  const allTopics = papers.flatMap(p => p.topics || []);
  const topicCounts = allTopics.reduce((acc: any, topic: string) => {
    acc[topic] = (acc[topic] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(topicCounts)
    .map(([name, count]) => ({ 
      name, 
      count: count as number,
      importance: (count as number) * 20 // Mock importance for now
    }))
    .sort((a, b) => b.count - a.count);

  const COLORS = ['#6366F1', '#818CF8', '#A5B4FC', '#C7D2FE', '#E0E7FF'];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-bold font-display tracking-tight text-white mb-1">
            Exam Forecaster
          </h1>
          <p className="text-slate-400 text-sm">Advanced AI identification of high-yield exam patterns and trends.</p>
        </div>

        <div className="flex items-center gap-4">
          <select 
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-200 outline-none focus:border-indigo-500 transition-all min-w-[220px] shadow-lg"
          >
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name.toUpperCase()}</option>)}
          </select>
          <div className="flex bg-[#0a0a0f] p-1.5 rounded-xl border border-white/10 shadow-inner">
            <button 
              onClick={() => setView("upload")}
              className={cn("px-5 py-2 rounded-lg text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300", view === "upload" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-slate-500 hover:text-slate-200")}
            >
              Upload
            </button>
            <button 
              onClick={() => setView("results")}
              className={cn("px-5 py-2 rounded-lg text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300", view === "results" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-slate-500 hover:text-slate-200")}
            >
              Analytics
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {view === "upload" ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            <div className="lg:col-span-8 space-y-6">
               <div className="relative group">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept="application/pdf,image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={isProcessing}
                  />
                  <div className={cn(
                    "border-2 border-dashed rounded-3xl p-24 flex flex-col items-center justify-center gap-8 transition-all duration-500",
                    isProcessing ? "border-indigo-500 bg-indigo-500/[0.03]" : "border-white/5 bg-white/[0.02] group-hover:border-indigo-500/30 group-hover:bg-indigo-500/[0.02]"
                  )}>
                    {isProcessing ? (
                      <>
                        <div className="relative">
                          <Loader2 className="w-20 h-20 text-indigo-400 animate-spin opacity-40" />
                          <Brain className="w-8 h-8 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <div className="text-center">
                          <h3 className="text-2xl font-bold mb-3 font-display tracking-tight text-white">AI Decoding in Progress</h3>
                          <p className="text-slate-500 text-sm max-w-xs font-medium leading-relaxed">Cross-referencing topics, questions, and weights using Gemini 1.5 Flash.</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-xl border border-indigo-500/20">
                          <FileUp className="w-10 h-10 text-indigo-400" />
                        </div>
                        <div className="text-center">
                          <h3 className="text-2xl font-bold mb-3 font-display tracking-tight text-white">Digital Paper Intake</h3>
                          <p className="text-slate-500 text-sm font-medium tracking-wide">Drag & drop past papers or click to select files.</p>
                        </div>
                      </>
                    )}
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="professional-card p-8 bg-[#0a0a0f] border-indigo-500/20">
                    <div className="flex items-center gap-3 mb-6">
                      <TrendingUp className="w-5 h-5 text-indigo-400" />
                      <h4 className="font-bold text-[10px] tracking-[0.2em] uppercase text-indigo-400">Yield Progress</h4>
                    </div>
                    <div className="flex items-end justify-between mb-4">
                      <span className="text-3xl font-bold font-display text-white">65%</span>
                      <span className="text-[10px] font-mono text-slate-500 pb-1">Covered Score</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.3)]" style={{ width: '65%' }} />
                    </div>
                  </div>
                  <div className="professional-card p-8 bg-[#0a0a0f]">
                    <div className="flex items-center gap-3 mb-6">
                      <CheckCircle2 className="w-5 h-5 text-slate-500" />
                      <h4 className="font-bold text-[10px] tracking-[0.2em] uppercase text-slate-500">Processed Archive</h4>
                    </div>
                    <div className="flex justify-between items-end">
                       <p className="text-4xl font-bold font-display text-white">{papers.length}</p>
                       <div className="text-right">
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">TOTAL PAPERS</p>
                         <p className="text-[9px] text-indigo-400 font-mono">+1 NEWLY ADDED</p>
                       </div>
                    </div>
                  </div>
               </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
               <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 flex items-center justify-between">
                 Paper Manifest
                 <div className="px-2 py-0.5 bg-white/5 rounded text-white">{papers.length}</div>
               </h3>
               <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                 {papers.map((paper, i) => (
                   <motion.div
                    key={paper.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 professional-card flex items-center justify-between group hover:border-indigo-500/30 transition-all cursor-default"
                   >
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/10 transition-colors">
                          <FileText className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-200 truncate max-w-[140px] uppercase tracking-wide">{paper.fileName}</p>
                          <p className="text-[9px] text-slate-500 font-mono">{paper.topics?.length || 0} Core Topics</p>
                        </div>
                     </div>
                     <CheckCircle2 className="w-4 h-4 text-green-500/50" />
                   </motion.div>
                 ))}
                 {papers.length === 0 && (
                   <div className="text-center py-24 glass-card border-dashed border-white/5 bg-transparent">
                     <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-10" />
                     <p className="text-[10px] font-bold uppercase tracking-widest text-slate-700">Digital library empty</p>
                   </div>
                 )}
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <div className="professional-card p-8 bg-[#0a0a0f] h-[550px] flex flex-col">
              <div className="flex items-center justify-between mb-10">
                 <div>
                   <h3 className="text-2xl font-bold font-display text-white mb-1">Frequency Mapping</h3>
                   <p className="text-xs text-slate-500 font-medium tracking-tight">Distribution of concepts across analyzed archive.</p>
                 </div>
                 <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shadow-xl">
                   <BarChart3 className="w-5 h-5 text-indigo-400" />
                 </div>
              </div>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#1f2937" fontSize={10} axisLine={false} tickLine={false} dy={10} />
                    <YAxis stroke="#1f2937" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                      contentStyle={{ backgroundColor: '#0a0a0f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
                      itemStyle={{ color: '#fff', fontSize: '12px' }}
                      labelStyle={{ color: '#6366f1', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={24}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between mt-8 text-[9px] font-mono font-bold text-slate-600 uppercase tracking-widest border-t border-white/5 pt-6">
                 <span>Least Common</span>
                 <span>Most Frequent</span>
              </div>
            </div>

            <div className="professional-card p-8 bg-[#0a0a0f] h-[550px] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-10">
                 <div>
                   <h3 className="text-2xl font-bold font-display text-white mb-1">AI Exam Forecast</h3>
                   <p className="text-xs text-slate-500 font-medium tracking-tight">Predicted importance rankings for upcoming finals.</p>
                 </div>
                 <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shadow-xl">
                   <Brain className="w-5 h-5 text-indigo-400" />
                 </div>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {chartData.map((topic, i) => (
                  <div key={i} className="p-5 professional-card bg-white/[0.01] hover:bg-white/[0.03] flex items-center justify-between group transition-all">
                     <div className="flex items-center gap-5">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xs font-display font-bold text-slate-500 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-all border border-transparent group-hover:border-indigo-500/20">
                          {String(i + 1).padStart(2, '0')}
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-bold text-slate-200 uppercase tracking-wide leading-none">{topic.name}</p>
                          <div className="flex items-center gap-3">
                             <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${topic.importance}%` }}
                                  className="h-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]" 
                                />
                             </div>
                             <span className="text-[9px] text-slate-600 font-mono font-bold tracking-widest uppercase">{topic.importance}% Confidence</span>
                          </div>
                        </div>
                     </div>
                     <span className={cn(
                       "text-[9px] font-black px-2.5 py-1.5 rounded-lg border uppercase tracking-[0.15em] shadow-sm",
                       topic.importance > 70 ? "bg-red-400/10 text-red-400 border-red-400/20" :
                       topic.importance > 40 ? "bg-amber-400/10 text-amber-500 border-amber-400/20" :
                       "bg-emerald-400/10 text-emerald-500 border-emerald-400/20"
                     )}>
                       {topic.importance > 70 ? "CRITICAL" : topic.importance > 40 ? "HIGH YIELD" : "MEDIUM"}
                     </span>
                  </div>
                ))}
                {chartData.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-20">
                    <Brain className="w-16 h-16 mb-4" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Neural Engine Standby</p>
                  </div>
                )}
              </div>
              <button className="w-full py-4 mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[11px] rounded-xl transition-all shadow-xl shadow-indigo-600/20 tracking-[0.2em] uppercase">
                GENERATE AI MOCK TEST
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BarChart3(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="M7 16V8" />
      <path d="M11 16V12" />
      <path d="M15 16V5" />
      <path d="M19 16v-7" />
    </svg>
  );
}
