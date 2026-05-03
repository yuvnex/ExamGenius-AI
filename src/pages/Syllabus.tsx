import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, updateDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { ai, MODELS } from "../lib/gemini";
import { FileText, Loader2, Sparkles, CheckCircle2, ChevronRight, BookOpen, AlertTriangle, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

interface SyllabusPageProps {
  user: any;
}

export default function Syllabus({ user }: SyllabusPageProps) {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [syllabusText, setSyllabusText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [coverageData, setCoverageData] = useState<any>(null);

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
    const sub = subjects.find(s => s.id === selectedSubjectId);
    if (sub) {
      setSyllabusText(sub.syllabusText || "");
      calculateCoverage(sub.id, sub.syllabusText || "");
    }
  }, [selectedSubjectId, subjects]);

  const calculateCoverage = async (subjectId: string, syllabus: string) => {
    if (!syllabus) return;
    
    // Get all topics from papers
    const papersQ = query(collection(db, "papers"), where("subjectId", "==", subjectId));
    const papersSnap = await getDocs(papersQ);
    const paperTopics = new Set(papersSnap.docs.flatMap(d => (d.data().topics || [])));

    if (paperTopics.size === 0) return;

    try {
      const prompt = `Compare these two lists:
      Syllabus Text: "${syllabus}"
      Analyzed Exam Topics: ${JSON.stringify(Array.from(paperTopics))}
      
      Identify:
      1. Topics perfectly covered in papers.
      2. Topics mentioned in syllabus but NEVER appeared in papers.
      3. Topics that appeared in papers but seem extra or contextually different.
      
      Return JSON:
      {
        "covered": ["...", "..."],
        "missing": ["...", "..."],
        "totalUnits": 0,
        "percentage": 0
      }`;

      const response = await ai.models.generateContent({
        model: MODELS.flash,
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      setCoverageData(JSON.parse(response.text || "{}"));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (!selectedSubjectId) return;
    setIsUpdating(true);
    try {
      await updateDoc(doc(db, "subjects", selectedSubjectId), {
        syllabusText,
        updatedAt: Date.now()
      });
      await calculateCoverage(selectedSubjectId, syllabusText);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-bold font-display tracking-tight text-white mb-1">
            Curriculum Mapping
          </h1>
          <p className="text-slate-400 text-sm">Cross-verify analyzed topics with your official study curriculum.</p>
        </div>

        <select 
          value={selectedSubjectId}
          onChange={(e) => setSelectedSubjectId(e.target.value)}
          className="bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-200 outline-none focus:border-indigo-500 transition-all min-w-[220px] shadow-lg"
        >
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name.toUpperCase()}</option>)}
        </select>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-8 space-y-6">
            <div className="professional-card p-8 bg-[#0a0a0f] flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 uppercase tracking-[0.2em] text-[10px] font-bold text-slate-500">
                  <div className="p-2 bg-white/5 rounded-lg">
                    <FileText className="w-4 h-4" />
                  </div>
                  Syllabus Manifest
                </div>
                <button
                  onClick={handleSave}
                  disabled={isUpdating}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                >
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Synchronize AI
                </button>
              </div>
              <textarea
                value={syllabusText}
                onChange={(e) => setSyllabusText(e.target.value)}
                placeholder="Paste your syllabus text here or a list of topics from your curriculum. Our AI will map these to your paper analysis."
                className="w-full h-[450px] bg-white/[0.02] border border-white/10 rounded-2xl p-8 outline-none focus:border-indigo-500/50 text-[13px] leading-relaxed resize-none transition-all placeholder:text-slate-700 font-mono text-slate-300 custom-scrollbar shadow-inner"
              />
            </div>
         </div>

         <div className="lg:col-span-4 space-y-8">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 px-1 border-l-2 border-indigo-500 ml-1">
              Coverage Intelligence
            </h3>
            
            {coverageData ? (
               <div className="space-y-6">
                  <div className="professional-card p-8 bg-linear-to-br from-[#0a0a0f] to-indigo-950/20 shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp className="w-20 h-20 text-indigo-400 rotate-12" />
                     </div>
                     <div className="flex items-end justify-between mb-6">
                        <h4 className="text-5xl font-black font-display tracking-tighter text-white">{coverageData.percentage}%</h4>
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-400 mb-2">CURRICULUM SCORE</span>
                     </div>
                     <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${coverageData.percentage}%` }}
                          className="h-full bg-indigo-600 shadow-[0_0_20px_rgba(99,102,241,0.5)]" 
                        />
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="p-6 professional-card border-green-500/10 bg-green-500/[0.02] hover:bg-green-500/[0.04] transition-colors">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-500 mb-4 flex items-center gap-2">
                           <CheckCircle2 className="w-3.5 h-3.5" />
                           MASTERED CONCEPTS ({coverageData.covered?.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                           {coverageData.covered?.slice(0, 8).map((t: string, i: number) => (
                             <span key={i} className="px-2.5 py-1.5 bg-green-500/10 text-green-400 text-[9px] rounded border border-green-500/20 font-bold uppercase tracking-tight">{t}</span>
                           ))}
                           {coverageData.covered?.length > 8 && <span className="text-[10px] font-bold text-slate-500 pt-2">+{coverageData.covered.length - 8} more</span>}
                        </div>
                     </div>

                     <div className="p-6 professional-card border-red-500/10 bg-red-500/[0.02] hover:bg-red-500/[0.04] transition-colors">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400 mb-4 flex items-center gap-2">
                           <AlertTriangle className="w-3.5 h-3.5" />
                           CRITICAL GAPS ({coverageData.missing?.length})
                        </p>
                         <div className="flex flex-wrap gap-2">
                           {coverageData.missing?.slice(0, 8).map((t: string, i: number) => (
                             <span key={i} className="px-2.5 py-1.5 bg-red-400/10 text-red-300 text-[9px] rounded border border-red-400/20 font-bold uppercase tracking-tight">{t}</span>
                           ))}
                             {coverageData.missing?.length > 8 && <span className="text-[10px] font-bold text-slate-500 pt-2">+{coverageData.missing.length - 8} more</span>}
                        </div>
                     </div>
                  </div>

                  <div className="p-6 professional-card bg-[#0a0a0f] border-indigo-500/10 italic text-slate-500 text-[11px] leading-relaxed relative">
                    <Sparkles className="w-4 h-4 text-indigo-400 absolute -top-2 -left-2 opacity-50" />
                    "Neural analysis suggests focusing on untested topics with high yield probability in your next 3 forecast sessions."
                  </div>
               </div>
            ) : (
               <div className="professional-card p-16 text-center flex flex-col items-center gap-6 text-slate-600 bg-transparent border-dashed border-white/5 opacity-50">
                  <div className="p-6 rounded-full bg-white/5">
                    <BookOpen className="w-12 h-12 opacity-30" />
                  </div>
                  <div className="text-[11px] font-bold tracking-[0.2em] uppercase max-w-[200px] leading-loose">
                    Ingest syllabus & sync analysis to generate intelligence
                  </div>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
