import { NavLink, Outlet } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  LayoutDashboard, Shield, FlaskConical, Network, Activity,
  GitBranch, Search, Database, TrendingUp, Settings,
  ChevronLeft, ChevronRight, Bell, Cpu,
} from 'lucide-react';
import { useState } from 'react';
import { ChatPanel } from '../components/chat/ChatPanel';
import { currentUser, signals } from '../data/mockData';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/initiative/init-001', icon: Shield, label: 'Initiative Builder' },
  { to: '/testing', icon: FlaskConical, label: 'Testing & TEVV' },
  { to: '/topology', icon: Network, label: 'Integration Topology' },
  { to: '/runtime', icon: Activity, label: 'Runtime Observatory' },
  { to: '/gates', icon: GitBranch, label: 'Release Gates' },
  { to: '/impact', icon: Search, label: 'Impact Analyzer' },
  { to: '/registry', icon: Database, label: 'MCP Registry' },
  { to: '/value', icon: TrendingUp, label: 'Value Tracking' },
];

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const unresolvedSignals = signals.filter(s => !s.resolved);

  return (
    <div className="flex h-screen overflow-hidden bg-surface-950">
      <aside className={clsx(
        'flex flex-col border-r border-surface-800 bg-surface-950 transition-all duration-300 shrink-0',
        collapsed ? 'w-16' : 'w-60',
      )}>
        <div className={clsx(
          'flex items-center gap-3 px-4 h-16 border-b border-surface-800',
          collapsed && 'justify-center',
        )}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shrink-0">
            <Cpu size={16} className="text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-surface-100 truncate">AI Control Plane</h1>
              <p className="text-[10px] text-surface-500">Governance Framework</p>
            </div>
          )}
        </div>

        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => clsx(
                'flex items-center gap-3 rounded-lg transition-all group',
                collapsed ? 'justify-center p-2.5' : 'px-3 py-2.5',
                isActive
                  ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                  : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/50 border border-transparent',
              )}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span className="text-sm truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-surface-800 p-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center p-2 rounded-lg text-surface-500 hover:text-surface-300 hover:bg-surface-800/50 transition-colors"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 flex items-center justify-between px-6 border-b border-surface-800 bg-surface-950/80 backdrop-blur-sm shrink-0">
          <div />
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-surface-400 hover:text-surface-200 hover:bg-surface-800 transition-colors"
              >
                <Bell size={18} />
                {unresolvedSignals.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                    {unresolvedSignals.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-12 w-96 bg-surface-900 border border-surface-700/50 rounded-xl shadow-2xl z-50 animate-slide-up">
                  <div className="px-4 py-3 border-b border-surface-700/50">
                    <h3 className="text-sm font-semibold text-surface-200">Active Signals</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-surface-800/50">
                    {unresolvedSignals.map(sig => (
                      <div key={sig.id} className="px-4 py-3 hover:bg-surface-800/30 transition-colors">
                        <div className="flex items-start gap-2">
                          <span className={clsx(
                            'w-2 h-2 rounded-full mt-1.5 shrink-0',
                            sig.severity === 'critical' ? 'bg-red-500' :
                            sig.severity === 'high' ? 'bg-orange-500' :
                            sig.severity === 'medium' ? 'bg-yellow-500' : 'bg-emerald-500',
                          )} />
                          <div>
                            <p className="text-xs font-medium text-surface-200">{sig.type}</p>
                            <p className="text-[11px] text-surface-400 mt-0.5">{sig.description}</p>
                            <p className="text-[10px] text-surface-500 mt-1">{sig.source} &middot; {new Date(sig.timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <NavLink to="/settings" className="p-2 rounded-lg text-surface-400 hover:text-surface-200 hover:bg-surface-800 transition-colors">
              <Settings size={18} />
            </NavLink>

            <div className="flex items-center gap-3 pl-3 border-l border-surface-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                {currentUser.avatar}
              </div>
              <div className="hidden lg:block">
                <p className="text-xs font-medium text-surface-200">{currentUser.name}</p>
                <p className="text-[10px] text-surface-500">{currentUser.role}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <ChatPanel />
    </div>
  );
}
