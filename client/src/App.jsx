import { ToastProvider } from './context/ToastContext';
import { WorkspaceProvider } from './context/WorkspaceContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <ToastProvider>
      <WorkspaceProvider>
        <AppRoutes />
      </WorkspaceProvider>
    </ToastProvider>
  );
}
