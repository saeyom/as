import { ALL_20_SLIDES } from './slidesData.js';

// Global application state
const state = {
  activeTab: 'presentation',
  
  // Slides Player States
  currentSlideId: 1,
  isPlaying: false,
  autoplayTimer: null,
  intervalTime: 5000,
  showNotes: true,
  showOutline: true,
  
  // Slide internal interactive widgets
  slideWidgets: {
    formulaCost: 1.5,
    formulaProfit: 1.0,
    scaleRevenue: 40,
    scaleExpense: 20,
    sandwichPrice: 2.0
  },

  // Google Exporter States
  user: null,
  token: null,
  needsAuth: true,
  exportState: 'idle', // 'idle' | 'creating' | 'populating' | 'success' | 'error'
  exportProgress: 0,
  statusMessage: '',
  createdPresentationUrl: null,
  selectedThemeId: 'navy_royal',

  // Sandbox States
  selectedIdeaId: 'cups',
  customIdeaName: '',
  customCategory: 'مشروع عام',
  materials: [
    { id: '1', name: 'علبة أكواب كرتونية (50 كوب)', cost: 15 },
    { id: '2', name: 'ألوان وقلم تحديد مقاوم للماء', cost: 10 }
  ],
  batchQuantity: 20,
  sellingPrice: 2,
  customerInterest: 4,
  customerProposedPrice: 2,
  simResults: [],
  isSimulating: false,
  cumulativeBalance: 0,
  charts: {
    pricingChart: null,
    daysChart: null,
    balanceChart: null
  },

  // Quiz States
  quizStarted: false,
  quizFinished: false,
  currentQuestionIndex: 0,
  selectedOptionIndex: null,
  hasSubmitted: false,
  score: 0,
  badges: [
    { id: 'b1', name: 'مخطط ريادي واعد 🧠', description: 'أجب على السؤال الأول بنجاح وافهم آلية هامش الربح', icon: '💡', color: 'from-amber-500 to-orange-500', unlocked: false },
    { id: 'b2', name: 'أمين الخزينة الذكي 💰', description: 'افهم معادلة الإيرادات الإجمالية بدقة لليوم الصفي', icon: '🏛️', color: 'from-blue-500 to-cyan-500', unlocked: false },
    { id: 'b3', name: 'موازن الحسابات الفذ ⚖️', description: 'فرّق بنجاح بين إيرادات المتجر ومصروفاته للوصول لصافي الأرباح', icon: '📈', color: 'from-emerald-500 to-teal-500', unlocked: false },
    { id: 'b4', name: 'صانع الحلول المرن 🚀', description: 'تعامل بذكاء ريادي لتخطي ضعف المبيعات ومفارقات السوق الدراسية', icon: '🏆', color: 'from-fuchsia-500 to-rose-500', unlocked: false }
  ]
};

// Static Data
const SANDBOX_IDEAS = [
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

const PRESENTATION_THEMES = [
  {
    id: 'navy_royal',
    name: 'أزرق ملكي وذهبي دافئ 💎',
    backgroundColor: { red: 0.06, green: 0.09, blue: 0.16 },
    primaryColor: { red: 0.93, green: 0.73, blue: 0.35 },
    secondaryColor: { red: 0.22, green: 0.53, blue: 0.93 },
    textColor: { red: 0.97, green: 0.98, blue: 1.0 },
    accentColor: { red: 0.12, green: 0.16, blue: 0.27 },
    bgHex: '#0f172a',
    primaryHex: '#f59e0b'
  },
  {
    id: 'sunset_glow',
    name: 'غروب ريادي دافئ 🌅',
    backgroundColor: { red: 0.18, green: 0.07, blue: 0.08 },
    secondaryColor: { red: 0.96, green: 0.44, blue: 0.26 },
    primaryColor: { red: 0.98, green: 0.81, blue: 0.4 },
    textColor: { red: 0.99, green: 0.96, blue: 0.93 },
    accentColor: { red: 0.26, green: 0.11, blue: 0.14 },
    bgHex: '#2e1214',
    primaryHex: '#f97316'
  },
  {
    id: 'emerald_modern',
    name: 'أخضر زمردي ريادي 🌿',
    backgroundColor: { red: 0.02, green: 0.13, blue: 0.1 },
    primaryColor: { red: 0.2, green: 0.9, blue: 0.61 },
    secondaryColor: { red: 0.52, green: 0.6, blue: 0.95 },
    textColor: { red: 0.95, green: 0.99, blue: 0.97 },
    accentColor: { red: 0.04, green: 0.21, blue: 0.17 },
    bgHex: '#06201b',
    primaryHex: '#10b981'
  },
  {
    id: 'clean_charcoal',
    name: 'رمادي فحمي كلاسيكي رصين 🏢',
    backgroundColor: { red: 0.12, green: 0.12, blue: 0.14 },
    primaryColor: { red: 1.0, green: 1.0, blue: 1.0 },
    secondaryColor: { red: 0.55, green: 0.58, blue: 0.67 },
    textColor: { red: 0.94, green: 0.94, blue: 0.96 },
    accentColor: { red: 0.18, green: 0.18, blue: 0.21 },
    bgHex: '#1e1e22',
    primaryHex: '#ffffff'
  }
];

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "السوار الجلدي في معصم اليد تكلفنا خاماته (0.5 ريال) وقررنا بيعه بـ (1.5 ريال)، فكم تبلغ قيمة هامش ربحنا الصافي للكوب الواحد؟",
    options: [
      "0.5 ريال",
      "1.0 ريال",
      "1.5 ريال",
      "2.0 ريال"
    ],
    correctIndex: 1,
    explanation: "هامش الربح = سعر البيع - التكلفة المباشرة للقطعة. أي (1.5 - 0.5 = 1.0 ريال) وهو ربح رائع يبلغ ضعف التكلفة!"
  },
  {
    id: 2,
    question: "قمت بصنع 15 كوب من ليموناد النعناع المنعش بتكلفة إجمالية 15 ريالاً، وبعت الكوب بـ 2 ريال. كيف تحسب الإيرادات الإجمالية عند بيع جميع الأكواب؟",
    options: [
      "تطرح 15 من 2 لتصل لـ 13 ريالاً",
      "تضرب 15 كوباً بسعر بيع الكوب 2 ريال لنصل لـ 30 ريالاً",
      "تقسم 15 على 2 لتصل لـ 7.5 ريال",
      "الإيراد الإجمالي يساوي التكلفة 15 ريالاً"
    ],
    correctIndex: 1,
    explanation: "الإيرادات الإجمالية = كمية الوحدات المباعة × سعر بيع الوحدة الواحدة. أي (15 × 2 = 30 ريالاً) وهو كل المال الذي تم جمعه في الدرج!"
  },
  {
    id: 3,
    question: "لو قمنا بجمع إيرادات كلية تبلغ 40 ريالاً للمشروع، وصرفنا خامات ومواصلات بقيمة 25 ريالاً، فهل مشروعنا يربح أم يخسر؟ وكم النتيجة؟",
    options: [
      "يربح 15 ريالاً",
      "يخسر 15 ريالاً",
      "يربح 40 ريالاً",
      "يقف في نقطة التعادل بدون ربح أو خسارة"
    ],
    correctIndex: 0,
    explanation: "المعادلة الذهبية: صافي الربح = الإيرادات - المصروفات. وبما أن الإيرادات (40) أكبر من المصروفات (25)، فنحن نربح والنتيجة (40 - 25 = 15 ريالاً)!"
  },
  {
    id: 4,
    question: "بدأت ببيع 'كاب كيك شوكلاتة' في المدرسة ولكن لم يأتِ أي زبون للشراء طيلة اليوم الأول. ما هو التصرف الذكي والريادي المناسب هنا؟",
    options: [
      "ترك المشروع واليأس وإلقاء البضاعة في سلة المهملات",
      "تصعيب الأمور والشكوى للمعلمين والوالدين",
      "استطلاع الزبائن بلطف عن السبب وتجربة تخفيض السعر أو تقديم عرض ترويجي (مثل اشتر قطعتين واحصل على الثالثة مجاناً)",
      "إنتاج كميات ضخمة إضافية لعلهم يشترون غداً"
    ],
    correctIndex: 2,
    explanation: "رائد الأعمال الذكي لا ييأس أبداً بل ينصت للسوق والزبائن! الاستطلاع وتوفير عروض ترويجية مرنة يولد حافزاً يجتذب المشترين."
  },
  {
    id: 5,
    question: "ما هي النصيحة والتحذير الأكثر أهمية لضمان ألا تخسر كل رأس مالك عند إطلاق فكرة مشروع جديدة؟",
    options: [
      "البدء بصنع كميات ضخمة جداً (أكثر من 100 حبة) لتكسب سريعاً",
      "اقتراض مبالغ بآلاف الريالات من الوالدين أو الأصدقاء وتوظيف عمالة",
      "البدء بكميات صغيرة وهادئة (مثل 10 حبات فقط) لتتحقق من جودة صنعك وإعجاب الزبائن قبل الاستثمار الكلي",
      "التسعير بأقل من سعر التكلفة المباشرة لدفع الناس للشراء"
    ],
    correctIndex: 2,
    explanation: "ابدأ صغيراً وتعلم رغبات السوق! إنتاجها محدوداً وتنمية رأس المال خطوة بخطوة يحميك من أي خسائر فادحة غير محسوبة."
  }
];

// Initialize Modules on Load
document.addEventListener('DOMContentLoaded', () => {
  initFirebase();
  initTabs();
  initSlidesPlayer();
  initExporter();
  initSandbox();
  initQuiz();
  renderApp(); // Initial render pass
});

// Firebase Compat Initializer
let auth = null;
const provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/presentations');
provider.addScope('https://www.googleapis.com/auth/drive.file');

function initFirebase() {
  const firebaseConfig = {
    projectId: "utilitarian-axiom-gcf5x",
    appId: "1:394895262980:web:052ee9b51568ecc953fc51",
    apiKey: "AIzaSyASaOEaF_Dcu6gg280Viu6ONoukTvnx3rQ",
    authDomain: "utilitarian-axiom-gcf5x.firebaseapp.com",
    storageBucket: "utilitarian-axiom-gcf5x.firebasestorage.app",
    messagingSenderId: "394895262980"
  };
  try {
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    
    // Auth Listener
    auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        state.user = currentUser;
        state.needsAuth = false;
        // The token needs to be fetch or retrieved after redirect/login
        // In popups, Firebase stores token in internal credential parameter at signIn time
      } else {
        state.user = null;
        state.token = null;
        state.needsAuth = true;
      }
      renderExporterUI();
    });
  } catch (err) {
    console.error("Firebase load issue:", err);
  }
}

// Tab handling
function initTabs() {
  const tabs = ['presentation', 'sandbox', 'quiz'];
  tabs.forEach(tab => {
    const btn = document.getElementById(`tab-btn-${tab}`);
    if (btn) {
      btn.addEventListener('click', () => {
        state.activeTab = tab;
        // Toggle view
        tabs.forEach(t => {
          const page = document.getElementById(`page-${t}`);
          const b = document.getElementById(`tab-btn-${t}`);
          if (page) {
            if (t === tab) {
              page.classList.remove('hidden');
              page.classList.add('animate-fadeIn');
            } else {
              page.classList.add('hidden');
              page.classList.remove('animate-fadeIn');
            }
          }
          if (b) {
            if (t === tab) {
              b.className = "px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10";
            } else {
              b.className = "px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 text-slate-400 hover:text-white";
            }
          }
        });
        
        // Re-draw sandbox charts if switching to results
        if (tab === 'sandbox') {
          setTimeout(updateSandboxCharts, 50);
        }
      });
    }
  });
}

