import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';

const STATUS_COLORS = {
  'To Do': '#94A3B8', // slate-400
  'In Progress': '#3B82F6', // blue-500
  'In Review': '#F59E0B', // amber-500
  'Done': '#10B981', // emerald-500
};

export default function TaskStatusChart({ tasks = [] }) {
  const data = [
    { name: 'To Do', count: tasks.filter((t) => t.status === 'todo').length },
    { name: 'In Progress', count: tasks.filter((t) => t.status === 'in_progress').length },
    { name: 'In Review', count: tasks.filter((t) => t.status === 'in_review').length },
    { name: 'Done', count: tasks.filter((t) => t.status === 'done').length },
  ];

  const totalTasks = tasks.length;

  if (totalTasks === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-xs">
        No task data available yet.
      </div>
    );
  }

  return (
    <div className="w-full h-64 pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="name"
            tick={{ fill: '#64748B', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#E2E8F0' }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: '#94A3B8', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }}
            contentStyle={{
              backgroundColor: '#FFFFFF',
              borderColor: '#E2E8F0',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#6366F1'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
