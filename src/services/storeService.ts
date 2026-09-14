import {
  AcademySettings,
  Assignment,
  AttendanceRecord,
  Book,
  ClassItem,
  ClassStudent,
  Course,
  CourseLesson,
  NotificationItem,
  Order,
  RecordedVideo,
  Submission,
  User,
} from '../types';
import {
  INITIAL_ASSIGNMENTS,
  INITIAL_BOOKS,
  INITIAL_CLASSES,
  INITIAL_COURSES,
  INITIAL_NOTIFICATIONS,
  INITIAL_ORDERS,
  INITIAL_SETTINGS,
  INITIAL_USERS,
  INITIAL_VIDEOS,
} from './seedData';

// Storage keys
const K = {
  USERS: 'pol_users',
  COURSES: 'pol_courses',
  CLASSES: 'pol_classes',
  CLASS_STUDENTS: 'pol_class_students',
  BOOKS: 'pol_books',
  VIDEOS: 'pol_videos',
  ORDERS: 'pol_orders',
  NOTIFICATIONS: 'pol_notifications',
  ATTENDANCE: 'pol_attendance',
  ASSIGNMENTS: 'pol_assignments',
  SUBMISSIONS: 'pol_submissions',
  SETTINGS: 'pol_settings',
};

function getStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('pol_store_change', { detail: { key } }));
  } catch (e) {
    console.error('Failed to write storage:', e);
  }
}

