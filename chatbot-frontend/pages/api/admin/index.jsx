// File: pages/admin/index.jsx

import { getSession }    from 'next-auth/react'
import DashboardLayout   from '../../components/DashboardLayout'
import { adminFullMenu } from '../../data/menus'

export default function AdminPage() {
  return (
    <DashboardLayout menuItems={adminFullMenu}>
      <h2 className="text-2xl font-semibold">Admin Console</h2>
      {/* admin-specific components here */}
    </DashboardLayout>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  if (!session || session.user.role !== 'admin') {
    return { redirect: { destination: '/login', permanent: false } }
  }
  return { props: {} }
}
