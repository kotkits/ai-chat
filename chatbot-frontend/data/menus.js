// File: data/menus.js

import {
  Home,
  Users,
  LayoutGrid,
  MessageSquare,
  Megaphone,
  Settings,
  FileText,
  Cog
} from 'lucide-react'

export const userMenu = [
  { key: 'home',         label: 'Home',       icon: Home          },
  { key: 'contacts',     label: 'Contacts',   icon: Users         },
  { key: 'automation',   label: 'Automation', icon: LayoutGrid    },
  { key: 'livechat',     label: 'Live Chat',  icon: MessageSquare },
  { key: 'broadcasting', label: 'Broadcast',  icon: Megaphone     },
  { key: 'settings',     label: 'Settings',   icon: Settings      }
]

export const adminFullMenu = [
  { key: 'users',           label: 'Users',          icon: Users    },
  { key: 'logs',            label: 'Logs',           icon: FileText },
  { key: 'settings_admin',  label: 'Admin Settings', icon: Cog      }
]
