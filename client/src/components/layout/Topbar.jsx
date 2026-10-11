import { Fragment } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, Plus, Bell } from 'lucide-react';

export default function Topbar({ onMenuToggle, onOpenNewTask, onOpenNewProject }) {
  const location = useLocation();

  // Dynamic Breadcrumb resolver
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/') return [{ label: 'Dashboard', path: '/' }];
    if (path === '/projects') return [{ label: 'Projects', path: '/projects' }];
    if (path.startsWith('/projects/')) {
      return [
        { label: 'Projects', path: '/projects' },
        { label: 'Project Details', path },
      ];
    }
    if (path === '/tasks') return [{ label: 'Tasks', path: '/tasks' }];
    if (path === '/analytics') return [{ label: 'Analytics', path: '/analytics' }];
    return [{ label: 'SprintDesk', path: '/' }];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
          {breadcrumbs.map((crumb, idx) => (
            <Fragment key={crumb.path}>
              {idx > 0 && <span className="text-slate-300">/</span>}
              {idx === breadcrumbs.length - 1 ? (
                <span className="font-semibold text-slate-800">{crumb.label}</span>
              ) : (
                <Link
                  to={crumb.path}
                  className="text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </Fragment>
          ))}
        </nav>
      </div>

      {/* Right: Quick Action CTAs & Profile */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onOpenNewProject}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          New Project
        </button>

        <button
          type="button"
          onClick={onOpenNewTask}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs hover:shadow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden xs:inline">New Task</span>
          <span className="xs:hidden">Task</span>
        </button>

        <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

        <button
          type="button"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 relative transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-600 rounded-full" />
        </button>

        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">
          PM
        </div>
      </div>
    </header>
  );
}