// Slide Viewer Subsystem
function initSlidesPlayer() {
  // Outline Sidebar toggler
  const toggleBtn = document.getElementById('toggle-outline-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      state.showOutline = !state.showOutline;
      const sidebar = document.getElementById('slides-sidebar');
      const container = document.getElementById('slides-stage-container');
      if (sidebar && container) {
        if (state.showOutline) {
          sidebar.classList.remove('hidden');
          container.className = "xl:col-span-3 flex flex-col gap-6";
        } else {
          sidebar.classList.add('hidden');
          container.className = "xl:col-span-4 flex flex-col gap-6";
        }
      }
    });
  }

  // Collapsible Notes Toggler
  const notesBtn = document.getElementById('toggle-notes-btn');
  if (notesBtn) {
    notesBtn.addEventListener('click', () => {
      state.showNotes = !state.showNotes;
      const notesBody = document.getElementById('notes-body-drawer');
      if (notesBody) {
        if (state.showNotes) {
          notesBody.classList.remove('hidden');
          notesBtn.innerText = 'إخفاء التفاصيل';
        } else {
          notesBody.classList.add('hidden');
          notesBtn.innerText = 'إظهار التفاصيل';
        }
      }
    });
  }

  // Arrows mapping
  const prevBtn = document.getElementById('slide-prev-btn');
  const nextBtn = document.getElementById('slide-next-btn');
  if (prevBtn) prevBtn.addEventListener('click', slidePrev);
  if (nextBtn) nextBtn.addEventListener('click', slideNext);

  // Auto-play button
  const autoplayBtn = document.getElementById('slide-autoplay-btn');
  const delaySelect = document.getElementById('autoplay-delay-select');
  if (autoplayBtn) {
    autoplayBtn.addEventListener('click', () => {
      state.isPlaying = !state.isPlaying;
      toggleAutoplay();
    });
  }
  if (delaySelect) {
    delaySelect.addEventListener('change', (e) => {
      state.intervalTime = parseInt(e.target.value);
      if (state.isPlaying) {
        toggleAutoplay(); // Reset timer
      }
    });
  }

  // Keybindings
  window.addEventListener('keydown', (e) => {
    if (state.activeTab !== 'presentation') return;
    if (e.key === 'ArrowLeft' || e.key === ' ') {
      e.preventDefault();
      slideNext();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      slidePrev();
    }
  });

  // Load indices in sidebar
  renderOutlineSidebar();
}

function renderOutlineSidebar() {
  const container = document.getElementById('outline-sidebar-list');
  if (!container) return;
  container.innerHTML = '';
  
  ALL_20_SLIDES.forEach(s => {
    const btn = document.createElement('button');
    btn.className = `w-full py-2 px-3 rounded-xl text-xs font-semibold text-right transition flex items-center justify-between border ${
      state.currentSlideId === s.id
        ? 'bg-amber-500/10 text-amber-500 border-amber-500/25'
        : 'text-slate-400 border-transparent hover:bg-slate-900/40 hover:text-slate-200'
    }`;
    btn.innerHTML = `
      <span class="truncate max-w-[150px] text-right">${s.title}</span>
      <span class="font-mono text-[9px] ${state.currentSlideId === s.id ? 'text-amber-500' : 'text-slate-650'}">
        شريحة ${s.id}
      </span>
    `;
    btn.addEventListener('click', () => {
      selectSlide(s.id);
    });
    container.appendChild(btn);
  });
}

function selectSlide(id) {
  state.currentSlideId = id;
  renderSlideBody();
  renderOutlineSidebar();
}

function slideNext() {
  let next = state.currentSlideId + 1;
  if (next > ALL_20_SLIDES.length) next = 1;
  selectSlide(next);
}

function slidePrev() {
  let prev = state.currentSlideId - 1;
  if (prev < 1) prev = ALL_20_SLIDES.length;
  selectSlide(prev);
}

function toggleAutoplay() {
  const autoplayBtn = document.getElementById('slide-autoplay-btn');
  const delayDiv = document.getElementById('autoplay-delay-container');
  
  if (state.autoplayTimer) {
    clearInterval(state.autoplayTimer);
    state.autoplayTimer = null;
  }

  if (state.isPlaying) {
    if (autoplayBtn) {
      autoplayBtn.className = "py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-rose-500/20 text-rose-400 border border-rose-500/30";
      autoplayBtn.innerHTML = `<i data-lucide="pause" class="w-4 h-4"></i> إيقاف مؤقت للتشغيل التلقائي`;
    }
    if (delayDiv) delayDiv.classList.remove('hidden');
    state.autoplayTimer = setInterval(() => {
      slideNext();
    }, state.intervalTime);
  } else {
    if (autoplayBtn) {
      autoplayBtn.className = "py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 animate-pulse";
      autoplayBtn.innerHTML = `<i data-lucide="play" class="w-4 h-4"></i> تشغيل الشرح التلقائي (أوتوبلاي)`;
    }
    if (delayDiv) delayDiv.classList.add('hidden');
  }
  lucide.createIcons();
}

function renderSlideBody() {
  const slide = ALL_20_SLIDES.find(s => s.id === state.currentSlideId);
  if (!slide) return;

  // Slide texts
  const titleEl = document.getElementById('slide-main-title');
  const numEl = document.getElementById('slide-indicator-badge');
  const counterBig = document.getElementById('slide-indicator-counter');
  
  if (titleEl) titleEl.innerText = slide.title;
  if (numEl) numEl.innerText = `مبادرة ريادي الغد • شريحة ${slide.id} من 20`;
  if (counterBig) counterBig.innerText = `الشريحة ${slide.id} / 20`;

  // Left Section details
  const leftContent = document.getElementById('slide-left-content-wrapper');
  if (leftContent) {
    leftContent.innerHTML = '';
    
    // Grid behavior matching cover or standard slides
    if (slide.illustrationType === 'cover') {
      leftContent.className = "lg:col-span-12 text-center space-y-6 pt-4";
      let coverHtml = '';
      if (slide.subtitle) {
        coverHtml += `<p class="text-sm sm:text-lg text-amber-400 font-bold italic leading-relaxed font-sans max-w-2xl mx-auto">${slide.subtitle}</p>`;
      }
      coverHtml += `<div class="space-y-4 max-w-xl mx-auto pt-2">`;
      slide.points.forEach(pt => {
        coverHtml += `
          <div class="flex gap-2.5 items-center justify-center text-center">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0"></span>
            <p class="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">${pt}</p>
          </div>
        `;
      });
      coverHtml += `</div>`;
      leftContent.innerHTML = coverHtml;
    } else {
      leftContent.className = "lg:col-span-7 space-y-4";
      let standardHtml = '';
      if (slide.subtitle) {
        standardHtml += `<p class="text-xs sm:text-sm text-amber-400 font-semibold italic leading-relaxed font-sans text-right">${slide.subtitle}</p>`;
      }
      standardHtml += `<div class="space-y-3">`;
      slide.points.forEach(pt => {
        standardHtml += `
          <div class="flex gap-2.5 items-start text-right">
            <span class="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0"></span>
            <p class="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans">${pt}</p>
          </div>
        `;
      });
      standardHtml += `</div>`;
      leftContent.innerHTML = standardHtml;
    }
  }

  // Right illustration selector
  const rightWrap = document.getElementById('slide-right-illustration-container');
  if (rightWrap) {
    if (slide.illustrationType === 'cover') {
      rightWrap.classList.add('hidden');
    } else {
      rightWrap.classList.remove('hidden');
      rightWrap.className = "lg:col-span-5 flex justify-center items-center h-full min-h-[160px]";
      rightWrap.innerHTML = getIllustrationHtml(slide.illustrationType);
      bindIllustrationEventHandlers(slide.illustrationType);
    }
  }

  // Trainer notes Drawer
  const notesPanel = document.getElementById('notes-content-box');
  if (notesPanel) {
    notesPanel.innerHTML = getTrainerNotesHtml(slide.id);
  }
}

