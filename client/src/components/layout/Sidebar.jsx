import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  BarChart3,
  Zap,
  X,
  Layers,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Projects', path: '/projects', icon: FolderKanban },
  { label: 'Tasks', path: '/tasks', icon: CheckSquare },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0F172A] text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight">
                SprintDesk
              </span>
              <span className="block text-[10px] uppercase font-semibold tracking-wider text-indigo-400">
                Workspace
              </span>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace Pill */}
        <div className="px-4 py-3 border-b border-slate-800/50">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-750">
            <Layers className="w-4 h-4 text-indigo-400" />
            <div className="truncate">
              <span className="block text-xs font-medium text-white truncate">
                StartupMeu Intern
              </span>
              <span className="block text-[10px] text-slate-400">Assessment Sprint</span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-indigo-600/15 text-white font-semibold border-l-3 border-indigo-500 pl-3'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-5 h-5 shrink-0 transition-colors ${
                        isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Meta */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-semibold text-xs">
              SM
            </div>
            <div className="truncate">
              <p className="text-xs font-medium text-slate-200 truncate">Parvej Mulani</p>
              <p className="text-[10px] text-slate-400 truncate">Software Engineer</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
