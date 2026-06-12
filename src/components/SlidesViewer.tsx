import { useState, useEffect } from 'react';
import { ALL_20_SLIDES } from '../lib/slidesData';
import { Slide } from '../types';
import { ChevronRight, ChevronLeft, Play, Pause, List, BookOpen, Calculator, Sparkles, Scale, Info, CheckCircle2, TrendingUp, HelpCircle } from 'lucide-react';

interface SlidesViewerProps {
  onSlideChange?: (id: number) => void;
}

export default function SlidesViewer({ onSlideChange }: SlidesViewerProps) {
  const [currentSlideId, setCurrentSlideId] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [intervalTime, setIntervalTime] = useState(5000); // 5 sec
  const [showNotes, setShowNotes] = useState(true);
  const [showOutline, setShowOutline] = useState(true);

  // Widget interactive states
  const [formulaCost, setFormulaCost] = useState<number>(1.5);
  const [formulaProfit, setFormulaProfit] = useState<number>(1.0);
  
  const [scaleRevenue, setScaleRevenue] = useState<number>(40);
  const [scaleExpense, setScaleExpense] = useState<number>(20);

  const [sandwichPrice, setSandwichPrice] = useState<number>(2.0);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideId]);

  // Autoplay
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        handleNext();
      }, intervalTime);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentSlideId, intervalTime]);

  const handleNext = () => {
    let nextId = currentSlideId + 1;
    if (nextId > ALL_20_SLIDES.length) {
      nextId = 1; // loop
    }
    setCurrentSlideId(nextId);
    if (onSlideChange) onSlideChange(nextId);
  };

  const handlePrev = () => {
    let prevId = currentSlideId - 1;
    if (prevId < 1) {
      prevId = ALL_20_SLIDES.length;
    }
    setCurrentSlideId(prevId);
    if (onSlideChange) onSlideChange(prevId);
  };

  const currentSlide = ALL_20_SLIDES.find(s => s.id === currentSlideId) || ALL_20_SLIDES[0];

  return (
    <div id="slides-viewer-master" className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      
      {/* Sidebar Quick Outline */}
      {showOutline && (
        <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-4 xl:col-span-1 select-none flex flex-col h-[640px]">
          <h3 className="text-sm font-bold text-slate-300 font-display flex items-center justify-between border-b border-slate-900 pb-3 mb-3">
            <span className="flex items-center gap-1.5"><List className="w-4 h-4 text-amber-500" /> مخطط الـ 20 شريحة</span>
            <span className="text-xs text-slate-500">منظّم</span>
          </h3>
          <div className="space-y-1 overflow-y-auto flex-1 pr-1 pl-1">
            {ALL_20_SLIDES.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setCurrentSlideId(s.id);
                  if (onSlideChange) onSlideChange(s.id);
                }}
                className={`w-full py-2 px-3 rounded-xl text-xs font-semibold text-right transition flex items-center justify-between ${
                  currentSlideId === s.id
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/25'
                    : 'text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
                }`}
              >
                <span className="truncate max-w-[150px]">{s.title}</span>
                <span className={`font-mono text-[9px] ${currentSlideId === s.id ? 'text-amber-500' : 'text-slate-600'}`}>
                  شريحة {s.id}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Presentation Stage */}
      <div className={`${showOutline ? 'xl:col-span-3' : 'xl:col-span-4'} flex flex-col gap-6`}>
        {/* Stage Frame */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 h-[480px] flex flex-col justify-between relative overflow-hidden group shadow-2xl">
          
          {/* Subtle background graphics */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-900/40 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-900/40 rounded-full blur-3xl -z-10" />

          {/* Slide Header */}
          <div className="flex justify-between items-start border-b border-slate-900 pb-4">
            <div>
              <span className="text-[10px] font-mono text-amber-500 font-bold bg-amber-500/5 px-2.5 py-1 rounded-full border border-amber-500/10">
                مبادرة ريادي الغد • شريحة {currentSlideId} من 20
              </span>
              <h1 className="text-lg sm:text-2xl font-black font-display text-white mt-1.5 leading-tight select-all">
                {currentSlide.title}
              </h1>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowOutline(!showOutline)}
                className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-lg transition"
                title="تصفح قائمة الشرائح"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Slide Content Box */}
          <div className="my-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center flex-1 py-4">
            
            {/* Left Texts description */}
            <div className={`${currentSlide.illustrationType === 'cover' ? 'lg:col-span-12 text-center' : 'lg:col-span-7'} space-y-4`}>
              {currentSlide.subtitle && (
                <p className="text-xs sm:text-sm text-amber-400 font-semibold italic leading-relaxed font-sans">
                  {currentSlide.subtitle}
                </p>
              )}
              
              <div className="space-y-3">
                {currentSlide.points?.map((point, index) => (
                  <div key={index} className="flex gap-2.5 items-start text-right">
                    <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Drawings & Widgets */}
            {currentSlide.illustrationType !== 'cover' && (
              <div className="lg:col-span-5 flex justify-center items-center h-full min-h-[160px]">
                
                {/* Illustration Type 1: Success goals */}
                {currentSlide.illustrationType === 'goals' && (
                  <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl w-full text-center space-y-3 animate-fadeIn select-none">
                    <div className="flex justify-center gap-2">
                      <span className="text-2xl">🌱</span>
                      <span className="text-2xl">➡️</span>
                      <span className="text-2xl">🌳</span>
                    </div>
                    <div className="text-xs text-slate-400">فكرة صغيرة مع تطبيق ذكي تصنع تغييراً كبيراً!</div>
                  </div>
                )}

                {/* Illustration Type 2: Ahmed story chart */}
                {currentSlide.illustrationType === 'story' && (
                  <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl w-full space-y-3 font-mono text-xs select-none">
                    <span className="text-[10px] text-slate-500 block">الهيكل المالي لمشروع أحمد للأكواب:</span>
                    <div className="space-y-1.5 pt-1">
                      <div>
                        <div className="flex justify-between"><span>رأس المال الخامات:</span><span className="text-rose-400">30 ريال</span></div>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full"><div className="bg-rose-500 h-full rounded-full" style={{ width: '30%' }} /></div>
                      </div>
                      <div>
                        <div className="flex justify-between"><span>الإيرادات الكلية:</span><span className="text-cyan-400">100 ريال</span></div>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full"><div className="bg-cyan-400 h-full rounded-full" style={{ width: '100%' }} /></div>
                      </div>
                      <div className="pt-1 border-t border-slate-800">
                        <div className="flex justify-between font-bold text-emerald-400"><span>الأرباح الصافية الحرة:</span><span>70 ريالاً</span></div>
                        <p className="text-[9px] text-emerald-500 text-right mt-1">* معدل نمو الأرباح يبلغ 233% من رأس المال!</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Illustration Type 3: Idea Picker */}
                {currentSlide.illustrationType === 'idea' && (
                  <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl grid grid-cols-2 gap-2 text-center w-full select-none text-xs">
                    <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800">🎨 رسم وتلوين</div>
                    <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800">🧁 طبخ وحلويات</div>
                    <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800">📷 تنظيم وتصوير</div>
                    <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800">🧵 خيوط وأساور</div>
                  </div>
                )}

                {/* Illustration Type 4: Customer survey visualizer */}
                {currentSlide.illustrationType === 'survey' && (
                  <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl w-full text-center space-y-3 font-mono text-xs select-none">
                    <span className="text-[10px] text-slate-500 block">نتائج استطلاع 5 زملاء بالفصل:</span>
                    <div className="flex justify-center gap-1.5 pt-2">
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-lg">👍 نعم (4)</span>
                      <span className="bg-rose-500/20 text-rose-450 border border-rose-500/20 px-2 py-1 rounded-lg">👎 لا (1)</span>
                    </div>
                    <p className="text-[10px] bg-slate-950/40 p-2 rounded-lg text-slate-400 leading-relaxed font-sans">
                      السعر المقبول للجميع هو <b>1.5 ريال</b> للكوب.
                    </p>
                  </div>
                )}

                {/* Illustration Type 5: Capital expense lists */}
                {currentSlide.illustrationType === 'capital' && (
                  <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl w-full text-xs space-y-2 select-none">
                    <div className="flex justify-between p-2 bg-slate-950/40 rounded-lg"><span>شاي فاخر العافية</span><span className="text-slate-400">5 ريال</span></div>
                    <div className="flex justify-between p-2 bg-slate-950/40 rounded-lg"><span>كيلو سكر طبيعي</span><span className="text-slate-400">3 ريال</span></div>
                    <div className="flex justify-between p-2 bg-slate-950/40 rounded-lg"><span>أكياس صحية</span><span className="text-slate-400">2 ريال</span></div>
                    <div className="flex justify-between p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-500 font-bold">
                      <span>إجمالي رأس مال البدء:</span><span>10 ريالات</span>
                    </div>
                  </div>
                )}

                {/* Illustration Type 6: Sizing Formula Calculator (Interactive!) */}
                {currentSlide.illustrationType === 'pricing' && (
                  <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl w-full space-y-4 font-mono text-xs animate-fadeIn">
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">تكلفة صنع الكوب الواحد (ريال):</label>
                        <input
                          type="number"
                          step={0.1}
                          value={formulaCost}
                          onChange={(e) => setFormulaCost(parseFloat(e.target.value) || 0)}
                          className="w-full bg-slate-950 border border-slate-800 p-2 rounded-lg text-rose-400 font-bold outline-none text-center"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">هامش ربحك المأمول للقطعة (ريال):</label>
                        <input
                          type="number"
                          step={0.1}
                          value={formulaProfit}
                          onChange={(e) => setFormulaProfit(parseFloat(e.target.value) || 0)}
                          className="w-full bg-slate-950 border border-slate-800 p-2 rounded-lg text-emerald-400 font-bold outline-none text-center"
                        />
                      </div>
                    </div>
                    <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center text-amber-500 font-bold font-sans">
                      سعر البيع المقترح لطلابك: {(formulaCost + formulaProfit).toFixed(1)} ر.س
                    </div>
                  </div>
                )}

                {/* Illustration Type 7: Pricing spectrum table */}
                {currentSlide.illustrationType === 'table' && (
                  <div className="bg-slate-900/40 border border-slate-800 p-2.5 rounded-xl w-full space-y-1.5 text-xs select-none font-mono">
                    <div className="grid grid-cols-3 p-1.5 bg-slate-950 rounded-lg text-slate-500 text-[10px] text-center">
                      <div>المنتج</div>
                      <div>التكلفة</div>
                      <div>العرض</div>
                    </div>
                    <div className="grid grid-cols-3 p-1.5 bg-slate-950/20 rounded-lg text-center">
                      <div className="text-slate-200">كب كيك</div>
                      <div className="text-rose-400">1.0 ر.س</div>
                      <div className="text-emerald-400 font-bold">2.0 ر.س</div>
                    </div>
                    <div className="grid grid-cols-3 p-1.5 bg-slate-950/20 rounded-lg text-center">
                      <div className="text-slate-200">سوار يد</div>
                      <div className="text-rose-400">0.5 ر.س</div>
                      <div className="text-emerald-400 font-bold">1.5 ر.س</div>
                    </div>
                    <div className="grid grid-cols-3 p-1.5 bg-slate-950/20 rounded-lg text-center">
                      <div className="text-slate-200">ملصق</div>
                      <div className="text-rose-400">0.2 ر.س</div>
                      <div className="text-emerald-400 font-bold">1.0 ر.س</div>
                    </div>
                  </div>
                )}

                {/* Illustration Type 8: Revenues formula details */}
                {currentSlide.illustrationType === 'revenue' && (
                  <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl w-full text-center space-y-3 font-mono text-xs select-none">
                    <span className="text-[10px] text-slate-500 block">معادلة حساب الإيرادات الإجمالية:</span>
                    <div className="p-3 bg-slate-950 rounded-lg flex justify-between items-center text-slate-200">
                      <span>20 كعكة</span>
                      <span>×</span>
                      <span>2 ريال</span>
                      <span>=</span>
                      <span className="text-amber-400 font-bold">40 ريال</span>
                    </div>
                    <p className="text-[9px] text-slate-400 leading-relaxed font-sans mt-1">
                      هي كل الأموال المدخلة المكتسبة داخل الخزينة المادية للمشروع.
                    </p>
                  </div>
                )}

                {/* Illustration Type 9: Expenses inputs */}
                {currentSlide.illustrationType === 'expenses' && (
                  <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl w-full text-center space-y-3 font-mono text-xs select-none">
                    <span className="text-[10px] text-slate-500 block">معادلة فرز المصروفات المباشرة:</span>
                    <div className="p-3 bg-slate-950 rounded-lg flex justify-between items-center text-slate-200">
                      <span>20 كعكة</span>
                      <span>×</span>
                      <span>1 ريال</span>
                      <span>=</span>
                      <span className="text-rose-400 font-bold">20 ريال</span>
                    </div>
                    <p className="text-[9px] text-slate-400 leading-relaxed font-sans mt-1">
                      الخامات المباشرة والصيانة هي عماد الصرف المالي المنضبط.
                    </p>
                  </div>
                )}

                {/* Illustration Type 10: Interactive Profit/Loss Scale Balancer */}
                {currentSlide.illustrationType === 'balance' && (
                  <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl w-full space-y-4 font-mono text-xs">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span>إيرادات المعرض (ريال):</span>
                        <span className="text-cyan-400 font-bold">{scaleRevenue} ريال</span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={100}
                        step={5}
                        value={scaleRevenue}
                        onChange={(e) => setScaleRevenue(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-950 appearance-none rounded-lg cursor-pointer accent-cyan-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span>مصروفات الصناعة (ريال):</span>
                        <span className="text-rose-400 font-bold">{scaleExpense} ريال</span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={100}
                        step={5}
                        value={scaleExpense}
                        onChange={(e) => setScaleExpense(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-950 appearance-none rounded-lg cursor-pointer accent-rose-500"
                      />
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                      <span className="text-slate-400">الربح الصافي:</span>
                      <span className={`text-base font-black ${scaleRevenue - scaleExpense >= 0 ? 'text-emerald-400 bg-emerald-500/5' : 'text-rose-400 bg-rose-500/5'} px-3 py-1 rounded-lg border border-slate-800`}>
                        {scaleRevenue - scaleExpense} ريالاً
                      </span>
                    </div>
                  </div>
                )}

                {/* Illustration Type 11: Orange stand infographic */}
                {currentSlide.illustrationType === 'full_example' && (
                  <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl w-full space-y-3 font-mono text-xs select-none text-right">
                    <div className="flex justify-between items-center">
                      <span className="text-[#f97316] font-display font-bold">عصير برتقال طبيعي 🍊</span>
                      <span className="text-[10px] text-slate-500">موازنة اليوم</span>
                    </div>
                    <div className="space-y-1 bg-slate-950 p-2.5 rounded-lg border border-slate-900">
                      <div className="flex justify-between"><span>إنتاج:</span><span className="text-slate-300">15 كوب</span></div>
                      <div className="flex justify-between"><span>بيع بـ:</span><span className="text-slate-300">2 ريال للكوب</span></div>
                      <div className="flex justify-between"><span>عائدات:</span><span className="text-cyan-400 font-bold">30 ريال</span></div>
                      <div className="flex justify-between"><span>مصروف:</span><span className="text-rose-400">15 ريال</span></div>
                    </div>
                    <p className="text-[10px] text-emerald-400 font-bold text-center bg-emerald-500/5 p-1 rounded">
                      الربح لدفعة اليوم الأول: 15 ريالات
                    </p>
                  </div>
                )}

                {/* Illustration Type 12: Roadmap step visualizer */}
                {currentSlide.illustrationType === 'steps' && (
                  <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl w-full text-xs space-y-1.5 select-none text-right">
                    <div className="flex items-center gap-2"><span className="bg-amber-500 text-slate-950 w-5 h-5 flex items-center justify-center font-bold text-[10px] rounded-full">1</span> جمع رأس المال</div>
                    <div className="flex items-center gap-2"><span className="bg-amber-500 text-slate-950 w-5 h-5 flex items-center justify-center font-bold text-[10px] rounded-full">2</span> شراء الخامات الأساسية</div>
                    <div className="flex items-center gap-2"><span className="bg-amber-500 text-slate-950 w-5 h-5 flex items-center justify-center font-bold text-[10px] rounded-full">3</span> تجريب المنتج في منزلكم</div>
                    <div className="flex items-center gap-2 pt-1 border-t border-slate-800"><span className="bg-emerald-500 text-slate-950 w-5 h-5 flex items-center justify-center font-bold text-[10px] rounded-full">4</span> البدء بالبيع المنضبط والمدروس</div>
                  </div>
                )}

                {/* Illustration Type 13: Top tips alert */}
                {currentSlide.illustrationType === 'tips' && (
                  <div className="bg-amber-500/5 border border-amber-500/20 p-5 rounded-2xl w-full text-center space-y-3 select-none">
                    <span className="text-4xl block animate-bounce">💡</span>
                    <h5 className="font-bold text-xs text-amber-500 font-display">سر التجارة الناجحة:</h5>
                    <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                      ابدأ بكمية إنتاجية صغيرة للغاية لتضمن عدم ضياع أموالك وحصيلة أرباحك الصافية.
                    </p>
                  </div>
                )}

                {/* Illustration Type 14: Sandbox ledger */}
                {currentSlide.illustrationType === 'ledger' && (
                  <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl w-full space-y-1.5 text-[9px] font-mono select-none">
                    <div className="grid grid-cols-4 p-1 bg-slate-950 rounded text-slate-500 text-[8px] text-center">
                      <div>اليوم</div>
                      <div>الإيراد</div>
                      <div>المصروف</div>
                      <div>الربح</div>
                    </div>
                    <div className="grid grid-cols-4 p-1 bg-slate-950/20 rounded text-center">
                      <div className="text-slate-100">الأحد</div>
                      <div className="text-cyan-400">20 ريال</div>
                      <div className="text-slate-500">10 ريال</div>
                      <div className="text-emerald-400 font-bold">10 ريال</div>
                    </div>
                    <div className="grid grid-cols-4 p-1 bg-slate-950/20 rounded text-center">
                      <div className="text-slate-100">الاثنين</div>
                      <div className="text-cyan-400">30 ريال</div>
                      <div className="text-slate-500">15 ريال</div>
                      <div className="text-emerald-400 font-bold">15 ريال</div>
                    </div>
                  </div>
                )}

                {/* Illustration Type 15: Interactive Group Challenge Sandbox */}
                {currentSlide.illustrationType === 'challenge' && (
                  <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl w-full space-y-3 font-mono text-xs text-right">
                    <span className="text-[10px] text-slate-500 block">اضبط سعر السندويش لترى الربح المشترك:</span>
                    <div>
                      <input
                        type="range"
                        min={1.2}
                        max={5.0}
                        step={0.1}
                        value={sandwichPrice}
                        onChange={(e) => setSandwichPrice(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-950 appearance-none rounded-lg cursor-pointer accent-amber-500"
                      />
                    </div>
                    <div className="space-y-1 bg-slate-950 p-2.5 rounded-lg border border-slate-900 text-[10px]">
                      <div className="flex justify-between"><span>الإنتاج (رأس المال 20 ر.س):</span><span>20 سندويش</span></div>
                      <div className="flex justify-between"><span>سعر البيع الموصى به:</span><span>{sandwichPrice.toFixed(1)} ريال</span></div>
                      <div className="flex justify-between"><span>الإيرادات المتوقعة:</span><span className="text-cyan-400 font-bold">{(20 * sandwichPrice).toFixed(1)} ريال</span></div>
                      <div className="flex justify-between border-t border-slate-900 pt-1 text-emerald-400 font-bold">
                        <span>صافي أرباح الفريق:</span><span>{((20 * sandwichPrice) - 20).toFixed(1)} ريالاً</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Illustration Type 16: Zero-sum business templates */}
                {currentSlide.illustrationType === 'projects' && (
                  <div className="bg-slate-900/40 border border-slate-800 p-3 rounded-xl w-full text-[10px] space-y-1.5 select-none text-right">
                    <div className="p-2 bg-slate-950/50 rounded-lg flex justify-between">🌸 أساور يدوية <span className="text-emerald-400">+15 ر.س ارباح</span></div>
                    <div className="p-2 bg-slate-950/50 rounded-lg flex justify-between">📑 ملصقات دفاتر <span className="text-emerald-400">+20 ر.س ارباح</span></div>
                    <div className="p-2 bg-slate-950/50 rounded-lg flex justify-between">✏️ إعادة بيع أقلام للجملة <span className="text-emerald-400">+25 ر.س ارباح</span></div>
                  </div>
                )}

                {/* Illustration Type 17: Solutions matching dashboard */}
                {currentSlide.illustrationType === 'solutions' && (
                  <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl w-full text-center space-y-3 font-mono text-xs select-none">
                    <h5 className="font-bold text-[10px] text-slate-550 block">مفتاح مواجهة الصعاب الريادية:</h5>
                    <div className="p-3 bg-slate-950/70 border border-emerald-500/10 text-emerald-400 rounded-lg">
                      حسومات وعروض ⬅️ مبيعات أقوى
                    </div>
                    <p className="text-[9px] text-slate-500 leading-relaxed font-sans mt-1">
                      العقبات ليست عائقاً بل هي أولى سلم الصعود والتميز المعرفي والمهني.
                    </p>
                  </div>
                )}

                {/* Illustration Type 18: Homework planner board */}
                {currentSlide.illustrationType === 'homework' && (
                  <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl w-full text-right space-y-2 select-none">
                    <span className="text-[9px] text-slate-500 font-mono block">الواجب العملي المنزلي للطلاب:</span>
                    <ul className="space-y-1 text-xs text-slate-300">
                      <li>• اختر مشروع عصير أو أساور ملونة</li>
                      <li>• بَع 5 لإنعاش العائلة بالمأكولات اليومية</li>
                      <li>• دون الإيرادات والمصروفات بالجدول</li>
                    </ul>
                  </div>
                )}

                {/* Illustration Type 19: Complete launch cover */}
                {currentSlide.illustrationType === 'summary' && (
                  <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-5 rounded-2xl w-full text-center space-y-3 select-none animate-pulse">
                    <span className="text-4xl block">✨ 🚀 ✨</span>
                    <h5 className="font-extrabold text-sm text-amber-500 font-display">مستقبل زاهر بانتظارك!</h5>
                    <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                      ابدأ الآن بخطوات صغيرة وبحساب دقيق للأرقام المالية.
                    </p>
                  </div>
                )}

              </div>
            )}

          </div>

          {/* Slide Controlling Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-900">
            {/* Nav Arrows */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                className="p-3 bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-white rounded-2xl border border-slate-800 hover:border-slate-700 transition"
                title="الشريحة السابقة (السهم الأيمن)"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              
              <div className="font-mono text-xs text-slate-400 font-bold bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-900">
                الشريحة <b className="text-white">{currentSlideId}</b> / 20
              </div>

              <button
                onClick={handleNext}
                className="p-3 bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-white rounded-2xl border border-slate-800 hover:border-slate-700 transition"
                title="الشريحة التالية (السهم الأيسر أو زر المسافة)"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

            {/* Timed autoplay */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  isPlaying
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 animate-pulse'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" />
                    إيقاف مؤقت للتشغيل التلقائي
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    تشغيل الشرح التلقائي (أوتوبلاي)
                  </>
                )}
              </button>
              
              {isPlaying && (
                <select
                  value={intervalTime}
                  onChange={(e) => setIntervalTime(parseInt(e.target.value))}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-400 outline-none"
                >
                  <option value={3000}>3 ثواني</option>
                  <option value={5000}>5 ثواني</option>
                  <option value={10000}>10 ثواني</option>
                  <option value={15000}>15 ثانية</option>
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Collapsible Trainer Notes (ملاحظات المعلم المدرب التوضيحية) */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-4 border-b border-slate-800/60 pb-3">
            <h3 className="text-sm font-bold text-slate-200 font-display flex items-center gap-2">
              <BookOpen className="text-amber-500 w-5 h-5" />
              إضاءات وملاحظات مرجعية للمدرب الخاص بالورشة الدراسية (الشريحة {currentSlideId})
            </h3>
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="text-amber-500 hover:text-amber-400 text-xs font-bold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/10 transition"
            >
              {showNotes ? 'إخفاء التفاصيل' : 'إظهار التفاصيل'}
            </button>
          </div>

          {showNotes && (
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-4 font-sans text-right animate-fadeIn">
              {currentSlideId === 1 && (
                <p>
                  📌 <b>توصية البدء:</b> رحّب بالطلاب بحب وشغف! عرّفهم بنفسك وبيّن لهم مدى سهولة وجمال لغة ريادة الأعمال للنهوض بمستقبل الفرد ومجتمعه المالي. أكّد لهم أنهم في نهاية الساعة الحالية سيحدثون فارقًا حقيقيًا بتصميم أول تجربة تجارية لهم وعرض أفكارهم بفخر.
                </p>
              )}
              {currentSlideId === 2 && (
                <p>
                  📌 <b>توجيه الأهداف:</b> اقرأ الأهداف بلغة واضحة ونبرة واثقة، وأشر للطلاب بأن الموازنة والحساب ليست مخصصة لكبار المحاسبين والشركات العملاقة فقط، بل يستطيع ذو الـ 14 عاماً البدء بها والنجاح بأبسط الأدوات المنزلية المادية المتاحة.
                </p>
              )}
              {currentSlideId === 3 && (
                <p>
                  📌 <b>تأطير قصة أحمد:</b> اسأل الفصل: هل ترون أحمد عبقرياً غير اعتيادي؟ الجواب: لا، أحمد طفل متميز فكر وقرأ وبدأ بهدوء مع كوب ورق وتلوين صفي. سر نجاحه يكمن في البساطة والتنفيذ، وعدم المغامرة برأس مال ضخم! شجعهم على مناقشة جدوى الـ 70 ريالًا.
                </p>
              )}
              {currentSlideId === 4 && (
                <p>
                  📌 <b>تطوير فكرة الطالب:</b> اطلب من الطلاب أخذ ورقة بيضاء الآن، وكتابة هواية واحدة يتقنونها ومحاولة إقرانها بمنتج يلبي رغبة حقيقية أو مشكلة تواجه زملائهم خلال الأسبوع الدراسي (مثلاً بيع ملصقات لافتة لغلاف الحاسوب).
                </p>
              )}
              {currentSlideId === 5 && (
                <p>
                  📌 <b>شرح دراسة العملاء:</b> اشرح للطلاب فكرة استطلاع الآراء. "قبل أن تشتري الخيوط أو تصنع الكب كيك لتجهيز 50 قطعة، اسأل 5 أشخاص عن السعر المقبول". يعلّمهم ذلك ألا يضعوا رأسمالهم في منتجات لا تعجب رفاقهم.
                </p>
              )}
              {currentSlideId === 6 && (
                <p>
                  📌 <b>صياغة رأسمال الدفعة:</b> ادعُ الطلاب لتعداد القطع والمكونات. وضّح لهم أن الشاي والسكر يشترى بـ 10 ريالات ويصنف رأسمال، بينما الماء المنزلي لا يحسب تكلفة هدر، وعلّمهم تصنيف وتتبع الأسعار لتفادي المفاجآت التضخمية.
                </p>
              )}
              {currentSlideId === 7 && (
                <p>
                  📌 <b>آلية التسعير وعمل هامش الربح:</b> فسر المعادلة بلغة واضحة: "لا تبيع بأقل من سعر التكلفة". إن كلفة الكوب البلاستيكي والليموني 1.5 ريال، وقررت بيعه بـ 2.5 ريال لتكسب 1 ريال كامل. هذا الريال هو ما يضمن لك مكافأة تعبك وشراء مخزون أفضل للغد.
                </p>
              )}
              {currentSlideId === 8 && (
                <p>
                  📌 <b>أمثلة تسعير ريادي الغد:</b> استعرض الجدول مع الطلاب، وناقشهم في حجم التكاليف البسيطة وسعر البيع الذي يراه الجميع في متناول مصروفهم اليومي. بيّن لهم ملاءمة هذه الأرقام لدعم القدرة الشرائية في مجتمعهم المدرسي.
                </p>
              )}
              {currentSlideId === 9 && (
                <p>
                  📌 <b>فهم الإيراد العام:</b> أكّد لهم أن الدرّج الذي يجمع المال لا يمثل الربح الصافي. "إذا جمعت 40 ريالاً فذلك يسمى الإيراد الإجمالي للبيع بالكامل وليس الفوائض". اطلب منهم ترديد المعادلة لتطبيقها في الذهن.
                </p>
              )}
              {currentSlideId === 10 && (
                <p>
                  📌 <b>تثبيت المصروف:</b> وضّح قيمة المصاريف المترتبة على إنتاج الـ 20 قطعة. ركّز في هذه الشريحة على تبيان أن أي قطعة خربت أو تلفت أثناء الإعداد هي مصروف وتكسب موازنة ويجب احتسابها بدقة لتجنب التعثر.
                </p>
              )}
              {currentSlideId === 11 && (
                <p>
                  📌 <b>التوازن بين الإيراد والمصروف:</b> اجعل الطلاب يشاهدون تدوير ميزان الربح والخسارة. "الربح هو الفرق الإيجابي". واطرح عليهم تساؤلاً ذهنياً مفاجئاً: "ماذا لو كانت مصروفاتنا لطباعة الدفتر 35 ريالاً وبعنا بـ 30 فقط؟ كم الخسارة؟" (الجواب: خسارة 5 ريالات!).
                </p>
              )}
              {currentSlideId === 12 && (
                <p>
                  📌 <b>تفصيل موازنة البرتغال المنعش:</b> اطلب من أحد الطلاب قراءة الجدول وموازنة البرتقال. ناقشهم في أن الربح المتكرر لثلاثة أيام وقيمته 45 ريالاً يكفل لهم استعادة كامل موازنة رأس المال الأولية مع الاحتفاظ بفائض مالي حقيقي واعد.
                </p>
              )}
              {currentSlideId === 13 && (
                <p>
                  📌 <b>تطبيق خارطة الطريق:</b> عرّفهم بكيفية أخذ خطوات ملموسة. اطلب منهم الاستعانة بدعم الوالدين للحصول على أولى قروض البدء الرمزية أو تفضيل شراء الخامات بصورة مشتركة لتلافي أي عقبة في التجهير الحقيقي للمشروع.
                </p>
              )}
              {currentSlideId === 14 && (
                <p>
                  📌 <b>توجيهات وملاحظات الحماية للطلاب:</b> اشرح لهم بحرص: "التدوين اليومي للديون والحسابات يقوي الثقة وصدق النوايا في التجارة". وعلّمهم أن سؤال العميل الرافض هو أهم فرصة لتطوير المنتجات وليس مصدراً مسبباً للضيق.
                </p>
              )}
              {currentSlideId === 15 && (
                <p>
                  📌 <b>استخدام دفتر الحسابات اليومي:</b> اعرض ومثّل لهم بالنقاش حول تدوير وتدوين الإيراد يومي الأحد والاثنين. اطلب منهم استخلاص النضج الحسابي الحقيقي وأهمية ترتيب الإيراد لمعرفة مصادر نمو الفوائض المالية للمشروع.
                </p>
              )}
              {currentSlideId === 16 && (
                <p>
                  📌 <b>إدارة النشاط الجماعي (10 دقائق):</b> قسّم قاعة الورشة أو الطلاب لمجموعات ثنائية أو مصفوفة من 4 طلاب. اجعلهم يجيبون على مستويات الإنتاج والتسعير المقترحة لسندويش الجبن وعرض نتيجتهم بالنقاش لتقوية الحوار والقدرات.
                </p>
              )}
              {currentSlideId === 17 && (
                <p>
                  📌 <b>تقديم فرص المشاريع الجاهزة:</b> عرّفهم بالفرص اللطيفة المرشحة لبدء نشاط صفي فوري بأساور وخيوط ملونة أو طباعة ملصقات الرموز. هذه أفكار مجربة وثبت مواءمتها المادية والمجتمعية لكل الأطفال بعمر 14 عاماً.
                </p>
              )}
              {currentSlideId === 18 && (
                <p>
                  📌 <b>تأطير ومواجهة التحديات:</b> وجّه نظرهم بالقول: "رائد الأعمال الحقيقي يصنع الحلول". اسألهم عن طريقتهم المفضلة لمجابهة المنافسة وتلافي تلف الفاكهة كعصير واحتوائهم بمواد مقاومة ومرنة لا تخضع للتلف.
                </p>
              )}
              {currentSlideId === 19 && (
                <p>
                  📌 <b>تفعيل تطبيق المهمة المنزلية:</b> رغبهم في تنفيذ الواجب بالتنسيق الأسري، واقترح توزيع نموذج التسجيل المبسط ليدونوا به نجاح مبيعاتهم الأولية ويكتبوا عليه بزهو وفخر أكبر درس تجاري واستثمار مالي تعلموه.
                </p>
              )}
              {currentSlideId === 20 && (
                <p>
                  📌 <b>خاتمة خلاقة وشكر:</b> بادر بشكر الطلاب بحفاوة وإكبار لمستوياتهم الواعدة. أشر إلى روعة الفكر واطلب منهم دائماً المضي في الابتكار، وذكّرهم بالمعاملة الشرفية التي تضمن ازدهار وطنهم في شتى جوانب ومفاصل الاقتصاد المستدام.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