// Render slides animations illustrations
function getIllustrationHtml(type) {
  const w = state.slideWidgets;
  
  switch(type) {
    case 'goals':
      return `
        <div class="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl w-full text-center space-y-3 animate-fadeIn select-none">
          <div class="flex justify-center gap-3 items-center">
            <span class="text-3xl">🌱</span>
            <span class="text-xl text-slate-500">➡️</span>
            <span class="text-3xl">🌳</span>
          </div>
          <div class="text-xs text-slate-400 font-semibold mt-1">فكرة صغيرة مع تطبيق ذكي تصنع تغييراً كبيراً!</div>
        </div>
      `;
    case 'story':
      return `
        <div class="bg-slate-900/60 border border-slate-800 p-4 rounded-xl w-full space-y-3 font-mono text-xs select-none">
          <span class="text-[10px] text-slate-500 block">الهيكل المالي لمشروع أحمد للأكواب:</span>
          <div class="space-y-2 pt-1">
            <div>
              <div class="flex justify-between mb-1"><span>رأس المال الخامات:</span><span class="text-rose-400 font-bold">30 ريال</span></div>
              <div class="w-full bg-slate-950 h-1.5 rounded-full"><div class="bg-rose-500 h-full rounded-full" style="width: 30%"></div></div>
            </div>
            <div>
              <div class="flex justify-between mb-1"><span>الإيرادات الكلية:</span><span class="text-cyan-400 font-bold">100 ريال</span></div>
              <div class="w-full bg-slate-950 h-1.5 rounded-full"><div class="bg-cyan-400 h-full rounded-full" style="width: 100%"></div></div>
            </div>
            <div class="pt-2 border-t border-slate-800">
              <div class="flex justify-between font-bold text-emerald-400"><span>الأرباح الصافية الحرة:</span><span>70 ريالاً</span></div>
              <p class="text-[9px] text-emerald-500 text-right mt-1.5">* معدل نمو الأرباح يبلغ 233% من رأس المال!</p>
            </div>
          </div>
        </div>
      `;
    case 'idea':
      return `
        <div class="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl grid grid-cols-2 gap-2 text-center w-full select-none text-xs font-semibold">
          <div class="p-3 bg-slate-950/40 rounded-lg border border-slate-800 text-slate-200 hover:border-amber-500/45 transition">🎨 رسم وتلوين</div>
          <div class="p-3 bg-slate-950/40 rounded-lg border border-slate-800 text-slate-200 hover:border-amber-500/45 transition">🧁 طبخ وحلويات</div>
          <div class="p-3 bg-slate-950/40 rounded-lg border border-slate-800 text-slate-200 hover:border-amber-500/45 transition">📷 تنظيم وتصوير</div>
          <div class="p-3 bg-slate-950/40 rounded-lg border border-slate-800 text-slate-200 hover:border-amber-500/45 transition">🧵 خيوط وأساور</div>
        </div>
      `;
    case 'survey':
      return `
        <div class="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl w-full text-center space-y-3 font-mono text-xs select-none">
          <span class="text-[10px] text-slate-500 block">نتائج استطلاع 5 زملاء بالفصل:</span>
          <div class="flex justify-center gap-2 pt-2">
            <span class="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg font-bold">👍 نعم (4)</span>
            <span class="bg-rose-500/10 text-rose-450 border border-rose-500/20 px-3 py-1.5 rounded-lg font-bold">👎 لا (1)</span>
          </div>
          <p class="text-[10px] bg-slate-950/40 p-2 rounded-lg text-slate-400 leading-relaxed font-sans">
            السعر المقبول للجميع هو <b>1.5 ريال</b> للكوب.
          </p>
        </div>
      `;
    case 'capital':
      return `
        <div class="bg-slate-900/40 border border-slate-800 p-4 rounded-xl w-full text-xs space-y-2 select-none">
          <div class="flex justify-between p-2 bg-slate-950/40 rounded-lg text-slate-350"><span>شاي فاخر العافية</span><span class="text-slate-400 font-mono font-bold">5 ريال</span></div>
          <div class="flex justify-between p-2 bg-slate-950/40 rounded-lg text-slate-350"><span>كيلو سكر طبيعي</span><span class="text-slate-400 font-mono font-bold">3 ريال</span></div>
          <div class="flex justify-between p-2 bg-slate-950/40 rounded-lg text-slate-350"><span>أكياس صحية</span><span class="text-slate-400 font-mono font-bold">2 ريال</span></div>
          <div class="flex justify-between p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-500 font-bold">
            <span>إجمالي رأس مال البدء:</span><span class="font-mono text-amber-400">10 ريالات</span>
          </div>
        </div>
      `;
    case 'pricing':
      const pricingTotal = (parseFloat(w.formulaCost) + parseFloat(w.formulaProfit)).toFixed(1);
      return `
        <div class="bg-slate-900/60 border border-slate-800 p-4 rounded-xl w-full space-y-4 font-mono text-xs animate-fadeIn">
          <div class="space-y-3">
            <div>
              <label class="text-[10px] text-slate-400 block mb-1">تكلفة صنع الكوب الواحد (ريال):</label>
              <input
                type="number"
                step="0.1"
                id="ill-widget-cost"
                value="${w.formulaCost}"
                class="w-full bg-slate-950 border border-slate-850 p-2 rounded-lg text-rose-450 font-black outline-none text-center"
              />
            </div>
            <div>
              <label class="text-[10px] text-slate-400 block mb-1">هامش ربحك المأمول للقطعة (ريال):</label>
              <input
                type="number"
                step="0.1"
                id="ill-widget-profit"
                value="${w.formulaProfit}"
                class="w-full bg-slate-950 border border-slate-850 p-2 rounded-lg text-emerald-400 font-black outline-none text-center"
              />
            </div>
          </div>
          <div id="ill-widget-pricing-out" class="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center text-amber-500 font-bold font-sans">
            سعر البيع المقترح لطلابك: ${pricingTotal} ر.س
          </div>
        </div>
      `;
    case 'table':
      return `
        <div class="bg-slate-900/40 border border-slate-800 p-2.5 rounded-xl w-full space-y-1.5 text-xs select-none font-mono">
          <div class="grid grid-cols-3 p-1.5 bg-slate-950 rounded-lg text-slate-500 text-[10px] text-center">
            <div>المنتج</div>
            <div>التكلفة</div>
            <div>السعر</div>
          </div>
          <div class="grid grid-cols-3 p-1.5 bg-slate-950/20 rounded-lg text-center">
            <div class="text-slate-200 font-sans">كب كيك محلى</div>
            <div class="text-rose-450 font-bold">1.0 ر.س</div>
            <div class="text-emerald-400 font-extrabold">2.0 ر.س</div>
          </div>
          <div class="grid grid-cols-3 p-1.5 bg-slate-950/20 rounded-lg text-center">
            <div class="text-slate-200 font-sans">سوار جلدي</div>
            <div class="text-rose-450 font-bold">0.5 ر.س</div>
            <div class="text-emerald-400 font-extrabold">1.5 ر.س</div>
          </div>
          <div class="grid grid-cols-3 p-1.5 bg-slate-950/20 rounded-lg text-center">
            <div class="text-slate-200 font-sans">ملصق دفتر</div>
            <div class="text-rose-450 font-bold">0.2 ر.س</div>
            <div class="text-emerald-400 font-extrabold">1.0 ر.س</div>
          </div>
        </div>
      `;
    case 'revenue':
      return `
        <div class="bg-slate-900/60 border border-slate-800 p-4 rounded-xl w-full text-center space-y-3 font-mono text-xs select-none">
          <span class="text-[10px] text-slate-500 block">معادلة حساب الإيرادات الإجمالية:</span>
          <div class="p-3 bg-slate-950 rounded-lg flex justify-between items-center text-slate-200">
            <span>20 قطعة</span>
            <span>×</span>
            <span>2 ريال</span>
            <span>=</span>
            <span class="text-amber-500 font-black">40 ريال</span>
          </div>
          <p class="text-[9px] text-slate-400 leading-relaxed font-sans mt-1">
            هي كل الأموال المدخلة المكتسبة داخل الخزينة المادية للمشروع.
          </p>
        </div>
      `;
    case 'expenses':
      return `
        <div class="bg-slate-900/60 border border-slate-800 p-4 rounded-xl w-full text-center space-y-3 font-mono text-xs select-none">
          <span class="text-[10px] text-slate-500 block">معادلة فرز المصروفات المباشرة:</span>
          <div class="p-3 bg-slate-950 rounded-lg flex justify-between items-center text-slate-200">
            <span>20 قطعة</span>
            <span>×</span>
            <span>1 ريال</span>
            <span>=</span>
            <span class="text-rose-450 font-black">20 ريال</span>
          </div>
          <p class="text-[9px] text-slate-400 leading-relaxed font-sans mt-1">
            الخامات المباشرة هي عماد الصرف المالي المنضبط للتصنيع.
          </p>
        </div>
      `;
    case 'balance':
      const scaleBalanceNet = w.scaleRevenue - w.scaleExpense;
      const scaleStyleClass = scaleBalanceNet >= 0 ? "text-emerald-400 bg-emerald-500/5 border-emerald-500/10" : "text-rose-400 bg-rose-500/5 border-rose-500/10";
      return `
        <div class="bg-slate-900/60 border border-slate-800 p-4 rounded-xl w-full space-y-4 font-mono text-xs">
          <div class="space-y-2">
            <div class="flex justify-between items-center text-[10px] text-slate-400">
              <span>إيرادات المعرض (ريال):</span>
              <span id="ill-val-revenue" class="text-cyan-400 font-bold">${w.scaleRevenue} ريال</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              id="ill-widget-revenue"
              value="${w.scaleRevenue}"
              class="w-full h-1.5 bg-slate-950 appearance-none rounded-lg cursor-pointer accent-cyan-500"
            />
          </div>

          <div class="space-y-2">
            <div class="flex justify-between items-center text-[10px] text-slate-400">
              <span>مصروفات الصناعة (ريال):</span>
              <span id="ill-val-expenses" class="text-rose-400 font-bold">${w.scaleExpense} ريال</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              id="ill-widget-expenses"
              value="${w.scaleExpense}"
              class="w-full h-1.5 bg-slate-950 appearance-none rounded-lg cursor-pointer accent-rose-500"
            />
          </div>

          <div class="pt-2 border-t border-slate-850 flex justify-between items-center">
            <span class="text-slate-400 font-sans">الربح الصافي:</span>
            <span id="ill-widget-scale-out" class="text-sm font-black px-3 py-1.5 rounded-lg border ${scaleStyleClass}">
              ${scaleBalanceNet} ريالاً
            </span>
          </div>
        </div>
      `;
    case 'full_example':
      return `
        <div class="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl w-full space-y-3 font-mono text-xs select-none text-right">
          <div class="flex justify-between items-center">
            <span class="text-orange-500 font-bold">عصير برتقال طبيعي 🍊</span>
            <span class="text-[10px] text-slate-500">موازنة اليوم</span>
          </div>
          <div class="space-y-1.5 bg-slate-950 p-2.5 rounded-lg border border-slate-900">
            <div class="flex justify-between"><span>إنتاج:</span><span class="text-slate-300">15 كوب</span></div>
            <div class="flex justify-between"><span>سعر البيع:</span><span class="text-slate-300">2 ريال للكوب</span></div>
            <div class="flex justify-between"><span>إيرادات:</span><span class="text-cyan-400 font-bold">30 ريال</span></div>
            <div class="flex justify-between"><span>مصروف خامات:</span><span class="text-rose-450 font-bold">15 ريال</span></div>
          </div>
          <p class="text-[10px] text-emerald-450 font-bold text-center bg-emerald-500/5 p-1 rounded border border-emerald-500/10">
            الربح لليوم الأول: 15 ريالات
          </p>
        </div>
      `;
    case 'steps':
      return `
        <div class="bg-slate-900/40 border border-slate-800 p-4 rounded-xl w-full text-xs space-y-2 select-none text-right font-sans">
          <div class="flex items-center gap-2"><span class="bg-amber-500 text-slate-950 w-5 h-5 flex items-center justify-center font-bold text-[10px] rounded-full">1</span> جمع رأس المال</div>
          <div class="flex items-center gap-2"><span class="bg-amber-500 text-slate-950 w-5 h-5 flex items-center justify-center font-bold text-[10px] rounded-full">2</span> شراء الخامات الأساسية</div>
          <div class="flex items-center gap-2"><span class="bg-amber-500 text-slate-950 w-5 h-5 flex items-center justify-center font-bold text-[10px] rounded-full">3</span> تجريب المنتج في منزلكم</div>
          <div class="flex items-center gap-2 pt-1 border-t border-slate-800/60"><span class="bg-emerald-500 text-slate-950 w-5 h-5 flex items-center justify-center font-bold text-[10px] rounded-full">4</span> البدء بالبيع المدروس</div>
        </div>
      `;
    case 'tips':
      return `
        <div class="bg-amber-500/5 border border-amber-500/20 p-5 rounded-2xl w-full text-center space-y-3 select-none font-sans">
          <span class="text-4xl block animate-bounce">💡</span>
          <h5 class="font-bold text-xs text-amber-500">سر التجارة الناجحة:</h5>
          <p class="text-[10px] text-slate-400 leading-relaxed font-sans">
            ابدأ بكمية إنتاجية صغيرة للغاية لتضمن عدم ضياع أموالك وحصيلة أرباحك الصافية قبل معرفة طلب زملائك.
          </p>
        </div>
      `;
    case 'ledger':
      return `
        <div class="bg-slate-900/60 border border-slate-800 p-3 rounded-xl w-full space-y-1.5 text-[9px] font-mono select-none">
          <div class="grid grid-cols-4 p-1 bg-slate-950 rounded text-slate-500 text-[8px] text-center">
            <div>اليوم</div>
            <div>الإيراد</div>
            <div>المصروف</div>
            <div>الربح</div>
          </div>
          <div class="grid grid-cols-4 p-1 bg-slate-950/20 rounded text-center">
            <div class="text-slate-100">الأحد</div>
            <div class="text-cyan-400 font-bold">20 ريال</div>
            <div class="text-slate-500">10 ريال</div>
            <div class="text-emerald-400 font-bold">10 ريال</div>
          </div>
          <div class="grid grid-cols-4 p-1 bg-slate-950/20 rounded text-center">
            <div class="text-slate-100">الاثنين</div>
            <div class="text-cyan-400 font-bold">30 ريال</div>
            <div class="text-slate-500">15 ريال</div>
            <div class="text-emerald-400 font-bold">15 ريال</div>
          </div>
        </div>
      `;
    case 'challenge':
      const estRev = (20 * w.sandwichPrice).toFixed(1);
      const estProfit = ((20 * w.sandwichPrice) - 20).toFixed(1);
      return `
        <div class="bg-slate-900/60 border border-slate-800 p-4 rounded-xl w-full space-y-3 font-mono text-xs text-right">
          <span class="text-[10px] text-slate-500 block">اضبط سعر السندويش لترى الربح المشترك بالفريق:</span>
          <div>
            <input
              type="range"
              min="1.2"
              max="5.0"
              step="0.1"
              id="ill-widget-sandwich"
              value="${w.sandwichPrice}"
              class="w-full h-1.5 bg-slate-950 appearance-none rounded-lg cursor-pointer accent-amber-500"
            />
          </div>
          <div class="space-y-1.5 bg-slate-950 p-2.5 rounded-lg border border-slate-900 text-[10px]">
            <div class="flex justify-between"><span>الإنتاج (رأس المال 20 ر.س):</span><span>20 سندويش</span></div>
            <div class="flex justify-between text-slate-350"><span>سعر البيع الموصى به:</span><span id="ill-val-sandwich" class="text-slate-105 font-bold">${parseFloat(w.sandwichPrice).toFixed(1)} ريال</span></div>
            <div class="flex justify-between text-slate-350"><span>الإيرادات المتوقعة:</span><span id="ill-widget-sandwich-rev" class="text-cyan-400 font-bold">${estRev} ريال</span></div>
            <div class="flex justify-between border-t border-slate-850 pt-1 text-emerald-450 font-extrabold text-[11px]">
              <span>صافي أرباح الفريق:</span><span id="ill-widget-sandwich-prof">${estProfit} ريالاً</span>
            </div>
          </div>
        </div>
      `;
    case 'projects':
      return `
        <div class="bg-slate-900/40 border border-slate-800 p-3 rounded-xl w-full text-[10px] space-y-1.5 select-none text-right font-sans">
          <div class="p-2 bg-slate-950/50 rounded-lg flex justify-between border border-slate-800/40"><span>🧵 أساور يدوية</span> <span class="text-emerald-400 font-bold font-mono">+15 ر.س ارباح</span></div>
          <div class="p-2 bg-slate-950/50 rounded-lg flex justify-between border border-slate-800/40"><span>💻 ملصقات حواسيب</span> <span class="text-emerald-400 font-bold font-mono">+20 ر.س ارباح</span></div>
          <div class="p-2 bg-slate-950/50 rounded-lg flex justify-between border border-slate-800/40"><span>✏️ إعادة بيع أقلام</span> <span class="text-emerald-400 font-bold font-mono">+25 ر.س ارباح</span></div>
        </div>
      `;
    case 'solutions':
      return `
        <div class="bg-slate-900/60 border border-slate-800 p-4 rounded-xl w-full text-center space-y-3 font-mono text-xs select-none">
          <h5 class="font-bold text-[10px] text-slate-500 block font-sans">مفتاح مواجهة الصعاب الريادية:</h5>
          <div class="p-3 bg-slate-950 text-emerald-400 rounded-lg font-sans border border-emerald-500/10 shadow-inner">
            حسومات وتسهيلات ترويجية ⬅️ مبيعات أقوى وأسرع
          </div>
          <p class="text-[9px] text-slate-450 leading-relaxed font-sans mt-1">
            العقبات ليست عائقاً بل هي أولى سلم الصعود والتميز المالي.
          </p>
        </div>
      `;
    case 'homework':
      return `
        <div class="bg-slate-900/40 border border-slate-800 p-4 rounded-xl w-full text-right space-y-2 select-none font-sans">
          <span class="text-[9px] text-slate-500 font-mono block">الواجب العملي الصفي للطلاب:</span>
          <ul class="space-y-1.5 text-[11px] text-slate-350 leading-relaxed">
            <li class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 bg-amber-500 rounded-full"></span> اختر مشروع ليموناد منعش أو أساور ملونة بالفصل</li>
            <li class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 bg-amber-500 rounded-full"></span> بَع 5 قطع كقيمة أولية لإنعاش أسرتك جودة وصنعاً</li>
            <li class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 bg-amber-500 rounded-full"></span> دون مخرجاتك بجدول حسابي ورقي خاص</li>
          </ul>
        </div>
      `;
    case 'summary':
      return `
        <div class="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-5 rounded-2xl w-full text-center space-y-3 select-none animate-pulse">
          <span class="text-3xl block">✨ 🚀 ✨</span>
          <h5 class="font-extrabold text-sm text-amber-500 font-sans">مستقبل زاهر بانتظارك!</h5>
          <p class="text-[10px] text-slate-400 font-sans leading-relaxed">
            الريادة تبدأ صغيراً، وتكبر بالصبر وبمراقبة واعية ومحكمة للأرقام.
          </p>
        </div>
      `;
    default:
      return '';
  }
}

