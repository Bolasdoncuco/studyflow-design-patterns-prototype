export default function TaskStats({ stats }: { stats: { total: number; active: number; completed: number; urgent: number } }) {
  return <div className="stats-grid"><div><span className="stat-value">{stats.active}</span><span className="stat-label">Active</span></div><div><span className="stat-value">{stats.completed}</span><span className="stat-label">Completed</span></div><div><span className="stat-value">{stats.urgent}</span><span className="stat-label">Urgent</span></div></div>;
}
