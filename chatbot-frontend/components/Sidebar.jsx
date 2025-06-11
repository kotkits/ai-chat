// components/Sidebar.jsx
export default function Sidebar({
  menuItems,
  selected,
  onSelect,
  collapsed
}) {
  return (
    <aside
      className={
        `${collapsed ? 'w-16' : 'w-60'} bg-white dark:bg-gray-800 p-4 border-r dark:border-gray-700 transition-all`
      }
    >
      <ul className="space-y-2">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = item.key === selected;
          return (
            <li key={item.key}>
              <button
                onClick={() => onSelect(item.key)}
                className={
                  `flex items-center w-full p-2 rounded 
                   ${isActive
                     ? 'bg-blue-100 dark:bg-blue-900'
                     : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`
                }
              >
                <Icon
                  className={`w-5 h-5 ${collapsed ? 'mx-auto' : 'mr-3'}`}
                />
                {!collapsed && <span>{item.label}</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
