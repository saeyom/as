import React, { useState } from 'react';
import { MaterialCostItem, StudentProject, DailyLedgerRecord, SimulationResult } from '../types';
import { ShoppingBag, Landmark, Plus, Trash2, Sliders, Users, Play, Coins, Award, RefreshCw, BarChart2, Briefcase, FileText } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';

const DEFAULT_IDEAS = [
  {
    id: 'cups',
    name: 'أكواب ورقية مصممة يدوياً 🎨',
    category: 'فنون وأشغال يدوية',
    minCapital: 15,
    suggestedPrice: 2,
    defaultMaterials: [
      { id: '1', name: 'علبة أكواب كرتونية (50 كوب)', cost: 15 },
      { id: '2', name: 'ألوان وقلم تحديد مقاوم للماء', cost: 10 }
    ],
    vPrice: 2,
    vInterest: 4
  },
  {
    id: 'bracelets',
    name: 'أساور خيطية ملونة مخصصة 🧵',
    category: 'إكسسوارات',
    minCapital: 5,
    suggestedPrice: 1.5,
    defaultMaterials: [
      { id: '1', name: 'خيوط صوفية ملونة ممتازة', cost: 5 },
      { id: '2', name: 'خرز وحبيبات ملونة مزخرفة', cost: 3 }
    ],
    vPrice: 1.5,
    vInterest: 3
  },
  {
    id: 'juice',
    name: 'أكياس عصير ليمون ونعناع مثلج 🍋',
    category: 'أغذية ومشروبات',
    minCapital: 10,
    suggestedPrice: 2.5,
    defaultMaterials: [
      { id: '1', name: 'ليمون طازج ونعناع أخضر', cost: 7 },
      { id: '2', name: 'كيلو سكر طبيعي', cost: 3 },
      { id: '3', name: 'أكواب بلاستيكية صحية صديقة للبيئة', cost: 4 }
    ],
    vPrice: 2.5,
    vInterest: 5
  },
  {
    id: 'stickers',
    name: 'ملصقات (استيكرز) للدفاتر والحواسيب 💻',
    category: 'مطبوعات',
    minCapital: 20,
    suggestedPrice: 1,
    defaultMaterials: [
      { id: '1', name: 'أوراق لواصق لامعة مخصصة للطباعة', cost: 12 },
      { id: '2', name: 'طباعة ليزرية ملونة بمكتبة الحي', cost: 10 }
    ],
    vPrice: 1,
    vInterest: 5
  }
];

const MARKET_EVENTS = [
  { day: 1, text: "اليوم غائم وهادئ في المدرسة، الحركة اعتيادية ولكن الأصدقاء متحمسون لاستكشاف فكرتك الجديدة!", multiplier: 1.0, type: 'neutral' },
  { day: 2, text: "أحد معلمي المدرسة يمر بجانب ركنك، ويعجبه ذكاؤك الريادي فيشتري 5 قطع دفعة واحدة ليهديها للطلاب المتفوقين! 🎉", multiplier: 1.8, type: 'positive' },
  { day: 3, text: "يوم الصيف الحار! إن كان مشروعك عصيرًا منعشًا فسيتهافتون عليك، وإن كان ملصقات فالحركة متوسطة لكنك تبتكر عرض خاص.", multiplier: 1.2, type: 'neutral' },
  { day: 4, text: "ركن آخر منافس يعرض منتجات مشابهة بسعر منخفض جداً! يقرر فريقك المضي قدماً بابتكار جودة أعلى واستقطاب زبائن عبر الكلام الطيب.", multiplier: 0.8, type: 'negative' },
  { day: 5, text: "اليوم الختامي للبازار المدرسي! فرصة كبرى لتخفيض السعر قليلاً لبيع كافة البضاعة المتبقية والحصول على إيراد كامل تصفية للمتجر. 🚀", multiplier: 1.5, type: 'positive' }
];

