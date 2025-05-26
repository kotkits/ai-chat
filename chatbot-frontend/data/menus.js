// data/menus.js

export const userMenu = [
  { key: 'home',         label: 'Home',              icon: 'home' },
  { key: 'contacts',     label: 'Contacts',          icon: 'group' },
  { key: 'automation',   label: 'Automation',        icon: 'settings_suggest' },
  { key: 'livechat',     label: 'Live Chat',         icon: 'chat_bubble' },
  { key: 'broadcasting', label: 'Broadcasting',      icon: 'send' },
  { key: 'settings',     label: 'Settings',          icon: 'settings' },
]

export const adminMenu = [
  { key: 'users',         label: 'User Management', icon: 'group' },
  { key: 'logs',          label: 'Audit Logs',      icon: 'history' },
  { key: 'settings_admin',label: 'System Settings', icon: 'settings' },
]

// adminFullMenu will be used by the admin portal to show both sets:
export const adminFullMenu = [
  ...userMenu,
  ...adminMenu,
]