function bindIllustrationEventHandlers(type) {
  const w = state.slideWidgets;
  
  if (type === 'pricing') {
    const costInput = document.getElementById('ill-widget-cost');
    const profitInput = document.getElementById('ill-widget-profit');
    
    const update = () => {
      w.formulaCost = parseFloat(costInput.value) || 0;
      w.formulaProfit = parseFloat(profitInput.value) || 0;
      const total = (w.formulaCost + w.formulaProfit).toFixed(1);
      const textOut = document.getElementById('ill-widget-pricing-out');
      if (textOut) textOut.innerText = `سعر البيع المقترح لطلابك: ${total} ر.س`;
    };
    
    if (costInput) costInput.addEventListener('input', update);
    if (profitInput) profitInput.addEventListener('input', update);
  }
  
  else if (type === 'balance') {
    const revInput = document.getElementById('ill-widget-revenue');
    const expInput = document.getElementById('ill-widget-expenses');
    
    const update = () => {
      w.scaleRevenue = parseInt(revInput.value) || 0;
      w.scaleExpense = parseInt(expInput.value) || 0;
      
      const vRev = document.getElementById('ill-val-revenue');
      const vExp = document.getElementById('ill-val-expenses');
      if (vRev) vRev.innerText = `${w.scaleRevenue} ريال`;
      if (vExp) vExp.innerText = `${w.scaleExpense} ريال`;
      
      const diff = w.scaleRevenue - w.scaleExpense;
      const widgetScale = document.getElementById('ill-widget-scale-out');
      if (widgetScale) {
        widgetScale.innerText = `${diff} ريالاً`;
        if (diff >= 0) {
          widgetScale.className = "text-sm font-black px-3 py-1.5 rounded-lg border text-emerald-400 bg-emerald-500/5 border-emerald-500/10";
        } else {
          widgetScale.className = "text-sm font-black px-3 py-1.5 rounded-lg border text-rose-450 bg-rose-500/5 border-rose-500/10";
        }
      }
    };
    
    if (revInput) revInput.addEventListener('input', update);
    if (expInput) expInput.addEventListener('input', update);
  }
  
  else if (type === 'challenge') {
    const sandInput = document.getElementById('ill-widget-sandwich');
    
    const update = () => {
      w.sandwichPrice = parseFloat(sandInput.value) || 0;
      
      const vSand = document.getElementById('ill-val-sandwich');
      if (vSand) vSand.innerText = `${w.sandwichPrice.toFixed(1)} ريال`;
      
      const estRev = (20 * w.sandwichPrice).toFixed(1);
      const estProfit = ((20 * w.sandwichPrice) - 20).toFixed(1);
      
      const vRev = document.getElementById('ill-widget-sandwich-rev');
      const vProf = document.getElementById('ill-widget-sandwich-prof');
      if (vRev) vRev.innerText = `${estRev} ريال`;
      if (vProf) vProf.innerText = `${estProfit} ريالاً`;
    };
    
    if (sandInput) sandInput.addEventListener('input', update);
  }
}

// Google Slides Exporter logic
function initExporter() {
  const loginBtn = document.getElementById('google-login-btn');
  const logoutBtn = document.getElementById('google-logout-btn');
  const exportBtn = document.getElementById('slides-export-action-btn');
  const retryBtn = document.getElementById('export-retry-btn');
  const resetBtn = document.getElementById('export-reset-btn');

  if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
      loginBtn.disabled = true;
      loginBtn.innerHTML = `
        <div class="gsi-material-button-content-wrapper">
          <i data-lucide="loader-2" class="animate-spin text-slate-500 w-5 h-5 ml-2"></i>
          <span class="gsi-material-button-contents">جاري الاتصال بـ Google...</span>
        </div>
      `;
      lucide.createIcons();
      try {
        const result = await auth.signInWithPopup(provider);
        if (result.credential) {
          state.token = result.credential.accessToken;
          state.user = result.user;
          state.needsAuth = false;
        }
      } catch (err) {
        console.error('Google authorization error', err);
        alert('فشل تسجيل الدخول بالرابط المختار لدعم عروض Google Slides');
      } finally {
        loginBtn.disabled = false;
        renderExporterUI();
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      if (confirm('هل ترغب في تسجيل الخروج من حساب Google؟')) {
        await auth.signOut();
        state.user = null;
        state.token = null;
        state.needsAuth = true;
        state.exportState = 'idle';
        renderExporterUI();
      }
    });
  }

  // Theme selection chips click listener
  const chips = ['navy_royal', 'sunset_glow', 'emerald_modern', 'clean_charcoal'];
  chips.forEach(cid => {
    const element = document.getElementById(`theme-chip-${cid}`);
    if (element) {
      element.addEventListener('click', () => {
        state.selectedThemeId = cid;
        chips.forEach(otherId => {
          const entry = document.getElementById(`theme-chip-${otherId}`);
          if (entry) {
            if (otherId === cid) {
              entry.classList.add('border-amber-500', 'bg-amber-500/5');
              entry.classList.remove('border-slate-800', 'bg-slate-900/40');
            } else {
              entry.classList.remove('border-amber-500', 'bg-amber-500/5');
              entry.classList.add('border-slate-800', 'bg-slate-900/40');
            }
          }
        });
      });
    }
  });

  if (exportBtn) exportBtn.addEventListener('click', handleExportToGoogleSlides);
  if (retryBtn) retryBtn.addEventListener('click', handleExportToGoogleSlides);
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state.exportState = 'idle';
      renderExporterUI();
    });
  }
}

function renderExporterUI() {
  const needsAuthSection = document.getElementById('export-auth-required-section');
  const loggedSection = document.getElementById('export-logged-in-section');
  const welcomeText = document.getElementById('export-welcome-profile-text');
  
  if (state.needsAuth) {
    if (needsAuthSection) needsAuthSection.classList.remove('hidden');
    if (loggedSection) loggedSection.classList.add('hidden');
  } else {
    if (needsAuthSection) needsAuthSection.classList.add('hidden');
    if (loggedSection) loggedSection.classList.remove('hidden');
    if (welcomeText) {
      welcomeText.innerHTML = `
        <p class="text-xs text-slate-500">متصل بـ Google باسم</p>
        <p class="text-sm font-semibold text-slate-300">${state.user.displayName || state.user.email}</p>
      `;
    }
  }

  // Render export progress panels
  updateExportStateUI();
}

function updateExportStateUI() {
  const container = document.getElementById('export-status-panel-wrapper');
  if (!container) return;
  container.innerHTML = '';

  const pct = state.exportProgress;
  const msg = state.statusMessage;

  if (state.exportState === 'idle') {
    container.innerHTML = `
      <div class="space-y-4 text-center py-2 animate-fadeIn">
        <p class="text-xs text-slate-500 leading-relaxed">تم دمج محاور الـ 20 شريحة بالفصحى لتنشئ أروع الورشات المدرسية.</p>
        <button id="slides-export-action-btn-dynamic" class="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:opacity-90 hover:scale-101 transition font-bold py-3.5 px-5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/5 text-sm">
          <i data-lucide="presentation" class="w-5 h-5"></i>
          تصدير العرض التقديمي الآن
        </button>
      </div>
    `;
    const actionBtn = document.getElementById('slides-export-action-btn-dynamic');
    if (actionBtn) actionBtn.addEventListener('click', handleExportToGoogleSlides);
  }
  
  else if (state.exportState === 'creating' || state.exportState === 'populating') {
    container.innerHTML = `
      <div class="space-y-4 animate-fadeIn">
        <div class="flex justify-between items-center text-sm">
          <span class="text-amber-500 font-bold select-none font-mono">${pct}%</span>
          <span class="text-slate-400 font-semibold animate-pulse flex items-center gap-1.5 text-xs">
            <i data-lucide="loader-2" class="w-4 h-4 animate-spin text-amber-500"></i>
            جاري المعالجة الرقمية...
          </span>
        </div>
        <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div class="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-300" style="width: ${pct}%"></div>
        </div>
        <p class="text-xs text-slate-400 font-sans leading-relaxed text-center select-all">
          ${msg}
        </p>
      </div>
    `;
  }
  
  else if (state.exportState === 'success') {
    container.innerHTML = `
      <div class="space-y-4 animate-fadeIn">
        <div class="flex items-center gap-2.5 text-emerald-400 bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/20">
          <i data-lucide="check-circle-2" class="w-5 h-5 flex-shrink-0"></i>
          <span class="text-xs font-bold leading-relaxed">اكتمل التصدير في Google Drive الخاص بك!</span>
        </div>
        <a
          href="${state.createdPresentationUrl}"
          target="_blank"
          rel="noreferrer"
          class="w-full bg-emerald-500 hover:bg-emerald-600 hover:scale-[1.01] text-slate-950 transition font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/10 text-sm"
        >
          فتح العرض على Google Slides
          <i data-lucide="arrow-up-right" class="w-4 h-4"></i>
        </a>
        <button id="export-reset-btn-dynamic" class="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 text-xs py-2 rounded-lg font-semibold transition">
          تصدير ملف جديد
        </button>
      </div>
    `;
    const resBtn = document.getElementById('export-reset-btn-dynamic');
    if (resBtn) {
      resBtn.addEventListener('click', () => {
        state.exportState = 'idle';
        renderExporterUI();
      });
    }
  }
  
  else if (state.exportState === 'error') {
    container.innerHTML = `
      <div class="space-y-4 animate-fadeIn text-center">
        <div class="text-red-400 bg-red-500/10 p-4 rounded-xl border border-red-500/20 text-xs font-semibold leading-relaxed">
          ${msg}
        </div>
        <div class="flex gap-2">
          <button id="export-retry-btn-dynamic" class="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-xl text-xs transition">
            إعادة المحاولة
          </button>
          <button id="export-cancel-btn-dynamic" class="bg-slate-900 border border-slate-800 text-slate-400 px-4 rounded-xl text-xs" transition">
            إلغاء
          </button>
        </div>
      </div>
    `;
    const retBtn = document.getElementById('export-retry-btn-dynamic');
    const canBtn = document.getElementById('export-cancel-btn-dynamic');
    if (retBtn) retBtn.addEventListener('click', handleExportToGoogleSlides);
    if (canBtn) {
      canBtn.addEventListener('click', () => {
        state.exportState = 'idle';
        renderExporterUI();
      });
    }
  }
  lucide.createIcons();
}

