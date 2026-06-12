import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { initAuth, googleSignIn, logout } from '../lib/firebaseAuth';
import { ALL_20_SLIDES } from '../lib/slidesData';
import { LogIn, LogOut, Presentation, ArrowUpRight, Share2, Sparkles, CheckCircle2, Loader2, Play } from 'lucide-react';

interface GoogleSlidesExporterProps {
  onExportSuccess?: (presentationId: string) => void;
}

interface PresentationTheme {
  id: string;
  name: string;
  primaryColor: { red: number; green: number; blue: number };
  secondaryColor: { red: number; green: number; blue: number };
  backgroundColor: { red: number; green: number; blue: number };
  textColor: { red: number; green: number; blue: number };
  accentColor: { red: number; green: number; blue: number };
  bgHex: string;
  primaryHex: string;
}

const THEMES: PresentationTheme[] = [
  {
    id: 'navy_royal',
    name: 'أزرق ملكي وذهبي دافئ 💎',
    backgroundColor: { red: 0.06, green: 0.09, blue: 0.16 }, // Slate dark
    primaryColor: { red: 0.93, green: 0.73, blue: 0.35 },    // Golden Accent
    secondaryColor: { red: 0.22, green: 0.53, blue: 0.93 },  // Royal blue
    textColor: { red: 0.97, green: 0.98, blue: 1.0 },       // Off white
    accentColor: { red: 0.12, green: 0.16, blue: 0.27 },     // Dark card bg
    bgHex: '#0f172a',
    primaryHex: '#f59e0b'
  },
  {
    id: 'sunset_glow',
    name: 'غروب ريادي دافئ 🌅',
    backgroundColor: { red: 0.18, green: 0.07, blue: 0.08 }, // Dark crimson sunset
    secondaryColor: { red: 0.96, green: 0.44, blue: 0.26 },  // Coral orange
    primaryColor: { red: 0.98, green: 0.81, blue: 0.4 },     // Sunset yellow
    textColor: { red: 0.99, green: 0.96, blue: 0.93 },       // Warm white
    accentColor: { red: 0.26, green: 0.11, blue: 0.14 },     // Dark orange-card
    bgHex: '#2e1214',
    primaryHex: '#f97316'
  },
  {
    id: 'emerald_modern',
    name: 'أخضر زمردي ريادي 🌿',
    backgroundColor: { red: 0.02, green: 0.13, blue: 0.1 },  // Dark emerald
    primaryColor: { red: 0.2, green: 0.9, blue: 0.61 },      // Mint green
    secondaryColor: { red: 0.52, green: 0.6, blue: 0.95 },   // Lavender
    textColor: { red: 0.95, green: 0.99, blue: 0.97 },       // Minty white
    accentColor: { red: 0.04, green: 0.21, blue: 0.17 },     // Forest green card
    bgHex: '#06201b',
    primaryHex: '#10b981'
  },
  {
    id: 'clean_charcoal',
    name: 'رمادي فحمي كلاسيكي رصين 🏢',
    backgroundColor: { red: 0.12, green: 0.12, blue: 0.14 }, // Charcoal
    primaryColor: { red: 1.0, green: 1.0, blue: 1.0 },       // Pure White
    secondaryColor: { red: 0.55, green: 0.58, blue: 0.67 },  // Slate grey
    textColor: { red: 0.94, green: 0.94, blue: 0.96 },       // Grey-white
    accentColor: { red: 0.18, green: 0.18, blue: 0.21 },     // Dark coal card
    bgHex: '#1e1e22',
    primaryHex: '#ffffff'
  }
];