export default function EntrepreneurSandbox() {
  const [activeTab, setActiveTab] = useState<'brainstorm' | 'capital' | 'pricing' | 'simulator' | 'results'>('brainstorm');
  const [selectedIdeaId, setSelectedIdeaId] = useState('cups');
  const [customIdeaName, setCustomIdeaName] = useState('');
  const [customCategory, setCustomCategory] = useState('مشروع عام');
  
  // Dynamic State for project costs
  const [materials, setMaterials] = useState<MaterialCostItem[]>(DEFAULT_IDEAS[0].defaultMaterials);
  const [newMaterialName, setNewMaterialName] = useState('');
  const [newMaterialCost, setNewMaterialCost] = useState('');

  // Sizing quantities
  const [batchQuantity, setBatchQuantity] = useState<number>(20);
  const [sellingPrice, setSellingPrice] = useState<number>(2);

  // Survey responses
  const [customerInterest, setCustomerInterest] = useState<number>(4); // how many out of 5 people said yes
  const [customerProposedPrice, setCustomerProposedPrice] = useState<number>(2);

  // Simulation output logs
  const [simResults, setSimResults] = useState<SimulationResult[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [cumulativeBalance, setCumulativeBalance] = useState<number>(0);

  // Handle Idea changes
  const handleSelectIdeaId = (id: string) => {
    setSelectedIdeaId(id);
    const idea = DEFAULT_IDEAS.find(x => x.id === id);
    if (idea) {
      setCustomIdeaName('');
      setMaterials(idea.defaultMaterials);
      setSellingPrice(idea.suggestedPrice);
      setCustomerInterest(idea.vInterest);
      setCustomerProposedPrice(idea.vPrice);
    }
  };

  const handleAddMaterial = () => {
    if (!newMaterialName || !newMaterialCost) return;
    const item: MaterialCostItem = {
      id: Date.now().toString(),
      name: newMaterialName,
      cost: parseFloat(newMaterialCost) || 0
    };
    setMaterials([...materials, item]);
    setNewMaterialName('');
    setNewMaterialCost('');
  };

  const handleRemoveMaterial = (id: string) => {
    setMaterials(materials.filter(m => m.id !== id));
  };

  // Capital calculations
  const totalCapitalCost = materials.reduce((sum, item) => sum + item.cost, 0);
  const costPerUnit = batchQuantity > 0 ? parseFloat((totalCapitalCost / batchQuantity).toFixed(2)) : 0;
  const unitProfitMargin = parseFloat((sellingPrice - costPerUnit).toFixed(2));
  const profitMarginPercentage = sellingPrice > 0 ? parseFloat(((unitProfitMargin / sellingPrice) * 100).toFixed(1)) : 0;

  // Run 5 day simulation
  const runSimulation = () => {
    setIsSimulating(true);
    const results: SimulationResult[] = [];
    let currentBalance = 0; // Starts from initial capital investment
    
    // Simulate day by day
    for (let i = 0; i < 5; i++) {
      const event = MARKET_EVENTS[i];
      // Base demand calculation based on customer interest and price alignment
      const priceRatio = customerProposedPrice > 0 ? sellingPrice / customerProposedPrice : 1;
      let baseDemand = Math.round((batchQuantity / 5) * (customerInterest / 5));
      
      // Price elasticity factor: If price is much higher than customer feedback, demand drops
      if (priceRatio > 1.5) baseDemand = Math.max(1, Math.round(baseDemand * 0.4));
      else if (priceRatio > 1.2) baseDemand = Math.max(1, Math.round(baseDemand * 0.7));
      else if (priceRatio < 0.9) baseDemand = Math.min(batchQuantity / 3, Math.round(baseDemand * 1.3));

      // Apply day specific multiplier matching market event
      let finalSold = Math.round(baseDemand * event.multiplier);
      // Constraints
      if (finalSold < 1) finalSold = 1;
      // Cap at remaining inventory context
      const currentSimulatedInventory = Math.max(1, Math.round(batchQuantity / 5));
      if (finalSold > currentSimulatedInventory * 1.5) finalSold = Math.round(currentSimulatedInventory * 1.5);

      const dailyRevenue = finalSold * sellingPrice;
      const dailyCost = finalSold * costPerUnit;
      const dailyProfit = dailyRevenue - dailyCost;
      currentBalance += dailyProfit;

      results.push({
        day: event.day,
        event: event.text,
        eventType: event.type as any,
        soldUnits: finalSold,
        pricePerUnit: sellingPrice,
        revenue: parseFloat(dailyRevenue.toFixed(1)),
        expenses: parseFloat(dailyCost.toFixed(1)),
        profit: parseFloat(dailyProfit.toFixed(1)),
        balanceAfter: parseFloat(currentBalance.toFixed(1))
      });
    }

    setSimResults(results);
    setCumulativeBalance(parseFloat(currentBalance.toFixed(1)));
    setTimeout(() => {
      setIsSimulating(false);
      setActiveTab('results');
    }, 1500); // 1.5s delay for realistic simulation experience
  };

  // Chart values
  const getPricingChartData = () => {
    const data = [];
    // Calculate potential total profit/loss for a spectrum of prices
    const prices = [costPerUnit * 0.5, costPerUnit * 0.8, costPerUnit, costPerUnit * 1.2, costPerUnit * 1.5, costPerUnit * 2.0, costPerUnit * 3.0];
    const sortedPrices = Array.from(new Set(prices)).sort((a,b) => a-b);
    
    for (const p of sortedPrices) {
      if (p <= 0) continue;
      // Demand decreases as price increases
      let interestFactor = 1.0;
      if (p > costPerUnit * 2.0) interestFactor = 0.3;
      else if (p > costPerUnit * 1.5) interestFactor = 0.6;
      else if (p > costPerUnit * 1.0) interestFactor = 0.9;
      else interestFactor = 1.2;

      const estimatedUnits = Math.round(batchQuantity * interestFactor * (customerInterest / 5));
      const estRev = estimatedUnits * p;
      const estCost = estimatedUnits * costPerUnit;
      const estProfit = estRev - estCost;

      data.push({
        price: parseFloat(p.toFixed(2)),
        'عائدات مفترضة (ريال)': parseFloat(estRev.toFixed(1)),
        'تكلفه الإجمالية (ريال)': parseFloat(estCost.toFixed(1)),
        'الأرباح الصافية المتوقعة': parseFloat(estProfit.toFixed(1)),
      });
    }
    return data;
  };

  const getDayChartData = () => {
    return simResults.map(res => ({
      name: `يوم ${res.day}`,
      'الإيرادات اليومية': res.revenue,
      'المصروفات': res.expenses,
      'صافي الربح': res.profit
    }));
  };

  const getCumulativeBalanceData = () => {
    const data = [{ name: 'البداية', 'رصيد الفوائض الإجمالي': 0 }];
    let acc = 0;
    simResults.forEach(res => {
      acc += res.profit;
      data.push({
        name: `يوم ${res.day}`,
        'رصيد الفوائض الإجمالي': parseFloat(acc.toFixed(1))
      });
    });
    return data;
  };

  return (
    <div id="entrepreneur-sandbox-section" className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Tab bar header */}
      <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex flex-wrap justify-between items-center gap-4">
        <div>
          <span className="bg-amber-500/10 text-amber-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider block w-fit mb-1">
            مختبر ريادي الغد
          </span>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <Coins className="text-amber-500 w-5 h-5" />
            تطبيق محاكي المشاريع الافتراضي للطلاب
          </h2>
        </div>

        {/* Navigation tabs */}
        <div className="flex flex-wrap gap-1">
          {[
            { id: 'brainstorm', label: '1. شغف وهوايات', icon: ShoppingBag },
            { id: 'capital', label: '2. رأسمال الدفعة', icon: Landmark },
            { id: 'pricing', label: '3. مؤشر التسعير', icon: Sliders },
            { id: 'simulator', label: '4. محاكي الـ 5 أيام', icon: Play },
            { id: 'results', label: '5. التقارير المالية', icon: BarChart2 }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6 sm:p-8">
        
        {/* Tab 1: Brainstorm */}
        {activeTab === 'brainstorm' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-800/80">
              <h3 className="text-lg font-bold font-display text-amber-400 mb-2">الخطوة 1: حدد الهواية ونوع المنتج</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                ابدأ باختيار أحد النماذج المدرسية الجاهزة بالأسفل لتجربتها، أو اصنع فكرة مشروع خاصة بك مميزة لتطبيق كافة حسابات ودراسة الجدوى الفورية عليها!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {DEFAULT_IDEAS.map((idea) => (
                <button
                  key={idea.id}
                  onClick={() => handleSelectIdeaId(idea.id)}
                  className={`p-5 rounded-2xl border text-right transition flex flex-col justify-between h-44 group ${
                    selectedIdeaId === idea.id && !customIdeaName
                      ? 'border-amber-500 bg-amber-500/5 shadow-lg shadow-amber-500/5'
                      : 'border-slate-800 bg-slate-900/40 hover:border-slate-700/80'
                  }`}
                >
                  <div>
                    <span className="text-xs text-slate-500 font-bold block mb-1">{idea.category}</span>
                    <h4 className="font-bold text-slate-100 font-display group-hover:text-amber-400 transition">{idea.name}</h4>
                  </div>
                  <div className="flex justify-between items-center w-full pt-4 border-t border-slate-800/60 text-xs">
                    <span className="text-slate-400">رأسمال مقترح: <b className="text-slate-100">{idea.minCapital} ر.س</b></span>
                    <span className="text-amber-500 font-semibold">تصفح البدء ←</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-slate-950/40 p-6 rounded-2xl border border-slate-800/80 space-y-4">
              <h4 className="text-sm font-bold text-slate-300">أو ابتكر فكرتك المخصصة هنا:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-2">اسم الفكرة المبتكرة:</label>
                  <input
                    type="text"
                    value={customIdeaName}
                    onChange={(e) => {
                      setCustomIdeaName(e.target.value);
                      setSelectedIdeaId('');
                    }}
                    placeholder="مثال: بيع كيك العسل، تصميم بروشات السترة"
                    className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-3 text-slate-200 outline-none text-sm font-semibold transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-2">القسم / التصنيف الدراسي:</label>
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="مثال: مخبوزات لذيذة، مصنوعات صيفية"
                    className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-3 text-slate-200 outline-none text-sm font-semibold transition"
                  />
                </div>
              </div>
            </div>

            {/* Next Action */}
            <div className="flex justify-end pt-4">
              <button
                onClick={() => setActiveTab('capital')}
                className="bg-amber-500 text-slate-950 font-bold px-6 py-3 rounded-xl hover:opacity-90 transition flex items-center gap-1.5 shadow-md shadow-amber-500/10 text-sm"
              >
                الخطوة التالية: موازنة رأس المال المطلوب
                <Play className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Capital Budgeting */}
        {activeTab === 'capital' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-800/80">
              <h3 className="text-lg font-bold font-display text-amber-400 mb-2">الخطوة 2: موازنة رأس المال ومكونات الدفعة الأولى</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                اضبط كمية الوحدات التي تريد تصنيعها دفعة واحدة كتاجر واعد، ومن ثم أضف أو احذف الخامات المباشرة لتشاهد انعكاس الإجمالي وعلاقة ذلك بتكلفة إنتاج الكوب أو السوار الواحد!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Material cost builder */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-200 text-sm">بنود الخامات المدخلة حالياً:</h4>
                  <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full font-mono">
                    {materials.length} عناصر
                  </span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {materials.map((m) => (
                    <div key={m.id} className="flex justify-between items-center bg-slate-900/60 px-4 py-3.5 rounded-xl border border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-semibold text-slate-300">{m.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-slate-100 font-mono">{m.cost} ريالاً</span>
                        <button
                          onClick={() => handleRemoveMaterial(m.id)}
                          className="text-red-500/75 hover:text-red-400 hover:bg-red-500/5 p-1 rounded-lg transition"
                          title="حذف المصروف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {materials.length === 0 && (
                    <div className="text-center py-8 text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                      لا توجد مدفوعات مضافة بعد. أضف بعض الخامات لصناعة الدفعة الأولى!
                    </div>
                  )}
                </div>

                {/* Add new expense */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-2">
                  <input
                    type="text"
                    value={newMaterialName}
                    onChange={(e) => setNewMaterialName(e.target.value)}
                    placeholder="اسم قطعة الخامة (مثال: برتقال نقي)"
                    className="sm:col-span-6 bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-3 text-slate-300 outline-none text-xs font-semibold transition"
                  />
                  <input
                    type="number"
                    value={newMaterialCost}
                    onChange={(e) => setNewMaterialCost(e.target.value)}
                    placeholder="السعر بالريال"
                    className="sm:col-span-4 bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-3 text-slate-300 outline-none text-xs font-semibold font-mono transition"
                  />
                  <button
                    onClick={handleAddMaterial}
                    className="sm:col-span-2 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-amber-500 hover:text-amber-400 font-semibold rounded-xl flex items-center justify-center transition"
                  >
                    <Plus className="w-5 h-5 ml-1" />
                    أضف
                  </button>
                </div>
              </div>

              {/* Summary outputs and sliders */}
              <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-6 h-fit space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 flex justify-between mb-2">
                    <span>كمية إنتاج الدفعة الأولى:</span>
                    <span className="text-amber-400 font-mono font-bold text-sm">{batchQuantity} وحدة</span>
                  </label>
                  <input
                    type="range"
                    min={5}
                    max={100}
                    step={5}
                    value={batchQuantity}
                    onChange={(e) => setBatchQuantity(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">ابدأ بكمية صغيرة مثل 15-20 وحدة لتقليل المخاطر.</p>
                </div>

                <div className="border-t border-slate-800 pt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">إجمالي رأس المال الأساسي:</span>
                    <span className="text-base font-bold text-amber-400 font-mono">{totalCapitalCost.toFixed(1)} ريال</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-900">
                    <span className="text-xs text-slate-300 font-semibold mb-1">تكلفة تصنيع الحبة الواحدة:</span>
                    <span className="text-lg font-black text-rose-400 font-mono bg-rose-500/5 px-2.5 py-1 rounded-lg border border-rose-500/10">
                      {costPerUnit} ريالاً
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between pt-6 border-t border-slate-800/60">
              <button
                onClick={() => setActiveTab('brainstorm')}
                className="text-slate-400 hover:text-white font-semibold flex items-center gap-1.5 text-sm"
              >
                السابق
              </button>
              <button
                onClick={() => setActiveTab('pricing')}
                className="bg-amber-500 text-slate-950 font-bold px-6 py-3 rounded-xl hover:opacity-90 transition flex items-center gap-1.5 shadow-md shadow-amber-500/10 text-sm"
              >
                الخطوة الثالثة: آليات التسعير والربحية
                <Play className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Sizing and Pricing optimization */}
        {activeTab === 'pricing' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-800/80">
              <h3 className="text-lg font-bold font-display text-amber-400 mb-2">الخطوة 3: تحديد السعر الأمثل ودراسة العميل لضمان الفوائض</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                قاعدة ريادي الغد: <b>سعر البيع = سعر التكلفة للقطعة + هامش ربحك</b>. حرك المنزلق بالأسفل لتقييم هامش الربح الذي تبتغيه، وشاهد توقعات العائد المستدام ومنحنى الأرباح الإجمالي!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Sliders and feedback inputs */}
              <div className="space-y-6">
                <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-5 space-y-6">
                  <h4 className="font-bold text-slate-200 text-sm">أدوات ضبط ومحاكاة التسعير:</h4>

                  {/* Profit slider */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-400">سعر البيع النهائي للحبة:</label>
                      <span className="text-amber-400 font-bold font-mono text-base">{sellingPrice.toFixed(2)} ر.س</span>
                    </div>
                    <input
                      type="range"
                      min={parseFloat((costPerUnit * 1.1).toFixed(2)) || 0.5}
                      max={Math.max(10, costPerUnit * 5)}
                      step={0.5}
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>

                  {/* Customer feedback simulation inputs */}
                  <div className="border-t border-slate-900 pt-5 space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 flex justify-between mb-2">
                        <span>اهتمام زملائك بالاستطلاع (5 أشخاص):</span>
                        <span className="text-amber-500 font-mono font-black">{customerInterest} مهتمين</span>
                      </label>
                      <input
                        type="range"
                        min={1}
                        max={5}
                        step={1}
                        value={customerInterest}
                        onChange={(e) => setCustomerInterest(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-400 flex justify-between mb-2">
                        <span>السعر المقترح من استطلاع الطلاب:</span>
                        <span className="text-cyan-400 font-bold font-mono text-sm">{customerProposedPrice.toFixed(2)} ر.س</span>
                      </label>
                      <input
                        type="range"
                        min={0.5}
                        max={10}
                        step={0.5}
                        value={customerProposedPrice}
                        onChange={(e) => setCustomerProposedPrice(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing Summary card */}
                <div className="bg-slate-950/30 border border-slate-800/80 rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>تكلفة إنتاج الوحدة الواحدة:</span>
                    <span className="font-mono text-slate-200">{costPerUnit} ريال</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>هامش بربحك الصافي للقطعة:</span>
                    <span className={`font-mono font-bold ${unitProfitMargin > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {unitProfitMargin} ريال
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 border-t border-slate-900 pt-2">
                    <span>نسبة الربح من الهامش:</span>
                    <span className="font-mono text-amber-500 font-extrabold">{profitMarginPercentage}%</span>
                  </div>
                </div>
              </div>

              {/* Graphical rendering */}
              <div className="lg:col-span-2 bg-slate-950/50 border border-slate-850 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-300 text-sm flex items-center gap-1.5 mb-1">
                    <BarChart2 className="w-4 h-4 text-amber-500" />
                    منحنى الربحية ومعدلات الإيراد المفترضة
                  </h4>
                  <p className="text-[10px] text-slate-500 mb-4">
                    يوضح المخطط نمو وتغير الأرباح الصافية المتوقعة وتكاليف الإنتاج كلما تغير سعر البيع لدفعة الـ {batchQuantity} قطعة كاملة.
                  </p>
                </div>

                <div className="h-64 select-none">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={getPricingChartData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="price" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }} />
                      <Legend fontSize={11} />
                      <Area type="monotone" dataKey="الأرباح الصافية المتوقعة" stroke="#10b981" fillOpacity={1} fill="url(#colorProfit)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between pt-6 border-t border-slate-800/60 font-sans">
              <button
                onClick={() => setActiveTab('capital')}
                className="text-slate-400 hover:text-white font-semibold flex items-center gap-1.5 text-sm"
              >
                السابق
              </button>
              <button
                onClick={() => setActiveTab('simulator')}
                className="bg-amber-500 text-slate-950 font-bold px-6 py-3 rounded-xl hover:opacity-90 transition flex items-center gap-1.5 shadow-md shadow-amber-500/10 text-sm"
              >
                الخطوة الرابعة: بدء محاكي مبيعات البازار
                <Play className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: 5-Day School Booth Simulator */}
        {activeTab === 'simulator' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-800/80">
              <h3 className="text-lg font-bold font-display text-amber-400 mb-2">الخطوة 4: تشغيل ومعاصرة السوق بمحاكي الـ 5 أيام</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                ستخوض تجربة حية تمتد لـ 5 أيام في بازار المدرسة الافتراضي. ستواجه أحداثًا طارئة ومفارقات في السوق تؤثر على الإقبال وحجم المبيعات الفعلي، تماماً كما يحدث مع كبار المستثمرين!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-6">
              {/* Left explanation info */}
              <div className="space-y-4">
                <div className="border border-slate-800 bg-slate-950/20 p-5 rounded-2xl space-y-4">
                  <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                    <Award className="text-amber-500 w-5 h-5" />
                    تفاصيل ومحددات مشروعك المسجل:
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                    <li>اسم النشاط القائم: <b className="text-slate-100">{customIdeaName || DEFAULT_IDEAS.find(x => x.id === selectedIdeaId)?.name}</b></li>
                    <li>إجمالي الدفعة المصممة: <b className="text-slate-100">{batchQuantity} وحدة</b></li>
                    <li>سعر بيع الحبة الموصى به: <b className="text-slate-100">{sellingPrice} ريال</b></li>
                    <li>تكلفة التصنيع المباشرة: <b className="text-amber-500">{costPerUnit} ر.س</b></li>
                  </ul>
                </div>

                <div className="text-xs text-slate-500">
                  * يقوم محاكي ريادي الغد بموازنة مستويات طلب الطلاب وسعر منتجك مقابل اهتمام العينة الحقيقية وتغييرات المنافسين في الحرم الدراسي لتوليد سيناريو دقيق وممتع.
                </div>
              </div>

              {/* Run simulation engine */}
              <div className="flex flex-col items-center justify-center p-8 bg-slate-950/40 border border-slate-850 rounded-2xl text-center">
                {isSimulating ? (
                  <div className="space-y-4 text-center py-8">
                    <RefreshCw className="w-12 h-12 text-amber-500 animate-spin mx-auto" />
                    <h4 className="text-base font-bold text-white font-display">جاري توليد محاكاة البازار المدرسي...</h4>
                    <p className="text-xs text-slate-400 font-sans">تجهيز الزبائن وحساب حركة المبيعات تحت تأثير الأحداث العشوائية</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-amber-500/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto text-amber-500">
                      <Briefcase className="w-10 h-10" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-200">استعد لإطلاق المتجر الآن!</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm">
                        سيقوم المحاكي بتصفيف الأرقام وبث الحياة في مشروعك وإعداد دفتر الحسابات النهائي الخاص بك.
                      </p>
                    </div>
                    <button
                      onClick={runSimulation}
                      className="bg-amber-500 text-slate-950 font-bold px-8 py-3.5 rounded-xl hover:opacity-90 hover:scale-105 transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 text-sm mx-auto"
                    >
                      بث ومحاكاة المبيعات الآن 👋
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between pt-6 border-t border-slate-800/60">
              <button
                onClick={() => setActiveTab('pricing')}
                className="text-slate-400 hover:text-white font-semibold flex items-center gap-1.5 text-sm"
              >
                السابق
              </button>
            </div>
          </div>
        )}

        {/* Tab 5: Results & ledger reports */}
        {activeTab === 'results' && (
          <div className="space-y-8 animate-fadeIn">
            {simResults.length === 0 ? (
              <div className="text-center py-12 bg-slate-950/20 border border-slate-800/80 rounded-2xl">
                <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h4 className="font-bold text-slate-400 text-sm">لم تقم بمحاكاة المبيعات بعد!</h4>
                <p className="text-xs text-slate-500 mt-1">يرجى تشغيل محاكي الـ 5 أيام في الخطوة السابقة أولاً لتصفح جداول الأرباح.</p>
                <button
                  onClick={() => setActiveTab('simulator')}
                  className="mt-4 bg-amber-500 text-slate-950 font-semibold px-5 py-2 rounded-xl text-xs hover:opacity-90"
                >
                  الذهاب للمحاكي
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Result header cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-950/40 border border-slate-800 p-5 rounded-2xl">
                    <span className="text-xs text-slate-500 block">إجمالي الوحدات المنتجة:</span>
                    <span className="text-xl font-bold text-slate-200 font-mono mt-1 block">{batchQuantity} حبة</span>
                  </div>
                  <div className="bg-slate-950/40 border border-slate-800 p-5 rounded-2xl">
                    <span className="text-xs text-slate-500 block">مجموع الوحدات المباعة فعليًا:</span>
                    <span className="text-xl font-bold text-cyan-400 font-mono mt-1 block">
                      {simResults.reduce((sum, r) => sum + r.soldUnits, 0)} حبة
                    </span>
                  </div>
                  <div className="bg-slate-950/40 border border-slate-800 p-5 rounded-2xl">
                    <span className="text-xs text-slate-500 block">مجموع الإيرادات المحققة:</span>
                    <span className="text-xl font-bold text-amber-500 font-mono mt-1 block">
                      {simResults.reduce((sum, r) => sum + r.revenue, 0).toFixed(1)} ريالًا
                    </span>
                  </div>
                  <div className="bg-slate-950/40 border-amber-500/30 bg-amber-500/5 p-5 rounded-2xl border">
                    <span className="text-xs text-amber-500 font-bold block">صافي الفوائض والأرباح الكلية:</span>
                    <span className={`text-2xl font-black font-mono mt-1 block ${cumulativeBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {cumulativeBalance} ر.س
                    </span>
                  </div>
                </div>

                {/* Ledger ledger block (Match slide 15!) */}
                <div className="space-y-4">
                  <h3 className="text-md font-bold text-slate-200 font-display flex items-center gap-2">
                    <FileText className="text-amber-500 w-5 h-5" />
                    دفتر الحسابات اليومي للمشروع (مطابق لنموذج الشريحة 15)
                  </h3>

                  <div className="border border-slate-800 rounded-2xl overflow-hidden select-none">
                    <div className="overflow-x-auto">
                      <table className="w-full text-right border-collapse">
                        <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 text-xs">
                          <tr>
                            <th className="p-4">اليوم</th>
                            <th className="p-4">المنتج والنشاط الصفي</th>
                            <th className="p-4">الأحداث والبيئة التسويقية</th>
                            <th className="p-4 text-cyan-400">الإيرادات اليومية</th>
                            <th className="p-4 text-rose-400">المصروفات اليومية</th>
                            <th className="p-4 text-emerald-400">صافي الأرباح اليومية</th>
                          </tr>
                        </thead>
                        <tbody className="text-xs text-slate-300 divide-y divide-slate-800/60">
                          {simResults.map((row) => (
                            <tr key={row.day} className="hover:bg-slate-900/40 transition">
                              <td className="p-4 font-bold text-slate-200">يوم {row.day}</td>
                              <td className="p-4">{customIdeaName || DEFAULT_IDEAS.find(x => x.id === selectedIdeaId)?.name}</td>
                              <td className="p-4 text-[11px] leading-relaxed text-slate-440 max-w-xs">{row.event}</td>
                              <td className="p-4 font-mono font-bold text-slate-100">{row.revenue.toFixed(1)} ريال</td>
                              <td className="p-4 font-mono text-slate-400">{row.expenses.toFixed(1)} ريال</td>
                              <td className={`p-4 font-mono font-extrabold ${row.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {row.profit >= 0 ? `+${row.profit.toFixed(1)}` : row.profit.toFixed(1)} ريال
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Performance Charts (Recharts visualization) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Daily profits charts */}
                  <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-5">
                    <h4 className="font-bold text-slate-300 text-xs sm:text-sm mr-1 mb-4 flex items-center gap-1.5">
                      <BarChart2 className="w-4 h-4 text-amber-500" />
                      مؤشر الإيرادات، التكلفة، وصافي الأرباح لليوم
                    </h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getDayChartData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                          <YAxis stroke="#64748b" fontSize={11} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }} />
                          <Legend index={11} />
                          <Bar dataKey="الإيرادات اليومية" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="صافي الربح" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Cumulative earnings area chart */}
                  <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-5">
                    <h4 className="font-bold text-slate-300 text-xs sm:text-sm mr-1 mb-4 flex items-center gap-1.5">
                      <Landmark className="w-4 h-4 text-amber-500" />
                      مخطط نمو وتراكم رصيد الأرباح الصافي خلال الأسبوع 📈
                    </h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={getCumulativeBalanceData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                          <YAxis stroke="#64748b" fontSize={11} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }} />
                          <Area type="monotone" dataKey="رصيد الفوائض الإجمالي" stroke="#3b82f6" fillOpacity={1} fill="url(#colorBalance)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Reset button to retry */}
                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => {
                      setSimResults([]);
                      setCumulativeBalance(0);
                      setActiveTab('brainstorm');
                    }}
                    className="bg-slate-800 hover:bg-slate-700/85 text-slate-200 border border-slate-700 font-semibold px-6 py-2.5 rounded-xl text-xs transition flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-4 h-4" />
                    تحديث وبدء محاولة بمشروع جديد
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