async function handleExportToGoogleSlides() {
  if (!state.user) {
    alert('يرجى تمكين الاتصال بحساب Google أولاً ليتم تصدير العرض.');
    return;
  }
  
  state.exportState = 'creating';
  state.exportProgress = 5;
  state.statusMessage = 'جاري تهيئة العرض التقديمي في حساب Google Drive الخاص بك...';
  updateExportStateUI();

  const activeTheme = PRESENTATION_THEMES.find(t => t.id === state.selectedThemeId) || PRESENTATION_THEMES[0];

  try {
    // Standard OAuth slides api calling sequence
    // A reliable client flow obtains the credentials of the signed user inside implicit token
    let token = state.token;
    if (!token) {
      // Fetch user access token directly from google identity.
      // If compat is used, cached credential is safe. As fallback, let's ask firebase to refresh token details
      const providerToken = await auth.currentUser.getIdToken(true);
      // Fallback: search indexed token storage or trigger rapid credentials popup.
      // The secure popup handles getting workspace scope credentials:
      const authResult = await auth.signInWithPopup(provider);
      token = authResult.credential.accessToken;
      state.token = token;
    }

    // Call fetch to slides
    const res = await fetch('https://slides.googleapis.com/v1/presentations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title: 'مبادرة ريادي الغد - ريادة الأعمال والإدارة المالية لطلاب المدارس'
      })
    });

    if (!res.ok) {
      throw new Error(`Failed to initialize Slides file: ${await res.text()}`);
    }

    const presentationData = await res.json();
    const presentationId = presentationData.presentationId;

    state.exportState = 'populating';
    
    // Process all 20 slides
    for (let i = 0; i < ALL_20_SLIDES.length; i++) {
      const slide = ALL_20_SLIDES[i];
      state.exportProgress = Math.min(95, Math.round(((i + 1) / ALL_20_SLIDES.length) * 85) + 10);
      state.statusMessage = `جاري صقل وتنسيق عناصر الشريحة رقم ${slide.id} بصيغة بصرية مبهجة...`;
      updateExportStateUI();

      const requests = [];
      const sId = `slide_p_${slide.id}`;
      const titleId = `title_p_${slide.id}`;
      const subtitleId = `sub_p_${slide.id}`;
      const pointsId = `pts_p_${slide.id}`;
      const borderLineId = `border_p_${slide.id}`;

      // Insert slide blank layout
      requests.push({
        createSlide: {
          objectId: sId,
          insertionIndex: i + 1,
          slideLayoutReference: { predefinedLayout: 'BLANK' }
        }
      });

      // Layout slide background color
      requests.push({
        updatePageProperties: {
          objectId: sId,
          pageProperties: {
            pageBackgroundFill: {
              solidFill: { color: { rgbColor: activeTheme.backgroundColor } }
            }
          },
          fields: 'pageBackgroundFill.solidFill.color'
        }
      });

      // Right Border graphic accent line
      requests.push({
        createShape: {
          objectId: borderLineId,
          shapeType: 'RECTANGLE',
          elementProperties: {
            pageObjectId: sId,
            size: {
              width: { magnitude: 200000, unit: 'EMU' },
              height: { magnitude: 4500000, unit: 'EMU' }
            },
            transform: {
              scaleX: 1, scaleY: 1, shearX: 0, shearY: 0,
              translateX: 9000000,
              translateY: 500000,
              unit: 'EMU'
            }
          }
        }
      });

      requests.push({
        updateShapeProperties: {
          objectId: borderLineId,
          shapeProperties: {
            shapeBackgroundFill: { solidFill: { color: { rgbColor: activeTheme.primaryColor } } },
            outline: { propertyState: 'NOT_RENDERED' }
          },
          fields: 'shapeBackgroundFill.solidFill.color,outline'
        }
      });

      // Title Textbox
      requests.push({
        createShape: {
          objectId: titleId,
          shapeType: 'TEXT_BOX',
          elementProperties: {
            pageObjectId: sId,
            size: {
              width: { magnitude: 8000000, unit: 'EMU' },
              height: { magnitude: 1100000, unit: 'EMU' }
            },
            transform: {
              scaleX: 1, scaleY: 1, shearX: 0, shearY: 0,
              translateX: 800000,
              translateY: 600000,
              unit: 'EMU'
            }
          }
        }
      });

      requests.push({
        insertText: { objectId: titleId, text: slide.title, insertionIndex: 0 }
      });

      requests.push({
        updateTextStyle: {
          objectId: titleId,
          textRange: { type: 'ALL' },
          style: {
            fontFamily: 'Cairo', fontSize: { magnitude: 24, unit: 'PT' }, bold: true,
            foregroundColor: { solidFill: { color: { rgbColor: activeTheme.primaryColor } } }
          },
          fields: 'fontFamily,fontSize,bold,foregroundColor'
        }
      });

      requests.push({
        updateParagraphStyle: {
          objectId: titleId,
          textRange: { type: 'ALL' },
          style: { alignment: 'RIGHT' },
          fields: 'alignment'
        }
      });

      // Subtitle
      if (slide.subtitle) {
        requests.push({
          createShape: {
            objectId: subtitleId,
            shapeType: 'TEXT_BOX',
            elementProperties: {
              pageObjectId: sId,
              size: {
                width: { magnitude: 8000000, unit: 'EMU' },
                height: { magnitude: 600005, unit: 'EMU' }
              },
              transform: {
                scaleX: 1, scaleY: 1, shearX: 0, shearY: 0,
                translateX: 800000,
                translateY: 1800000,
                unit: 'EMU'
              }
            }
          }
        });

        requests.push({
          insertText: { objectId: subtitleId, text: slide.subtitle, insertionIndex: 0 }
        });

        requests.push({
          updateTextStyle: {
            objectId: subtitleId,
            textRange: { type: 'ALL' },
            style: {
              fontFamily: 'Cairo', fontSize: { magnitude: 14, unit: 'PT' }, italic: true,
              foregroundColor: { solidFill: { color: { rgbColor: activeTheme.secondaryColor } } }
            },
            fields: 'fontFamily,fontSize,italic,foregroundColor'
          }
        });

        requests.push({
          updateParagraphStyle: {
            objectId: subtitleId,
            textRange: { type: 'ALL' },
            style: { alignment: 'RIGHT' },
            fields: 'alignment'
          }
        });
      }

      // Point bullets
      if (slide.points && slide.points.length > 0) {
        requests.push({
          createShape: {
            objectId: pointsId,
            shapeType: 'TEXT_BOX',
            elementProperties: {
              pageObjectId: sId,
              size: {
                width: { magnitude: 7600000, unit: 'EMU' },
                height: { magnitude: 2400000, unit: 'EMU' }
              },
              transform: {
                scaleX: 1, scaleY: 1, shearX: 0, shearY: 0,
                translateX: 1200000,
                translateY: 2600000,
                unit: 'EMU'
              }
            }
          }
        });

        const jPoints = slide.points.map(p => `•  ${p}`).join('\n\n');
        requests.push({
          insertText: { objectId: pointsId, text: jPoints, insertionIndex: 0 }
        });

        requests.push({
          updateTextStyle: {
            objectId: pointsId,
            textRange: { type: 'ALL' },
            style: {
              fontFamily: 'Cairo', fontSize: { magnitude: 13, unit: 'PT' },
              foregroundColor: { solidFill: { color: { rgbColor: activeTheme.textColor } } }
            },
            fields: 'fontFamily,fontSize,foregroundColor'
          }
        });

        requests.push({
          updateParagraphStyle: {
            objectId: pointsId,
            textRange: { type: 'ALL' },
            style: { alignment: 'RIGHT', lineSpacing: 115 },
            fields: 'alignment,lineSpacing'
          }
        });
      }

      const updateRes = await fetch(`https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ requests })
      });

      if (!updateRes.ok) {
        throw new Error(`Error preparing slide items: ${await updateRes.text()}`);
      }
    }

    // Clean up empty initial slide template
    try {
      await fetch(`https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          requests: [{ deleteObject: { objectId: 'p' } }]
        })
      });
    } catch(err) {
      console.log('Ignore default sheet removal block');
    }

    state.exportProgress = 100;
    state.exportState = 'success';
    state.createdPresentationUrl = `https://docs.google.com/presentation/d/${presentationId}/edit`;
    state.statusMessage = 'تم الانتهاء بنجاح! تم حفظ العرض في حسابك بـ Google Drive.';
  } catch(err) {
    console.error(err);
    state.exportState = 'error';
    state.statusMessage = `فشل عملية التصدير الرقمي للعرض: ${err.message || err}`;
  } finally {
    updateExportStateUI();
  }
}

// Sandbox Subsystem Controller
function initSandbox() {
  const ideaCards = document.querySelectorAll('.sandbox-idea-card');
  const customIdeaInput = document.getElementById('sandbox-custom-name');
  const customCatInput = document.getElementById('sandbox-custom-category');
  
  // Custom Material Form
  const addMaterialBtn = document.getElementById('sandbox-add-material-btn');
  const materialNameIn = document.getElementById('sandbox-material-name');
  const materialCostIn = document.getElementById('sandbox-material-cost');

  // Sliders
  const batchSlider = document.getElementById('sandbox-batch-slider');
  const priceSlider = document.getElementById('sandbox-price-slider');
  const interestSlider = document.getElementById('sandbox-interest-slider');
  const propPriceSlider = document.getElementById('sandbox-props-price-slider');

  // Launch Simulator
  const launchBtn = document.getElementById('sandbox-launch-sim-btn');
  const retrySimBtn = document.getElementById('results-retry-sim-btn');

  // Setup Idea listeners
  ideaCards.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      selectSandboxIdea(id);
    });
  });

  if (customIdeaInput) {
    customIdeaInput.addEventListener('input', (e) => {
      state.customIdeaName = e.target.value;
      state.selectedIdeaId = '';
      
      // Remove selected border from cards
      ideaCards.forEach(c => c.className = "p-5 rounded-2xl border text-right transition flex flex-col justify-between h-44 group border-slate-800 bg-slate-900/40 hover:border-slate-700/80");
      
      updateSandboxCalculations();
    });
  }

  if (customCatInput) {
    customCatInput.addEventListener('input', (e) => {
      state.customCategory = e.target.value;
    });
  }

  // Material ADD Action
  if (addMaterialBtn) {
    addMaterialBtn.addEventListener('click', () => {
      const name = materialNameIn.value;
      const cost = parseFloat(materialCostIn.value);
      if (!name || isNaN(cost) || cost <= 0) {
        alert('يرجى كتابة اسم خامة ووحدات ميزانية صحيحة.');
        return;
      }
      state.materials.push({
        id: Date.now().toString(),
        name,
        cost
      });
      materialNameIn.value = '';
      materialCostIn.value = '';
      renderMaterialsList();
      updateSandboxCalculations();
    });
  }

  // Sliders Change
  if (batchSlider) {
    batchSlider.addEventListener('input', (e) => {
      state.batchQuantity = parseInt(e.target.value);
      const valText = document.getElementById('sandbox-batch-val-display');
      if (valText) valText.innerText = `${state.batchQuantity} وحدة`;
      updateSandboxCalculations();
    });
  }

  if (priceSlider) {
    priceSlider.addEventListener('input', (e) => {
      state.sellingPrice = parseFloat(e.target.value);
      const valText = document.getElementById('sandbox-price-val-display');
      if (valText) valText.innerText = `${state.sellingPrice.toFixed(2)} ر.س`;
      updateSandboxCalculations();
    });
  }

  if (interestSlider) {
    interestSlider.addEventListener('input', (e) => {
      state.customerInterest = parseInt(e.target.value);
      const valText = document.getElementById('sandbox-interest-val-display');
      if (valText) valText.innerText = `${state.customerInterest} مهتمين`;
      updateSandboxCalculations();
    });
  }

  if (propPriceSlider) {
    propPriceSlider.addEventListener('input', (e) => {
      state.customerProposedPrice = parseFloat(e.target.value);
      const valText = document.getElementById('sandbox-props-price-val-display');
      if (valText) valText.innerText = `${state.customerProposedPrice.toFixed(2)} ر.س`;
      updateSandboxCalculations();
    });
  }

  // Simulation Launch Button
  if (launchBtn) {
    launchBtn.addEventListener('click', triggerSimulatorRun);
  }

  if (retrySimBtn) {
    retrySimBtn.addEventListener('click', () => {
      state.activeTab = 'sandbox';
      switchSandboxTab('brainstorm');
    });
  }

  // Sub tabs switching
  setupSandboxSubTabs();
  
  // Initial materials list render
  renderMaterialsList();
  updateSandboxCalculations();
}

