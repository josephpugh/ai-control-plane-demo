import { useParams } from 'react-router-dom';
import {
  Shield, ChevronRight, AlertTriangle, CheckCircle,
  GitBranch, Cpu, Brain, Users, Clock, MapPin,
  Sparkles, ArrowUpRight,
} from 'lucide-react';
import { clsx } from 'clsx';
import { GlassCard, GlassCardHeader, GlassCardContent } from '../components/common/GlassCard';
import { StatusBadge, RiskBadge } from '../components/common/StatusBadge';
import { ProgressBar } from '../components/common/ProgressBar';
import { initiatives, mcpServers, signals, taggedReleases } from '../data/mockData';
import { useState } from 'react';

const statusSteps: { key: string; label: string }[] = [
  { key: 'intake', label: 'Intake' },
  { key: 'building', label: 'Building' },
  { key: 'testing', label: 'Testing' },
  { key: 'gating', label: 'Gating' },
  { key: 'deployed', label: 'Deployed' },
  { key: 'monitoring', label: 'Monitoring' },
];

export function InitiativeDetail() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'classification' | 'controls' | 'signals'>('overview');
  const initiative = initiatives.find(i => i.id === id) || initiatives[0];
  const connectedServers = mcpServers.filter(m => initiative.connectedMcpServers.includes(m.id));
  const initSignals = signals.filter(s => s.initiativeId === initiative.id);
  const initReleases = taggedReleases.filter(r => r.initiativeId === initiative.id);
  const currentStepIdx = statusSteps.findIndex(s => s.key === initiative.status);

  const tabs = [
    { key: 'overview' as const, label: 'Overview' },
    { key: 'classification' as const, label: 'Classification' },
    { key: 'controls' as const, label: 'Controls & Gates' },
    { key: 'signals' as const, label: 'Signals' },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className={clsx(
            'w-14 h-14 rounded-xl flex items-center justify-center',
            initiative.riskTier === 'critical' ? 'bg-red-500/10' :
            initiative.riskTier === 'high' ? 'bg-orange-500/10' :
            initiative.riskTier === 'medium' ? 'bg-yellow-500/10' : 'bg-emerald-500/10',
          )}>
            <Shield size={24} className={
              initiative.riskTier === 'critical' ? 'text-red-400' :
              initiative.riskTier === 'high' ? 'text-orange-400' :
              initiative.riskTier === 'medium' ? 'text-yellow-400' : 'text-emerald-400'
            } />
          </div>
          <div>
            <h1 className="text-xl font-bold text-surface-100">{initiative.name}</h1>
            <p className="text-sm text-surface-400 mt-1 max-w-2xl">{initiative.description}</p>
            <div className="flex items-center gap-4 mt-3">
              <RiskBadge risk={initiative.riskTier} size="md" />
              <StatusBadge status={initiative.status} size="md" />
              <span className="text-xs text-surface-500 flex items-center gap-1"><Users size={12} />{initiative.owner}</span>
              <span className="text-xs text-surface-500 flex items-center gap-1"><MapPin size={12} />{initiative.environment}</span>
              <span className="text-xs text-surface-500 flex items-center gap-1"><Clock size={12} />Updated {new Date(initiative.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-500 transition-colors">
          <Sparkles size={14} />
          Ask AI
        </button>
      </div>

      <GlassCard>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {statusSteps.map((step, i) => (
              <div key={step.key} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={clsx(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-all',
                    i < currentStepIdx ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' :
                    i === currentStepIdx ? 'bg-brand-500/20 border-brand-500 text-brand-400 ring-4 ring-brand-500/10' :
                    'bg-surface-800 border-surface-600 text-surface-500',
                  )}>
                    {i < currentStepIdx ? <CheckCircle size={14} /> : i + 1}
                  </div>
                  <span className={clsx(
                    'text-[10px] mt-1.5 font-medium',
                    i <= currentStepIdx ? 'text-surface-300' : 'text-surface-600',
                  )}>{step.label}</span>
                </div>
                {i < statusSteps.length - 1 && (
                  <div className={clsx(
                    'flex-1 h-0.5 mx-2 mt-[-16px]',
                    i < currentStepIdx ? 'bg-emerald-500/40' : 'bg-surface-700',
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      <div className="flex gap-2 border-b border-surface-800">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={clsx(
              'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors',
              activeTab === tab.key
                ? 'text-brand-400 border-brand-500'
                : 'text-surface-400 border-transparent hover:text-surface-200',
            )}
          >
            {tab.label}
            {tab.key === 'signals' && initSignals.filter(s => !s.resolved).length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-[10px] rounded-full bg-red-500/15 text-red-400">{initSignals.filter(s => !s.resolved).length}</span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <GlassCard>
              <GlassCardHeader>
                <h3 className="text-sm font-semibold text-surface-200">Value Hypothesis</h3>
              </GlassCardHeader>
              <GlassCardContent>
                <p className="text-sm text-surface-300 italic mb-4">"{initiative.hypothesis}"</p>
                <div className="space-y-4">
                  {initiative.valueMetrics.map(vm => (
                    <div key={vm.id} className="flex items-center gap-4">
                      <div className="w-36 shrink-0">
                        <p className="text-xs font-medium text-surface-300">{vm.name}</p>
                      </div>
                      <div className="flex-1">
                        <ProgressBar
                          value={vm.actual ?? 0}
                          max={vm.hypothesis}
                          label={`Target: ${vm.hypothesis}${vm.unit}`}
                          color={vm.actual !== null ? (vm.actual >= vm.hypothesis * 0.8 ? 'emerald' : vm.actual >= vm.hypothesis * 0.5 ? 'amber' : 'red') : 'blue'}
                        />
                      </div>
                      <div className="w-20 text-right">
                        <span className="text-sm font-medium text-surface-200">
                          {vm.actual !== null ? `${vm.actual}${vm.unit}` : '—'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCardContent>
            </GlassCard>

            <GlassCard>
              <GlassCardHeader>
                <h3 className="text-sm font-semibold text-surface-200">Connected Resources</h3>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] text-surface-500 uppercase tracking-wider font-medium mb-2">MCP Servers</p>
                    <div className="space-y-2">
                      {connectedServers.map(server => (
                        <div key={server.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-800/30 border border-surface-700/30">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                              <Cpu size={14} className="text-purple-400" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-surface-200">{server.name}</p>
                              <p className="text-[10px] text-surface-500">{server.tools.length} tools &middot; {server.requestsPerDay.toLocaleString()} req/day</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={server.status} size="xs" />
                            <ArrowUpRight size={14} className="text-surface-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-surface-500 uppercase tracking-wider font-medium mb-2">Models</p>
                    <div className="flex gap-2">
                      {initiative.connectedModels.map(model => (
                        <span key={model} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-400">
                          <Brain size={12} />{model}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-surface-500 uppercase tracking-wider font-medium mb-2">Agent Identity</p>
                    <span className="px-3 py-1.5 rounded-lg bg-surface-800/50 border border-surface-700/30 text-xs font-mono text-surface-300">
                      {initiative.agentIdentity}
                    </span>
                  </div>
                </div>
              </GlassCardContent>
            </GlassCard>
          </div>

          <div className="space-y-6">
            <GlassCard>
              <GlassCardHeader>
                <h3 className="text-sm font-semibold text-surface-200">Latest Release</h3>
              </GlassCardHeader>
              <GlassCardContent>
                {initReleases.length > 0 ? (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-mono font-semibold text-surface-100">{initReleases[0].version}</span>
                      <StatusBadge status={initReleases[0].overallStatus} />
                    </div>
                    <div className="space-y-2 mb-3">
                      <p className="text-[10px] text-surface-500">Artifact: <span className="font-mono text-surface-400">{initReleases[0].artifactHash}</span></p>
                      <p className="text-[10px] text-surface-500">Created: {new Date(initReleases[0].createdAt).toLocaleString()}</p>
                    </div>
                    <div className="space-y-1.5">
                      {initReleases[0].gates.slice(0, 5).map(g => (
                        <div key={g.id} className="flex items-center gap-2 text-xs">
                          {g.status === 'passed' ? <CheckCircle size={12} className="text-emerald-400" /> :
                           g.status === 'failed' ? <AlertTriangle size={12} className="text-red-400" /> :
                           <Clock size={12} className="text-yellow-400" />}
                          <span className="text-surface-300">{g.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-surface-500">No releases yet</p>
                )}
              </GlassCardContent>
            </GlassCard>

            <GlassCard>
              <GlassCardHeader>
                <h3 className="text-sm font-semibold text-surface-200">Approval Pathway</h3>
              </GlassCardHeader>
              <GlassCardContent>
                <div className={clsx(
                  'p-4 rounded-lg border text-center',
                  initiative.approvalPathway === 'exception-only' ? 'bg-red-500/5 border-red-500/20' :
                  initiative.approvalPathway === 'enhanced-controls' ? 'bg-orange-500/5 border-orange-500/20' :
                  initiative.approvalPathway === 'proportionate-controls' ? 'bg-yellow-500/5 border-yellow-500/20' :
                  'bg-emerald-500/5 border-emerald-500/20',
                )}>
                  <p className={clsx(
                    'text-sm font-semibold capitalize',
                    initiative.approvalPathway === 'exception-only' ? 'text-red-400' :
                    initiative.approvalPathway === 'enhanced-controls' ? 'text-orange-400' :
                    initiative.approvalPathway === 'proportionate-controls' ? 'text-yellow-400' :
                    'text-emerald-400',
                  )}>
                    {initiative.approvalPathway.replace(/-/g, ' ')}
                  </p>
                  <p className="text-[10px] text-surface-500 mt-1">
                    Based on highest risk dimension
                  </p>
                </div>
              </GlassCardContent>
            </GlassCard>

            <GlassCard>
              <GlassCardHeader>
                <h3 className="text-sm font-semibold text-surface-200">Quick Actions</h3>
              </GlassCardHeader>
              <GlassCardContent className="space-y-2">
                {[
                  { label: 'Run Impact Analysis', icon: <Sparkles size={14} /> },
                  { label: 'Request Recertification', icon: <GitBranch size={14} /> },
                  { label: 'View Evidence Pack', icon: <CheckCircle size={14} /> },
                  { label: 'Edit Classification', icon: <Shield size={14} /> },
                ].map(action => (
                  <button key={action.label} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-surface-300 hover:text-surface-100 bg-surface-800/30 hover:bg-surface-800/60 border border-surface-700/30 transition-colors">
                    {action.icon}
                    {action.label}
                    <ChevronRight size={12} className="ml-auto text-surface-500" />
                  </button>
                ))}
              </GlassCardContent>
            </GlassCard>
          </div>
        </div>
      )}

      {activeTab === 'classification' && (
        <GlassCard>
          <GlassCardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-surface-200">Classification Dimensions (IA–IM)</h3>
              <span className="text-xs text-surface-500">13 dimensions evaluated</span>
            </div>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="grid grid-cols-1 gap-3">
              {initiative.classification.map(dim => (
                <div key={dim.id} className="flex items-center gap-4 p-3 rounded-lg bg-surface-800/20 hover:bg-surface-800/40 transition-colors">
                  <div className="w-10 text-center">
                    <span className="text-xs font-mono font-bold text-brand-400">{dim.id}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-surface-200">{dim.name}</span>
                      <RiskBadge risk={dim.riskContribution} size="xs" />
                    </div>
                    <p className="text-[10px] text-surface-400">{dim.description}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-surface-800 rounded-full overflow-hidden">
                        <div
                          className={clsx(
                            'h-full rounded-full transition-all',
                            dim.riskContribution === 'critical' ? 'bg-red-500' :
                            dim.riskContribution === 'high' ? 'bg-orange-500' :
                            dim.riskContribution === 'medium' ? 'bg-yellow-500' : 'bg-emerald-500',
                          )}
                          style={{ width: `${(dim.level / dim.maxLevel) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-surface-400">{dim.measure} / {dim.id}{dim.maxLevel}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCardContent>
        </GlassCard>
      )}

      {activeTab === 'controls' && (
        <div className="space-y-6">
          {initReleases.map(release => (
            <GlassCard key={release.id}>
              <GlassCardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono font-semibold text-surface-200">{release.version}</span>
                    <StatusBadge status={release.overallStatus} />
                  </div>
                  <span className="text-xs text-surface-500">{release.environment}</span>
                </div>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="grid grid-cols-2 gap-3">
                  {release.gates.map(gate => (
                    <div key={gate.id} className={clsx(
                      'p-4 rounded-lg border',
                      gate.status === 'passed' ? 'bg-emerald-500/5 border-emerald-500/20' :
                      gate.status === 'failed' ? 'bg-red-500/5 border-red-500/20' :
                      gate.status === 'pending' ? 'bg-yellow-500/5 border-yellow-500/20' :
                      'bg-surface-800/30 border-surface-700/30',
                    )}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-surface-200">{gate.name}</span>
                        <StatusBadge status={gate.status} size="xs" />
                      </div>
                      <p className="text-[10px] text-surface-400">{gate.details}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <StatusBadge status={gate.category} size="xs" />
                        {gate.required && <span className="text-[9px] px-1.5 py-0.5 rounded bg-surface-700 text-surface-400">Required</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCardContent>
            </GlassCard>
          ))}
        </div>
      )}

      {activeTab === 'signals' && (
        <GlassCard>
          <GlassCardHeader>
            <h3 className="text-sm font-semibold text-surface-200">Signal History</h3>
          </GlassCardHeader>
          <div className="divide-y divide-surface-800/30">
            {initSignals.length > 0 ? initSignals.map(sig => (
              <div key={sig.id} className="px-5 py-4 hover:bg-surface-800/20 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className={clsx(
                      'w-2 h-2 rounded-full mt-1.5',
                      sig.severity === 'critical' ? 'bg-red-400' :
                      sig.severity === 'high' ? 'bg-orange-400' :
                      sig.severity === 'medium' ? 'bg-yellow-400' : 'bg-emerald-400',
                    )} />
                    <div>
                      <p className="text-sm font-medium text-surface-200">{sig.type}</p>
                      <p className="text-xs text-surface-400 mt-0.5">{sig.description}</p>
                      <p className="text-[10px] text-surface-500 mt-1">{sig.source} &middot; {new Date(sig.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                  <StatusBadge status={sig.resolved ? 'passed' : 'pending'} size="xs" />
                </div>
              </div>
            )) : (
              <div className="px-5 py-8 text-center text-xs text-surface-500">No signals recorded</div>
            )}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
