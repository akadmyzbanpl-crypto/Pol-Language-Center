import React, { useState } from 'react';
import { videoService } from '../../services/videoService';
import { VideoLesson } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Plus, Edit2, Trash2, Video, Search, Clock } from 'lucide-react';
import { formatPersianDate, toPersianDigits } from '../../lib/formatters';

export const AdminVideos: React.FC = () => {
  const [videos, setVideos] = useState<VideoLesson[]>(videoService.listVideos());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoLesson | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formDuration, setFormDuration] = useState('45:20');
  const [formVideoUrl, setFormVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  const [formThumbnail, setFormThumbnail] = useState('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80');
  const [formDesc, setFormDesc] = useState('');
  const [formTags, setFormTags] = useState('IELTS, Speaking');
  const [formIsFree, setFormIsFree] = useState(true);

  const refreshList = () => {
    setVideos(videoService.listVideos());
  };

  const openCreateModal = () => {
    setEditingVideo(null);
    setFormTitle('');
    setFormDuration('45:00');
    setFormVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
    setFormThumbnail('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80');
    setFormDesc('');
    setFormTags('IELTS, Speaking');
    setFormIsFree(true);
    setModalOpen(true);
  };

  const openEditModal = (v: VideoLesson) => {
    setEditingVideo(v);
    setFormTitle(v.title);
    setFormDuration(v.duration);
    setFormVideoUrl(v.videoUrl);
    setFormThumbnail(v.thumbnailUrl);
    setFormDesc(v.description);
    setFormTags(v.tags?.join(', ') || '');
    setFormIsFree(v.isFree);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = formTags.split(',').map((t) => t.trim()).filter(Boolean);

    if (editingVideo) {
      videoService.updateVideo(editingVideo.id, {
        title: formTitle,
        duration: formDuration,
        videoUrl: formVideoUrl,
        thumbnailUrl: formThumbnail,
        description: formDesc,
        tags,
        isFree: formIsFree,
      });
    } else {
      videoService.createVideo({
        courseId: 'course_1',
        courseTitle: 'مسترکلاس جامع آیلتس',
        teacherId: 'user_teacher_1',
        teacherName: 'دکتر محمدرضا رضایی',
        isPublic: true,
        title: formTitle,
        duration: formDuration,
        videoUrl: formVideoUrl,
        thumbnailUrl: formThumbnail,
        description: formDesc,
        tags,
        isFree: formIsFree,
        attachments: [
          { name: 'جزوه خلاصه این جلسه (PDF)', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
        ],
      });
    }
    setModalOpen(false);
    refreshList();
  };

  const handleDelete = () => {
    if (deleteTargetId) {
      videoService.deleteVideo(deleteTargetId);
      setDeleteTargetId(null);
      refreshList();
    }
  };

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="w-full sm:w-80">
          <Input
            placeholder="جستجوی عنوان ویدیو..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            rightIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <Button onClick={openCreateModal} icon={<Plus className="w-4 h-4" />}>
          ثبت ویدیوی آموزشی جدید
        </Button>
      </div>

      {/* Videos List */}
      <Card className="p-0 overflow-hidden divide-y divide-slate-100">
        {videos.map((v) => (
          <div key={v.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={v.thumbnailUrl}
                alt=""
                className="w-20 h-14 rounded-xl object-cover shadow-xs flex-shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">{v.title}</h4>
                  {v.isFree ? (
                    <Badge variant="emerald" size="sm">رایگان</Badge>
                  ) : (
                    <Badge variant="blue" size="sm">ویژه اعضا</Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-mono" dir="ltr">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{v.duration}</span>
                  </span>
                  <span>تاریخ: {formatPersianDate(v.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => openEditModal(v)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl"
                title="ویرایش"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeleteTargetId(v.id)}
                className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl"
                title="حذف"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </Card>

      {/* Modal */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingVideo ? 'ویرایش ویدیو' : 'افزودن ویدیوی آموزشی جدید'}
        >
          <form onSubmit={handleSave} className="space-y-4 text-right">
            <Input
              label="عنوان ویدیو"
              required
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="مثلاً آموزش تلفظ و لهجه صحیح در ریدینگ"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="مدت زمان (دقیقه:ثانیه)"
                dir="ltr"
                value={formDuration}
                onChange={(e) => setFormDuration(e.target.value)}
              />
              <Input
                label="تگ‌ها (با ویرگول جدا کنید)"
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
              />
            </div>

            <Input
              label="آدرس فایل ویدیو (MP4 URL / HLS)"
              dir="ltr"
              value={formVideoUrl}
              onChange={(e) => setFormVideoUrl(e.target.value)}
            />

            <Input
              label="آدرس تصویر پوستر ویدیو"
              dir="ltr"
              value={formThumbnail}
              onChange={(e) => setFormThumbnail(e.target.value)}
            />

            <Textarea
              label="توضیحات ویدیو"
              rows={3}
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
            />

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isFree"
                checked={formIsFree}
                onChange={(e) => setFormIsFree(e.target.checked)}
                className="rounded text-blue-600"
              />
              <label htmlFor="isFree" className="text-xs font-bold text-slate-700 cursor-pointer">
                این ویدیو به صورت رایگان برای همه در دسترس باشد (پیش‌نمایش)
              </label>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                انصراف
              </Button>
              <Button type="submit">
                ذخیره ویدیو
              </Button>
            </div>
          </form>
        </Modal>
      )}

      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
        title="حذف ویدیو"
        message="آیا از حذف این ویدیو اطمینان دارید؟"
        confirmText="بله، حذف کن"
      />
    </div>
  );
};