function setupSandboxSubTabs() {
  const steps = ['brainstorm', 'capital', 'pricing', 'simulator', 'results'];
  steps.forEach(step => {
    const btn = document.getElementById(`step-lnk-${step}`);
    if (btn) {
      btn.addEventListener('click', () => {
        switchSandboxTab(step);
      });
    }
  });

  // Footer navigation actions inside step pages
  const nextLnkCapitalObj = document.getElementById('btn-next-capital');
  if (nextLnkCapitalObj) nextLnkCapitalObj.addEventListener('click', () => switchSandboxTab('capital'));

  const nextLnkPricingObj = document.getElementById('btn-next-pricing');
  if (nextLnkPricingObj) nextLnkPricingObj.addEventListener('click', () => switchSandboxTab('pricing'));

  const nextLnkSimObj = document.getElementById('btn-next-simulator');
  if (nextLnkSimObj) nextLnkSimObj.addEventListener('click', () => switchSandboxTab('simulator'));
}

function switchSandboxTab(step) {
  const steps = ['brainstorm', 'capital', 'pricing', 'simulator', 'results'];
  
  // Set tab buttons active styles
  steps.forEach(s => {
    const lnk = document.getElementById(`step-lnk-${s}`);
    const div = document.getElementById(`step-pan-${s}`);
    if (lnk) {
      if (s === step) {
        lnk.className = "py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10";
      } else {
        lnk.className = "py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 text-slate-400 hover:text-white hover:bg-slate-900";
      }
    }
    if (div) {
      if (s === step) {
        div.classList.remove('hidden');
        div.classList.add('animate-fadeIn');
      } else {
        div.classList.add('hidden');
        div.classList.remove('animate-fadeIn');
      }
    }
  });

  // Trigger graphs render
  if (step === 'pricing') {
    setTimeout(renderPricingSpectrumChart, 30);
  } else if (step === 'results') {
    setTimeout(updateSandboxCharts, 30);
  }
}

function selectSandboxIdea(id) {
  state.selectedIdeaId = id;
  state.customIdeaName = '';
  
  const customInput = document.getElementById('sandbox-custom-name');
  if (customInput) customInput.value = '';

  const idea = SANDBOX_IDEAS.find(x => x.id === id);
  if (idea) {
    state.materials = [...idea.defaultMaterials];
    state.sellingPrice = idea.suggestedPrice;
    state.customerInterest = idea.vInterest;
    state.customerProposedPrice = idea.vPrice;
    
    // Set Sliders values inside DOM
    const priceSlider = document.getElementById('sandbox-price-slider');
    const priceDisplay = document.getElementById('sandbox-price-val-display');
    if (priceSlider) priceSlider.value = idea.suggestedPrice;
    if (priceDisplay) priceDisplay.innerText = `${idea.suggestedPrice.toFixed(2)} ر.س`;

    const interestSlider = document.getElementById('sandbox-interest-slider');
    const interestDisplay = document.getElementById('sandbox-interest-val-display');
    if (interestSlider) interestSlider.value = idea.vInterest;
    if (interestDisplay) interestDisplay.innerText = `${idea.vInterest} مهتمين`;

    const proposedSlider = document.getElementById('sandbox-props-price-slider');
    const proposedDisplay = document.getElementById('sandbox-props-price-val-display');
    if (proposedSlider) proposedSlider.value = idea.vPrice;
    if (proposedDisplay) proposedDisplay.innerText = `${idea.vPrice.toFixed(2)} ر.س`;

    // Visual active highlight
    const ideaCards = document.querySelectorAll('.sandbox-idea-card');
    ideaCards.forEach(c => {
      if (c.dataset.id === id) {
        c.className = "p-5 rounded-2xl border text-right transition flex flex-col justify-between h-44 group border-amber-500 bg-amber-500/5 shadow-lg shadow-amber-500/5";
      } else {
        c.className = "p-5 rounded-2xl border text-right transition flex flex-col justify-between h-44 group border-slate-800 bg-slate-900/40 hover:border-slate-700/80";
      }
    });

    renderMaterialsList();
    updateSandboxCalculations();
  }
}

