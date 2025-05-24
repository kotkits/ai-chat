// pages/admin.jsx
import AdminUsers from '../components/AdminUsers'
import AdminSettings from '../components/AdminSettings'
import AuditLogs     from '../components/AuditLogs'
import { adminMenu } from '../data/menus'

export default function AdminDashboard() {
  return (
    <DashboardLayout menuItems={adminMenu}>
      {(selected) => {
        switch (selected) {
          case 'users':    return <AdminUsers />
          case 'settings': return <AdminSettings />
          case 'logs':     return <AuditLogs />
          default:         return <AdminUsers />
        }
      }}
    </DashboardLayout>
  )
}
