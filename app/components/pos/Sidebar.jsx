const Sidebar = ({ activeNav, setActiveNav }) => (
  <aside className="w-52 bg-[#111116] border-r border-[#2e2e38] flex flex-col">
    <div className="p-6 border-b border-[#1e1e28] flex items-center gap-3">
      <div className="w-8 h-8 bg-amber-200 rounded-lg flex items-center justify-center text-black font-bold text-xs">VS</div>
      <span className="font-bold text-white tracking-tight">Vitamin See</span>
    </div>
    
    <nav className="flex-1 py-4">
      {NAV.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveNav(item.id)}
          className={`w-full flex items-center gap-4 px-6 py-4 text-sm transition-all ${
            activeNav === item.id 
            ? "text-white bg-[#232330] border-l-4 border-amber-200 shadow-lg" 
            : "text-gray-500 hover:text-gray-300"
          }`}
        >
          <span>{item.icon}</span> {item.label}
        </button>
      ))}
    </nav>
  </aside>
);