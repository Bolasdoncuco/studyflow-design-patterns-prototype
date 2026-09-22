import type { PriorityStrategyName } from "@/domain/Task";

export default function DashboardHeader({ strategyName, onStrategyChange }: { strategyName: PriorityStrategyName; onStrategyChange(name: PriorityStrategyName): void }) {
  return <header className="dashboard-header"><div><p className="eyebrow">STUDYFLOW / WEEKLY PLANNER</p><h1>Make progress <em>visible.</em></h1><p className="lede">A calm place to turn deadlines into the next clear action.</p></div><label className="strategy-control">Priority lens<select aria-label="Priority strategy" value={strategyName} onChange={(event) => onStrategyChange(event.target.value as PriorityStrategyName)}><option value="balanced">Balanced</option><option value="deadline">Deadline first</option><option value="effort">Effort first</option></select></label></header>;
}
