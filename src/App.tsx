import { useState } from 'react';
import SlidesViewer from './components/SlidesViewer';
import GoogleSlidesExporter from './components/GoogleSlidesExporter';
import EntrepreneurSandbox from './components/EntrepreneurSandbox';
import ChallengeKnowledgeQuiz from './components/ChallengeKnowledgeQuiz';
import { Sparkles, Trophy, Coins, Presentation, Award, TrendingUp, Info } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'presentation' | 'sandbox' | 'quiz'>('presentation');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Premium Header Container */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2.5 rounded-2xl shadow-lg shadow-amber-500/10">
              <Sparkles className="text-slate-950 w-6 h-6 animate-pulse" />
            </div>
            <div className="text-right sm:text-right">
              <h1 className="text-lg sm:text-xl font-black font-display text-white tracking-tight">مبادرة ريادي الغد 🌟</h1>
              <p className="text-[10px] text-slate-400 font-semibold font-sans mt-0.5">مبادئ ريادة الأعمال والإدارة المالية لطلاب المدارس</p>
            </div>
          </div>

          {/* Navigation Control Tabs */}
          <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('presentation')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 ${
                activeTab === 'presentation'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Presentation className="w-4 h-4" />
              العرض والشرائح الـ 20
            </button>
            <button
              onClick={() => setActiveTab('sandbox')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 ${
                activeTab === 'sandbox'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Coins className="w-4 h-4" />
              مختبر المشاريع الذكي
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 ${
                activeTab === 'quiz'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4" />
              تحديات المعرفة والمسابقة
            </button>
          </div>

        </div>
      </header>

      {/* Main Workspace Body wrapper */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* TAB 1: Presentation & Google Slides Exporter */}
        {activeTab === 'presentation' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Google Exporter Box */}
            <GoogleSlidesExporter />

            {/* Slide Player */}
            <SlidesViewer />
          </div>
        )}

        {/* TAB 2: Dynamic Project Sandbox Simulator */}
        {activeTab === 'sandbox' && (
          <div className="animate-fadeIn">
            <EntrepreneurSandbox />
          </div>
        )}

        {/* TAB 3: Gamified Quiz challenge */}
        {activeTab === 'quiz' && (
          <div className="animate-fadeIn">
            <ChallengeKnowledgeQuiz />
          </div>
        )}

      </main>

      {/* Premium Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} مبادرة ريادي الغد • تطوير مالي وتجاري متكامل بموازنة صفية.
          </p>
          <div className="flex gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1"><Award className="text-amber-500 w-3.5 h-3.5" /> الفئة العمرية المستهدفة: 14 سنة</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1"><TrendingUp className="text-emerald-500 w-3.5 h-3.5" /> الإدارة المالية الميسرة للمدارس</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
