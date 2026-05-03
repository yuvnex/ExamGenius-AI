import { motion } from "motion/react";
import { GraduationCap, ArrowRight, Brain, Target, Zap, Clock, ShieldCheck, Star } from "lucide-react";
import { signInWithGoogle } from "../lib/firebase";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#050507] overflow-x-hidden text-slate-200">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <img 
          src="https://picsum.photos/seed/examgenius_pro/1920/1080?blur=10" 
          alt="Abstract neural network"
          className="absolute top-0 left-0 w-full h-full object-cover opacity-10 mix-blend-screen scale-110 grayscale"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/10 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[0%] right-[-5%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
      </div>

      <nav className="relative z-10 flex items-center justify-between px-10 py-8 max-w-7xl mx-auto border-b border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-2xl shadow-indigo-500/20 group-hover:rotate-6 transition-transform duration-500">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black font-display tracking-tighter text-white">
            ExamGenius <span className="text-indigo-500">AI</span>
          </span>
        </div>
        <div className="flex items-center gap-10">
          <div className="hidden lg:flex gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Forecaster</a>
            <a href="#" className="hover:text-white transition-colors">Roadmap</a>
            <a href="#" className="hover:text-white transition-colors">Benchmarks</a>
          </div>
          <button 
            onClick={signInWithGoogle}
            className="px-8 py-3 bg-white text-indigo-700 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-100 transition-all shadow-2xl hover:scale-105 active:scale-95"
          >
            Authenticate
          </button>
        </div>
      </nav>

      <section className="relative z-10 pt-32 pb-44 px-8 max-w-7xl mx-auto">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 mb-10">
              <Zap className="w-4 h-4 text-indigo-400 fill-indigo-400 animate-pulse" />
              <span className="text-[10px] font-black tracking-[0.3em] text-indigo-400 uppercase leading-none">Neural analysis active</span>
            </div>
            
            <h1 className="text-7xl md:text-9xl font-black font-display tracking-[ -0.05em] leading-[0.85] text-white mb-10">
              OPTIMIZE YOUR <br />
              <span className="gradient-text">MASTERY.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mb-16 leading-relaxed font-medium tracking-tight">
              Transform raw past papers into strategic intelligence. Decode curriculum patterns to architect your ultimate revision roadmap.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-10">
              <button 
                onClick={signInWithGoogle}
                className="group relative px-12 py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm transition-all shadow-2xl shadow-indigo-600/40 overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <span className="relative flex items-center justify-center gap-3 uppercase tracking-[0.3em]">
                  Start Ingestion <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              
              <div className="flex items-center gap-6">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=student${i}`}
                      className="w-12 h-12 rounded-full border-2 border-[#050507] bg-slate-900 shadow-xl"
                      alt="Student"
                    />
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex gap-0.5 mb-1">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />)}
                  </div>
                  <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">
                    Trusted by <span className="text-white">12k+</span> students
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 px-8 max-w-7xl mx-auto py-32 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              icon: Brain,
              title: "Neural Extraction",
              text: "Advanced Gemini-powered vision engines scan PDFs to identify core concepts and hidden repetitions."
            },
            {
              icon: Target,
              title: "Relational Mapping",
              text: "Synchronize exam history with official curriculum unit data to reveal mission-critical knowledge gaps."
            },
            {
              icon: Zap,
              title: "Yield Forecasting",
              text: "Predict upcoming exam topics with high-fidelity probabilistic modeling based on multi-year trends."
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className="professional-card p-12 bg-[#0a0a0f] hover:border-indigo-500/30 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                 <feature.icon className="w-24 h-24 text-white rotate-12" />
              </div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500">
                <feature.icon className="w-7 h-7 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-6 font-display uppercase tracking-tight text-white">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm font-medium">
                {feature.text}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 py-20 border-t border-white/5 px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
           <div className="flex items-center gap-3 grayscale opacity-40">
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                 <ShieldCheck className="w-4 h-4 text-black" />
              </div>
              <span className="text-[9px] uppercase tracking-[0.4em] font-black text-white">Encrypted Neural Compute</span>
           </div>
           
           <div className="flex gap-10 text-[9px] font-black uppercase tracking-[0.3em] text-slate-600">
             <a href="#" className="hover:text-white transition-colors">Privacy</a>
             <a href="#" className="hover:text-white transition-colors">Terms</a>
             <a href="#" className="hover:text-white transition-colors">Security</a>
           </div>

           <p className="text-[10px] font-mono text-slate-700 tracking-wider">© 2026 EXAMGENIUS AI SYSTEM. DOMAIN SECURED.</p>
        </div>
      </footer>
    </div>
  );
}
