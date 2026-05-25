import { useState } from 'react';
import {
  Activity, AlertTriangle, CheckCircle, TrendingUp, TrendingDown,
  Minus, Clock, Zap, Eye, BarChart3, Server,
} from 'lucide-react';
import { clsx } from 'clsx';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, ReferenceLine, CartesianGrid,
} from 'recharts';
import { GlassCard, GlassCardHeader, GlassCardContent } from '../components/common/GlassCard';
import { StatusBadge, RiskBadge } from '../components/common/StatusBadge';
import { MetricCard } from '../components/common/MetricCard';
import { initiatives, runtimeEvals, generateTimeSeriesData, mcpServers } from '../data/mockData';

const environments = ['production', 'staging', 'development'] as const;

export function Runtime() {
  const [selectedEnv, setSelectedEnv] = useState<typeof environments[number]>('production');
  const [selectedInit, setSelectedInit] = useState(initiatives[0].id);

  const initiative = initiatives.find(i => i.id === selectedInit)!;
  const envInitiatives = initiatives.filter(i => i.environment === selectedEnv);

  // Generate mock time series for runtime metrics
  const requestData = generateTimeSeriesData(48, 350, 120, 1.5);
  const latencyData = generateTimeSeriesData(48, 180, 60, -0.2);
  const errorData = generateTimeSeriesData(48, 2, 3, 0);
  const tokenData = generateTimeSeriesData(48, 12000, 4000, 50);

  const groundednessHistory = generateTimeSeriesData(48, 0.93, 0.04, 0.0005).map(d => ({
    ...d, threshold: 0.90,
  }));

  const safetyHistory = generateTimeSeriesData(48, 0.985, 0.01, 0.0002).map(d => ({
    ...d, threshold: 0.98,
  }));

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-100">Runtime Observatory</h1>
          <p className="text-sm text-surface-400 mt-1">Live monitoring, runtime evaluations, and declared-vs-observed reconciliation</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-surface-800 rounded-lg border border-surface-700 p-0.5">
            {environments.map(env => (
              <button
                key={env}
                onClick={() => setSelectedEnv(env)}
                className={clsx(
                  'px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize',
                  selectedEnv === env
                    ? 'bg-brand-600 text-white'
                    : 'text-surface-400 hover:text-surface-200',
                )}
              >
                {env}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Environment Overview */}
      <div className="grid grid-cols-5 gap-4">
        <MetricCard label="Active Initiatives" value={envInitiatives.length} icon={<Activity size={18} />} accentColor="blue" />
        <MetricCard label="Requests (24h)" value="42.3K" trend="up" trendValue="+12%" icon={<Zap size={18} />} accentColor="cyan" />
        <MetricCard label="Avg Latency" value="182ms" trend="down" trendValue="-8ms" icon={<Clock size={18} />} accentColor="emerald" />
        <MetricCard label="Error Rate" value="0.12%" trend="down" trendValue="-0.03%" icon={<AlertTriangle size={18} />} accentColor="amber" />
        <MetricCard label="Token Usage" value="1.2M" subtitle="$96.40 estimated cost" trend="up" trendValue="+5%" icon={<BarChart3 size={18} />} accentColor="purple" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Request Volume */}
        <GlassCard>
          <GlassCardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-surface-200">Request Volume (48h)</h3>
              <span className="text-xs text-surface-500">Advisor Knowledge Assistant</span>
            </div>
          </GlassCardHeader>
          <GlassCardContent className="!p-0 !pb-2 !px-2">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={requestData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="reqGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timestamp" tick={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }} labelFormatter={() => ''} />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="url(#reqGradient)" strokeWidth={2} name="Requests" />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCardContent>
        </GlassCard>

        {/* Latency */}
        <GlassCard>
          <GlassCardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-surface-200">Response Latency P95 (48h)</h3>
              <span className="text-xs text-emerald-400">Below threshold</span>
            </div>
          </GlassCardHeader>
          <GlassCardContent className="!p-0 !pb-2 !px-2">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={latencyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="latGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timestamp" tick={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }} labelFormatter={() => ''} formatter={(v: number) => [`${Math.round(v)}ms`, 'Latency']} />
                <ReferenceLine y={300} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'SLA', fill: '#ef4444', fontSize: 10, position: 'right' }} />
                <Area type="monotone" dataKey="value" stroke="#06b6d4" fill="url(#latGradient)" strokeWidth={2} name="Latency" />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCardContent>
        </GlassCard>
      </div>

      {/* Runtime Evaluations */}
      <GlassCard>
        <GlassCardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye size={16} className="text-brand-400" />
              <h3 className="text-sm font-semibold text-surface-200">Runtime Evaluations</h3>
            </div>
            <span className="text-xs text-surface-500">Continuous sampling &middot; 12,400 samples evaluated</span>
          </div>
        </GlassCardHeader>
        <GlassCardContent>
          <div className="grid grid-cols-4 gap-4">
            {runtimeEvals.map(eval_ => {
              const isAboveThreshold = eval_.name === 'Harmful Content Rate' || eval_.name === 'Latency P95'
                ? eval_.score <= eval_.threshold
                : eval_.score >= eval_.threshold;
              return (
                <div key={eval_.id} className={clsx(
                  'p-4 rounded-xl border transition-all',
                  isAboveThreshold
                    ? 'bg-emerald-500/5 border-emerald-500/20'
                    : 'bg-red-500/5 border-red-500/20',
                )}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-surface-300">{eval_.name}</span>
                    <span className={clsx(
                      'flex items-center gap-0.5 text-[10px]',
                      eval_.trend === 'improving' ? 'text-emerald-400' :
                      eval_.trend === 'degrading' ? 'text-red-400' : 'text-surface-400',
                    )}>
                      {eval_.trend === 'improving' ? <TrendingUp size={10} /> :
                       eval_.trend === 'degrading' ? <TrendingDown size={10} /> :
                       <Minus size={10} />}
                      {eval_.trend}
                    </span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className={clsx(
                      'text-2xl font-bold',
                      isAboveThreshold ? 'text-emerald-400' : 'text-red-400',
                    )}>
                      {eval_.name === 'Latency P95' ? `${eval_.score}s` :
                       eval_.score < 1 ? (eval_.score * 100).toFixed(1) + '%' : eval_.score}
                    </span>
                    <span className="text-[10px] text-surface-500 mb-1">
                      threshold: {eval_.name === 'Latency P95' ? `${eval_.threshold}s` :
                       eval_.threshold < 1 ? (eval_.threshold * 100).toFixed(1) + '%' : eval_.threshold}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1">
                    {isAboveThreshold ? (
                      <CheckCircle size={10} className="text-emerald-400" />
                    ) : (
                      <AlertTriangle size={10} className="text-red-400" />
                    )}
                    <span className={clsx('text-[9px]', isAboveThreshold ? 'text-emerald-400' : 'text-red-400')}>
                      {isAboveThreshold ? 'Meeting expectations' : 'Below threshold'}
                    </span>
                  </div>
                  <p className="text-[9px] text-surface-500 mt-1">{eval_.category} &middot; {eval_.samples.toLocaleString()} samples</p>
                </div>
              );
            })}
          </div>
        </GlassCardContent>
      </GlassCard>

      <div className="grid grid-cols-2 gap-6">
        {/* Groundedness Trend */}
        <GlassCard>
          <GlassCardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-surface-200">Groundedness Score (48h)</h3>
              <StatusBadge status="passed" size="xs" />
            </div>
          </GlassCardHeader>
          <GlassCardContent className="!p-0 !pb-2 !px-2">
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={groundednessHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timestamp" tick={false} axisLine={false} />
                <YAxis domain={[0.80, 1.0]} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }} labelFormatter={() => ''} formatter={(v: number) => [`${(v * 100).toFixed(1)}%`, '']} />
                <ReferenceLine y={0.90} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Min', fill: '#ef4444', fontSize: 9, position: 'right' }} />
                <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} dot={false} name="Groundedness" />
              </LineChart>
            </ResponsiveContainer>
          </GlassCardContent>
        </GlassCard>

        {/* Safety Score Trend */}
        <GlassCard>
          <GlassCardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-surface-200">Safety Score (48h)</h3>
              <StatusBadge status="passed" size="xs" />
            </div>
          </GlassCardHeader>
          <GlassCardContent className="!p-0 !pb-2 !px-2">
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={safetyHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timestamp" tick={false} axisLine={false} />
                <YAxis domain={[0.95, 1.0]} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }} labelFormatter={() => ''} formatter={(v: number) => [`${(v * 100).toFixed(1)}%`, '']} />
                <ReferenceLine y={0.98} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Min', fill: '#ef4444', fontSize: 9, position: 'right' }} />
                <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Safety" />
              </LineChart>
            </ResponsiveContainer>
          </GlassCardContent>
        </GlassCard>
      </div>

      {/* Declared vs Observed */}
      <GlassCard>
        <GlassCardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-400" />
              <h3 className="text-sm font-semibold text-surface-200">Declared vs. Observed Reconciliation</h3>
            </div>
            <span className="text-xs text-surface-500">Last reconciliation: 2 minutes ago</span>
          </div>
        </GlassCardHeader>
        <GlassCardContent>
          <div className="space-y-3">
            {[
              { declared: 'MCP Servers: Knowledge-Base, Portfolio-Analytics, Compliance-Rules', observed: 'Knowledge-Base, Portfolio-Analytics, Compliance-Rules + Market-Data-MCP (undeclared)', match: false, detail: 'AD group change detected — svc-advisor-assistant-prod was added to SG-AI-MarketData' },
              { declared: 'Model: claude-sonnet-4-6', observed: 'claude-sonnet-4-6', match: true, detail: 'Model matches declared configuration' },
              { declared: 'Data Reach: IC2 (Bounded approved sources)', observed: 'IC2 behaviour confirmed (no external calls detected)', match: true, detail: 'Telemetry confirms bounded source access pattern' },
              { declared: 'Action Authority: IE1 (No system action)', observed: 'IE1 confirmed (read-only tool usage)', match: true, detail: 'No write operations detected in tool call telemetry' },
              { declared: 'Audience: IK2 (Firmwide internal)', observed: 'IK2 confirmed (internal traffic only)', match: true, detail: 'All requests originate from internal network' },
            ].map((item, i) => (
              <div key={i} className={clsx(
                'p-4 rounded-lg border',
                item.match ? 'bg-emerald-500/5 border-emerald-500/15' : 'bg-red-500/5 border-red-500/20',
              )}>
                <div className="flex items-start gap-3">
                  {item.match ? (
                    <CheckCircle size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                  ) : (
                    <AlertTriangle size={14} className="text-red-400 mt-0.5 shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="grid grid-cols-2 gap-4 mb-1">
                      <div>
                        <span className="text-[9px] text-surface-500 uppercase tracking-wider block mb-0.5">Declared</span>
                        <span className="text-xs text-surface-300">{item.declared}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-surface-500 uppercase tracking-wider block mb-0.5">Observed</span>
                        <span className={clsx('text-xs', item.match ? 'text-surface-300' : 'text-red-400')}>{item.observed}</span>
                      </div>
                    </div>
                    <p className={clsx('text-[10px] mt-1', item.match ? 'text-surface-500' : 'text-red-400/80')}>{item.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCardContent>
      </GlassCard>

      {/* Active Tool Usage */}
      <GlassCard>
        <GlassCardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-surface-200">Tool Call Activity (Production)</h3>
            <span className="text-xs text-surface-500">Last 24 hours</span>
          </div>
        </GlassCardHeader>
        <GlassCardContent>
          <div className="grid grid-cols-3 gap-3">
            {mcpServers.filter(m => initiatives[0].connectedMcpServers.includes(m.id)).flatMap(m => m.tools).sort((a, b) => b.invocations24h - a.invocations24h).slice(0, 9).map(tool => (
              <div key={tool.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-800/20 border border-surface-700/20">
                <div>
                  <p className="text-xs font-mono text-surface-200">{tool.name}</p>
                  <p className="text-[10px] text-surface-500">{tool.avgLatency}ms avg</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-surface-200">{tool.invocations24h.toLocaleString()}</p>
                  <p className="text-[9px] text-surface-500">calls</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCardContent>
      </GlassCard>
    </div>
  );
}
