import { useState } from 'react';
import {
  Search, Sparkles, ArrowRight, AlertTriangle, Shield,
  ChevronRight, Cpu, Plus, TrendingUp, Zap,
} from 'lucide-react';
import { clsx } from 'clsx';
import { GlassCard, GlassCardHeader, GlassCardContent } from '../components/common/GlassCard';
import { StatusBadge, RiskBadge } from '../components/common/StatusBadge';
import { initiatives, mcpServers } from '../data/mockData';
import type { ImpactPreview } from '../types';

const precomputedImpacts: Record<string, ImpactPreview> = {
  'mcp-010': {
    dimensionChanges: [
      { dimension: 'IC — Information Sources', from: 'IC2 (Bounded approved sources)', to: 'IC4 (External/unbounded)', fromLevel: 2, toLevel: 4 },
      { dimension: 'ID — Data Reach', from: 'ID2 (Curated internal content)', to: 'ID5 (Arbitrary vendor/web)', fromLevel: 2, toLevel: 5 },
    ],
    newControls: [
      'Connector allow-listing with domain restrictions',
      'Domain allow-lists for external data sources',
      'Strict instruction hierarchy enforcement',
      'Enhanced monitoring with data-leak detection',
      'Output filtering for licensed content',
    ],
    newGates: [
      'Formal risk-acceptance review (IC4 + ID5 triggers exception pathway)',
      'Data governance sign-off for external data reach',
      'Executive sponsor approval',
    ],
    newEvidence: [
      'Prompt injection test suite (mandatory)',
      'Reach-abuse TEVV scenarios',
      'Data exfiltration test cases',
      'External content validation tests',
    ],
    tierChange: { from: 'medium', to: 'critical' },
    pathwayChange: { from: 'proportionate-controls', to: 'exception-only' },
    recertificationRequired: true,
  },
  'mcp-004': {
    dimensionChanges: [
      { dimension: 'IE — Action Authority', from: 'IE1 (No system action)', to: 'IE2 (Read/write to claims)', fromLevel: 1, toLevel: 2 },
      { dimension: 'IB — Training Data Sensitivity', from: 'IB2 (Internal non-sensitive)', to: 'IB3 (PII and sensitive)', fromLevel: 2, toLevel: 3 },
      { dimension: 'ID — Data Reach', from: 'ID2 (Curated internal)', to: 'ID4 (Client-specific records)', fromLevel: 2, toLevel: 4 },
    ],
    newControls: [
      'PII redaction in all responses',
      'Action audit logging (all writes)',
      'Human-in-the-loop for status changes',
      'Data minimization enforcement',
    ],
    newGates: [
      'PII detection test suite',
      'Enhanced controls governance review',
      'Data classification verification',
    ],
    newEvidence: [
      'PII handling test cases',
      'Action audit validation',
      'Write operation safety tests',
    ],
    tierChange: { from: 'medium', to: 'high' },
    pathwayChange: { from: 'proportionate-controls', to: 'enhanced-controls' },
    recertificationRequired: true,
  },
  'mcp-007': {
    dimensionChanges: [],
    newControls: [],
    newGates: [],
    newEvidence: [],
    tierChange: null,
    pathwayChange: null,
    recertificationRequired: false,
  },
};

