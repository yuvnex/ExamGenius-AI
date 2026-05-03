import { Search, Bell, User, LogOut } from "lucide-react";
import { auth } from "../../lib/firebase";
import { signOut } from "firebase/auth";
import { cn } from "../../lib/utils";

interface NavbarProps {
  user: any;
}

export default function Navbar({ user }: NavbarProps) {
  return (
    <nav className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#050507]/80 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <div className="text-sm text-slate-400">Analysis for: <span className="text-white font-semibold">Past Paper Engine</span></div>
        <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[10px] rounded border border-green-500/20 font-bold tracking-widest uppercase">LIVE</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-focus-within:text-indigo-400 transition-colors" />
          <input
            type="text"
            placeholder="Search topics, questions..."
            className="bg-white/5 border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500 w-64 transition-all"
          />
        </div>

        <button className="relative p-2 hover:bg-white/5 rounded-full transition-colors group">
          <Bell className="w-5 h-5 text-slate-400 group-hover:text-white" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border border-[#050507] shadow-lg"></span>
        </button>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-white leading-none">{user.displayName || "Student"}</p>
            <p className="text-[10px] text-slate-500 mt-1">{user.email}</p>
          </div>
          <div className="group relative">
            <img
              src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`}
              alt="Avatar"
              className="w-8 h-8 rounded-full border border-white/10 shadow-lg"
              referrerPolicy="no-referrer"
            />
            <div className="absolute right-0 top-10 w-48 py-2 bg-[#0a0a0f] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <button
                onClick={() => signOut(auth)}
                className="w-full flex items-center gap-3 px-4 py-2 text-xs text-red-400 hover:bg-red-400/10 transition-colors font-bold uppercase tracking-wider"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
