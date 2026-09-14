import React, { useState, useMemo } from 'react';
import { videoService } from '../../services/videoService';
import { VideoLesson } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  PlayCircle,
  Clock,
  Eye,
  Search,
  Download,
  Calendar,
  Sparkles,
  Lock,
} from 'lucide-react';
import { toPersianDigits, formatPersianDate } from '../../lib/formatters';

export const Videos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [activeVideo, setActiveVideo] = useState<VideoLesson | null>(null);

  const videos = videoService.listVideos();

  const allTags = useMemo(() => {
    const set = new Set<string>();
    videos.forEach((v) => v.tags?.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [videos]);

  const filteredVideos = useMemo(() => {
    return videos.filter((v) => {
      const matchTag = selectedTag === 'all' || v.tags?.includes(selectedTag);
      const matchSearch =
        !searchTerm.trim() ||
        v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchTag && matchSearch;
    });
  }, [videos, selectedTag, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-right">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900">آرشیو ویدیوها و کلاس‌های ضبط‌شده</h1>
        <p className="text-sm text-slate-500 mt-1">
          مشاهده جلسات ضبط شده، کارگاه‌های تخصصی گرامر، آیلتس و مهارت‌های گفتاری
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-80">
          <Input
            placeholder="جستجوی ویدیو یا موضوع..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            rightIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
              selectedTag === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            همه موضوعات
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                selectedTag === tag ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Videos Grid */}
      {filteredVideos.length === 0 ? (
        <EmptyState
          title="ویدیویی یافت نشد"
          description="با فیلترهای انتخابی هیچ ویدیویی پیدا نشد."
          actionText="نمایش همه ویدیوها"
          onAction={() => {
            setSelectedTag('all');
            setSearchTerm('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <Card
              key={video.id}
              hoverEffect
              className="p-0 overflow-hidden flex flex-col justify-between cursor-pointer group"
              onClick={() => setActiveVideo(video)}
            >
              <div>
                <div className="relative h-48 bg-slate-900 overflow-hidden">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-blue-600/90 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <PlayCircle className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-0.5 rounded-md text-[11px] font-bold text-white flex items-center gap-1" dir="ltr">
                    <Clock className="w-3 h-3 text-blue-400" />
                    <span>{video.duration}</span>
                  </div>

                  {video.isFree && (
                    <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      جلسه رایگان
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-2.5">
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {video.tags?.map((t) => (
                      <span key={t} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formatPersianDate(video.createdAt)}</span>
                </span>
                <span className="text-blue-600 font-bold hover:underline">
                  مشاهده ویدیو
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Video Player Modal */}
      {activeVideo && (
        <Modal
          isOpen={!!activeVideo}
          onClose={() => setActiveVideo(null)}
          title={activeVideo.title}
          size="xl"
        >
          <div className="space-y-4 text-right">
            {/* Embedded Responsive Video Player */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 shadow-xl border border-slate-800 flex items-center justify-center">
              <video
                controls
                autoPlay
                poster={activeVideo.thumbnailUrl}
                className="w-full h-full object-cover"
                src={activeVideo.videoUrl}
              >
                مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
              </video>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">{activeVideo.title}</h3>
                <span className="text-xs text-slate-500 font-mono" dir="ltr">{activeVideo.duration}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{activeVideo.description}</p>
            </div>

            {/* Attachments Section */}
            {activeVideo.attachments && activeVideo.attachments.length > 0 && (
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <h4 className="text-xs font-bold text-slate-800">فایل‌ها و جزوات ضمیمه ویدیو:</h4>
                <div className="space-y-2">
                  {activeVideo.attachments.map((att, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <span className="font-medium text-slate-700">{att.name}</span>
                      <a
                        href={att.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>دانلود فایل</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
