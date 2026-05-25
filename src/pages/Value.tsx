import { useState } from 'react';
import {
  TrendingUp, TrendingDown, Target, DollarSign,
  Users, BarChart3, CheckCircle, AlertTriangle, Minus,
} from 'lucide-react';
import { clsx } from 'clsx';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, Cell, CartesianGrid, ReferenceLine,
} from 'recharts';
import { GlassCard, GlassCardHeader, GlassCardContent } from '../components/common/GlassCard';
import { StatusBadge, RiskBadge } from '../components/common/StatusBadge';
import { MetricCard } from '../components/common/MetricCard';
import { ProgressBar } from '../components/common/ProgressBar';
import { initiatives, generateTimeSeriesData } from '../data/mockData';

export function Value() {
  const [selectedInit, setSelectedInit] = useState(initiatives[0].id);
  const initiative = initiatives.find(i => i.id === selectedInit)!;

  const deployedInits = initiatives.filter(i => i.status === 'deployed');
  const avgConfidence = deployedInits.length > 0
    ? (deployedInits.flatMap(i => i.valueMetrics).filter(m => m.actual !== null).reduce((sum, m) => sum + m.confidence, 0) /
       deployedInits.flatMap(i => i.valueMetrics).filter(m => m.actual !== null).length * 100).toFixed(0)
    : '0';

  const metricsOnTrack = deployedInits.flatMap(i => i.valueMetrics).filter(m => m.actual !== null && m.actual >= m.hypothesis * 0.7).length;
  const metricsTotal = deployedInits.flatMap(i => i.valueMetrics).filter(m => m.actual !== null).length;

  // Mock adoption trend data
  const adoptionData = generateTimeSeriesData(30 * 24, 200, 80, 0.1).filter((_, i) => i % 24 === 0);

  // Radar chart data for the selected initiative
  const radarData = initiative.valueMetrics.filter(m => m.actual !== null).map(m => ({
    metric: m.name.length > 15 ? m.name.substring(0, 15) + '...' : m.name,
    target: 100,
    actual: Math.min((m.actual! / m.hypothesis) * 100, 150),
  }));

  // Portfolio value view
  const portfolioData = deployedInits.map(init => {
    const avgAchievement = init.valueMetrics.filter(m => m.actual !== null).length > 0
      ? init.valueMetrics.filter(m => m.actual !== null).reduce((sum, m) => sum + (m.actual! / m.hypothesis) * 100, 0) / init.valueMetrics.filter(m => m.actual !== null).length
      : 0;
    return { name: init.name.length > 20 ? init.name.substring(0, 20) + '...' : init.name, achievement: avgAchievement };
  });

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-100">Value Tracking</h1>
          <p className="text-sm text-surface-400 mt-1">Measure initiative hypotheses against real-world usage and business impact</p>
        </div>
        <select
          value={selectedInit}
          onChange={e => setSelectedInit(e.target.value)}
          className="px-3 py-2 rounded-lg bg-surface-800 border border-surface-700 text-sm text-surface-200 outline-none focus:border-brand-500"
        >
          {initiatives.map(i => (
            <option key={i.id} value={i.id}>{i.name}</option>
          ))}
        </select>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard label="Portfolio Initiatives" value={deployedInits.length} subtitle={`${initiatives.length} total`} icon={<BarChart3 size={18} />} accentColor="blue" />
        <MetricCard label="Metrics On Track" value={`${metricsOnTrack}/${metricsTotal}`} subtitle="Within 70% of target" icon={<Target size={18} />} accentColor="emerald" />
        <MetricCard label="Avg Confidence" value={`${avgConfidence}%`} icon={<CheckCircle size={18} />} accentColor="purple" />
        <MetricCard label="Est. Cost Savings" value="$142K" subtitle="Monthly across portfolio" icon={<DollarSign size={18} />} accentColor="cyan" trend="up" trendValue="+18%" />
      </div>

      {/* Selected Initiative Value */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <GlassCard>
            <GlassCardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-surface-200">{initiative.name} — Value Hypothesis</h3>
                  <p className="text-xs text-surface-400 mt-0.5 italic">"{initiative.hypothesis}"</p>
                </div>
                <div className="flex items-center gap-2">
                  <RiskBadge risk={initiative.riskTier} size="xs" />
                  <StatusBadge status={initiative.status} size="xs" />
                </div>
              </div>
            </GlassCardHeader>
            <GlassCardContent>
              <div className="space-y-5">
                {initiative.valueMetrics.map(metric => {
                  const achievement = metric.actual !== null ? (metric.actual / metric.hypothesis) * 100 : 0;
                  const isOnTrack = metric.actual !== null && metric.actual >= metric.hypothesis * 0.7;

                  return (
                    <div key={metric.id} className="p-4 rounded-lg bg-surface-800/20 border border-surface-700/20">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-surface-200">{metric.name}</span>
                          {metric.actual !== null && (
                            <span className={clsx(
                              'flex items-center gap-1 text-[10px]',
                              metric.trend === 'up' ? 'text-emerald-400' :
                              metric.trend === 'down' ? 'text-red-400' : 'text-surface-400',
                            )}>
                              {metric.trend === 'up' ? <TrendingUp size={10} /> :
                               metric.trend === 'down' ? <TrendingDown size={10} /> :
                               <Minus size={10} />}
                              {metric.trend}
                            </span>
                          )}
                        </div>
                        {metric.actual !== null ? (
                          isOnTrack ? (
                            <CheckCircle size={14} className="text-emerald-400" />
                          ) : (
                            <AlertTriangle size={14} className="text-amber-400" />
                          )
                        ) : (
                          <span className="text-[10px] text-surface-500">No data yet</span>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-[10px] text-surface-500">Target</p>
                          <p className="text-lg font-semibold text-surface-300">{metric.hypothesis}<span className="text-xs text-surface-500 ml-1">{metric.unit}</span></p>
                        </div>
                        <div>
                          <p className="text-[10px] text-surface-500">Actual</p>
                          <p className={clsx(
                            'text-lg font-semibold',
                            metric.actual === null ? 'text-surface-600' :
                            isOnTrack ? 'text-emerald-400' : 'text-amber-400',
                          )}>{metric.actual !== null ? metric.actual : '—'}<span className="text-xs text-surface-500 ml-1">{metric.unit}</span></p>
                        </div>
                        <div>
                          <p className="text-[10px] text-surface-500">Achievement</p>
                          <p className={clsx(
                            'text-lg font-semibold',
                            metric.actual === null ? 'text-surface-600' :
                            achievement >= 100 ? 'text-emerald-400' :
                            achievement >= 70 ? 'text-blue-400' : 'text-amber-400',
                          )}>{metric.actual !== null ? `${achievement.toFixed(0)}%` : '—'}</p>
                        </div>
                      </div>

                      {metric.actual !== null && (
                        <>
                          <ProgressBar
                            value={metric.actual}
                            max={metric.hypothesis}
                            showValue={false}
                            color={achievement >= 100 ? 'emerald' : achievement >= 70 ? 'blue' : 'amber'}
                          />
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-[9px] text-surface-500">Confidence: {(metric.confidence * 100).toFixed(0)}%</span>
                            <span className="text-[9px] text-surface-500">{achievement.toFixed(1)}% of target</span>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </GlassCardContent>
          </GlassCard>
        </div>

        <div className="space-y-6">
          {/* Radar Chart */}
          {radarData.length > 0 && (
            <GlassCard>
              <GlassCardHeader>
                <h3 className="text-sm font-semibold text-surface-200">Achievement Radar</h3>
              </GlassCardHeader>
              <GlassCardContent className="!p-0">
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                    <PolarGrid stroke="#1e293b" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9, fill: '#94a3b8' }} />
                    <PolarRadiusAxis tick={{ fontSize: 8, fill: '#64748b' }} domain={[0, 150]} />
                    <Radar name="Target" dataKey="target" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeDasharray="4 4" />
                    <Radar name="Actual" dataKey="actual" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} />
                  </RadarChart>
                </ResponsiveContainer>
              </GlassCardContent>
            </GlassCard>
          )}

          {/* Adoption Trend */}
          <GlassCard>
            <GlassCardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-surface-200">User Adoption (30 days)</h3>
                <span className="flex items-center gap-1 text-xs text-emerald-400"><TrendingUp size={12} /> Growing</span>
              </div>
            </GlassCardHeader>
            <GlassCardContent className="!p-0 !pb-2 !px-2">
              <ResponsiveContainer width="100%" height={150}>
                <AreaChart data={adoptionData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="adoptionGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="timestamp" tick={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }} labelFormatter={() => ''} />
                  <Area type="monotone" dataKey="value" stroke="#8b5cf6" fill="url(#adoptionGrad)" strokeWidth={2} name="Daily Active Users" />
                </AreaChart>
              </ResponsiveContainer>
            </GlassCardContent>
          </GlassCard>

          {/* Quick Stats */}
          <GlassCard>
            <GlassCardHeader>
              <h3 className="text-sm font-semibold text-surface-200">Usage Snapshot</h3>
            </GlassCardHeader>
            <GlassCardContent>
              <div className="space-y-3">
                {[
                  { label: 'Daily Active Users', value: '423', trend: 'up', change: '+12%' },
                  { label: 'Avg Session Duration', value: '8.2 min', trend: 'up', change: '+1.4 min' },
                  { label: 'Interactions/User/Day', value: '14.3', trend: 'up', change: '+2.1' },
                  { label: 'User Satisfaction', value: '4.2/5', trend: 'up', change: '+0.3' },
                  { label: 'Cost per Interaction', value: '$0.08', trend: 'down', change: '-$0.02' },
                ].map(stat => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <span className="text-xs text-surface-400">{stat.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-surface-200">{stat.value}</span>
                      <span className={clsx(
                        'text-[10px]',
                        stat.trend === 'up' && stat.label !== 'Cost per Interaction' ? 'text-emerald-400' :
                        stat.trend === 'down' && stat.label === 'Cost per Interaction' ? 'text-emerald-400' :
                        'text-red-400',
                      )}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCardContent>
          </GlassCard>
        </div>
      </div>

      {/* Portfolio Achievement View */}
      {portfolioData.length > 0 && (
        <GlassCard>
          <GlassCardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-surface-200">Portfolio Value Achievement</h3>
              <span className="text-xs text-surface-500">Deployed initiatives — avg achievement vs hypothesis</span>
            </div>
          </GlassCardHeader>
          <GlassCardContent className="!p-0 !pb-4 !px-4">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={portfolioData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }} formatter={(v: number) => [`${v.toFixed(0)}%`, 'Achievement']} />
                <ReferenceLine y={100} stroke="#22c55e" strokeDasharray="4 4" label={{ value: 'Target', fill: '#22c55e', fontSize: 10, position: 'right' }} />
                <Bar dataKey="achievement" radius={[6, 6, 0, 0]}>
                  {portfolioData.map((entry, i) => (
                    <Cell key={i} fill={entry.achievement >= 100 ? '#22c55e' : entry.achievement >= 70 ? '#3b82f6' : '#eab308'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </GlassCardContent>
        </GlassCard>
      )}
    </div>
  );
}