export const store = {
  // Reset / Seed
  resetToDefaults() {
    setStorage(K.USERS, INITIAL_USERS);
    setStorage(K.COURSES, INITIAL_COURSES);
    setStorage(K.CLASSES, INITIAL_CLASSES);
    setStorage(K.BOOKS, INITIAL_BOOKS);
    setStorage(K.VIDEOS, INITIAL_VIDEOS);
    setStorage(K.ORDERS, INITIAL_ORDERS);
    setStorage(K.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    setStorage(K.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
    setStorage(K.SETTINGS, INITIAL_SETTINGS);
  },
  resetToSeed() {
    this.resetToDefaults();
  },

  // USERS
  getUsers(): User[] {
    return getStorage<User[]>(K.USERS, INITIAL_USERS);
  },
  saveUser(user: User) {
    const list = this.getUsers();
    const idx = list.findIndex((u) => u.uid === user.uid);
    if (idx >= 0) list[idx] = user;
    else list.push(user);
    setStorage(K.USERS, list);
  },
  deleteUser(uid: string) {
    const list = this.getUsers().filter((u) => u.uid !== uid);
    setStorage(K.USERS, list);
  },
  findUserByUsername(username: string): User | undefined {
    return this.getUsers().find((u) => u.username.toLowerCase() === username.toLowerCase());
  },
  findUserByEmail(email: string): User | undefined {
    return this.getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
  },
  findUserById(uid: string): User | undefined {
    return this.getUsers().find((u) => u.uid === uid);
  },

  // COURSES
  getCourses(): Course[] {
    return getStorage<Course[]>(K.COURSES, INITIAL_COURSES);
  },
  saveCourse(course: Course) {
    const list = this.getCourses();
    const idx = list.findIndex((c) => c.id === course.id);
    if (idx >= 0) list[idx] = course;
    else list.unshift(course);
    setStorage(K.COURSES, list);
  },
  deleteCourse(id: string) {
    const list = this.getCourses().filter((c) => c.id !== id);
    setStorage(K.COURSES, list);
  },
  getCourseBySlug(slug: string): Course | undefined {
    return this.getCourses().find((c) => c.slug === slug || c.id === slug);
  },

  // CLASSES
  getClasses(): ClassItem[] {
    return getStorage<ClassItem[]>(K.CLASSES, INITIAL_CLASSES);
  },
  saveClass(cls: ClassItem) {
    const list = this.getClasses();
    const idx = list.findIndex((c) => c.id === cls.id);
    if (idx >= 0) list[idx] = cls;
    else list.unshift(cls);
    setStorage(K.CLASSES, list);
  },
  deleteClass(id: string) {
    const list = this.getClasses().filter((c) => c.id !== id);
    setStorage(K.CLASSES, list);
  },
  getClassById(id: string): ClassItem | undefined {
    return this.getClasses().find((c) => c.id === id);
  },

  // CLASS STUDENTS
  getClassStudents(classId: string): ClassStudent[] {
    const all = getStorage<ClassStudent[]>(K.CLASS_STUDENTS, [
      {
        id: 'cs_1',
        classId: 'class_1',
        studentId: 'user_student_1',
        studentName: 'حسام پورسادات',
        studentEmail: 'student@demo.com',
        studentPhone: '09123456789',
        joinedAt: '2026-08-20',
        status: 'active',
      },
    ]);
    return all.filter((s) => s.classId === classId && s.status === 'active');
  },
  addStudentToClass(cs: ClassStudent) {
    const all = getStorage<ClassStudent[]>(K.CLASS_STUDENTS, []);
    all.push(cs);
    setStorage(K.CLASS_STUDENTS, all);
  },
  removeStudentFromClass(classId: string, studentId: string) {
    const all = getStorage<ClassStudent[]>(K.CLASS_STUDENTS, []).map((s) =>
      s.classId === classId && s.studentId === studentId ? { ...s, status: 'removed' as const } : s
    );
    setStorage(K.CLASS_STUDENTS, all);
  },

  // BOOKS
  getBooks(): Book[] {
    return getStorage<Book[]>(K.BOOKS, INITIAL_BOOKS);
  },
  saveBook(book: Book) {
    const list = this.getBooks();
    const idx = list.findIndex((b) => b.id === book.id);
    if (idx >= 0) list[idx] = book;
    else list.unshift(book);
    setStorage(K.BOOKS, list);
  },
  deleteBook(id: string) {
    const list = this.getBooks().filter((b) => b.id !== id);
    setStorage(K.BOOKS, list);
  },
  getBookById(id: string): Book | undefined {
    return this.getBooks().find((b) => b.id === id);
  },

  // VIDEOS
  getVideos(): RecordedVideo[] {
    return getStorage<RecordedVideo[]>(K.VIDEOS, INITIAL_VIDEOS);
  },
  saveVideo(video: RecordedVideo) {
    const list = this.getVideos();
    const idx = list.findIndex((v) => v.id === video.id);
    if (idx >= 0) list[idx] = video;
    else list.unshift(video);
    setStorage(K.VIDEOS, list);
  },
  deleteVideo(id: string) {
    const list = this.getVideos().filter((v) => v.id !== id);
    setStorage(K.VIDEOS, list);
  },

  // ORDERS
  getOrders(): Order[] {
    return getStorage<Order[]>(K.ORDERS, INITIAL_ORDERS);
  },
  saveOrder(order: Order) {
    const list = this.getOrders();
    const idx = list.findIndex((o) => o.id === order.id);
    if (idx >= 0) list[idx] = order;
    else list.unshift(order);
    setStorage(K.ORDERS, list);
  },

  // NOTIFICATIONS
  getNotifications(userId?: string): NotificationItem[] {
    const all = getStorage<NotificationItem[]>(K.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    if (!userId) return all;
    return all.filter((n) => n.userId === userId || n.userId === 'all');
  },
  saveNotification(notif: NotificationItem) {
    const list = getStorage<NotificationItem[]>(K.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    list.unshift(notif);
    setStorage(K.NOTIFICATIONS, list);
  },
  markNotificationAsRead(id: string) {
    const list = this.getNotifications().map((n) => (n.id === id ? { ...n, isRead: true } : n));
    setStorage(K.NOTIFICATIONS, list);
  },
  markAllNotificationsRead(userId: string) {
    const list = this.getNotifications().map((n) =>
      n.userId === userId || n.userId === 'all' ? { ...n, isRead: true } : n
    );
    setStorage(K.NOTIFICATIONS, list);
  },

  // ATTENDANCE
  getAttendance(classId: string, date: string): AttendanceRecord[] {
    const all = getStorage<AttendanceRecord[]>(K.ATTENDANCE, []);
    return all.filter((a) => a.classId === classId && a.date === date);
  },
  saveAttendance(records: AttendanceRecord[]) {
    let all = getStorage<AttendanceRecord[]>(K.ATTENDANCE, []);
    for (const r of records) {
      all = all.filter((a) => !(a.classId === r.classId && a.studentId === r.studentId && a.date === r.date));
      all.push(r);
    }
    setStorage(K.ATTENDANCE, all);
  },

  // ASSIGNMENTS
  getAssignments(classId?: string): Assignment[] {
    const all = getStorage<Assignment[]>(K.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
    if (!classId) return all;
    return all.filter((a) => a.classId === classId);
  },
  saveAssignment(assignment: Assignment) {
    const list = this.getAssignments();
    const idx = list.findIndex((a) => a.id === assignment.id);
    if (idx >= 0) list[idx] = assignment;
    else list.unshift(assignment);
    setStorage(K.ASSIGNMENTS, list);
  },
  deleteAssignment(id: string) {
    const list = this.getAssignments().filter((a) => a.id !== id);
    setStorage(K.ASSIGNMENTS, list);
  },

  // SUBMISSIONS
  getSubmissions(assignmentId: string): Submission[] {
    const all = getStorage<Submission[]>(K.SUBMISSIONS, [
      {
        id: 'sub_1',
        assignmentId: 'assign_1',
        studentId: 'user_student_1',
        studentName: 'حسام پورسادات',
        submittedAt: '2026-09-13T16:00:00.000Z',
        score: 19,
        feedback: 'عالی بود حسام عزیز. تلفظ کلمات و ساختار ریتم صحبت طبیعی و روان است.',
        content: 'توضیحات و فایل ارسال شده اسپیکینگ',
      },
    ]);
    return all.filter((s) => s.assignmentId === assignmentId);
  },
  gradeSubmission(id: string, score: number, feedback: string) {
    const all = getStorage<Submission[]>(K.SUBMISSIONS, []);
    const idx = all.findIndex((s) => s.id === id);
    if (idx >= 0) {
      all[idx] = { ...all[idx], score, feedback };
      setStorage(K.SUBMISSIONS, all);
    }
  },

  // SETTINGS
  getSettings(): AcademySettings {
    return getStorage<AcademySettings>(K.SETTINGS, INITIAL_SETTINGS);
  },
  saveSettings(settings: AcademySettings) {
    setStorage(K.SETTINGS, settings);
  },
};

export const storeService = store;

