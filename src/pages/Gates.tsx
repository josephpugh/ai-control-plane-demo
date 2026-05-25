import { useState } from 'react';
import {
  GitBranch, CheckCircle, XCircle, Clock, AlertTriangle,
  Shield, Lock, FileCheck, UserCheck, ChevronDown, ChevronRight,
} from 'lucide-react';
import { clsx } from 'clsx';
import { GlassCard, GlassCardHeader, GlassCardContent } from '../components/common/GlassCard';
import { StatusBadge, RiskBadge } from '../components/common/StatusBadge';
import { MetricCard } from '../components/common/MetricCard';
import { taggedReleases, initiatives } from '../data/mockData';

const gateIcons: Record<string, React.ReactNode> = {
  security: <Shield size={14} className="text-red-400" />,
  quality: <CheckCircle size={14} className="text-blue-400" />,
  compliance: <Lock size={14} className="text-purple-400" />,
  evidence: <FileCheck size={14} className="text-cyan-400" />,
  approval: <UserCheck size={14} className="text-amber-400" />,
};

export function Gates() {
  const [expandedRelease, setExpandedRelease] = useState<string | null>(taggedReleases[0].id);

  const allGates = taggedReleases.flatMap(r => r.gates);
  const passedCount = allGates.filter(g => g.status === 'passed').length;
  const failedCount = allGates.filter(g => g.status === 'failed').length;
  const pendingCount = allGates.filter(g => g.status === 'pending').length;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-100">Release Gates</h1>
          <p className="text-sm text-surface-400 mt-1">Gate enforcement status per tagged release &middot; Evidence-bound go/no-go decisions</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <MetricCard label="Total Gates" value={allGates.length} subtitle="Across all releases" icon={<GitBranch size={18} />} accentColor="blue" />
        <MetricCard label="Passed" value={passedCount} accentColor="emerald" icon={<CheckCircle size={18} />} />
        <MetricCard label="Failed" value={failedCount} accentColor="red" icon={<XCircle size={18} />} />
        <MetricCard label="Pending" value={pendingCount} accentColor="amber" icon={<Clock size={18} />} />
      </div>

      {/* Gate Enforcement Policy */}
      <GlassCard>
        <GlassCardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-surface-200">Gate Enforcement Policy</h3>
            <span className="text-xs text-surface-500">Derived from classification &amp; approval pathway</span>
          </div>
        </GlassCardHeader>
        <GlassCardContent>
          <div className="grid grid-cols-4 gap-4">
            {[
              { pathway: 'Standard', gates: ['Security Scan', 'Golden Dataset Tests', 'Evidence Pack Integrity'], color: 'emerald' },
              { pathway: 'Proportionate', gates: ['Security Scan', 'Golden Dataset Tests', 'Safety Evaluation', 'Prompt Injection Tests', 'Evidence Pack Integrity', 'Architecture Review'], color: 'yellow' },
              { pathway: 'Enhanced', gates: ['All Proportionate gates +', 'PII Detection', 'Bias Evaluation', 'Enhanced Controls Review', 'Data Governance Sign-off'], color: 'orange' },
              { pathway: 'Exception-Only', gates: ['All Enhanced gates +', 'Formal Risk Acceptance', 'Executive Sponsor Approval', 'Regulatory Review', 'External Audit Trail'], color: 'red' },
            ].map(policy => (
              <div key={policy.pathway} className={clsx(
                'p-4 rounded-xl border',
                `bg-${policy.color}-500/5 border-${policy.color}-500/20`,
              )} style={{
                backgroundColor: policy.color === 'emerald' ? 'rgba(34,197,94,0.05)' : policy.color === 'yellow' ? 'rgba(234,179,8,0.05)' : policy.color === 'orange' ? 'rgba(249,115,22,0.05)' : 'rgba(239,68,68,0.05)',
                borderColor: policy.color === 'emerald' ? 'rgba(34,197,94,0.2)' : policy.color === 'yellow' ? 'rgba(234,179,8,0.2)' : policy.color === 'orange' ? 'rgba(249,115,22,0.2)' : 'rgba(239,68,68,0.2)',
              }}>
                <h4 className={clsx('text-xs font-semibold mb-2', {
                  'text-emerald-400': policy.color === 'emerald',
                  'text-yellow-400': policy.color === 'yellow',
                  'text-orange-400': policy.color === 'orange',
                  'text-red-400': policy.color === 'red',
                })}>{policy.pathway}</h4>
                <ul className="space-y-1">
                  {policy.gates.map(g => (
                    <li key={g} className="text-[10px] text-surface-400 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-surface-500" />
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </GlassCardContent>
      </GlassCard>

      {/* Releases with Gates */}
      <div className="space-y-4">
        {taggedReleases.map(release => {
          const init = initiatives.find(i => i.id === release.initiativeId)!;
          const isExpanded = expandedRelease === release.id;
          const passedGates = release.gates.filter(g => g.status === 'passed').length;
          const totalGates = release.gates.length;

          return (
            <GlassCard key={release.id}>
              <div
                onClick={() => setExpandedRelease(isExpanded ? null : release.id)}
                className="px-5 py-4 cursor-pointer hover:bg-surface-800/20 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {isExpanded ? <ChevronDown size={16} className="text-surface-400" /> : <ChevronRight size={16} className="text-surface-400" />}
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-mono font-bold text-surface-100">{release.version}</span>
                      <StatusBadge status={release.overallStatus} />
                    </div>
                    <div>
                      <p className="text-xs text-surface-300">{init.name}</p>
                      <p className="text-[10px] text-surface-500">
                        {release.environment} &middot; {release.artifactHash} &middot; {new Date(release.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <RiskBadge risk={init.riskTier} />
                    <div className="text-right">
                      <p className="text-sm font-medium text-surface-200">{passedGates}/{totalGates}</p>
                      <p className="text-[10px] text-surface-500">gates passing</p>
                    </div>
                    {/* Mini gate status bar */}
                    <div className="flex gap-0.5">
                      {release.gates.map(g => (
                        <div key={g.id} className={clsx(
                          'w-3 h-6 rounded-sm',
                          g.status === 'passed' ? 'bg-emerald-500/40' :
                          g.status === 'failed' ? 'bg-red-500/50' :
                          g.status === 'pending' ? 'bg-yellow-500/40' :
                          'bg-surface-700',
                        )} title={`${g.name}: ${g.status}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-surface-800/50 animate-slide-up">
                  {/* Evidence Pack Info */}
                  <div className="px-5 py-3 bg-surface-800/10 flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <FileCheck size={14} className={release.evidencePack.integrity === 'verified' ? 'text-emerald-400' : 'text-yellow-400'} />
                      <span className="text-xs text-surface-300">Evidence Pack: </span>
                      <StatusBadge status={release.evidencePack.integrity} size="xs" />
                    </div>
                    <span className="text-[10px] text-surface-500">
                      {release.evidencePack.signed ? 'Signed' : 'Unsigned'} &middot;
                      Bound to {release.evidencePack.boundToRelease} &middot;
                      Created {new Date(release.evidencePack.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {/* Gate Details */}
                  <div className="grid grid-cols-2 gap-0.5 p-2">
                    {release.gates.map(gate => (
                      <div key={gate.id} className={clsx(
                        'p-4 rounded-lg m-1 border',
                        gate.status === 'passed' ? 'bg-emerald-500/5 border-emerald-500/15' :
                        gate.status === 'failed' ? 'bg-red-500/5 border-red-500/15' :
                        gate.status === 'pending' ? 'bg-yellow-500/5 border-yellow-500/15' :
                        'bg-surface-800/20 border-surface-700/20',
                      )}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {gate.status === 'passed' ? <CheckCircle size={14} className="text-emerald-400" /> :
                             gate.status === 'failed' ? <XCircle size={14} className="text-red-400" /> :
                             gate.status === 'pending' ? <Clock size={14} className="text-yellow-400" /> :
                             <AlertTriangle size={14} className="text-surface-400" />}
                            <span className="text-xs font-medium text-surface-200">{gate.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {gateIcons[gate.category]}
                            {gate.required && (
                              <span className="text-[8px] px-1.5 py-0.5 rounded bg-surface-700 text-surface-400 uppercase tracking-wider">Required</span>
                            )}
                          </div>
                        </div>
                        <p className="text-[11px] text-surface-400">{gate.details}</p>
                        <p className="text-[9px] text-surface-500 mt-2">Last checked: {new Date(gate.lastChecked).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