export function Impact() {
  const [selectedInit, setSelectedInit] = useState(initiatives[0].id);
  const [selectedMcp, setSelectedMcp] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ImpactPreview | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const initiative = initiatives.find(i => i.id === selectedInit)!;
  const availableServers = mcpServers.filter(m => !initiative.connectedMcpServers.includes(m.id));

  const runAnalysis = (mcpId: string) => {
    setSelectedMcp(mcpId);
    setIsAnalyzing(true);
    setAnalysisResult(null);

    setTimeout(() => {
      setAnalysisResult(precomputedImpacts[mcpId] || precomputedImpacts['mcp-007']);
      setIsAnalyzing(false);
    }, 2000);
  };

  const selectedServer = selectedMcp ? mcpServers.find(m => m.id === selectedMcp) : null;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-100">Impact Analyzer</h1>
          <p className="text-sm text-surface-400 mt-1">Preview classification, control, and gate changes before committing — "What happens if?"</p>
        </div>
      </div>

      {/* Scenario Builder */}
      <GlassCard className="gradient-border">
        <GlassCardHeader>
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-brand-400" />
            <h3 className="text-sm font-semibold text-surface-200">What-If Scenario Builder</h3>
          </div>
        </GlassCardHeader>
        <GlassCardContent>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="text-[10px] text-surface-500 uppercase tracking-wider block mb-2">Initiative</label>
              <select
                value={selectedInit}
                onChange={e => { setSelectedInit(e.target.value); setSelectedMcp(null); setAnalysisResult(null); }}
                className="w-full px-3 py-2.5 rounded-lg bg-surface-800 border border-surface-700 text-sm text-surface-200 outline-none focus:border-brand-500"
              >
                {initiatives.map(i => (
                  <option key={i.id} value={i.id}>{i.name}</option>
                ))}
              </select>
              <div className="mt-2 flex items-center gap-2">
                <RiskBadge risk={initiative.riskTier} size="xs" />
                <span className="text-[10px] text-surface-500">{initiative.approvalPathway.replace(/-/g, ' ')}</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-surface-500 uppercase tracking-wider block mb-2">Change Type</label>
              <div className="flex items-center gap-2">
                <button className="flex-1 px-3 py-2.5 rounded-lg bg-brand-500/10 border border-brand-500/30 text-xs text-brand-400 font-medium">
                  <Plus size={12} className="inline mr-1" />
                  Add MCP Server
                </button>
                <button className="flex-1 px-3 py-2.5 rounded-lg bg-surface-800 border border-surface-700 text-xs text-surface-400">
                  Change Model
                </button>
              </div>
              <button className="w-full mt-2 px-3 py-2 rounded-lg bg-surface-800 border border-surface-700 text-xs text-surface-400">
                Expand Audience
              </button>
            </div>

            <div>
              <label className="text-[10px] text-surface-500 uppercase tracking-wider block mb-2">Select MCP Server</label>
              <select
                value={selectedMcp || ''}
                onChange={e => e.target.value && runAnalysis(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-surface-800 border border-surface-700 text-sm text-surface-200 outline-none focus:border-brand-500"
              >
                <option value="">Choose a server to analyze...</option>
                {availableServers.map(s => (
                  <option key={s.id} value={s.id}>{s.name} {s.riskMetadata.externalAccess ? '(External)' : ''}</option>
                ))}
              </select>
              {selectedServer && (
                <p className="text-[10px] text-surface-400 mt-1">{selectedServer.description}</p>
              )}
            </div>
          </div>
        </GlassCardContent>
      </GlassCard>

      {/* Analysis in Progress */}
      {isAnalyzing && (
        <GlassCard>
          <GlassCardContent>
            <div className="flex flex-col items-center py-12">
              <div className="w-12 h-12 rounded-full border-2 border-brand-500 border-t-transparent animate-spin mb-4" />
              <p className="text-sm text-surface-300">Running what-if analysis...</p>
              <p className="text-xs text-surface-500 mt-1">Evaluating classification changes, control mapping, and gate requirements</p>
            </div>
          </GlassCardContent>
        </GlassCard>
      )}

      {/* Analysis Results */}
      {analysisResult && !isAnalyzing && (
        <div className="space-y-6 animate-slide-up">
          {/* Tier Change Banner */}
          {analysisResult.tierChange && (
            <div className={clsx(
              'p-6 rounded-xl border',
              analysisResult.tierChange.to === 'critical' ? 'bg-red-500/5 border-red-500/20' :
              analysisResult.tierChange.to === 'high' ? 'bg-orange-500/5 border-orange-500/20' :
              'bg-yellow-500/5 border-yellow-500/20',
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <AlertTriangle size={24} className={
                    analysisResult.tierChange.to === 'critical' ? 'text-red-400' :
                    analysisResult.tierChange.to === 'high' ? 'text-orange-400' : 'text-yellow-400'
                  } />
                  <div>
                    <h3 className="text-lg font-semibold text-surface-100">Risk Tier Escalation</h3>
                    <p className="text-sm text-surface-400">
                      Adding {selectedServer?.name} would escalate this initiative
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <RiskBadge risk={analysisResult.tierChange.from} size="md" />
                  <ArrowRight size={20} className="text-surface-500" />
                  <RiskBadge risk={analysisResult.tierChange.to} size="md" />
                </div>
              </div>
              {analysisResult.pathwayChange && (
                <div className="mt-3 pt-3 border-t border-surface-700/30 flex items-center gap-2">
                  <span className="text-xs text-surface-400">Approval Pathway:</span>
                  <span className="text-xs text-surface-300 capitalize">{analysisResult.pathwayChange.from.replace(/-/g, ' ')}</span>
                  <ArrowRight size={12} className="text-surface-500" />
                  <span className={clsx('text-xs font-medium capitalize', {
                    'text-red-400': analysisResult.pathwayChange.to === 'exception-only',
                    'text-orange-400': analysisResult.pathwayChange.to === 'enhanced-controls',
                    'text-yellow-400': analysisResult.pathwayChange.to === 'proportionate-controls',
                    'text-emerald-400': analysisResult.pathwayChange.to === 'standard',
                  })}>{analysisResult.pathwayChange.to.replace(/-/g, ' ')}</span>
                </div>
              )}
            </div>
          )}

          {analysisResult.dimensionChanges.length === 0 && !analysisResult.tierChange && (
            <GlassCard>
              <GlassCardContent>
                <div className="flex items-center gap-3 py-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <Shield size={20} className="text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-emerald-400">No Impact Detected</h3>
                    <p className="text-xs text-surface-400">Adding this server would not change your classification, tier, or required controls.</p>
                  </div>
                </div>
              </GlassCardContent>
            </GlassCard>
          )}

          <div className="grid grid-cols-2 gap-6">
            {/* Dimension Changes */}
            {analysisResult.dimensionChanges.length > 0 && (
              <GlassCard>
                <GlassCardHeader>
                  <h3 className="text-sm font-semibold text-surface-200">Classification Dimension Changes</h3>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-4">
                    {analysisResult.dimensionChanges.map((change, i) => (
                      <div key={i} className="p-3 rounded-lg bg-red-500/5 border border-red-500/15">
                        <p className="text-xs font-medium text-surface-200 mb-2">{change.dimension}</p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <p className="text-[10px] text-surface-500">Current</p>
                            <p className="text-xs text-surface-300">{change.from}</p>
                          </div>
                          <ArrowRight size={16} className="text-red-400 shrink-0" />
                          <div className="flex-1">
                            <p className="text-[10px] text-red-400">After Change</p>
                            <p className="text-xs text-red-300 font-medium">{change.to}</p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-surface-800 rounded-full overflow-hidden flex">
                            <div className="h-full bg-emerald-500" style={{ width: `${(change.fromLevel / 5) * 100}%` }} />
                          </div>
                          <ArrowRight size={10} className="text-surface-500" />
                          <div className="flex-1 h-1.5 bg-surface-800 rounded-full overflow-hidden flex">
                            <div className="h-full bg-red-500" style={{ width: `${(change.toLevel / 5) * 100}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCardContent>
              </GlassCard>
            )}

            {/* New Requirements */}
            {(analysisResult.newControls.length > 0 || analysisResult.newGates.length > 0) && (
              <GlassCard>
                <GlassCardHeader>
                  <h3 className="text-sm font-semibold text-surface-200">New Requirements</h3>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-4">
                    {analysisResult.newControls.length > 0 && (
                      <div>
                        <p className="text-[10px] text-surface-500 uppercase tracking-wider font-medium mb-2">New Controls Required</p>
                        <div className="space-y-1.5">
                          {analysisResult.newControls.map((c, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-surface-300">
                              <Shield size={11} className="text-orange-400 mt-0.5 shrink-0" />
                              {c}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {analysisResult.newGates.length > 0 && (
                      <div>
                        <p className="text-[10px] text-surface-500 uppercase tracking-wider font-medium mb-2">New Gates Required</p>
                        <div className="space-y-1.5">
                          {analysisResult.newGates.map((g, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-surface-300">
                              <Zap size={11} className="text-red-400 mt-0.5 shrink-0" />
                              {g}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {analysisResult.newEvidence.length > 0 && (
                      <div>
                        <p className="text-[10px] text-surface-500 uppercase tracking-wider font-medium mb-2">New Evidence Obligations</p>
                        <div className="space-y-1.5">
                          {analysisResult.newEvidence.map((e, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-surface-300">
                              <Search size={11} className="text-cyan-400 mt-0.5 shrink-0" />
                              {e}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {analysisResult.recertificationRequired && (
                      <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 flex items-center gap-2">
                        <AlertTriangle size={14} className="text-amber-400 shrink-0" />
                        <span className="text-xs text-amber-300">Immediate recertification required</span>
                      </div>
                    )}
                  </div>
                </GlassCardContent>
              </GlassCard>
            )}
          </div>

          {/* Recommendation */}
          {analysisResult.tierChange && (
            <GlassCard className="gradient-border">
              <GlassCardContent>
                <div className="flex items-start gap-3">
                  <Sparkles size={18} className="text-brand-400 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-surface-200 mb-2">AI Recommendation</h3>
                    <p className="text-xs text-surface-400 leading-relaxed">
                      Consider using a <strong className="text-surface-200">bounded version</strong> of {selectedServer?.name} that restricts
                      to pre-approved data providers. This would keep your classification at the current levels and avoid
                      the exception-only pathway. Alternatively, if the full external reach is required, begin the formal
                      risk-acceptance process now — typical review time is 2–3 weeks for exception-only pathway.
                    </p>
                    <div className="flex gap-3 mt-4">
                      <button className="px-4 py-2 rounded-lg bg-brand-600 text-white text-xs font-medium hover:bg-brand-500 transition-colors">
                        Explore Bounded Alternative
                      </button>
                      <button className="px-4 py-2 rounded-lg bg-surface-800 border border-surface-700 text-xs text-surface-300 hover:text-surface-100 transition-colors">
                        Begin Exception Process
                      </button>
                      <button className="px-4 py-2 rounded-lg bg-surface-800 border border-surface-700 text-xs text-surface-300 hover:text-surface-100 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCardContent>
            </GlassCard>
          )}
        </div>
      )}

      {/* Available MCP Servers Quick Reference */}
      {!analysisResult && !isAnalyzing && (
        <GlassCard>
          <GlassCardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-surface-200">Available MCP Servers</h3>
              <span className="text-xs text-surface-500">Click to run impact analysis</span>
            </div>
          </GlassCardHeader>
          <div className="grid grid-cols-2 divide-x divide-y divide-surface-800/30">
            {availableServers.map(server => (
              <div
                key={server.id}
                onClick={() => runAnalysis(server.id)}
                className="px-5 py-4 hover:bg-surface-800/20 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={clsx(
                      'w-8 h-8 rounded-lg flex items-center justify-center',
                      server.riskMetadata.externalAccess ? 'bg-red-500/10' : 'bg-purple-500/10',
                    )}>
                      <Cpu size={14} className={server.riskMetadata.externalAccess ? 'text-red-400' : 'text-purple-400'} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-surface-200">{server.name}</p>
                      <p className="text-[10px] text-surface-500">{server.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {server.riskMetadata.externalAccess && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">External</span>
                    )}
                    <ChevronRight size={14} className="text-surface-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
