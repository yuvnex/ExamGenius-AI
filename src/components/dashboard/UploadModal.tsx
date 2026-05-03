import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Upload, Check, FileText } from "lucide-react";
import { db } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export default function UploadModal({ isOpen, onClose, userId }: UploadModalProps) {
  const [subjectName, setSubjectName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim()) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, "subjects"), {
        name: subjectName,
        userId: userId,
        createdAt: Date.now(),
      });
      setSubjectName("");
      onClose();
    } catch (error) {
      console.error("Error adding subject:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md glass-card p-8 bg-[#111111]"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <header className="mb-8">
            <h2 className="text-2xl font-bold font-display tracking-tight mb-2">Add New Subject</h2>
            <p className="text-sm text-gray-500">Create a space to analyze your past papers.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                Subject Name
              </label>
              <input
                autoFocus
                type="text"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                placeholder="e.g. Computer Science, Medicine, Law..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent transition-colors"
              />
            </div>

            <button
              disabled={submitting || !subjectName.trim()}
              className="w-full py-4 bg-accent disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent/20"
            >
              {submitting ? "Processing..." : "Create Subject"}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