function renderMaterialsList() {
  const container = document.getElementById('sandbox-materials-list-root');
  if (!container) return;
  container.innerHTML = '';

  state.materials.forEach(m => {
    const div = document.createElement('div');
    div.className = "flex justify-between items-center bg-slate-900/60 px-4 py-3.5 rounded-xl border border-slate-800/80";
    div.innerHTML = `
      <div class="flex items-center gap-2">
        <i data-lucide="shopping-bag" class="w-4 h-4 text-slate-500"></i>
        <span class="text-xs sm:text-sm font-semibold text-slate-300 ml-1 pb-0.5">${m.name}</span>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-xs sm:text-sm font-bold text-slate-100 font-mono">${m.cost.toFixed(1)} ريال</span>
        <button class="delete-material-btn text-red-500/75 hover:text-red-400 hover:bg-red-500/5 p-1 rounded-lg transition" data-id="${m.id}" title="حذف">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>
    `;
    container.appendChild(div);
  });

  // Re-map lucide elements
  lucide.createIcons();

  // Bind deletes
  const dels = container.querySelectorAll('.delete-material-btn');
  dels.forEach(b => {
    b.addEventListener('click', () => {
      const mId = b.dataset.id;
      state.materials = state.materials.filter(x => x.id !== mId);
      renderMaterialsList();
      updateSandboxCalculations();
    });
  });

  // Empty indicator
  if (state.materials.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-slate-500 text-xs border border-dashed border-slate-850 rounded-xl font-sans">
        لا توجد خامات مضافة بعد. أضف بعض الخامات لصناعة الدفعة الأولى!
      </div>
    `;
  }
}

function updateSandboxCalculations() {
  const totalCapitalCost = state.materials.reduce((sum, item) => sum + item.cost, 0);
  const costPerUnit = state.batchQuantity > 0 ? parseFloat((totalCapitalCost / state.batchQuantity).toFixed(2)) : 0;
  const unitProfitMargin = parseFloat((state.sellingPrice - costPerUnit).toFixed(2));
  const profitMarginPercentage = state.sellingPrice > 0 ? parseFloat(((unitProfitMargin / state.sellingPrice) * 100).toFixed(1)) : 0;

  // Render elements
  const elCapital = document.getElementById('calc-capital-total');
  const elUnitCost = document.getElementById('calc-per-unit-cost');
  const elUnitMargin = document.getElementById('calc-profit-margin');
  const elMarginPct = document.getElementById('calc-profit-margin-percentage');

  // Sliders range updates
  const priceSlider = document.getElementById('sandbox-price-slider');
  if (priceSlider) {
    priceSlider.min = parseFloat((costPerUnit * 1.1).toFixed(1)) || 0.5;
    priceSlider.max = Math.max(10, costPerUnit * 5);
  }

  if (elCapital) elCapital.innerText = `${totalCapitalCost.toFixed(1)} ريال`;
  if (elUnitCost) elUnitCost.innerText = `${costPerUnit.toFixed(2)} ريالاً`;
  
  if (elUnitMargin) {
    elUnitMargin.innerText = `${unitProfitMargin.toFixed(2)} ريال`;
    if (unitProfitMargin >= 0) {
      elUnitMargin.className = "text-lg font-black text-emerald-450 font-mono bg-emerald-500/5 px-2.5 py-1 rounded-lg border border-emerald-500/10";
    } else {
      elUnitMargin.className = "text-lg font-black text-rose-400 font-mono bg-rose-500/5 px-2.5 py-1 rounded-lg border border-rose-500/10";
    }
  }

  if (elMarginPct) {
    elMarginPct.innerText = `${profitMarginPercentage}%`;
    if (profitMarginPercentage >= 0) {
      elMarginPct.className = "font-mono text-emerald-400 font-black text-right";
    } else {
      elMarginPct.className = "font-mono text-rose-450 font-black text-right";
    }
  }

  // Update launch helper card text
  const projLabel = document.getElementById('sim-helper-proj-name');
  const sizeLabel = document.getElementById('sim-helper-batch-size');
  const pTag = document.getElementById('sim-helper-price');
  const costTag = document.getElementById('sim-helper-unit-cost');

  const activeName = state.customIdeaName || SANDBOX_IDEAS.find(x => x.id === state.selectedIdeaId)?.name || 'مشروع مخصص';

  if (projLabel) projLabel.innerText = activeName;
  if (sizeLabel) sizeLabel.innerText = `${state.batchQuantity} وحدة`;
  if (pTag) pTag.innerText = `${state.sellingPrice.toFixed(2)} ريال`;
  if (costTag) costTag.innerText = `${costPerUnit.toFixed(2)} ر.س`;
}

function generatePricingSpectrum() {
  const totalCapitalCost = state.materials.reduce((sum, item) => sum + item.cost, 0);
  const costPerUnit = state.batchQuantity > 0 ? parseFloat((totalCapitalCost / state.batchQuantity).toFixed(2)) : 0;
  
  const step = 0.5;
  const data = {
    labels: [],
    revenues: [],
    costs: [],
    profits: []
  };

  for (let p = costPerUnit * 0.5; p <= Math.max(10, costPerUnit * 3); p += step) {
    if (p <= 0) continue;
    let interestFactor = 1.0;
    const priceRatio = state.customerProposedPrice > 0 ? p / state.customerProposedPrice : 1;
    
    if (priceRatio > 2.0) interestFactor = 0.2;
    else if (priceRatio > 1.5) interestFactor = 0.45;
    else if (priceRatio > 1.1) interestFactor = 0.8;
    else if (priceRatio < 0.8) interestFactor = 1.35;
    
    const estimatedUnits = Math.round(state.batchQuantity * interestFactor * (state.customerInterest / 5));
    const cappedUnits = Math.min(state.batchQuantity, estimatedUnits);
    
    const estRev = cappedUnits * p;
    const estCost = cappedUnits * costPerUnit;
    const estProfit = estRev - estCost;

    data.labels.push(parseFloat(p.toFixed(1)));
    data.revenues.push(parseFloat(estRev.toFixed(1)));
    data.costs.push(parseFloat(estCost.toFixed(1)));
    data.profits.push(parseFloat(estProfit.toFixed(1)));
  }

  return data;
}

function renderPricingSpectrumChart() {
  const ctx = document.getElementById('pricing-spectrum-canvas');
  if (!ctx) return;

  const chartData = generatePricingSpectrum();
  
  if (state.charts.pricingChart) {
    state.charts.pricingChart.destroy();
  }

  state.charts.pricingChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartData.labels,
      datasets: [
        {
          label: 'الأرباح المتوقعة الصافية',
          data: chartData.profits,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.05)',
          fill: true,
          tension: 0.35,
          borderWidth: 2.5
        },
        {
          label: 'إجمالي الإيرادات المفترضة',
          data: chartData.revenues,
          borderColor: '#06b6d4',
          borderDash: [4, 4],
          backgroundColor: 'transparent',
          tension: 0.35,
          borderWidth: 1.5
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#94a3b8', font: { family: 'Cairo', size: 10 } }
        },
        tooltip: {
          titleFont: { family: 'Cairo' },
          bodyFont: { family: 'Cairo' }
        }
      },
      scales: {
        x: {
          grid: { color: '#1e293b' },
          ticks: { color: '#64748b', font: { family: 'Cairo', size: 10 } },
          title: { display: true, text: 'سعر بيع الحبة (ريال)', color: '#64748b', font: { family: 'Cairo', size: 10 } }
        },
        y: {
          grid: { color: '#1e293b' },
          ticks: { color: '#64748b', font: { family: 'Cairo', size: 10 } },
          title: { display: true, text: 'القيمة المالية (ريال)', color: '#64748b', font: { family: 'Cairo', size: 10 } }
        }
      }
    }
  });
}

function triggerSimulatorRun() {
  const launcher = document.getElementById('launcher-active-sim-view');
  const player = document.getElementById('launcher-play-intro');
  if (launcher && player) {
    player.classList.add('hidden');
    launcher.classList.remove('hidden');
  }

  // Fast day calculations
  const totalCapitalCost = state.materials.reduce((sum, item) => sum + item.cost, 0);
  const costPerUnit = state.batchQuantity > 0 ? parseFloat((totalCapitalCost / state.batchQuantity).toFixed(2)) : 0;
  
  const results = [];
  let accBalance = 0;

  for (let i = 0; i < 5; i++) {
    const event = MARKET_EVENTS[i];
    const priceRatio = state.customerProposedPrice > 0 ? state.sellingPrice / state.customerProposedPrice : 1;
    let baseDemand = Math.round((state.batchQuantity / 5) * (state.customerInterest / 5));

    if (priceRatio > 1.5) baseDemand = Math.max(1, Math.round(baseDemand * 0.4));
    else if (priceRatio > 1.2) baseDemand = Math.max(1, Math.round(baseDemand * 0.75));
    else if (priceRatio < 0.9) baseDemand = Math.min(state.batchQuantity / 3, Math.round(baseDemand * 1.3));

    let finalSold = Math.round(baseDemand * event.multiplier);
    if (finalSold < 1) finalSold = 1;
    
    const cappedUnitsPerDay = Math.max(1, Math.round(state.batchQuantity / 4));
    if (finalSold > cappedUnitsPerDay * 1.5) finalSold = Math.round(cappedUnitsPerDay * 1.5);
    
    // Total inventory cap limit check: can't sell more than remaining parts in batch!
    const accumSoldSoFar = results.reduce((sum, r) => sum + r.soldUnits, 0);
    const leftInStock = state.batchQuantity - accumSoldSoFar;
    if (finalSold > leftInStock) finalSold = leftInStock;
    if (finalSold < 0) finalSold = 0;

    const rev = finalSold * state.sellingPrice;
    const directCost = finalSold * costPerUnit;
    const netProf = rev - directCost;
    accBalance += netProf;

    results.push({
      day: event.day,
      event: event.text,
      eventType: event.type,
      soldUnits: finalSold,
      pricePerUnit: state.sellingPrice,
      revenue: parseFloat(rev.toFixed(1)),
      expenses: parseFloat(directCost.toFixed(1)),
      profit: parseFloat(netProf.toFixed(1)),
      balanceAfter: parseFloat(accBalance.toFixed(1))
    });
  }

  state.simResults = results;
  state.cumulativeBalance = parseFloat(accBalance.toFixed(1));

  // Delay simulation UI for smooth gaming feel (1.5 seconds)
  setTimeout(() => {
    // Reset view
    if (player && launcher) {
      launcher.classList.add('hidden');
      player.classList.remove('hidden');
    }
    
    // Switch window to sub results tab
    switchSandboxTab('results');
    renderLedgerTable();
  }, 1500);
}

function renderLedgerTable() {
  const container = document.getElementById('results-ledger-rows-container');
  if (!container) return;
  container.innerHTML = '';

  const activeName = state.customIdeaName || SANDBOX_IDEAS.find(x => x.id === state.selectedIdeaId)?.name || 'مشروع مخصص';

  // Metrics numbers
  const sumProd = document.getElementById('res-total-produced');
  const sumSold = document.getElementById('res-total-sold');
  const sumRev = document.getElementById('res-total-revenues');
  const netProfit = document.getElementById('res-total-net-profit');

  const totalSold = state.simResults.reduce((sum, r) => sum + r.soldUnits, 0);
  const totalRev = state.simResults.reduce((sum, r) => sum + r.revenue, 0);

  if (sumProd) sumProd.innerText = `${state.batchQuantity} حبة`;
  if (sumSold) sumSold.innerText = `${totalSold} حبة`;
  if (sumRev) sumRev.innerText = `${totalRev.toFixed(1)} ريالاً`;
  
  if (netProfit) {
    netProfit.innerText = `${state.cumulativeBalance} ر.س`;
    if (state.cumulativeBalance >= 0) {
      netProfit.className = "text-2xl font-black font-mono mt-1 block text-emerald-400";
    } else {
      netProfit.className = "text-2xl font-black font-mono mt-1 block text-rose-450";
    }
  }

  // Populate actual rows matching spreadsheet styles
  state.simResults.forEach(row => {
    const tr = document.createElement('tr');
    tr.className = "hover:bg-slate-900/40 transition border-b border-slate-900";
    
    const profClass = row.profit >= 0 ? 'text-emerald-400 font-extrabold' : 'text-rose-450 font-extrabold';
    const profVal = row.profit >= 0 ? `+${row.profit.toFixed(1)}` : row.profit.toFixed(1);

    tr.innerHTML = `
      <td class="p-4 font-bold text-slate-200">يوم ${row.day}</td>
      <td class="p-4 font-semibold text-slate-300 text-xs sm:text-sm">${activeName}</td>
      <td class="p-4 text-[10px] sm:text-xs leading-relaxed text-slate-400 max-w-[150px] sm:max-w-xs">${row.event}</td>
      <td class="p-4 font-mono font-bold text-slate-100">${row.revenue.toFixed(1)} ريال</td>
      <td class="p-4 font-mono text-slate-500">${row.expenses.toFixed(1)} ريال</td>
      <td class="p-4 font-mono ${profClass}">${profVal} ريال</td>
    `;
    container.appendChild(tr);
  });
}

function updateSandboxCharts() {
  if (state.simResults.length === 0) return;

  const canvasDays = document.getElementById('results-dayschart-canvas');
  const canvasBalance = document.getElementById('results-balancechart-canvas');

  if (!canvasDays || !canvasBalance) return;

  const names = state.simResults.map(r => `يوم ${r.day}`);
  const revenues = state.simResults.map(r => r.revenue);
  const profits = state.simResults.map(r => r.profit);

  const cumBalances = [0];
  let acc = 0;
  state.simResults.forEach(r => {
    acc += r.profit;
    cumBalances.push(parseFloat(acc.toFixed(1)));
  });
  const balanceLabels = ['البداية', ...names];

  // Destroy stale Charts
  if (state.charts.daysChart) state.charts.daysChart.destroy();
  if (state.charts.balanceChart) state.charts.balanceChart.destroy();

  // Draw indicators side-by-side bar chart
  state.charts.daysChart = new Chart(canvasDays, {
    type: 'bar',
    data: {
      labels: names,
      datasets: [
        {
          label: 'الإيرادات اليومية',
          data: revenues,
          backgroundColor: '#06b6d4',
          borderRadius: 4
        },
        {
          label: 'صافي أرباح اليوم',
          data: profits,
          backgroundColor: '#10b981',
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#94a3b8', font: { family: 'Cairo', size: 10 } } }
      },
      scales: {
        x: { grid: { color: '#1e293b' }, ticks: { color: '#64748b', font: { family: 'Cairo', size: 10 } } },
        y: { grid: { color: '#1e293b' }, ticks: { color: '#64748b', font: { family: 'Cairo', size: 10 } } }
      }
    }
  });

  // Draw cumulative line charts
  state.charts.balanceChart = new Chart(canvasBalance, {
    type: 'line',
    data: {
      labels: balanceLabels,
      datasets: [{
        label: 'رصيد المدخرات التراكمي',
        data: cumBalances,
        borderColor: '#fbbf24',
        backgroundColor: 'rgba(251, 191, 36, 0.05)',
        tension: 0.35,
        fill: true,
        borderWidth: 2.5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#94a3b8', font: { family: 'Cairo', size: 10 } } }
      },
      scales: {
        x: { grid: { color: '#1e293b' }, ticks: { color: '#64748b', font: { family: 'Cairo', size: 10 } } },
        y: { grid: { color: '#1e293b' }, ticks: { color: '#64748b', font: { family: 'Cairo', size: 10 } } }
      }
    }
  });
}

// Gamified Quiz challenge
function initQuiz() {
  const startBtn = document.getElementById('quiz-start-action-btn');
  const verifyBtn = document.getElementById('quiz-verify-action-btn');
  const nextBtn = document.getElementById('quiz-next-action-btn');
  const restartBtn = document.getElementById('quiz-restart-action-btn');

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      state.quizStarted = true;
      state.quizFinished = false;
      state.currentQuestionIndex = 0;
      state.score = 0;
      state.selectedOptionIndex = null;
      state.hasSubmitted = false;
      
      // Reset badges
      state.badges.forEach(b => b.unlocked = false);

      renderQuizUI();
    });
  }

  if (verifyBtn) verifyBtn.addEventListener('click', handleQuizVerify);
  if (nextBtn) nextBtn.addEventListener('click', handleQuizNextQuestion);
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      state.quizStarted = false;
      state.quizFinished = false;
      renderQuizUI();
    });
  }
}

function renderQuizUI() {
  const startCard = document.getElementById('quiz-start-screen-card');
  const activeCard = document.getElementById('quiz-active-screen-card');
  const endCard = document.getElementById('quiz-finished-screen-card');

  if (state.quizStarted && !state.quizFinished) {
    if (startCard) startCard.classList.add('hidden');
    if (activeCard) {
      activeCard.classList.remove('hidden');
      activeCard.classList.add('animate-fadeIn');
    }
    if (endCard) endCard.classList.add('hidden');
    
    renderActiveQuestion();
  }
  
  else if (state.quizFinished) {
    if (startCard) startCard.classList.add('hidden');
    if (activeCard) activeCard.classList.add('hidden');
    if (endCard) {
      endCard.classList.remove('hidden');
      endCard.classList.add('animate-fadeIn');
    }
    
    renderQuizEndSummary();
  }
  
  else {
    if (startCard) {
      startCard.classList.remove('hidden');
      startCard.classList.add('animate-fadeIn');
    }
    if (activeCard) activeCard.classList.add('hidden');
    if (endCard) endCard.classList.add('hidden');
  }
}

function renderActiveQuestion() {
  const q = QUIZ_QUESTIONS[state.currentQuestionIndex];
  if (!q) return;

  // Counter
  const countSpan = document.getElementById('quiz-step-counter-badge');
  if (countSpan) countSpan.innerText = `السؤال ${state.currentQuestionIndex + 1} من ${QUIZ_QUESTIONS.length}`;

  // Texts
  const questionTitle = document.getElementById('quiz-question-title');
  if (questionTitle) questionTitle.innerText = q.question;

  // Render options list
  const container = document.getElementById('quiz-options-container');
  if (!container) return;
  container.innerHTML = '';

  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = getOptionButtonClasses(idx);
    btn.disabled = state.hasSubmitted;
    
    btn.innerHTML = `
      <span class="text-right">${opt}</span>
      <span class="w-5 h-5 rounded-full border border-slate-800 flex-shrink-0 flex items-center justify-center font-mono text-[10px] ml-2 text-slate-500 bg-slate-950 font-bold select-none">
        ${String.fromCharCode(65 + idx)}
      </span>
    `;

    btn.addEventListener('click', () => {
      if (state.hasSubmitted) return;
      state.selectedOptionIndex = idx;
      
      // Update custom visuals
      const optionsButtons = container.querySelectorAll('button');
      optionsButtons.forEach((b, childIdx) => {
        b.className = getOptionButtonClasses(childIdx);
      });
      
      const verifyBtn = document.getElementById('quiz-verify-action-btn');
      if (verifyBtn) verifyBtn.disabled = false;
    });

    container.appendChild(btn);
  });

  // Action bars details
  const verifyBtn = document.getElementById('quiz-verify-action-btn');
  const nextBtn = document.getElementById('quiz-next-action-btn');
  if (verifyBtn) {
    verifyBtn.classList.remove('hidden');
    verifyBtn.disabled = (state.selectedOptionIndex === null);
  }
  if (nextBtn) nextBtn.classList.add('hidden');

  // Clear explanation pane
  const explPane = document.getElementById('quiz-explanation-box-wrap');
  if (explPane) {
    explPane.innerHTML = `
      <div class="bg-slate-950/30 border border-slate-800/80 rounded-2xl p-5 text-center text-slate-500 py-10 space-y-3">
        <i data-lucide="info" class="w-8 h-8 text-slate-700 mx-auto"></i>
        <p class="text-xs leading-relaxed max-w-xs mx-auto">
          حدد أحد الخيارات المتاحة واضغط على "تأكيد الإجابة" لمقايسة الحسابات ورؤية تعليق المدقق المالي.
        </p>
      </div>
    `;
    lucide.createIcons();
  }
}

function getOptionButtonClasses(idx) {
  let base = "w-full p-4 rounded-xl border text-right transition flex items-center justify-between text-xs sm:text-sm font-semibold ";
  const q = QUIZ_QUESTIONS[state.currentQuestionIndex];

  if (!state.hasSubmitted) {
    if (state.selectedOptionIndex === idx) {
      return base + "border-amber-500 bg-amber-500/10 text-amber-400";
    } else {
      return base + "border-slate-800 bg-slate-900/40 hover:border-slate-700 text-slate-300";
    }
  } else {
    // Submitted styles
    if (idx === q.correctIndex) {
      return base + "border-emerald-500 bg-emerald-500/15 text-emerald-400 font-bold shadow-lg shadow-emerald-500/5";
    } else if (state.selectedOptionIndex === idx) {
      return base + "border-rose-500 bg-rose-500/15 text-rose-450 font-bold";
    } else {
      return base + "border-slate-850 bg-slate-900/20 text-slate-600";
    }
  }
}

function handleQuizVerify() {
  if (state.selectedOptionIndex === null || state.hasSubmitted) return;

  const q = QUIZ_QUESTIONS[state.currentQuestionIndex];
  const isCorrect = (state.selectedOptionIndex === q.correctIndex);
  
  state.hasSubmitted = true;
  if (isCorrect) {
    state.score += 1;
  }

  // Update Badge unlock
  state.badges.forEach(badge => {
    if (badge.id === 'b1' && state.currentQuestionIndex === 0 && isCorrect) badge.unlocked = true;
    if (badge.id === 'b2' && state.currentQuestionIndex === 1 && isCorrect) badge.unlocked = true;
    if (badge.id === 'b3' && state.currentQuestionIndex === 2 && isCorrect) badge.unlocked = true;
    if (badge.id === 'b4' && state.currentQuestionIndex === 3 && isCorrect) badge.unlocked = true;
  });

  // Re-style buttons list
  const container = document.getElementById('quiz-options-container');
  if (container) {
    const buttons = container.querySelectorAll('button');
    buttons.forEach((b, childIdx) => {
      b.className = getOptionButtonClasses(childIdx);
      b.disabled = true;
    });
  }

  // Toggle buttons
  const verifyBtn = document.getElementById('quiz-verify-action-btn');
  const nextBtn = document.getElementById('quiz-next-action-btn');
  if (verifyBtn) verifyBtn.classList.add('hidden');
  if (nextBtn) nextBtn.classList.remove('hidden');

  // Render response comments
  const explPane = document.getElementById('quiz-explanation-box-wrap');
  if (explPane) {
    const headerColor = isCorrect ? 'text-emerald-405' : 'text-rose-405';
    const headerTitle = isCorrect ? 'إجابة ممتازة وصحيحة! 🎉' : 'حاول استيعاب المبدأ! 🧭';
    const headerIcon = isCorrect ? 'check-circle-2' : 'x-circle';

    explPane.innerHTML = `
      <div class="bg-slate-950/50 border border-slate-850 rounded-2xl p-5 space-y-4 animate-fadeIn">
        <h4 class="text-sm font-extrabold flex items-center gap-2 ${headerColor}">
          <i data-lucide="${headerIcon}" class="w-5 h-5"></i>
          ${headerTitle}
        </h4>
        <p class="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans font-medium">
          ${q.explanation}
        </p>
      </div>
    `;
    lucide.createIcons();
  }
}

function handleQuizNextQuestion() {
  state.selectedOptionIndex = null;
  state.hasSubmitted = false;

  if (state.currentQuestionIndex + 1 < QUIZ_QUESTIONS.length) {
    state.currentQuestionIndex += 1;
    renderQuizUI();
  } else {
    state.quizFinished = true;
    renderQuizUI();
  }
}

function renderQuizEndSummary() {
  const resultDisplay = document.getElementById('quiz-final-score-text');
  if (resultDisplay) resultDisplay.innerText = `${state.score} / ${QUIZ_QUESTIONS.length}`;

  // Populate dynamic earned bags
  const badgeRoot = document.getElementById('quiz-earned-badges-root');
  if (!badgeRoot) return;
  badgeRoot.innerHTML = '';

  state.badges.forEach(badge => {
    const div = document.createElement('div');
    const borderClass = badge.unlocked ? 'border-amber-500 bg-amber-500/5 shadow-md shadow-amber-500/5' : 'border-slate-850 bg-slate-900/10 opacity-35';
    const checkBadge = badge.unlocked ? `<span class="absolute top-2 right-2 bg-amber-500 text-slate-950 p-0.5 rounded-full block"><i data-lucide="check" class="w-3 h-3"></i></span>` : '';
    
    div.className = `p-4 rounded-xl border text-center relative overflow-hidden transition-all duration-300 ${borderClass}`;
    div.innerHTML = `
      ${checkBadge}
      <span class="text-3xl block mb-2 select-none">${badge.icon}</span>
      <h5 class="font-extrabold text-[11px] text-slate-200 mt-1 select-all font-display">${badge.name}</h5>
      <p class="text-[9px] text-slate-500 mt-1.5 leading-relaxed font-sans">${badge.description}</p>
    `;

    badgeRoot.appendChild(div);
  });
  lucide.createIcons();
}

// Master Render loop
function renderApp() {
  renderSlideBody();
}

// Sidebar/Trainer notes contents handler
function getTrainerNotesHtml(id) {
  const notes = {
    1: "📌 <b>توصية البدء:</b> رحّب بالطلاب بحب وشغف! عرّفهم بنفسك وبيّن لهم مدى سهولة وجمال لغة ريادة الأعمال للنهوض بمستقبل الفرد ومجتمعه المالي. أكّد لهم أنهم في نهاية الساعة الحالية سيحدثون فارقًا حقيقيًا بتصميم أول تجربة تجارية لهم وعرض أفكارهم بفخر.",
    2: "📌 <b>توجيه الأهداف:</b> اقرأ الأهداف بلغة واضحة ونبرة واثقة، وأشر للطلاب بأن الموازنة والحساب ليست مخصصة لكبار المحاسبين والشركات العملاقة فقط، بل يستطيع ذو الـ 14 عاماً البدء بها والنجاح بأبسط الأدوات المنزلية المادية المتاحة.",
    3: "📌 <b>تأطير قصة أحمد:</b> اسأل الفصل: هل ترون أحمد عبقرياً غير اعتيادي؟ الجواب: لا، أحمد طفل متميز فكر وقرأ وبدأ بهدوء مع كوب ورق وتلوين صفي. سر نجاحه يكمن في البساطة والتنفيذ، وعدم المغامرة برأس مال ضخم! شجعهم على مناقشة جدوى الـ 70 ريالًا.",
    4: "📌 <b>تطوير فكرة الطالب:</b> اطلب من الطلاب أخذ ورقة بيضاء الآن، وكتابة هواية واحدة يتقنونها ومحاولة إقرانها بمنتج يلبي رغبة حقيقية أو مشكلة تواجه زملائهم خلال الأسبوع الدراسي (مثلاً بيع ملصقات لافتة لغلاف الحاسوب).",
    5: "📌 <b>شرح دراسة العملاء:</b> اشرح للطلاب فكرة استطلاع الآراء. 'قبل أن تشتري الخيوط أو تصنع الكب كيك لتجهيز 50 قطعة، اسأل 5 أشخاص عن السعر المقبول'. يعلّمهم ذلك ألا يضعوا رأسمالهم في منتجات لا تعجب رفاقهم.",
    6: "📌 <b>صياغة رأسمال الدفعة:</b> ادعُ الطلاب لتعداد القطع والمكونات. وضّح لهم أن الشاي والسكر يشترى بـ 10 ريالات ويصنف رأسمال، بينما الماء المنزلي لا يحسب تكلفة هدر، وعلّمهم تصنيف وتتبع الأسعار لتفادي المفاجآت التضخمية.",
    7: "📌 <b>آلية التسعير وعمل هامش الربح:</b> فسر المعادلة بلغة واضحة: 'لا تبيع بأقل من سعر التكلفة'. إن كلفة الكوب البلاستيكي والليموني 1.5 ريال، وقررت بيعه بـ 2.5 ريال لتكسب 1 ريال كامل. هذا الريال هو ما يضمن لك مكافأة تعبك وشراء مخزون أفضل للغد.",
    8: "📌 <b>أمثلة تسعير ريادي الغد:</b> استعرض الجدول مع الطلاب، وناقشهم في حجم التكاليف البسيطة وسعر البيع الذي يراه الجميع في متناول مصروفهم اليومي. بيّن لهم ملاءمة هذه الأرقام لدعم القدرة الشرائية في مجتمعهم المدرسي.",
    9: "📌 <b>فهم الإيراد العام:</b> أكّد لهم أن الدرّج الذي يجمع المال لا يمثل الربح الصافي. 'إذا جمعت 40 ريالاً فذلك يسمى الإيراد الإجمالي للبيع بالكامل وليس الفوائض'. اطلب منهم ترديد المعادلة لتطبيقها في الذهن.",
    10: "📌 <b>تثبيت المصروف:</b> وضّح قيمة المصاريف المترتبة على إنتاج الـ 20 قطعة. ركّز في هذه الشريحة على تبيان أن أي قطعة خربت أو تلفت أثناء الإعداد هي مصروف وتكسب موازنة ويجب احتسابها بدقة لتجنب التعثر.",
    11: "📌 <b>التوازن بين الإيراد والمصروف:</b> اجعل الطلاب يشاهدون تدوير ميزان الربح والخسارة. 'الربح هو الفرق الإيجابي'. واطرح عليهم تساؤلاً ذهنياً مفاجئاً: 'ماذا لو كانت مصروفاتنا لطباعة الدفتر 35 ريالاً وبعنا بـ 30 فقط؟ كم الخسارة؟' (الجواب: خسارة 5 ريالات!).",
    12: "📌 <b>تفصيل موازنة البرتغال المنعش:</b> اطلب من أحد الطلاب قراءة الجدول وموازنة البرتقال. ناقشهم في أن الربح المتكرر لثلاثة أيام وقيمته 45 ريالاً يكفل لهم استعادة كامل موازنة رأس المال الأولية مع الاحتفاظ بفائض مالي حقيقي واعد.",
    13: "📌 <b>تطبيق خارطة الطريق:</b> عرّفهم بكيفية أخذ خطوات ملموسة. اطلب منهم الاستعانة بدعم الوالدين للحصول على أولى قروض البدء الرمزية أو تفضيل شراء الخامات بصورة مشتركة لتلافي أي عقبة في التجهير الحقيقي للمشروع.",
    14: "📌 <b>توجيهات وملاحظات الحماية للطلاب:</b> اشرح لهم بحرص: 'التدوين اليومي للديون والحسابات يقوي الثقة وصدق النوايا في التجارة'. وعلّمهم أن سؤال العميل الرافض هو أهم فرصة لتطوير المنتجات وليس مصدراً مسبباً للضيق.",
    15: "📌 <b>استخدام دفتر الحسابات اليومي:</b> اعرض ومثّل لهم بالنقاش حول تدوير وتدوين الإيراد يومي الأحد والاثنين. اطلب منهم استخلاص النضج الحسابي الحقيقي وأهمية ترتيب الإيراد لمعرفة مصادر نمو الفوائض المالية للمشروع.",
    16: "📌 <b>إدارة النشاط الجماعي (10 دقائق):</b> قسّم قاعة الورشة أو الطلاب لمجموعات ثنائية أو مصفوفة من 4 طلاب. اجعلهم يجيبون على مستويات الإنتاج والتسعير المقترحة لسندويش الجبن وعرض نتيجتهم بالنقاش لتقوية الحوار والقدرات.",
    17: "📌 <b>تقديم فرص المشاريع الجاهزة:</b> عرّفهم بالفرص اللطيفة المرشحة لبدء نشاط صفي فوري بأساور وخيوط ملونة أو طباعة ملصقات الرموز. هذه أفكار مجربة وثبت مواءمتها المادية والمجتمعية لكل الأطفال بعمر 14 عاماً.",
    18: "📌 <b>تأطير ومواجهة التحديات:</b> وجّه نظرهم بالقول: 'رائد الأعمال الحقيقي يصنع الحلول'. اسألهم عن طريقتهم المفضلة لمجابهة المنافسة وتلافي تلف الفاكهة كعصير واحتوائهم بمواد مقاومة ومرنة لا تخضع للتلف.",
    19: "📌 <b>تفعيل تطبيق المهمة المنزلية:</b> رغبهم في تنفيذ الواجب بالتنسيق الأسري، واقترح توزيع نموذج التسجيل المبسط ليدونوا به نجاح مبيعاتهم الأولية ويكتبوا عليه بزهو وفخر أكبر درس تجاري واستثمار مالي تعلموه.",
    20: "📌 <b>خاتمة خلاقة وشكر:</b> بادر بتهنئة الطلاب على صبرهم واستماعهم، ووزّع عليهم رمزياً ألقاب وشارات رواد الأعمال الصغار. أكّد لهم أن التفوق الدراسي يزيد من قدرتهم على النجاح التجاري لاحقاً باقتدار مالي واعٍ."
  };
  return notes[id] || '';
}
