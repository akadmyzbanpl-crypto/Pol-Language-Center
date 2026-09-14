import { store } from './storeService';

export const reportService = {
  getStats() {
    const users = store.getUsers();
    const courses = store.getCourses();
    const classes = store.getClasses();
    const books = store.getBooks();
    const orders = store.getOrders();

    const totalUsers = users.length;
    const totalStudents = users.filter((u) => u.role === 'student').length;
    const totalTeachers = users.filter((u) => u.role === 'teacher').length;
    const totalCourses = courses.length;
    const totalClasses = classes.length;
    const totalOrders = orders.length;

    let totalRevenue = 0;
    let bookRevenue = 0;
    let courseRevenue = 0;

    orders.forEach((o) => {
      if (o.paymentStatus === 'paid') {
        totalRevenue += o.total;
        o.items.forEach((item) => {
          if (item.itemType === 'book') {
            bookRevenue += item.finalPrice * item.qty;
          } else {
            courseRevenue += item.finalPrice * item.qty;
          }
        });
      }
    });

    return {
      totalUsers,
      totalStudents,
      totalTeachers,
      totalCourses,
      totalClasses,
      totalOrders,
      totalRevenue,
      bookRevenue,
      courseRevenue,
      lowStockBooks: books.filter((b) => b.stock < 10),
      unpaidOrders: orders.filter((o) => o.paymentStatus === 'pending'),
    };
  },

  getSummaryStats() {
    return this.getStats();
  },

  getSalesChart() {
    return [
      { date: '۱ شهریور', amount: 3200000 },
      { date: '۵ شهریور', amount: 4800000 },
      { date: '۱۰ شهریور', amount: 7200000 },
      { date: '۱۵ شهریور', amount: 5600000 },
      { date: '۲۰ شهریور', amount: 9100000 },
      { date: '۲۵ شهریور', amount: 8400000 },
      { date: '۳۰ شهریور', amount: 12500000 },
    ];
  },

  getUserGrowth() {
    return [
      { date: 'فروردین', count: 120 },
      { date: 'اردیبهشت', count: 210 },
      { date: 'خرداد', count: 340 },
      { date: 'تیر', count: 480 },
      { date: 'مرداد', count: 620 },
      { date: 'شهریور', count: 850 },
    ];
  },

  getCourseEnrollment() {
    const courses = store.getCourses();
    return courses.map((c) => ({
      courseTitle: c.title.split('(')[0].trim().slice(0, 20),
      count: Math.floor(Math.random() * 40) + 15,
    }));
  },

  getMonthlyRevenue() {
    return [
      { month: 'فروردین', revenue: 14000000 },
      { month: 'اردیبهشت', revenue: 22000000 },
      { month: 'خرداد', revenue: 31000000 },
      { month: 'تیر', revenue: 28000000 },
      { month: 'مرداد', revenue: 42000000 },
      { month: 'شهریور', revenue: 54000000 },
    ];
  },
};
