import { useNavigate } from 'react-router-dom';
import {
  Shield, AlertTriangle, CheckCircle, Clock,
  Activity, TrendingUp, Cpu, Users,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MetricCard } from '../components/common/MetricCard';
import { GlassCard, GlassCardHeader, GlassCardContent } from '../components/common/GlassCard';
import { StatusBadge, RiskBadge } from '../components/common/StatusBadge';
import { initiatives, signals, mcpServers, dataSources, generateTimeSeriesData } from '../data/mockData';

const riskDistribution = [
  { name: 'Critical', value: initiatives.filter(i => i.riskTier === 'critical').length, color: '#ef4444' },
  { name: 'High', value: initiatives.filter(i => i.riskTier === 'high').length, color: '#f97316' },
  { name: 'Medium', value: initiatives.filter(i => i.riskTier === 'medium').length, color: '#eab308' },
  { name: 'Low', value: initiatives.filter(i => i.riskTier === 'low').length, color: '#22c55e' },
];

const activityData = generateTimeSeriesData(24, 450, 150, 2);
const unresolvedSignals = signals.filter(s => !s.resolved);
const myInitiatives = initiatives.filter(i => i.owner === 'Joe Pugh');

export function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-100">Control Plane Dashboard</h1>
          <p className="text-sm text-surface-400 mt-1">AI initiative governance overview &middot; Last updated 2 minutes ago</p>
        </div>
        <div className="flex items-center gap-2">
          {dataSources.map(ds => (
            <div key={ds.name} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-surface-800/50 border border-surface-700/30" title={`${ds.name}: ${ds.status}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${ds.status === 'connected' ? 'bg-emerald-400' : ds.status === 'degraded' ? 'bg-yellow-400' : 'bg-red-400'}`} />
              <span className="text-[10px] text-surface-500">{ds.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Active Initiatives" value={initiatives.filter(i => i.status !== 'retired').length} subtitle="2 mine, 3 team" icon={<Shield size={18} />} accentColor="blue" trend="up" trendValue="+2 this month" />
        <MetricCard label="Active Signals" value={unresolvedSignals.length} subtitle={`${unresolvedSignals.filter(s => s.severity === 'critical').length} critical`} icon={<AlertTriangle size={18} />} accentColor="amber" />
        <MetricCard label="Gates Passing" value="78%" subtitle="18/23 gates passing" icon={<CheckCircle size={18} />} accentColor="emerald" trend="up" trendValue="+4%" />
        <MetricCard label="MCP Servers" value={mcpServers.filter(m => m.status === 'active').length} subtitle={`${mcpServers.length} registered`} icon={<Cpu size={18} />} accentColor="purple" />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <GlassCard>
            <GlassCardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-surface-200">My Initiatives</h2>
                <button onClick={() => navigate('/initiative/init-001')} className="text-xs text-brand-400 hover:text-brand-300">View all</button>
              </div>
            </GlassCardHeader>
            <div className="divide-y divide-surface-800/50">
              {myInitiatives.map(init => (
                <div
                  key={init.id}
                  onClick={() => navigate(`/initiative/${init.id}`)}
                  className="px-5 py-4 hover:bg-surface-800/30 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        init.riskTier === 'critical' ? 'bg-red-500/10' :
                        init.riskTier === 'high' ? 'bg-orange-500/10' :
                        init.riskTier === 'medium' ? 'bg-yellow-500/10' : 'bg-emerald-500/10'
                      }`}>
                        <Shield size={18} className={
                          init.riskTier === 'critical' ? 'text-red-400' :
                          init.riskTier === 'high' ? 'text-orange-400' :
                          init.riskTier === 'medium' ? 'text-yellow-400' : 'text-emerald-400'
                        } />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-surface-200">{init.name}</h3>
                        <p className="text-xs text-surface-500 mt-0.5">{init.team} &middot; {init.environment}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <RiskBadge risk={init.riskTier} />
                      <StatusBadge status={init.status} />
                    </div>
                  </div>
                </div>
              ))}

              {initiatives.filter(i => i.owner !== 'Joe Pugh' && i.team === 'Platform Engineering').map(init => (
                <div
                  key={init.id}
                  onClick={() => navigate(`/initiative/${init.id}`)}
                  className="px-5 py-4 hover:bg-surface-800/30 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-800/50 flex items-center justify-center">
                        <Users size={18} className="text-surface-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-surface-300">{init.name}</h3>
                        <p className="text-xs text-surface-500 mt-0.5">{init.owner} &middot; {init.team}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <RiskBadge risk={init.riskTier} />
                      <StatusBadge status={init.status} />
                    </div>
                  </div>
                </div>
              ))}

              <div className="px-5 py-3 bg-surface-800/20">
                <p className="text-[10px] text-surface-500 uppercase tracking-wider font-medium">Other Teams</p>
              </div>
              {initiatives.filter(i => i.team !== 'Platform Engineering').map(init => (
                <div
                  key={init.id}
                  onClick={() => navigate(`/initiative/${init.id}`)}
                  className="px-5 py-4 hover:bg-surface-800/30 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-800/50 flex items-center justify-center">
                        <Shield size={18} className="text-surface-500" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-surface-300">{init.name}</h3>
                        <p className="text-xs text-surface-500 mt-0.5">{init.owner} &middot; {init.team}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <RiskBadge risk={init.riskTier} />
                      <StatusBadge status={init.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard>
            <GlassCardHeader>
              <h2 className="text-sm font-semibold text-surface-200">Risk Distribution</h2>
            </GlassCardHeader>
            <GlassCardContent>
              <div className="flex items-center gap-6">
                <div className="w-32 h-32">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={30} outerRadius={55} paddingAngle={3} dataKey="value">
                        {riskDistribution.map((entry, i) => (
                          <Cell key={i} fill={entry.color} stroke="transparent" />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {riskDistribution.map(r => (
                    <div key={r.name} className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: r.color }} />
                      <span className="text-xs text-surface-400">{r.name}</span>
                      <span className="text-xs font-medium text-surface-300">{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>

          <GlassCard>
            <GlassCardHeader>
              <h2 className="text-sm font-semibold text-surface-200">AI Interactions (24h)</h2>
            </GlassCardHeader>
            <GlassCardContent className="!p-0 !pb-2">
              <ResponsiveContainer width="100%" height={140}>
                <AreaChart data={activityData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="timestamp" tick={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
                    labelFormatter={() => ''}
                    formatter={(v: number) => [Math.round(v), 'Interactions']}
                  />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="url(#activityGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </GlassCardContent>
          </GlassCard>

          <GlassCard>
            <GlassCardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-surface-200">Recent Signals</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30">{unresolvedSignals.length} active</span>
              </div>
            </GlassCardHeader>
            <div className="divide-y divide-surface-800/30 max-h-60 overflow-y-auto">
              {unresolvedSignals.slice(0, 5).map(sig => (
                <div key={sig.id} className="px-5 py-3">
                  <div className="flex items-start gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                      sig.severity === 'critical' ? 'bg-red-400' :
                      sig.severity === 'high' ? 'bg-orange-400' :
                      sig.severity === 'medium' ? 'bg-yellow-400' : 'bg-emerald-400'
                    }`} />
                    <div>
                      <p className="text-xs text-surface-300">{sig.description}</p>
                      <p className="text-[10px] text-surface-500 mt-0.5">{sig.source}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