export default function GoogleSlidesExporter({ onExportSuccess }: GoogleSlidesExporterProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [exportState, setExportState] = useState<'idle' | 'creating' | 'populating' | 'success' | 'error'>('idle');
  const [exportProgress, setExportProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [createdPresentationUrl, setCreatedPresentationUrl] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<PresentationTheme>(THEMES[0]);

  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, currentToken) => {
        setUser(currentUser);
        setToken(currentToken);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setToken(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setToken(result.accessToken);
        setUser(result.user);
        setNeedsAuth(false);
      }
    } catch (err) {
      console.error('Login failed', err);
      alert('فشل تسجيل الدخول بالرابط المطلوب لدعم عروض Google Slides');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    if (confirm('هل ترغب في تسجيل الخروج من حساب Google؟')) {
      await logout();
      setUser(null);
      setToken(null);
      setNeedsAuth(true);
      setExportState('idle');
      setCreatedPresentationUrl(null);
    }
  };

  const createGooglePresentation = async (title: string, authToken: string): Promise<string> => {
    const res = await fetch('https://slides.googleapis.com/v1/presentations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        title,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to create presentation: ${errorText}`);
    }

    const data = await res.json();
    return data.presentationId;
  };

  const handleExport = async () => {
    if (!token) {
      alert('يرجى تسجيل الدخول أولاً باستخدام حساب Google لتسهيل تصدير الشرائح');
      return;
    }

    setExportState('creating');
    setExportProgress(5);
    setStatusMessage('جاري تهيئة العرض التقديمي في حساب Google Drive الخاص بك...');

    try {
      const presentationId = await createGooglePresentation('مبادئ ريادة الأعمال والإدارة المالية للمشاريع (ريادي الغد)', token);
      
      setExportState('populating');
      setStatusMessage('جاري تجهيز وبناء شرائح العرض الـ 20 بنسق راقٍ...');

      // Google Slides created on user's drive starts with 1 blank default slide (ID typically 'p').
      // Let's retrieve page details to optionally clean up or adapt later, but appending new slides is highly robust.
      // Now let me build 20 slides in batches to keep request size safe and progress responsive.
      const slides = ALL_20_SLIDES;
      
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        setExportProgress(Math.min(95, Math.round(((i + 1) / slides.length) * 85) + 10));
        setStatusMessage(`جاري كتابة وتنسيق الشريحة رقم ${slide.id}...`);

        const slideObjectId = `slide_page_${slide.id}`;
        const titleObjectId = `title_text_${slide.id}`;
        const subtitleObjectId = `subtitle_text_${slide.id}`;
        const pointsObjectId = `points_text_${slide.id}`;
        const decorationObjectId = `decor_shape_${slide.id}`;

        const requests: any[] = [];

        // 1. Create a slide (Layout = BLANK to have pure custom control over typography and layout sizing)
        requests.push({
          createSlide: {
            objectId: slideObjectId,
            insertionIndex: i + 1, // Start after the default slide
            slideLayoutReference: {
              predefinedLayout: 'BLANK'
            }
          }
        });

        // 2. Set Slide Background Color
        requests.push({
          updatePageProperties: {
            objectId: slideObjectId,
            pageProperties: {
              pageBackgroundFill: {
                solidFill: {
                  color: {
                    rgbColor: selectedTheme.backgroundColor
                  }
                }
              }
            },
            fields: 'pageBackgroundFill.solidFill.color'
          }
        });

        // 3. Add Top/Side Elegant Brand Accent Shape (Left border line in premium projects)
        requests.push({
          createShape: {
            objectId: decorationObjectId,
            shapeType: 'RECTANGLE',
            elementProperties: {
              pageObjectId: slideObjectId,
              size: {
                width: { magnitude: 200000, unit: 'EMU' }, // thin visual strip
                height: { magnitude: 4500000, unit: 'EMU' },
              },
              transform: {
                scaleX: 1, scaleY: 1, shearX: 0, shearY: 0,
                translateX: 9000000, // Top Right positioning
                translateY: 500000,
                unit: 'EMU'
              }
            }
          }
        });

        requests.push({
          updateShapeProperties: {
            objectId: decorationObjectId,
            shapeProperties: {
              shapeBackgroundFill: {
                solidFill: {
                  color: {
                    rgbColor: selectedTheme.primaryColor
                  }
                }
              },
              outline: {
                propertyState: 'NOT_RENDERED'
              }
            },
            fields: 'shapeBackgroundFill.solidFill.color,outline'
          }
        });

        // 4. Create Main Title Textbox
        requests.push({
          createShape: {
            objectId: titleObjectId,
            shapeType: 'TEXT_BOX',
            elementProperties: {
              pageObjectId: slideObjectId,
              size: {
                width: { magnitude: 8000000, unit: 'EMU' },
                height: { magnitude: 1100000, unit: 'EMU' },
              },
              transform: {
                scaleX: 1, scaleY: 1, shearX: 0, shearY: 0,
                translateX: 800000, // Spaced from the right border
                translateY: 600000,
                unit: 'EMU'
              }
            }
          }
        });

        // Fill Title Text (RTL text aligned properly)
        const slideTitleText = slide.title;
        requests.push({
          insertText: {
            objectId: titleObjectId,
            text: slideTitleText,
            insertionIndex: 0
          }
        });

        // Style Title
        requests.push({
          updateTextStyle: {
            objectId: titleObjectId,
            textRange: { type: 'ALL' },
            style: {
              fontFamily: 'Cairo', // Direct font pairing! Cairo is supported!
              fontSize: { magnitude: 24, unit: 'PT' },
              bold: true,
              foregroundColor: {
                solidFill: {
                  color: {
                    rgbColor: selectedTheme.primaryColor
                  }
                }
              }
            },
            fields: 'fontFamily,fontSize,bold,foregroundColor'
          }
        });

        requests.push({
          updateParagraphStyle: {
            objectId: titleObjectId,
            textRange: { type: 'ALL' },
            style: {
              alignment: 'RIGHT', // Perfect RTL direction!
            },
            fields: 'alignment'
          }
        });

        // 5. Create Subtitle Textbox (if subtitle exists)
        if (slide.subtitle) {
          requests.push({
            createShape: {
              objectId: subtitleObjectId,
              shapeType: 'TEXT_BOX',
              elementProperties: {
                pageObjectId: slideObjectId,
                size: {
                  width: { magnitude: 8000000, unit: 'EMU' },
                  height: { magnitude: 600000, unit: 'EMU' },
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
            insertText: {
              objectId: subtitleObjectId,
              text: slide.subtitle,
              insertionIndex: 0
            }
          });

          requests.push({
            updateTextStyle: {
              objectId: subtitleObjectId,
              textRange: { type: 'ALL' },
              style: {
                fontFamily: 'Cairo',
                fontSize: { magnitude: 14, unit: 'PT' },
                italic: true,
                foregroundColor: {
                  solidFill: {
                    color: {
                      rgbColor: selectedTheme.secondaryColor
                    }
                  }
                }
              },
              fields: 'fontFamily,fontSize,italic,foregroundColor'
            }
          });

          requests.push({
            updateParagraphStyle: {
              objectId: subtitleObjectId,
              textRange: { type: 'ALL' },
              style: {
                alignment: 'RIGHT',
              },
              fields: 'alignment'
            }
          });
        }

        // 6. Create Bullet points Textbox
        if (slide.points && slide.points.length > 0) {
          requests.push({
            createShape: {
              objectId: pointsObjectId,
              shapeType: 'TEXT_BOX',
              elementProperties: {
                pageObjectId: slideObjectId,
                size: {
                  width: { magnitude: 7600000, unit: 'EMU' },
                  height: { magnitude: 2400000, unit: 'EMU' },
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

          // Join points with newline
          const joinedPoints = slide.points.map(p => `•  ${p}`).join('\n\n');
          requests.push({
            insertText: {
              objectId: pointsObjectId,
              text: joinedPoints,
              insertionIndex: 0
            }
          });

          requests.push({
            updateTextStyle: {
              objectId: pointsObjectId,
              textRange: { type: 'ALL' },
              style: {
                fontFamily: 'Cairo',
                fontSize: { magnitude: 13, unit: 'PT' },
                foregroundColor: {
                  solidFill: {
                    color: {
                      rgbColor: selectedTheme.textColor
                    }
                  }
                }
              },
              fields: 'fontFamily,fontSize,foregroundColor'
            }
          });

          requests.push({
            updateParagraphStyle: {
              objectId: pointsObjectId,
              textRange: { type: 'ALL' },
              style: {
                alignment: 'RIGHT',
                lineSpacing: 115, // elegant readable line spacing
              },
              fields: 'alignment,lineSpacing'
            }
          });
        }

        // Send API call for this slide
        const updateRes = await fetch(`https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            requests,
          }),
        });

        if (!updateRes.ok) {
          const updateError = await updateRes.text();
          throw new Error(`Failed to update slide ${slide.id}: ${updateError}`);
        }
      }

      // Cleanup: We can optionally delete the default first slide to look ultra clean
      try {
        await fetch(`https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            requests: [
              {
                deleteObject: {
                  objectId: 'p' // Default first slide id is often 'p' or first page in presentations.get
                }
              }
            ]
          }),
        });
      } catch (err) {
        // Safe to ignore if default first slide ID was different from 'p'
        console.log('Skipped cleaning default first slide', err);
      }

      setExportProgress(100);
      setExportState('success');
      setCreatedPresentationUrl(`https://docs.google.com/presentation/d/${presentationId}/edit`);
      setStatusMessage('تم الانتهاء بنجاح! تم حفظ العرض في حسابك بـ Google Drive.');
      if (onExportSuccess) {
        onExportSuccess(presentationId);
      }
    } catch (err: any) {
      console.error(err);
      setExportState('error');
      setStatusMessage(`حدث خطأ أثناء التصدير: ${err.message || err}`);
    }
  };

  return (
    <div id="google-exporter-section" className="bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <Sparkles className="text-amber-400 w-5 h-5 animate-pulse" />
            التصدير الفوري لعروض Google Slides
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            تتوفر لدينا ميزة حصرية قوية تتيح لك تصدير هذه الـ 20 شريحة مباشرة إلى حسابك الشخصي في <span className="text-amber-400 font-semibold">Google Slides</span> بجودة فائقة ونقوش وسمات تصميم احترافية لتكون جاهزاً فوراً للطلاب في المدرسة.
          </p>
        </div>

        <div>
          {needsAuth ? (
            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="gsi-material-button text-slate-900 shadow-md font-sans w-full md:w-auto"
            >
              {isLoggingIn ? (
                <div className="gsi-material-button-content-wrapper">
                  <Loader2 className="animate-spin text-slate-500 w-5 h-5 ml-2" />
                  <span className="gsi-material-button-contents">جاري الاتصال بـ Google...</span>
                </div>
              ) : (
                <div className="gsi-material-button-content-wrapper">
                  <svg className="gsi-material-button-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block' }}>
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  </svg>
                  <span className="gsi-material-button-contents">تمكين Google وتصدير العرض</span>
                </div>
              )}
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-right ml-2 hidden md:block">
                <p className="text-xs text-slate-500">متصل بـ Google باسم</p>
                <p className="text-sm font-semibold text-slate-300">{user?.displayName || user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-slate-800 hover:bg-slate-700/80 text-slate-300 p-2.5 rounded-xl border border-slate-700 transition"
                title="تسجيل الخروج"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {!needsAuth && (
        <div className="mt-8 pt-6 border-t border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Theme selection panel */}
            <div className="lg:col-span-2 space-y-4">
              <label className="text-sm font-semibold text-slate-300 block">اختر السمة والسمات الفنية للعرض التقديمي المصدّر:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme)}
                    className={`p-4 rounded-xl border text-right transition flex items-center justify-between ${
                      selectedTheme.id === theme.id
                        ? 'border-amber-500 bg-amber-500/5'
                        : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <span className="font-semibold block text-slate-200">{theme.name}</span>
                      <span className="text-xs text-slate-500 block mt-1">
                        خلفية دافئة بلون تباين مميز للطلاب
                      </span>
                    </div>
                    <div className="flex gap-1.5 ml-2">
                      <span className="w-5 h-5 rounded-full border border-slate-700 block" style={{ backgroundColor: theme.bgHex }} />
                      <span className="w-5 h-5 rounded-full block" style={{ backgroundColor: theme.primaryHex }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Run export panel */}
            <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
              {exportState === 'idle' && (
                <div className="space-y-4 text-center py-2">
                  <p className="text-xs text-slate-500">تم دمج الـ 20 شريحة كاملة مع نصوصها ومحاورها بأعلى دقة.</p>
                  <button
                    onClick={handleExport}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:opacity-90 transition font-bold py-3 px-5 rounded-xl flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Presentation className="w-5 h-5" />
                    تصدير العرض التقديمي الآن
                  </button>
                </div>
              )}

              {(exportState === 'creating' || exportState === 'populating') && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-amber-500 font-bold">{exportProgress}%</span>
                    <span className="text-slate-400 font-semibold animate-pulse flex items-center gap-1">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
                      جاري المعالجة الرقمية...
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${exportProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed text-center">
                    {statusMessage}
                  </p>
                </div>
              )}

              {exportState === 'success' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span className="text-xs font-semibold">اكتمل التصدير والمزامنة بنجاح تام!</span>
                  </div>
                  <a
                    href={createdPresentationUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 transition font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/10 text-sm"
                  >
                    فتح العرض على Google Slides
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => setExportState('idle')}
                    className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 text-xs py-1.5 rounded-lg"
                  >
                    تصدير ملف جديد
                  </button>
                </div>
              )}

              {exportState === 'error' && (
                <div className="space-y-4">
                  <div className="text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-xs font-semibold leading-relaxed">
                    {statusMessage}
                  </div>
                  <button
                    onClick={handleExport}
                    className="w-full bg-slate-900 border border-slate-800 hover:bg-slate-700 text-white font-semibold py-2 rounded-xl text-sm"
                  >
                    إعادة المحاولة
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
