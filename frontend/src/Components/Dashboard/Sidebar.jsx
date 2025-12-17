import { 
  LayoutDashboard, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Target, 
  Settings,
  Menu,
  X,
  Wallet
} from "lucide-react";
import { useState } from "react";

const navigationItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: TrendingUp, label: "Income", active: false },
  { icon: TrendingDown, label: "Expenses", active: false },
  { icon: PieChart, label: "Categories", active: false },
  { icon: Target, label: "Goals", active: false },
  { icon: Settings, label: "Settings", active: false }
];

export default function Sidebar({ collapsed, onToggle }) {
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-dark-secondary/90 backdrop-blur-xl border-r border-neon-cyan/20 z-50 transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-neon-gradient rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-dark-primary" />
                </div>
                <span className="text-brand font-bold text-xl">WealthLog</span>
              </div>
            )}
            
            <button
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-neon-cyan/10 transition-colors text-gray-400 hover:text-neon-cyan"
            >
              {collapsed ? <Menu size={20} /> : <X size={20} />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <div
              key={item.label}
              onMouseEnter={() => setHoveredItem(item.label)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <button
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group relative ${
                  item.active
                    ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <item.icon 
                  size={20} 
                  className={`transition-colors ${
                    item.active ? 'text-neon-cyan' : 'group-hover:text-neon-cyan'
                  }`} 
                />
                
                {!collapsed && (
                  <span className="font-medium">{item.label}</span>
                )}

                {/* Active indicator */}
                {item.active && (
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-neon-cyan rounded-l-full" />
                )}

                {/* Tooltip for collapsed state */}
                {collapsed && hoveredItem === item.label && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-dark-primary border border-neon-cyan/30 rounded text-sm whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </button>
            </div>
          ))}
        </nav>

        {/* Bottom Section */}
        {!collapsed && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="glass p-4 rounded-lg border border-neon-cyan/20">
              <div className="text-center">
                <div className="w-12 h-12 bg-neon-gradient rounded-full mx-auto mb-2 flex items-center justify-center">
                  <Target className="w-6 h-6 text-dark-primary" />
                </div>
                <h4 className="text-sm font-semibold text-gray-200 mb-1">Monthly Goal</h4>
                <p className="text-xs text-gray-400 mb-2">Save 20% of income</p>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-neon-gradient h-2 rounded-full transition-all duration-1000"
                    style={{ width: "68%" }}
                  />
                </div>
                <p className="text-xs text-neon-cyan mt-1">68% Complete</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}