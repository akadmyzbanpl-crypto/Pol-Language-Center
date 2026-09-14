import { RecordedVideo } from '../types';
import { store } from './storeService';

export const videoService = {
  listVideos(filter?: { courseId?: string; search?: string }): RecordedVideo[] {
    let list = store.getVideos();
    if (filter?.courseId && filter.courseId !== 'all') {
      list = list.filter((v) => v.courseId === filter.courseId);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q) ||
          v.teacherName.toLowerCase().includes(q)
      );
    }
    return list;
  },

  getVideoById(id: string): RecordedVideo | undefined {
    return store.getVideos().find((v) => v.id === id);
  },

  createVideo(data: Omit<RecordedVideo, 'id' | 'publishedAt'>): RecordedVideo {
    const newVideo: RecordedVideo = {
      ...data,
      id: 'vid_' + Date.now(),
      publishedAt: new Date().toISOString(),
    };
    store.saveVideo(newVideo);
    return newVideo;
  },

  updateVideo(id: string, data: Partial<RecordedVideo>): RecordedVideo {
    const existing = this.getVideoById(id);
    if (!existing) throw new Error('ویدیو یافت نشد');
    const updated = { ...existing, ...data };
    store.saveVideo(updated);
    return updated;
  },

  deleteVideo(id: string): void {
    store.deleteVideo(id);
  },
};
