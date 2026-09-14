export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  uid: string;
  firstName: string;
  lastName: string;
  username: string;
  phone: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  isActive: boolean;
  status?: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt?: string;
}

export type CourseLevel = 'مبتدی (A1-A2)' | 'متوسط (B1-B2)' | 'پیشرفته (C1-C2)' | 'آمادگی آیلتس' | 'مکالمه فشرده' | 'کودکان و نوجوانان';
export type ClassType = 'online' | 'inPerson' | 'hybrid';
export type CourseStatus = 'draft' | 'published' | 'archived';

export interface CourseLesson {
  id: string;
  courseId?: string;
  title: string;
  order: number;
  description: string;
  videoUrl?: string;
  duration: string;
  isFree: boolean;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  level: CourseLevel;
  thumbnailUrl: string;
  teacherId: string;
  teacherName: string;
  sessionCount: number;
  durationHours: number;
  price: number;
  discountPercent: number;
  finalPrice: number;
  type: ClassType;
  status: CourseStatus;
  lessons?: CourseLesson[];
  createdAt: string;
}

export type ClassStatus = 'scheduled' | 'live' | 'finished' | 'cancelled' | 'ongoing';

export interface ClassItem {
  id: string;
  title: string;
  courseId: string;
  courseTitle?: string;
  teacherId: string;
  teacherName: string;
  level: CourseLevel;
  capacity: number;
  enrolledCount: number;
  startDate: string;
  endDate: string;
  weekDays: number[]; // 0=شنبه, 1=یکشنبه, 2=دوشنبه, 3=سه‌شنبه, 4=چهارشنبه, 5=پنج‌شنبه, 6=جمعه
  startTime: string; // e.g. "17:30"
  endTime: string;   // e.g. "19:00"
  type: ClassType;
  status: ClassStatus;
  createdAt: string;
  schedule?: { days: string[]; time: string };
  sessionDurationMinutes?: number;
  roomOrLink?: string;
  price?: number;
}

export interface ClassStudent {
  id: string;
  classId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  joinedAt: string;
  status: 'active' | 'removed';
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  courseTitle: string;
  orderId: string;
  progressPercent: number;
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverUrl: string;
  price: number;
  discountPercent: number;
  finalPrice: number;
  stock: number;
  category: string;
  isActive: boolean;
  isPublished?: boolean;
  pages?: number;
  level?: string;
}

export interface CartItem {
  itemType: 'course' | 'book';
  itemId: string;
  title: string;
  price: number;
  finalPrice: number;
  qty: number;
  imageUrl: string;
}

export interface Cart {
  userId?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
}

export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  address?: string;
  shippingAddress?: { address: string; postalCode: string };
  authority?: string;
  createdAt: string;
}

export type NotificationType =
  | 'class_reminder'
  | 'class_time_changed'
  | 'live_class_started'
  | 'new_course'
  | 'payment_success'
  | 'new_video'
  | 'general';

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface RecordedVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  teacherId: string;
  teacherName: string;
  courseId: string;
  courseTitle: string;
  lessonId?: string;
  duration: string;
  publishedAt: string;
  createdAt?: string;
  isPublic: boolean;
  isFree?: boolean;
  tags?: string[];
  attachments?: { name: string; url: string }[];
}

export type ClassSchedule = ClassItem;
export type VideoLesson = RecordedVideo;
export type Notification = NotificationItem;
export type OrderPaymentStatus = PaymentStatus;

export interface AttendanceRecord {
  id: string;
  classId: string;
  studentId: string;
  studentName: string;
  date: string;
  status: 'present' | 'absent' | 'late';
}

export interface Assignment {
  id: string;
  classId: string;
  classTitle: string;
  teacherId: string;
  teacherName: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  submissionsCount: number;
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  score?: number;
  feedback?: string;
  fileUrl?: string;
  content?: string;
}

export interface AcademySettings {
  name: string;
  englishName: string;
  slogan: string;
  logoUrl: string;
  phone: string;
  email: string;
  address: string;
  aboutText: string;
  instagram: string;
  telegram: string;
  linkedin: string;
  merchantId?: string;
}
