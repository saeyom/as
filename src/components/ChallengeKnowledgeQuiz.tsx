import { useState } from 'react';
import { QuizQuestion, Badge } from '../types';
import { Award, CheckCircle2, XCircle, Info, RefreshCw, Trophy, Crown, Check, Play } from 'lucide-react';

const QUESTIONS: QuizQuestion[] = [
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

const INITIAL_BADGES: Badge[] = [
  { id: 'b1', name: 'مخطط ريادي واعد 🧠', description: 'أجب على السؤال الأول بنجاح وافهم آلية هامش الربح', icon: '💡', color: 'from-amber-500 to-orange-500', unlocked: false },
  { id: 'b2', name: 'أمين الخزينة الذكي 💰', description: 'افهم معادلة الإيرادات الإجمالية بدقة لليوم الصفي', icon: '🏛️', color: 'from-blue-500 to-cyan-500', unlocked: false },
  { id: 'b3', name: 'موازن الحسابات الفذ ⚖️', description: 'فرّق بنجاح بين إيرادات المتجر ومصروفاته للوصول لصافي الأرباح', icon: '📈', color: 'from-emerald-500 to-teal-500', unlocked: false },
  { id: 'b4', name: 'صانع الحلول المرن 🚀', description: 'تعامل بذكاء ريادي لتخطي ضعف المبيعات ومفارقات السوق الدراسية', icon: '🏆', color: 'from-fuchsia-500 to-rose-500', unlocked: false }
];

export default function ChallengeKnowledgeQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [quizStarted, setQuizStarted] = useState(false);

  const currentQuestion = QUESTIONS[currentQuestionIndex];

  const handleOptionSelect = (index: number) => {
    if (hasSubmitted) return;
    setSelectedOptionIndex(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOptionIndex === null || hasSubmitted) return;
    
    const isCorrect = selectedOptionIndex === currentQuestion.correctIndex;
    if (isCorrect) {
      setScore(score + 1);
    }

    setHasSubmitted(true);

    // Update dynamic badges unlocking
    setBadges(prevBadges => {
      return prevBadges.map(badge => {
        if (badge.id === 'b1' && currentQuestionIndex === 0 && isCorrect) return { ...badge, unlocked: true };
        if (badge.id === 'b2' && currentQuestionIndex === 1 && isCorrect) return { ...badge, unlocked: true };
        if (badge.id === 'b3' && currentQuestionIndex === 2 && isCorrect) return { ...badge, unlocked: true };
        if (badge.id === 'b4' && currentQuestionIndex === 3 && isCorrect) return { ...badge, unlocked: true };
        return badge;
      });
    });
  };

  const handleNextQuestion = () => {
    setSelectedOptionIndex(null);
    setHasSubmitted(false);
    
    if (currentQuestionIndex + 1 < QUESTIONS.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setHasSubmitted(false);
    setScore(0);
    setQuizFinished(false);
    setBadges(INITIAL_BADGES);
  };

  return (
    <div id="quiz-block-section" className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      
      {/* Quiz banner */}
      <div className="bg-slate-950 px-6 py-5 border-b border-slate-800 flex justify-between items-center flex-wrap gap-4">
        <div>
          <span className="bg-emerald-500/10 text-emerald-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider block w-fit mb-1">
            بنك المعرفة والمسابقات
          </span>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <Trophy className="text-amber-500 w-5 h-5" />
            تحدي الرواد الصغار والربحية الذكية
          </h2>
        </div>
        {quizStarted && !quizFinished && (
          <div className="bg-slate-900 border border-slate-800 px-4 py-1.5 rounded-xl font-mono text-xs text-slate-400">
            السؤال <b className="text-white">{currentQuestionIndex + 1}</b> من {QUESTIONS.length}
          </div>
        )}
      </div>

      <div className="p-6 sm:p-8">
        
        {!quizStarted ? (
          <div className="text-center py-10 space-y-6 max-w-xl mx-auto">
            <div className="bg-amber-500/5 p-6 rounded-3xl border border-amber-500/10 inline-block">
              <Crown className="w-16 h-16 text-amber-500 animate-bounce" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-white font-display">هل أنت جاهز لتحدي عمالقة المال؟</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-sans">
                اختبر مهاراتك المالية والريادية التي تعلمتها اليوم من الشرائح، واكسب أوسمة الأبطال لتضعها بفخر في مشروعك الخاص بموازنة الصف.
              </p>
            </div>
            <button
              onClick={() => setQuizStarted(true)}
              className="bg-emerald-500 text-slate-950 hover:bg-emerald-600 transition font-extrabold px-8 py-3.5 rounded-xl text-sm shadow-lg shadow-emerald-500/10"
            >
              ابدأ التحدي الصفي الآن 👋
            </button>
          </div>
        ) : quizFinished ? (
          <div className="space-y-8">
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-850 text-center max-w-lg mx-auto space-y-4">
              <div className="inline-block bg-amber-500/10 text-amber-500 p-4 rounded-full">
                <Crown className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-white font-display">تهانينا الحارة يا بطل ريادة الأعمال!</h3>
              <p className="text-3xl font-mono font-black text-amber-400">{score} / {QUESTIONS.length}</p>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                لقد أكملت ورشة اليوم واستوعبت بنجاح معادلات الربحية والتكلفة والتطوير المرن لحل مشكلات المشاريع المدرسية.
              </p>
              
              <div className="pt-2">
                <button
                  onClick={handleResetQuiz}
                  className="bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-bold py-2.5 px-5 rounded-xl transition inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" />
                  إعادة المحاولة
                </button>
              </div>
            </div>

            {/* Unlocked Badges results */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h4 className="text-sm font-bold text-slate-300 font-display text-center">الأوسمة والجوائز التي حصلت عليها:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-xl border text-center relative overflow-hidden transition ${
                      badge.unlocked
                        ? 'border-amber-500 bg-amber-500/5'
                        : 'border-slate-800 bg-slate-900/10 opacity-40'
                    }`}
                  >
                    {badge.unlocked && (
                      <span className="absolute top-2 right-2 bg-amber-500 text-slate-950 p-0.5 rounded-full block">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                    <span className="text-3xl block mb-2">{badge.icon}</span>
                    <h5 className="font-bold text-xs text-slate-200 font-display">{badge.name}</h5>
                    <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{badge.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Question column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-950/30 p-5 rounded-2xl border border-slate-850">
                <h3 className="text-sm text-amber-500 font-bold mb-1">السؤال المالي النشط:</h3>
                <p className="text-base font-bold text-slate-100 font-display leading-relaxed">
                  {currentQuestion.question}
                </p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((option, idx) => {
                  let optStyle = 'border-slate-800 bg-slate-900/40 hover:border-slate-700 text-slate-300';
                  if (selectedOptionIndex === idx) {
                    optStyle = 'border-amber-500 bg-amber-500/10 text-amber-400 font-semibold';
                  }

                  if (hasSubmitted) {
                    if (idx === currentQuestion.correctIndex) {
                      optStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold';
                    } else if (selectedOptionIndex === idx) {
                      optStyle = 'border-rose-500 bg-rose-500/10 text-rose-400 font-bold';
                    } else {
                      optStyle = 'border-slate-800 bg-slate-900/20 text-slate-600';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={hasSubmitted}
                      onClick={() => handleOptionSelect(idx)}
                      className={`w-full p-4 rounded-xl border text-right transition flex items-center justify-between text-xs sm:text-sm ${optStyle}`}
                    >
                      <span>{option}</span>
                      <span className="w-5 h-5 rounded-full border border-slate-700 flex-shrink-0 flex items-center justify-center font-mono text-[10px] ml-2 text-slate-500">
                        {String.fromCharCode(65 + idx)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Action bar submitting */}
              <div className="flex justify-end pt-2">
                {!hasSubmitted ? (
                  <button
                    disabled={selectedOptionIndex === null}
                    onClick={handleSubmitAnswer}
                    className="bg-amber-500 text-slate-950 disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none transition font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md shadow-amber-500/10"
                  >
                    تأكيد الإجابة والتحقق من الربحية!
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="bg-emerald-500 text-slate-950 hover:bg-emerald-600 transition font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md"
                  >
                    السؤال التالي
                    <Play className="w-3.5 h-3.5 rotate-180 inline-block mr-1.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Explanations section */}
            <div className="space-y-4">
              {hasSubmitted ? (
                <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <h4 className="text-sm font-bold flex items-center gap-2 font-display">
                    {selectedOptionIndex === currentQuestion.correctIndex ? (
                      <span className="text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-5 h-5" />
                        إجابة ممتازة وصحيحة!
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1.5">
                        <XCircle className="w-5 h-5" />
                        حاول استيعاب المبدأ!
                      </span>
                    )}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                    {currentQuestion.explanation}
                  </p>
                </div>
              ) : (
                <div className="bg-slate-950/30 border border-slate-800/80 rounded-2xl p-5 text-center text-slate-500 py-10 space-y-3">
                  <Info className="w-8 h-8 text-slate-650 mx-auto" />
                  <p className="text-xs leading-relaxed max-w-xs mx-auto">
                    حدد أحد الخيارات المتاحة واضغط على "تأكيد الإجابة" لمقايسة الحسابات ورؤية تعليق المدقق المالي.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
