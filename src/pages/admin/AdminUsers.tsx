import React, { useState, useMemo } from 'react';
import { authService } from '../../services/authService';
import { User, UserRole } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Search, UserPlus, Edit2, Trash2, ShieldCheck, User as UserIcon } from 'lucide-react';
import { formatPersianDate } from '../../lib/formatters';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>(authService.listUsers());
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Modal states
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form states
  const [formFirstName, setFormFirstName] = useState('');
  const [formLastName, setFormLastName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('student');
  const [formStatus, setFormStatus] = useState<'active' | 'inactive' | 'suspended'>('active');

  const refreshList = () => {
    setUsers(authService.listUsers());
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchRole = roleFilter === 'all' || u.role === roleFilter;
      const matchSearch =
        !searchTerm.trim() ||
        u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.username.toLowerCase().includes(searchTerm.toLowerCase());
      return matchRole && matchSearch;
    });
  }, [users, roleFilter, searchTerm]);

  const openCreateModal = () => {
    setEditingUser(null);
    setFormFirstName('');
    setFormLastName('');
    setFormUsername('');
    setFormEmail('');
    setFormPhone('');
    setFormRole('student');
    setFormStatus('active');
    setUserModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormFirstName(user.firstName);
    setFormLastName(user.lastName);
    setFormUsername(user.username);
    setFormEmail(user.email);
    setFormPhone(user.phone || '');
    setFormRole(user.role);
    setFormStatus(user.status);
    setUserModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      authService.updateUser(editingUser.uid, {
        firstName: formFirstName,
        lastName: formLastName,
        phone: formPhone,
        role: formRole,
        status: formStatus,
      });
    } else {
      authService.createUserAdmin({
        firstName: formFirstName,
        lastName: formLastName,
        username: formUsername,
        email: formEmail,
        phone: formPhone,
        role: formRole,
        status: formStatus,
      });
    }
    setUserModalOpen(false);
    refreshList();
  };

  const handleDeleteUser = () => {
    if (deleteTargetId) {
      authService.deleteUser(deleteTargetId);
      setDeleteTargetId(null);
      refreshList();
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Badge variant="purple">مدیر کل</Badge>;
      case 'teacher':
        return <Badge variant="blue">استاد</Badge>;
      default:
        return <Badge variant="slate">دانش‌آموز</Badge>;
    }
  };

  return (
    <div className="space-y-6 text-right">
      {/* Top Filter and Create Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="w-full sm:w-80">
          <Input
            placeholder="جستجوی نام، ایمیل، نام کاربری..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            rightIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2.5"
          >
            <option value="all">همه نقش‌ها</option>
            <option value="admin">فقط مدیران</option>
            <option value="teacher">فقط اساتید</option>
            <option value="student">فقط دانش‌آموزان</option>
          </select>

          <Button onClick={openCreateModal} icon={<UserPlus className="w-4 h-4" />}>
            افزودن کاربر جدید
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
              <tr>
                <th className="p-4">کاربر</th>
                <th className="p-4">نام کاربری</th>
                <th className="p-4">ایمیل / تلفن</th>
                <th className="p-4">نقش سیستمی</th>
                <th className="p-4">وضعیت</th>
                <th className="p-4">تاریخ عضویت</th>
                <th className="p-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u.uid} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                        alt=""
                        className="w-9 h-9 rounded-xl object-cover"
                      />
                      <span className="font-bold text-slate-900">
                        {u.firstName} {u.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-slate-600" dir="ltr">
                    @{u.username}
                  </td>
                  <td className="p-4">
                    <span className="block text-slate-700 font-mono" dir="ltr">{u.email}</span>
                    <span className="text-slate-400 text-[11px]" dir="ltr">{u.phone || '-'}</span>
                  </td>
                  <td className="p-4">{getRoleBadge(u.role)}</td>
                  <td className="p-4">
                    <Badge variant={u.status === 'active' ? 'emerald' : 'rose'} size="sm">
                      {u.status === 'active' ? 'فعال' : 'مسدود'}
                    </Badge>
                  </td>
                  <td className="p-4 text-slate-500">{formatPersianDate(u.createdAt)}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditModal(u)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                        title="ویرایش"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTargetId(u.uid)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="حذف کاربر"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* User Create / Edit Modal */}
      {userModalOpen && (
        <Modal
          isOpen={userModalOpen}
          onClose={() => setUserModalOpen(false)}
          title={editingUser ? 'ویرایش کاربر' : 'افزودن کاربر جدید'}
        >
          <form onSubmit={handleSaveUser} className="space-y-4 text-right">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="نام"
                required
                value={formFirstName}
                onChange={(e) => setFormFirstName(e.target.value)}
              />
              <Input
                label="نام خانوادگی"
                required
                value={formLastName}
                onChange={(e) => setFormLastName(e.target.value)}
              />
            </div>

            <Input
              label="نام کاربری"
              required
              disabled={!!editingUser}
              dir="ltr"
              value={formUsername}
              onChange={(e) => setFormUsername(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="ایمیل"
                type="email"
                required
                disabled={!!editingUser}
                dir="ltr"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
              />
              <Input
                label="تلفن تماس"
                dir="ltr"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="نقش کاربری"
                value={formRole}
                onChange={(e) => setFormRole(e.target.value as UserRole)}
                options={[
                  { label: 'دانش‌آموز', value: 'student' },
                  { label: 'استاد / مدرس', value: 'teacher' },
                  { label: 'مدیر کل (ادمین)', value: 'admin' },
                ]}
              />

              <Select
                label="وضعیت حساب"
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as any)}
                options={[
                  { label: 'فعال', value: 'active' },
                  { label: 'غیرفعال / مسدود', value: 'inactive' },
                ]}
              />
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setUserModalOpen(false)}>
                انصراف
              </Button>
              <Button type="submit">
                {editingUser ? 'ذخیره تغییرات' : 'ایجاد کاربر'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteUser}
        title="حذف کاربر"
        message="آیا از حذف این کاربر اطمینان دارید؟ دسترسی او به دوره‌ها لغو خواهد شد."
        confirmText="بله، حذف کن"
      />
    </div>
  );
};
