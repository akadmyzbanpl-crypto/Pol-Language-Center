import React from 'react';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';

// Layout components
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { DashboardShell } from './components/layout/DashboardShell';
import { AdminShell } from './components/layout/AdminShell';
import { PrivateRoute, RoleRoute } from './components/layout/RouteGuards';

// Public pages
import { Home } from './pages/public/Home';
import { Courses } from './pages/public/Courses';
import { CourseDetail } from './pages/public/CourseDetail';
import { Books } from './pages/public/Books';
import { BookDetail } from './pages/public/BookDetail';
import { Videos } from './pages/public/Videos';
import { Teachers } from './pages/public/Teachers';
import { About } from './pages/public/About';
import { Contact } from './pages/public/Contact';
import { Cart } from './pages/public/Cart';
import { Checkout } from './pages/public/Checkout';
import { NotificationsPage } from './pages/public/NotificationsPage';
import { Login } from './pages/public/Login';
import { Register } from './pages/public/Register';
import { ForgotPassword } from './pages/public/ForgotPassword';
import { Forbidden } from './pages/public/Forbidden';
import { NotFound } from './pages/public/NotFound';
import { GoogleWorkspaceHub } from './pages/workspace/GoogleWorkspaceHub';

// Public Classes & Live Classes
import { Classes } from './pages/public/Classes';
import { LiveClassRoom } from './pages/live/LiveClassRoom';

// Student Dashboard pages
import { StudentDashboard } from './pages/dashboard/StudentDashboard';
import { MyCourses } from './pages/dashboard/MyCourses';
import { StudentSchedule } from './pages/dashboard/StudentSchedule';
import { StudentOrders } from './pages/dashboard/StudentOrders';
import { StudentProfile } from './pages/dashboard/StudentProfile';

// Teacher portal
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';

// Admin pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminStudents } from './pages/admin/AdminStudents';
import { AdminTeachers } from './pages/admin/AdminTeachers';
import { AdminCourses } from './pages/admin/AdminCourses';
import { AdminClasses } from './pages/admin/AdminClasses';
import { AdminCalendar } from './pages/admin/AdminCalendar';
import { AdminLive } from './pages/admin/AdminLive';
import { AdminVideos } from './pages/admin/AdminVideos';
import { AdminBooks } from './pages/admin/AdminBooks';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminPayments } from './pages/admin/AdminPayments';
import { AdminAttendance } from './pages/admin/AdminAttendance';
import { AdminAssignments } from './pages/admin/AdminAssignments';
import { AdminNotifications } from './pages/admin/AdminNotifications';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminSettings } from './pages/admin/AdminSettings';
import { DevSeed } from './pages/admin/DevSeed';

// Public Layout Wrapper with Header and Footer
const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Public Website Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:slug" element={<CourseDetail />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/forbidden" element={<Forbidden />} />
          <Route path="/workspace" element={<GoogleWorkspaceHub />} />
          <Route path="/dev/seed" element={<DevSeed />} />
        </Route>

        {/* Live Interactive Classroom (Standalone view) */}
        <Route path="/live/:classId" element={<LiveClassRoom />} />

        {/* Student Dashboard (Requires Auth) */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardShell>
                <Outlet />
              </DashboardShell>
            </PrivateRoute>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="schedule" element={<StudentSchedule />} />
          <Route path="orders" element={<StudentOrders />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>

        {/* Teacher Portal (Requires teacher or admin) */}
        <Route
          path="/teacher"
          element={
            <RoleRoute allowedRoles={['teacher', 'admin']}>
              <PublicLayout />
            </RoleRoute>
          }
        >
          <Route index element={<TeacherDashboard />} />
        </Route>

        {/* Admin Suite (Requires admin role) */}
        <Route
          path="/admin"
          element={
            <RoleRoute allowedRoles={['admin']}>
              <AdminShell>
                <Outlet />
              </AdminShell>
            </RoleRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="teachers" element={<AdminTeachers />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="classes" element={<AdminClasses />} />
          <Route path="calendar" element={<AdminCalendar />} />
          <Route path="live" element={<AdminLive />} />
          <Route path="videos" element={<AdminVideos />} />
          <Route path="books" element={<AdminBooks />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="attendance" element={<AdminAttendance />} />
          <Route path="assignments" element={<AdminAssignments />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* 404 Fallback */}
        <Route
          path="*"
          element={
            <PublicLayout>
              <NotFound />
            </PublicLayout>
          }
        />
      </Routes>
    </HashRouter>
  );
}
