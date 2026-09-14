import React, { useState, useEffect } from 'react';
import {
  googleWorkspaceService,
  DriveFileItem,
  SpreadsheetInfo,
  DocInfo,
  PresentationInfo,
} from '../../services/googleWorkspaceService';
import { db, isFirebaseConfigured } from '../../services/firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import {
  FileSpreadsheet,
  FileText,
  HardDrive,
  Presentation,
  Plus,
  Trash2,
  ExternalLink,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  Database,
  FolderPlus,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { GoogleSlidesTab } from './GoogleSlidesTab';
import { AcademyUserGuide } from './AcademyUserGuide';

export const GoogleWorkspaceHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sheets' | 'drive' | 'docs' | 'slides'>('sheets');
  const [selectedPresentationId, setSelectedPresentationId] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Drive state
  const [driveFiles, setDriveFiles] = useState<DriveFileItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [showFolderModal, setShowFolderModal] = useState<boolean>(false);

  // Sheets state
  const [selectedSpreadsheetId, setSelectedSpreadsheetId] = useState<string>('');
  const [sheetValues, setSheetValues] = useState<(string | number)[][]>([]);
  const [sheetRange, setSheetRange] = useState<string>('Sheet1!A1:Z20');
  const [customSheetTitle, setCustomSheetTitle] = useState<string>('');
  const [loadingSheetData, setLoadingSheetData] = useState<boolean>(false);
  const [newStudentRow, setNewStudentRow] = useState({ name: '', code: '', grade: '', status: 'حاضر' });

  // Docs state
  const [selectedDocId, setSelectedDocId] = useState<string>('');
  const [docContent, setDocContent] = useState<string>('');
  const [customDocTitle, setCustomDocTitle] = useState<string>('');
  const [additionalText, setAdditionalText] = useState<string>('');

  // Delete Confirmation Modal (Workspace API safety requirement)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Firestore synced items
  const [savedWorkspaceFiles, setSavedWorkspaceFiles] = useState<any[]>([]);

  useEffect(() => {
    // Check initial auth state
    if (googleWorkspaceService.hasAccessToken()) {
      setIsAuthenticated(true);
    }

    const unsubscribe = googleWorkspaceService.initAuth(
      (user, token) => {
        setIsAuthenticated(true);
        setUserEmail(user.email);
        setUserName(user.displayName);
        setUserPhoto(user.photoURL);
        loadInitialData();
      },
      () => {
        setIsAuthenticated(false);
      }
    );

    loadSavedFromFirestore();

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const loadSavedFromFirestore = async () => {
    if (!db) return;
    try {
      const q = query(collection(db, 'workspaceFiles'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const items: any[] = [];
      snapshot.forEach((d) => items.push({ id: d.id, ...d.data() }));
      setSavedWorkspaceFiles(items);
    } catch (e) {
      // Offline fallback
    }
  };

  const saveFileToFirestore = async (item: { fileId: string; name: string; type: string; url?: string }) => {
    if (!db) return;
    try {
      await addDoc(collection(db, 'workspaceFiles'), {
        ...item,
        createdAt: new Date().toISOString(),
        userEmail: userEmail || 'unknown',
      });
      loadSavedFromFirestore();
    } catch (e) {
      console.warn('Could not save file reference to Firestore:', e);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    try {
      const res = await googleWorkspaceService.signInWithGoogle();
      setIsAuthenticated(true);
      setUserEmail(res.user.email);
      setUserName(res.user.displayName);
      setUserPhoto(res.user.photoURL);
      toast.success('اتصال به حساب Google و سرویس‌های Workspace برقرار شد');
      await loadInitialData();
    } catch (err: any) {
      toast.error(err.message || 'خطا در ورود با گوگل');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleSignOut = async () => {
    await googleWorkspaceService.signOut();
    setIsAuthenticated(false);
    setUserEmail(null);
    setUserName(null);
    setDriveFiles([]);
    setSheetValues([]);
    toast.info('خروج از حساب گوگل انجام شد');
  };

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const files = await googleWorkspaceService.listDriveFiles();
      setDriveFiles(files);
    } catch (err: any) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- DRIVE ACTIONS ----------------
  const handleSearchDrive = async () => {
    setLoading(true);
    try {
      const q = searchQuery.trim() ? `name contains '${searchQuery.trim()}' and trashed = false` : 'trashed = false';
      const files = await googleWorkspaceService.listDriveFiles(q);
      setDriveFiles(files);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      const folder = await googleWorkspaceService.createDriveFolder(newFolderName.trim());
      toast.success(`پوشه "${newFolderName}" در گوگل درایو ساخته شد`);
      setNewFolderName('');
      setShowFolderModal(false);
      await saveFileToFirestore({ fileId: folder.id, name: folder.name, type: 'folder' });
      loadInitialData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const confirmDeleteFile = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await googleWorkspaceService.deleteDriveFile(deleteTarget.id, deleteTarget.name);
      toast.success(`فایل "${deleteTarget.name}" با موفقیت حذف شد`);
      setDeleteTarget(null);
      setDriveFiles((prev) => prev.filter((f) => f.id !== deleteTarget.id));
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // ---------------- SHEETS ACTIONS ----------------
  const handleCreateAttendanceSheet = async () => {
    setLoading(true);
    try {
      const sheet = await googleWorkspaceService.createClassAttendanceSheet(
        'کلاس جامع آیلتس و مکالمه فشرده',
        'استاد محمودی'
      );
      toast.success('کارنامه و لیست حضور و غیاب در گوگل شیت ساخته شد');
      await saveFileToFirestore({
        fileId: sheet.spreadsheetId,
        name: sheet.title,
        type: 'sheet',
        url: sheet.spreadsheetUrl,
      });
      setSelectedSpreadsheetId(sheet.spreadsheetId);
      loadInitialData();
      await fetchSheetData(sheet.spreadsheetId, 'A1:K10');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomSheet = async () => {
    if (!customSheetTitle.trim()) return;
    setLoading(true);
    try {
      const sheet = await googleWorkspaceService.createSpreadsheet(customSheetTitle.trim(), {
        sheetTitle: 'جدول اطلاعات',
        rows: [
          ['عنوان دوره / فعالیت', 'تعداد جلسات', 'مدرس', 'وضعیت تایید'],
          [customSheetTitle.trim(), '12', 'دپارتمان آموزش', 'فعال'],
        ],
      });
      toast.success(`گوگل شیت "${customSheetTitle}" ایجاد شد`);
      setCustomSheetTitle('');
      await saveFileToFirestore({
        fileId: sheet.spreadsheetId,
        name: sheet.title,
        type: 'sheet',
        url: sheet.spreadsheetUrl,
      });
      setSelectedSpreadsheetId(sheet.spreadsheetId);
      loadInitialData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSheetData = async (spreadsheetId: string, range: string) => {
    setLoadingSheetData(true);
    try {
      const values = await googleWorkspaceService.getSheetValues(spreadsheetId, range);
      setSheetValues(values);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoadingSheetData(false);
    }
  };

  const handleAppendStudentRow = async () => {
    if (!selectedSpreadsheetId || !newStudentRow.name) {
      toast.error('لطفاً نام زبان‌آموز را وارد کنید');
      return;
    }
    try {
      const row = [
        String(sheetValues.length + 1),
        newStudentRow.code || `ST-${100 + sheetValues.length}`,
        newStudentRow.name,
        newStudentRow.status,
        'حاضر',
        'حاضر',
        'حاضر',
        'حاضر',
        newStudentRow.grade || '18',
        '19',
        'قبول',
      ];
      await googleWorkspaceService.appendSheetValues(selectedSpreadsheetId, 'A1', [row]);
      toast.success(`اطلاعات ${newStudentRow.name} به گوگل شیت اضافه گردید`);
      setNewStudentRow({ name: '', code: '', grade: '', status: 'حاضر' });
      fetchSheetData(selectedSpreadsheetId, 'A1:K15');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // ---------------- DOCS ACTIONS ----------------
  const handleCreateIeltsDoc = async () => {
    setLoading(true);
    try {
      const doc = await googleWorkspaceService.createIeltsWritingFeedbackDoc(
        'سارا احمدی',
        'Task 2 - Education & Online Learning'
      );
      toast.success('سند فیدبک رایتینگ آیلتس در گوگل داکس ساخته شد');
      await saveFileToFirestore({
        fileId: doc.documentId,
        name: doc.title,
        type: 'doc',
        url: `https://docs.google.com/document/d/${doc.documentId}/edit`,
      });
      setSelectedDocId(doc.documentId);
      loadInitialData();
      await fetchDocData(doc.documentId);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLessonPlanDoc = async () => {
    setLoading(true);
    try {
      const doc = await googleWorkspaceService.createLessonPlanDoc('دوره فشرده مکالمه و گرامر پیشرفته');
      toast.success('سند سیلابس و طرح درس در گوگل داکس ساخته شد');
      await saveFileToFirestore({
        fileId: doc.documentId,
        name: doc.title,
        type: 'doc',
        url: `https://docs.google.com/document/d/${doc.documentId}/edit`,
      });
      setSelectedDocId(doc.documentId);
      loadInitialData();
      await fetchDocData(doc.documentId);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomDoc = async () => {
    if (!customDocTitle.trim()) return;
    setLoading(true);
    try {
      const doc = await googleWorkspaceService.createDocument(
        customDocTitle.trim(),
        `آموزشگاه زبان پل\nسند رسمی: ${customDocTitle}\nتاریخ ثبت: ${new Date().toLocaleDateString('fa-IR')}\n`
      );
      toast.success(`سند گوگل داکس "${customDocTitle}" ساخته شد`);
      setCustomDocTitle('');
      await saveFileToFirestore({
        fileId: doc.documentId,
        name: doc.title,
        type: 'doc',
        url: `https://docs.google.com/document/d/${doc.documentId}/edit`,
      });
      setSelectedDocId(doc.documentId);
      loadInitialData();
      await fetchDocData(doc.documentId);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocData = async (docId: string) => {
    try {
      const doc = await googleWorkspaceService.getDocument(docId);
      const textParts: string[] = [];
      if (doc.body?.content) {
        doc.body.content.forEach((item: any) => {
          if (item.paragraph?.elements) {
            item.paragraph.elements.forEach((el: any) => {
              if (el.textRun?.content) {
                textParts.push(el.textRun.content);
              }
            });
          }
        });
      }
      setDocContent(textParts.join(''));
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleAppendDocText = async () => {
    if (!selectedDocId || !additionalText.trim()) return;
    try {
      await googleWorkspaceService.appendDocText(selectedDocId, additionalText.trim());
      toast.success('متن جدید به سند گوگل داکس اضافه شد');
      setAdditionalText('');
      fetchDocData(selectedDocId);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" dir="rtl">
      {/* Top Banner & Status */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/30 text-blue-100 border border-blue-400/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                یکپارچه‌سازی رسمی گوگل ورک‌اسپیس
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/30 text-emerald-100 border border-emerald-400/30">
                <Database className="w-3.5 h-3.5" />
                پایگاه‌داده Firestore متصل
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              مدیریت ابزارهای ابری گوگل (Sheets, Drive, Docs, Slides)
            </h1>
            <p className="text-blue-100/90 text-sm sm:text-base max-w-2xl leading-relaxed">
              اتصال مستقیم آموزشگاه زبان پل به ابزارهای گوگل برای مدیریت یکپارچه کارنامه‌ها، فایل‌های کلاسی، فیدبک‌های تحلیلی رایتینگ و اسلایدهای تدریس.
            </p>
          </div>

          {/* Auth Action */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20">
                {userPhoto ? (
                  <img src={userPhoto} alt="User" className="w-10 h-10 rounded-full border border-white/40 shadow-sm" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white shadow-sm">
                    {userName ? userName[0] : 'G'}
                  </div>
                )}
                <div className="text-right">
                  <div className="text-sm font-bold leading-tight">{userName || 'کاربر متصل گوگل'}</div>
                  <div className="text-xs text-blue-200">{userEmail}</div>
                </div>
                <button
                  onClick={handleGoogleSignOut}
                  className="mr-2 text-xs bg-rose-500/80 hover:bg-rose-600 px-3 py-1.5 rounded-xl transition text-white"
                >
                  خروج
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoggingIn}
                className="gsi-material-button group relative inline-flex items-center justify-center overflow-hidden rounded-2xl p-0.5 font-medium shadow-md transition-all hover:shadow-xl disabled:opacity-50"
              >
                <div className="flex items-center gap-3 bg-white hover:bg-slate-50 text-slate-800 font-semibold px-5 py-3 rounded-2xl transition">
                  <svg className="w-5 h-5" viewBox="0 0 48 48">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                    <path fill="none" d="M0 0h48v48H0z" />
                  </svg>
                  <span>{isLoggingIn ? 'در حال اتصال...' : 'ورود با حساب گوگل (Google)'}</span>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {!isAuthenticated && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-5 mb-8 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-bold text-base">دسترسی به ابزارهای ابری گوگل با تأیید شما</h3>
            <p className="text-sm text-amber-800 leading-relaxed">
              برای ایجاد و ویرایش برگه‌های حضور و غیاب (Google Sheets)، آپلود منابع کلاسی در Google Drive، اسناد طرح درس و تصحیح رایتینگ در Google Docs و اسلایدهای تدریس در Google Slides با اجازه شما از حساب Google استفاده می‌شود.
              کافیست دکمه <strong>«ورود با حساب گوگل»</strong> را فشرده و دسترسی لازم را تأیید فرمایید.
            </p>
          </div>
        </div>
      )}

      {/* Interactive Academy & Site Guide */}
      <AcademyUserGuide />

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('sheets')}
          className={`flex items-center gap-2 px-6 py-3.5 font-bold text-sm border-b-2 transition whitespace-nowrap ${
            activeTab === 'sheets'
              ? 'border-emerald-600 text-emerald-600 bg-emerald-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
          <span>گوگل شیت (Google Sheets)</span>
          <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">کارنامه و حضور غیاب</span>
        </button>

        <button
          onClick={() => setActiveTab('drive')}
          className={`flex items-center gap-2 px-6 py-3.5 font-bold text-sm border-b-2 transition whitespace-nowrap ${
            activeTab === 'drive'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <HardDrive className="w-5 h-5 text-blue-600" />
          <span>گوگل درایو (Google Drive)</span>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">فایل‌ها و جزوه‌ها</span>
        </button>

        <button
          onClick={() => setActiveTab('docs')}
          className={`flex items-center gap-2 px-6 py-3.5 font-bold text-sm border-b-2 transition whitespace-nowrap ${
            activeTab === 'docs'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-5 h-5 text-indigo-600" />
          <span>گوگل داکس (Google Docs)</span>
          <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-medium">طرح درس و رایتینگ</span>
        </button>

        <button
          onClick={() => setActiveTab('slides')}
          className={`flex items-center gap-2 px-6 py-3.5 font-bold text-sm border-b-2 transition whitespace-nowrap ${
            activeTab === 'slides'
              ? 'border-amber-500 text-amber-600 bg-amber-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Presentation className="w-5 h-5 text-amber-500" />
          <span>گوگل اسلایدز (Google Slides)</span>
          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">اسلایدهای تدریس و ارائه</span>
        </button>
      </div>

      {/* ----------------- TAB: GOOGLE SHEETS ----------------- */}
      {activeTab === 'sheets' && (
        <div className="space-y-8">
          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-4">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">کارنامه و حضور و غیاب</h3>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                ایجاد خودکار فرم کامل حضور و غیاب کلاسی همراه با ستون‌های نمرات میان‌ترم، پایان‌ترم و وضعیت قبولی در گوگل شیت.
              </p>
              <button
                disabled={!isAuthenticated || loading}
                onClick={handleCreateAttendanceSheet}
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-4 rounded-xl text-sm transition disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                ایجاد فرم رسمی کارنامه
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">ساخت اسپردشیت دلخواه</h3>
              <p className="text-slate-600 text-sm mb-3 leading-relaxed">
                عنوان جدول دلخواه خود را وارد کنید تا مستقیماً در گوگل شیت شما ساخته شود.
              </p>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="مثال: شهریه ترم بهار ۱۴۰۵"
                  value={customSheetTitle}
                  onChange={(e) => setCustomSheetTitle(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
                <button
                  disabled={!isAuthenticated || loading || !customSheetTitle.trim()}
                  onClick={handleCreateCustomSheet}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl text-sm transition disabled:opacity-50"
                >
                  ایجاد شیت جدید
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">همگام‌سازی با پایگاه‌داده</h3>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                اسناد ساخته شده بلافاصله در دیتابیس ابری فایربیس ذخیره شده و برای تمامی اساتید و مدیران آموزشگاه در دسترس خواهد بود.
              </p>
              <div className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-700 space-y-1">
                <div className="flex justify-between">
                  <span>فایل‌های ثبت‌شده در دیتابیس:</span>
                  <span className="font-bold text-indigo-600">{savedWorkspaceFiles.length} فایل</span>
                </div>
                <div className="flex justify-between">
                  <span>وضعیت اتصال به Firebase:</span>
                  <span className="text-emerald-600 font-bold">برقرار (Online)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Sheet Table Viewer & Row Inserter */}
          {selectedSpreadsheetId && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                    مشاهده زنده اطلاعات در گوگل شیت
                  </h3>
                  <p className="text-xs text-slate-500">شناسه شیت: {selectedSpreadsheetId}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fetchSheetData(selectedSpreadsheetId, 'A1:K20')}
                    disabled={loadingSheetData}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition font-medium"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingSheetData ? 'animate-spin' : ''}`} />
                    بروزرسانی داده‌ها
                  </button>
                  <a
                    href={`https://docs.google.com/spreadsheets/d/${selectedSpreadsheetId}/edit`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition font-semibold"
                  >
                    باز کردن در گوگل شیت
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                {sheetValues.length > 0 ? (
                  <table className="min-w-full text-xs text-right divide-y divide-slate-200">
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {sheetValues.map((row, rIdx) => (
                        <tr key={rIdx} className={rIdx === 0 ? 'bg-emerald-50 font-bold text-emerald-950' : 'hover:bg-slate-50/80'}>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="px-3 py-2.5 whitespace-nowrap text-slate-700">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-8 text-center text-slate-400 text-sm">
                    {loadingSheetData ? 'در حال دریافت اطلاعات شیت...' : 'اطلاعاتی دریافت نشد یا شیت خالی است.'}
                  </div>
                )}
              </div>

              {/* Insert Row Form */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-700">افزودن مستقیم دانش‌آموز جدید به انتهای این شیت:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    placeholder="نام و نام خانوادگی"
                    value={newStudentRow.name}
                    onChange={(e) => setNewStudentRow({ ...newStudentRow, name: e.target.value })}
                    className="text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="کد زبان‌آموز (مثال ST-105)"
                    value={newStudentRow.code}
                    onChange={(e) => setNewStudentRow({ ...newStudentRow, code: e.target.value })}
                    className="text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="نمره میان‌ترم (مثال ۱۹)"
                    value={newStudentRow.grade}
                    onChange={(e) => setNewStudentRow({ ...newStudentRow, grade: e.target.value })}
                    className="text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg"
                  />
                  <button
                    onClick={handleAppendStudentRow}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs py-2 px-3 rounded-lg transition"
                  >
                    ثبت در گوگل شیت
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ----------------- TAB: GOOGLE DRIVE ----------------- */}
      {activeTab === 'drive' && (
        <div className="space-y-6">
          {/* Top Actions & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                <input
                  type="text"
                  placeholder="جستجو در فایل‌های گوگل درایو..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchDrive()}
                  className="w-full text-xs pr-9 pl-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
              <button
                onClick={handleSearchDrive}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition shrink-0"
              >
                جستجو
              </button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => setShowFolderModal(true)}
                disabled={!isAuthenticated}
                className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold px-4 py-2.5 rounded-xl transition disabled:opacity-50"
              >
                <FolderPlus className="w-4 h-4" />
                ساخت پوشه در درایو
              </button>
              <button
                onClick={loadInitialData}
                disabled={!isAuthenticated || loading}
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2.5 rounded-xl transition"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                تازه‌سازی
              </button>
            </div>
          </div>

          {/* Folder Modal */}
          {showFolderModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-right">
                <h3 className="font-bold text-base text-slate-900">ایجاد پوشه جدید در Google Drive</h3>
                <input
                  type="text"
                  placeholder="نام پوشه (مثال: جزوات گرامر آیلتس)"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowFolderModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    انصراف
                  </button>
                  <button
                    onClick={handleCreateFolder}
                    className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                  >
                    ایجاد پوشه
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Drive Files List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="font-bold text-sm text-slate-800">
                فایل‌های درایو ({driveFiles.length} مورد نمایش داده شده)
              </span>
              <span className="text-xs text-slate-400">مرتب‌سازی بر اساس آخرین ویرایش</span>
            </div>

            {driveFiles.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {driveFiles.map((file) => {
                  const isSheet = file.mimeType.includes('spreadsheet');
                  const isDoc = file.mimeType.includes('document');
                  const isSlide = file.mimeType.includes('presentation');
                  const isFolder = file.mimeType.includes('folder');

                  return (
                    <div key={file.id} className="p-4 hover:bg-slate-50/80 transition flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            isSheet
                              ? 'bg-emerald-100 text-emerald-600'
                              : isDoc
                              ? 'bg-indigo-100 text-indigo-600'
                              : isSlide
                              ? 'bg-amber-100 text-amber-600'
                              : isFolder
                              ? 'bg-amber-100 text-amber-600'
                              : 'bg-blue-100 text-blue-600'
                          }`}
                        >
                          {isSheet ? (
                            <FileSpreadsheet className="w-5 h-5" />
                          ) : isDoc ? (
                            <FileText className="w-5 h-5" />
                          ) : isSlide ? (
                            <Presentation className="w-5 h-5" />
                          ) : isFolder ? (
                            <FolderPlus className="w-5 h-5" />
                          ) : (
                            <HardDrive className="w-5 h-5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-800 truncate">{file.name}</h4>
                          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                            <span>{isSheet ? 'Google Sheets' : isDoc ? 'Google Docs' : isSlide ? 'Google Slides' : isFolder ? 'پوشه' : 'فایل'}</span>
                            {file.modifiedTime && (
                              <span>• {new Date(file.modifiedTime).toLocaleDateString('fa-IR')}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isSheet && (
                          <button
                            onClick={() => {
                              setSelectedSpreadsheetId(file.id);
                              setActiveTab('sheets');
                              fetchSheetData(file.id, 'A1:K15');
                            }}
                            className="px-2.5 py-1 text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-medium"
                          >
                            نمایش در اپ
                          </button>
                        )}
                        {isDoc && (
                          <button
                            onClick={() => {
                              setSelectedDocId(file.id);
                              setActiveTab('docs');
                              fetchDocData(file.id);
                            }}
                            className="px-2.5 py-1 text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg font-medium"
                          >
                            نمایش در اپ
                          </button>
                        )}
                        {isSlide && (
                          <button
                            onClick={() => {
                              setSelectedPresentationId(file.id);
                              setActiveTab('slides');
                            }}
                            className="px-2.5 py-1 text-xs bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg font-medium"
                          >
                            نمایش در اپ
                          </button>
                        )}
                        {file.webViewLink && (
                          <a
                            href={file.webViewLink}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition"
                            title="باز کردن در گوگل"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => setDeleteTarget({ id: file.id, name: file.name })}
                          className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                          title="حذف فایل"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 text-sm">
                {loading ? 'در حال بارگذاری فایل‌های درایو...' : 'هیچ فایلی یافت نشد یا هنوز با گوگل متصل نشده‌اید.'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------- TAB: GOOGLE DOCS ----------------- */}
      {activeTab === 'docs' && (
        <div className="space-y-8">
          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">فیدبک رایتینگ آیلتس</h3>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                قالب استاندارد تصحیح رایتینگ با ارزیابی ۴ معیار اصلی Task 2 آیلتس، تخمین نمره و فیدبک تحلیلی.
              </p>
              <button
                disabled={!isAuthenticated || loading}
                onClick={handleCreateIeltsDoc}
                className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-xl text-sm transition disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                ایجاد فرم تصحیح رایتینگ
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">طرح درس و سیلابس ترم</h3>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                سند تدوین برنامه هفتگی، سرفصل‌های آموزشی و منابع پیشنهادی دوره‌های ترمیک در گوگل داکس.
              </p>
              <button
                disabled={!isAuthenticated || loading}
                onClick={handleCreateLessonPlanDoc}
                className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-xl text-sm transition disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                ایجاد سند طرح درس
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-4">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">ساخت سند جدید گوگل داکس</h3>
              <p className="text-slate-600 text-sm mb-3 leading-relaxed">
                عنوان سند مورد نظر خود را وارد کنید تا مستقیماً در گوگل داکس ایجاد شود.
              </p>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="مثال: تکالیف جلسه هشتم کلاس پیشرفته"
                  value={customDocTitle}
                  onChange={(e) => setCustomDocTitle(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
                <button
                  disabled={!isAuthenticated || loading || !customDocTitle.trim()}
                  onClick={handleCreateCustomDoc}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-xl text-sm transition disabled:opacity-50"
                >
                  ایجاد سند جدید
                </button>
              </div>
            </div>
          </div>

          {/* Document Content Viewer & Appender */}
          {selectedDocId && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    محتوای سند گوگل داکس
                  </h3>
                  <p className="text-xs text-slate-500">شناسه سند: {selectedDocId}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fetchDocData(selectedDocId)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition font-medium"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    بروزرسانی
                  </button>
                  <a
                    href={`https://docs.google.com/document/d/${selectedDocId}/edit`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl transition font-semibold"
                  >
                    ویرایش در Google Docs
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Pre-formatted Document Viewer */}
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 max-h-96 overflow-y-auto font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                {docContent || 'در حال دریافت متن سند...'}
              </div>

              {/* Append Text Form */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-700">درج یادداشت یا پاراگراف جدید در انتهای این سند:</h4>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="متن جدید را وارد کنید..."
                    value={additionalText}
                    onChange={(e) => setAdditionalText(e.target.value)}
                    className="flex-1 text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg"
                  />
                  <button
                    onClick={handleAppendDocText}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs py-2 px-4 rounded-lg transition shrink-0"
                  >
                    افزودن به سند گوگل داکس
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ----------------- TAB: GOOGLE SLIDES ----------------- */}
      {activeTab === 'slides' && (
        <GoogleSlidesTab
          isAuthenticated={isAuthenticated}
          loading={loading}
          onSaveFile={saveFileToFirestore}
          onRefreshDrive={loadInitialData}
          selectedPresentationId={selectedPresentationId}
          onSelectPresentationId={setSelectedPresentationId}
        />
      )}

      {/* Explicit User Confirmation Modal for Destructive Operations */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-right">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">تأیید حذف فایل از گوگل درایو</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              آیا از حذف فایل «<strong className="text-slate-900">{deleteTarget.name}</strong>» از حساب Google Drive خود اطمینان دارید؟ این عملیات قابل بازگشت نخواهد بود.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                انصراف
              </button>
              <button
                disabled={isDeleting}
                onClick={confirmDeleteFile}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs"
              >
                {isDeleting ? 'در حال حذف...' : 'بله، حذف شود'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
