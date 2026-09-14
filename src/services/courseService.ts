import { Course, CourseLesson } from '../types';
import { store } from './storeService';

export const courseService = {
  listCourses(filter?: { level?: string; type?: string; search?: string }): Course[] {
    let list = store.getCourses();
    if (filter?.level && filter.level !== 'all') {
      list = list.filter((c) => c.level === filter.level);
    }
    if (filter?.type && filter.type !== 'all') {
      list = list.filter((c) => c.type === filter.type);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.teacherName.toLowerCase().includes(q)
      );
    }
    return list;
  },

  getCourseById(id: string): Course | undefined {
    return store.getCourses().find((c) => c.id === id);
  },

  getCourseBySlug(slug: string): Course | undefined {
    return store.getCourseBySlug(slug);
  },

  createCourse(data: Omit<Course, 'id' | 'createdAt' | 'finalPrice'>): Course {
    const finalPrice = Math.round(data.price * (1 - (data.discountPercent || 0) / 100));
    const newCourse: Course = {
      ...data,
      id: 'course_' + Date.now(),
      finalPrice,
      createdAt: new Date().toISOString(),
      lessons: data.lessons || [],
    };
    store.saveCourse(newCourse);
    return newCourse;
  },

  updateCourse(id: string, data: Partial<Course>): Course {
    const existing = this.getCourseById(id);
    if (!existing) throw new Error('دوره مورد نظر یافت نشد');
    const price = data.price !== undefined ? data.price : existing.price;
    const discount = data.discountPercent !== undefined ? data.discountPercent : existing.discountPercent;
    const finalPrice = Math.round(price * (1 - (discount || 0) / 100));

    const updated: Course = {
      ...existing,
      ...data,
      finalPrice,
    };
    store.saveCourse(updated);
    return updated;
  },

  deleteCourse(id: string): void {
    store.deleteCourse(id);
  },

  // Lessons CRUD
  addLesson(courseId: string, lessonData: Omit<CourseLesson, 'id' | 'courseId' | 'order'>): CourseLesson {
    const course = this.getCourseById(courseId);
    if (!course) throw new Error('دوره یافت نشد');
    const lessons = course.lessons || [];
    const newLesson: CourseLesson = {
      ...lessonData,
      id: 'lesson_' + Date.now(),
      courseId,
      order: lessons.length + 1,
    };
    lessons.push(newLesson);
    this.updateCourse(courseId, { lessons, sessionCount: lessons.length });
    return newLesson;
  },

  updateLesson(courseId: string, lessonId: string, data: Partial<CourseLesson>): void {
    const course = this.getCourseById(courseId);
    if (!course || !course.lessons) return;
    const lessons = course.lessons.map((l) => (l.id === lessonId ? { ...l, ...data } : l));
    this.updateCourse(courseId, { lessons });
  },

  deleteLesson(courseId: string, lessonId: string): void {
    const course = this.getCourseById(courseId);
    if (!course || !course.lessons) return;
    const lessons = course.lessons.filter((l) => l.id !== lessonId);
    this.updateCourse(courseId, { lessons, sessionCount: lessons.length });
  },
};
