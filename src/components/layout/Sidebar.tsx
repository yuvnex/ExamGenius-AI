import { NavLink } from "react-router-dom";
import { 
  BarChart3, 
  FileText, 
  Calendar, 
  HelpCircle, 
  BrainCircuit, 
  LayoutDashboard,
  GraduationCap
} from "lucide-react";
import { cn } from "../../lib/utils";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/syllabus", label: "Syllabus", icon: FileText },
  { to: "/analysis", label: "Topic Analysis", icon: BarChart3 },
  { to: "/study-planner", label: "Study Planner", icon: Calendar },
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-white/10 flex flex-col h-full bg-[#0a0a0f]">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display tracking-tight text-white leading-none">
              ExamGenius <span className="text-indigo-400">AI</span>
            </h1>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1 mt-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                isActive 
                  ? "bg-indigo-500/10 text-indigo-400" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )
            }
          >
            <link.icon className={cn("w-5 h-5", "group-hover:scale-105 transition-transform font-bold")} />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-6 mt-auto">
        <div className="bg-linear-to-br from-indigo-600 to-purple-700 rounded-xl p-5 shadow-xl">
          <p className="text-sm font-semibold text-white mb-2 italic tracking-tight">Ready for Finals?</p>
          <p className="text-[11px] text-indigo-100 mb-4 opacity-80 leading-relaxed">
            Upgrade to Premium for full syllabus mapping and AI mock tests.
          </p>
          <button className="w-full py-2 bg-white text-indigo-700 text-[10px] font-bold rounded-lg hover:bg-indigo-50 transition-colors uppercase tracking-widest">
            UPGRADE NOW
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-600 mt-6 font-mono tracking-widest uppercase opacity-50">ExamGenius v1.0</p>
      </div>
    </aside>
  );
}
