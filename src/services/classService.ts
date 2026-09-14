import { ClassItem, ClassStudent } from '../types';
import { formatWeekDays } from '../lib/formatters';
import { notificationService } from './notificationService';
import { store } from './storeService';

export const classService = {
  listClasses(filter?: { teacherId?: string; status?: string }): ClassItem[] {
    let list = store.getClasses();
    if (filter?.teacherId) {
      list = list.filter((c) => c.teacherId === filter.teacherId);
    }
    if (filter?.status) {
      list = list.filter((c) => c.status === filter.status);
    }
    return list;
  },

  getClassById(id: string): ClassItem | undefined {
    return store.getClassById(id);
  },

  createClass(data: Omit<ClassItem, 'id' | 'enrolledCount' | 'createdAt'>): ClassItem {
    const newClass: ClassItem = {
      ...data,
      id: 'class_' + Date.now(),
      enrolledCount: 0,
      createdAt: new Date().toISOString(),
    };
    store.saveClass(newClass);
    return newClass;
  },

  updateClass(id: string, data: Partial<ClassItem>): ClassItem {
    const existing = store.getClassById(id);
    if (!existing) throw new Error('کلاس مورد نظر یافت نشد');
    const updated = { ...existing, ...data };
    store.saveClass(updated);
    return updated;
  },

  deleteClass(id: string): void {
    store.deleteClass(id);
  },

  // ⚠️ Notifications logic on time change
  changeClassTime(classId: string, startTime: string, endTime: string): ClassItem {
    const cls = store.getClassById(classId);
    if (!cls) throw new Error('کلاس یافت نشد');
    cls.startTime = startTime;
    cls.endTime = endTime;
    store.saveClass(cls);

    // Notify all enrolled students
    const students = store.getClassStudents(classId);
    const studentIds = students.map((s) => s.studentId);
    notificationService.createBulk(studentIds, {
      title: 'تغییر ساعت کلاس',
      body: `ساعت کلاس [${cls.title}] تغییر کرده است. زمان جدید: ${cls.startTime} الی ${cls.endTime}`,
      type: 'class_time_changed',
      link: `/live/${classId}`,
    });
    return cls;
  },

  // ⚠️ Notifications logic on teacher change
  changeClassTeacher(classId: string, teacherId: string, teacherName: string): ClassItem {
    const cls = store.getClassById(classId);
    if (!cls) throw new Error('کلاس یافت نشد');
    cls.teacherId = teacherId;
    cls.teacherName = teacherName;
    store.saveClass(cls);

    const students = store.getClassStudents(classId);
    notificationService.createBulk(students.map((s) => s.studentId), {
      title: 'تغییر مدرس کلاس',
      body: `مدرس کلاس [${cls.title}] به [${teacherName}] تغییر یافت.`,
      type: 'class_time_changed',
      link: `/live/${classId}`,
    });
    return cls;
  },

  // ⚠️ Notifications logic on day change
  changeClassDay(classId: string, weekDays: number[]): ClassItem {
    const cls = store.getClassById(classId);
    if (!cls) throw new Error('کلاس یافت نشد');
    cls.weekDays = weekDays;
    store.saveClass(cls);

    const students = store.getClassStudents(classId);
    notificationService.createBulk(students.map((s) => s.studentId), {
      title: 'تغییر روزهای برگزاری کلاس',
      body: `روزهای برگزاری کلاس [${cls.title}] تغییر کرد: ${formatWeekDays(weekDays)} ساعت ${cls.startTime}`,
      type: 'class_time_changed',
      link: `/live/${classId}`,
    });
    return cls;
  },

  // ⚠️ Notifications logic on cancel
  cancelClass(classId: string): ClassItem {
    const cls = store.getClassById(classId);
    if (!cls) throw new Error('کلاس یافت نشد');
    cls.status = 'cancelled';
    store.saveClass(cls);

    const students = store.getClassStudents(classId);
    notificationService.createBulk(students.map((s) => s.studentId), {
      title: 'لغو جلسه یا کلاس',
      body: `کلاس [${cls.title}] لغو شد. اطلاعات تکمیلی به زودی اعلام می‌گردد.`,
      type: 'general',
      link: '/dashboard/schedule',
    });
    return cls;
  },

  listClassStudents(classId: string): ClassStudent[] {
    return store.getClassStudents(classId);
  },

  addStudentToClass(classId: string, student: { studentId: string; studentName: string; studentEmail: string; studentPhone: string }): void {
    const cls = store.getClassById(classId);
    if (!cls) throw new Error('کلاس یافت نشد');
    const existing = store.getClassStudents(classId);
    if (existing.length >= cls.capacity) {
      throw new Error('ظرفیت این کلاس تکمیل شده است');
    }
    if (existing.some((s) => s.studentId === student.studentId)) {
      throw new Error('این زبان‌آموز در این کلاس ثبت‌نام دارد');
    }

    store.addStudentToClass({
      id: 'cs_' + Date.now(),
      classId,
      ...student,
      joinedAt: new Date().toISOString().split('T')[0],
      status: 'active',
    });

    cls.enrolledCount = (cls.enrolledCount || 0) + 1;
    store.saveClass(cls);
  },

  removeStudentFromClass(classId: string, studentId: string): void {
    store.removeStudentFromClass(classId, studentId);
    const cls = store.getClassById(classId);
    if (cls && cls.enrolledCount > 0) {
      cls.enrolledCount -= 1;
      store.saveClass(cls);
    }
  },
};
