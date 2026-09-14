import React, { useState } from 'react';
import {
  googleWorkspaceService,
  PresentationInfo,
} from '../../services/googleWorkspaceService';
import {
  Presentation,
  Plus,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Layers,
  FileCheck2,
  Tv,
  MessageSquare,
  BookOpen,
} from 'lucide-react';
import { toast } from 'sonner';

interface GoogleSlidesTabProps {
  isAuthenticated: boolean;
  loading: boolean;
  onSaveFile: (item: { fileId: string; name: string; type: string; url?: string }) => Promise<void>;
  onRefreshDrive: () => void;
  selectedPresentationId?: string;
  onSelectPresentationId?: (id: string) => void;
}

export const GoogleSlidesTab: React.FC<GoogleSlidesTabProps> = ({
  isAuthenticated,
  loading: parentLoading,
  onSaveFile,
  onRefreshDrive,
  selectedPresentationId: propPresentationId,
  onSelectPresentationId,
}) => {
  const [selectedId, setSelectedId] = useState<string>(propPresentationId || '');
  const [presentationData, setPresentationData] = useState<PresentationInfo | null>(null);
  const [loadingPresentation, setLoadingPresentation] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Teaching Deck form
  const [teachingTopic, setTeachingTopic] = useState<string>('مکالمه موضوعی: Travel & Culture');
  const [teacherName, setTeacherName] = useState<string>('استاد پورصادق');

  // Custom Deck form
  const [customTitle, setCustomTitle] = useState<string>('');

  // Add slide form
  const [newSlideTitle, setNewSlideTitle] = useState<string>('');
  const [newSlideBody, setNewSlideBody] = useState<string>('');
  const [addingSlide, setAddingSlide] = useState<boolean>(false);

  // Sync if prop changes
  React.useEffect(() => {
    if (propPresentationId && propPresentationId !== selectedId) {
      setSelectedId(propPresentationId);
      fetchPresentation(propPresentationId);
    }
  }, [propPresentationId]);

  const fetchPresentation = async (id: string) => {
    if (!id) return;
    setLoadingPresentation(true);
    try {
      const data = await googleWorkspaceService.getPresentation(id);
      setPresentationData(data);
    } catch (err: any) {
      toast.error(err.message || 'خطا در دریافت اسلایدها');
    } finally {
      setLoadingPresentation(false);
    }
  };

  const handleCreateTeachingDeck = async () => {
    if (!teachingTopic.trim()) {
      toast.error('لطفاً عنوان مبحث را وارد کنید');
      return;
    }
    setIsProcessing(true);
    try {
      const pres = await googleWorkspaceService.createTeachingSlides(teachingTopic, teacherName);
      toast.success('اسلایدهای تدریس با موفقیت در گوگل اسلایدز ایجاد شد');
      await onSaveFile({
        fileId: pres.presentationId,
        name: pres.title,
        type: 'slide',
        url: `https://docs.google.com/presentation/d/${pres.presentationId}/edit`,
      });
      setSelectedId(pres.presentationId);
      if (onSelectPresentationId) onSelectPresentationId(pres.presentationId);
      onRefreshDrive();
      await fetchPresentation(pres.presentationId);
    } catch (err: any) {
      toast.error(err.message || 'خطا در ساخت اسلاید');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateCustomDeck = async () => {
    if (!customTitle.trim()) {
      toast.error('لطفاً عنوان ارائه را وارد کنید');
      return;
    }
    setIsProcessing(true);
    try {
      const pres = await googleWorkspaceService.createPresentation(customTitle.trim());
      toast.success(`ارائه "${customTitle}" در Google Slides ساخته شد`);
      setCustomTitle('');
      await onSaveFile({
        fileId: pres.presentationId,
        name: pres.title,
        type: 'slide',
        url: `https://docs.google.com/presentation/d/${pres.presentationId}/edit`,
      });
      setSelectedId(pres.presentationId);
      if (onSelectPresentationId) onSelectPresentationId(pres.presentationId);
      onRefreshDrive();
      await fetchPresentation(pres.presentationId);
    } catch (err: any) {
      toast.error(err.message || 'خطا در ایجاد ارائه');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateQuizDeck = async () => {
    setIsProcessing(true);
    try {
      const title = `کوئیز شفاهی و بحث آزاد (Discussion & Quiz) - ${new Date().toLocaleDateString('fa-IR')}`;
      const pres = await googleWorkspaceService.createPresentation(title);
      await googleWorkspaceService.addSlideWithText(
        pres.presentationId,
        'پرسش‌های بحث آزاد (Warm-up & Discussion)',
        '1. Describe a memorable journey you have experienced.\n2. How does learning a second language change someone\'s perspective?\n3. What are the advantages of online learning versus traditional classrooms?'
      );
      toast.success('ارائه کوئیز کلاسی در گوگل اسلایدز ایجاد شد');
      await onSaveFile({
        fileId: pres.presentationId,
        name: pres.title,
        type: 'slide',
        url: `https://docs.google.com/presentation/d/${pres.presentationId}/edit`,
      });
      setSelectedId(pres.presentationId);
      if (onSelectPresentationId) onSelectPresentationId(pres.presentationId);
      onRefreshDrive();
      await fetchPresentation(pres.presentationId);
    } catch (err: any) {
      toast.error(err.message || 'خطا در ایجاد اسلاید کوئیز');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddNewSlide = async () => {
    if (!selectedId) {
      toast.error('لطفاً ابتدا یک ارائه را انتخاب فرمایید');
      return;
    }
    if (!newSlideTitle.trim()) {
      toast.error('لطفاً عنوان اسلاید جدید را وارد کنید');
      return;
    }

    setAddingSlide(true);
    try {
      await googleWorkspaceService.addSlideWithText(
        selectedId,
        newSlideTitle.trim(),
        newSlideBody.trim() || 'نکات و سرفصل‌های آموزشی این اسلاید'
      );
      toast.success('اسلاید جدید به ارائه گوگل اضافه شد');
      setNewSlideTitle('');
      setNewSlideBody('');
      await fetchPresentation(selectedId);
    } catch (err: any) {
      toast.error(err.message || 'خطا در افزودن اسلاید جدید');
    } finally {
      setAddingSlide(false);
    }
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Teaching Slides */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mb-4">
            <Presentation className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">اسلایدهای تدریس کلاسی</h3>
          <p className="text-slate-600 text-sm mb-4 leading-relaxed">
            تولید خودکار ارائه آموزشی شامل جلد دوره، مشخصات استاد و سرفصل‌های آموزشی برای نمایش در کلاس آنلاین.
          </p>
          <div className="space-y-2 mb-3">
            <input
              type="text"
              placeholder="مبحث جلسه (مثال: گرامر زمان گذشته)"
              value={teachingTopic}
              onChange={(e) => setTeachingTopic(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
            <input
              type="text"
              placeholder="نام مدرس"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
          </div>
          <button
            disabled={!isAuthenticated || isProcessing || parentLoading}
            onClick={handleCreateTeachingDeck}
            className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-medium py-2.5 px-4 rounded-xl text-sm transition disabled:opacity-50 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            {isProcessing ? 'در حال ساخت...' : 'ایجاد اسلایدهای تدریس'}
          </button>
        </div>

        {/* Card 2: Custom Presentation */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-4">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">ساخت ارائه خام و سفارشی</h3>
          <p className="text-slate-600 text-sm mb-3 leading-relaxed">
            عنوان ارائه مورد نظر خود را وارد کنید تا یک فایل Google Slides جدید در اکانت شما ایجاد شود.
          </p>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="مثال: کارگاه نگارش مقالات انگلیسی"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
            />
            <button
              disabled={!isAuthenticated || isProcessing || !customTitle.trim()}
              onClick={handleCreateCustomDeck}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 px-4 rounded-xl text-sm transition disabled:opacity-50"
            >
              ایجاد ارائه جدید
            </button>
          </div>
        </div>

        {/* Card 3: Quiz & Discussion Deck */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-4">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">اسلایدهای بحث آزاد و کوئیز</h3>
          <p className="text-slate-600 text-sm mb-4 leading-relaxed">
            ایجاد اسلایدهای حاوی سوالات تعاملی اسپیکینگ و بحث آزاد کلاسی (Free Discussion) جهت استفاده در جلسات وبینار.
          </p>
          <button
            disabled={!isAuthenticated || isProcessing || parentLoading}
            onClick={handleCreateQuizDeck}
            className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-xl text-sm transition disabled:opacity-50"
          >
            <Tv className="w-4 h-4" />
            تولید اسلایدهای بحث آزاد
          </button>
        </div>
      </div>

      {/* Selected Presentation Details & Interactive Manager */}
      {selectedId && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <Presentation className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  {presentationData?.title || 'ارائه انتخاب‌شده در Google Slides'}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span>شناسه: {selectedId}</span>
                  {presentationData?.slides && (
                    <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                      {presentationData.slides.length} اسلاید
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchPresentation(selectedId)}
                disabled={loadingPresentation}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition font-medium"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingPresentation ? 'animate-spin' : ''}`} />
                بروزرسانی
              </button>
              <a
                href={`https://docs.google.com/presentation/d/${selectedId}/edit`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition font-bold shadow-xs"
              >
                ارائه و ویرایش در Google Slides
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Slides List Preview */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              فهرست اسلایدهای موجود در این ارائه:
            </h4>

            {loadingPresentation ? (
              <div className="p-8 text-center text-slate-400 text-sm">در حال دریافت اسلایدها از گوگل...</div>
            ) : presentationData?.slides && presentationData.slides.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {presentationData.slides.map((slide, idx) => (
                  <div
                    key={slide.objectId}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-amber-300 transition"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span className="font-bold text-slate-700">اسلاید {idx + 1}</span>
                      <span className="text-[10px] font-mono">{slide.objectId}</span>
                    </div>
                    <div className="aspect-video bg-white rounded-lg border border-slate-200 p-3 flex flex-col justify-center items-center text-center shadow-2xs">
                      <Presentation className="w-8 h-8 text-amber-500/80 mb-2" />
                      <span className="text-xs font-semibold text-slate-700 line-clamp-1">
                        صفحه {idx + 1}: {presentationData.title}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1">آماده پخش در کلاس آنلاین</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-slate-400 text-sm bg-slate-50 rounded-xl border border-slate-200">
                این ارائه هنوز اسلایدی ندارد یا در حال دریافت است. از فرم زیر برای افزودن اسلاید استفاده کنید.
              </div>
            )}
          </div>

          {/* Add Slide Form */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-amber-600" />
              افزودن اسلاید جدید به این فایل Google Slides:
            </h4>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="عنوان اسلاید (مثال: تمرین مکالمه جفت‌ها - Pair Work Activity)"
                value={newSlideTitle}
                onChange={(e) => setNewSlideTitle(e.target.value)}
                className="w-full text-xs px-3 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
              <textarea
                rows={3}
                placeholder="متن بدنه، پرسش‌ها یا نکات آموزشی اسلاید..."
                value={newSlideBody}
                onChange={(e) => setNewSlideBody(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
              <div className="flex justify-end">
                <button
                  disabled={addingSlide || !newSlideTitle.trim()}
                  onClick={handleAddNewSlide}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-medium text-xs py-2 px-5 rounded-lg transition disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {addingSlide ? 'در حال ثبت اسلاید...' : 'ثبت اسلاید در Google Slides'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
