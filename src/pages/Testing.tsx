import { useState } from 'react';
import {
  FlaskConical, CheckCircle, XCircle, Clock, Play,
  FileCheck, Shield, AlertTriangle, BarChart3, Download,
} from 'lucide-react';
import { clsx } from 'clsx';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { GlassCard, GlassCardHeader, GlassCardContent } from '../components/common/GlassCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { MetricCard } from '../components/common/MetricCard';
import { taggedReleases, initiatives } from '../data/mockData';

export function Testing() {
  const [selectedRelease, setSelectedRelease] = useState(taggedReleases[0].id);
  const release = taggedReleases.find(r => r.id === selectedRelease)!;
  const initiative = initiatives.find(i => i.id === release.initiativeId)!;
  const tests = release.evidencePack.tests;

  const suites = [...new Set(tests.map(t => t.suite))];
  const categories = [...new Set(tests.map(t => t.category))];

  const suiteStats = suites.map(suite => {
    const suiteTests = tests.filter(t => t.suite === suite);
    return {
      suite,
      passed: suiteTests.filter(t => t.status === 'passed').length,
      failed: suiteTests.filter(t => t.status === 'failed').length,
      total: suiteTests.length,
    };
  });

  const categoryData = categories.map(cat => {
    const catTests = tests.filter(t => t.category === cat);
    const passed = catTests.filter(t => t.status === 'passed').length;
    return { name: cat.replace(/-/g, ' '), passed, failed: catTests.length - passed, total: catTests.length, rate: (passed / catTests.length) * 100 };
  });

  const totalPassed = tests.filter(t => t.status === 'passed').length;
  const totalFailed = tests.filter(t => t.status === 'failed').length;
  const passRate = ((totalPassed / tests.length) * 100).toFixed(1);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-100">Testing & TEVV</h1>
          <p className="text-sm text-surface-400 mt-1">Test, Evaluate, Verify & Validate — evidence-based release assurance</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedRelease}
            onChange={e => setSelectedRelease(e.target.value)}
            className="px-3 py-2 rounded-lg bg-surface-800 border border-surface-700 text-sm text-surface-200 outline-none focus:border-brand-500"
          >
            {taggedReleases.map(r => {
              const init = initiatives.find(i => i.id === r.initiativeId)!;
              return (
                <option key={r.id} value={r.id}>{init.name} — {r.version}</option>
              );
            })}
          </select>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-500 transition-colors">
            <Play size={14} />
            Run Test Suite
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <MetricCard label="Pass Rate" value={`${passRate}%`} accentColor={parseFloat(passRate) >= 95 ? 'emerald' : 'red'} icon={<BarChart3 size={18} />} />
        <MetricCard label="Tests Passed" value={totalPassed} subtitle={`of ${tests.length} total`} accentColor="emerald" icon={<CheckCircle size={18} />} />
        <MetricCard label="Tests Failed" value={totalFailed} accentColor={totalFailed > 0 ? 'red' : 'emerald'} icon={<XCircle size={18} />} />
        <MetricCard
          label="Evidence Pack"
          value={release.evidencePack.integrity === 'verified' ? 'Verified' : 'Pending'}
          subtitle={release.evidencePack.signed ? 'Signed & tamper-evident' : 'Unsigned'}
          accentColor={release.evidencePack.integrity === 'verified' ? 'emerald' : 'amber'}
          icon={<FileCheck size={18} />}
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <GlassCard>
            <GlassCardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-surface-200">Test Results by Category</h3>
                <span className="text-xs text-surface-500">Bound to {release.version} ({release.artifactHash})</span>
              </div>
            </GlassCardHeader>
            <GlassCardContent className="!p-0 !pb-4 !px-2">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={categoryData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} angle={-20} textAnchor="end" />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="passed" stackId="a" fill="#22c55e" radius={[0, 0, 0, 0]} name="Passed" />
                  <Bar dataKey="failed" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} name="Failed" />
                </BarChart>
              </ResponsiveContainer>
            </GlassCardContent>
          </GlassCard>

          <GlassCard>
            <GlassCardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-surface-200">Test Suite Details</h3>
              </div>
            </GlassCardHeader>
            <div className="divide-y divide-surface-800/30">
              {suiteStats.map(suite => (
                <div key={suite.suite} className="px-5 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FlaskConical size={14} className="text-surface-500" />
                      <span className="text-xs font-medium text-surface-200">{suite.suite}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-emerald-400">{suite.passed} passed</span>
                      {suite.failed > 0 && <span className="text-[10px] text-red-400">{suite.failed} failed</span>}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {tests.filter(t => t.suite === suite.suite).map(test => (
                      <div
                        key={test.id}
                        title={`${test.name}: ${test.status}`}
                        className={clsx(
                          'h-6 flex-1 rounded-sm transition-all hover:opacity-80 cursor-pointer',
                          test.status === 'passed' ? 'bg-emerald-500/30' :
                          test.status === 'failed' ? 'bg-red-500/40' :
                          test.status === 'running' ? 'bg-blue-500/30 animate-pulse' : 'bg-surface-700',
                        )}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {totalFailed > 0 && (
            <GlassCard>
              <GlassCardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} className="text-red-400" />
                  <h3 className="text-sm font-semibold text-red-400">Failed Tests</h3>
                </div>
              </GlassCardHeader>
              <div className="divide-y divide-surface-800/30">
                {tests.filter(t => t.status === 'failed').map(test => (
                  <div key={test.id} className="px-5 py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-surface-200">{test.name}</p>
                        <p className="text-[10px] text-surface-500">{test.suite} &middot; {test.category}</p>
                        {test.details && <p className="text-[10px] text-red-400/70 mt-1">{test.details}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-surface-500">{test.duration}ms</span>
                        <XCircle size={14} className="text-red-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>

        <div className="space-y-6">
          <GlassCard>
            <GlassCardHeader>
              <h3 className="text-sm font-semibold text-surface-200">Evidence Pack</h3>
            </GlassCardHeader>
            <GlassCardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-surface-400">Status</span>
                  <StatusBadge status={release.evidencePack.integrity} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-surface-400">Signed</span>
                  <span className="text-xs text-surface-200">{release.evidencePack.signed ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-surface-400">Bound to</span>
                  <span className="text-xs font-mono text-surface-200">{release.evidencePack.boundToRelease}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-surface-400">Created</span>
                  <span className="text-xs text-surface-200">{new Date(release.evidencePack.createdAt).toLocaleString()}</span>
                </div>
                <button className="w-full flex items-center justify-center gap-2 mt-2 px-3 py-2 rounded-lg bg-surface-800/50 border border-surface-700/30 text-xs text-surface-300 hover:text-surface-100 transition-colors">
                  <Download size={12} />
                  Download Evidence Pack
                </button>
              </div>
            </GlassCardContent>
          </GlassCard>

          <GlassCard>
            <GlassCardHeader>
              <h3 className="text-sm font-semibold text-surface-200">Required by Classification</h3>
            </GlassCardHeader>
            <GlassCardContent>
              <div className="space-y-2">
                {[
                  { name: 'Golden Dataset Tests', required: true, present: true },
                  { name: 'Safety Probe Suite', required: true, present: true },
                  { name: 'Prompt Injection Tests', required: true, present: true },
                  { name: 'Bias Evaluation', required: true, present: release.initiativeId === 'init-001' },
                  { name: 'PII Detection', required: initiative.riskTier === 'high' || initiative.riskTier === 'critical', present: release.initiativeId === 'init-001' },
                  { name: 'Reach-abuse Scenarios', required: false, present: false },
                ].map(req => (
                  <div key={req.name} className="flex items-center gap-2 text-xs">
                    {req.present ? (
                      <CheckCircle size={12} className="text-emerald-400 shrink-0" />
                    ) : req.required ? (
                      <AlertTriangle size={12} className="text-red-400 shrink-0" />
                    ) : (
                      <Clock size={12} className="text-surface-500 shrink-0" />
                    )}
                    <span className={clsx(
                      req.present ? 'text-surface-300' : req.required ? 'text-red-400' : 'text-surface-500',
                    )}>{req.name}</span>
                    {req.required && <span className="text-[9px] px-1 py-0.5 rounded bg-surface-700 text-surface-400 ml-auto">Required</span>}
                  </div>
                ))}
              </div>
            </GlassCardContent>
          </GlassCard>

          <GlassCard>
            <GlassCardHeader>
              <h3 className="text-sm font-semibold text-surface-200">Golden Datasets</h3>
            </GlassCardHeader>
            <GlassCardContent>
              <div className="space-y-3">
                {[
                  { name: 'Core Query Set', size: '147 samples', updated: 'May 18, 2026', version: 'v3.2' },
                  { name: 'Edge Cases', size: '56 samples', updated: 'May 15, 2026', version: 'v2.1' },
                  { name: 'Safety Probes', size: '89 samples', updated: 'May 20, 2026', version: 'v4.0' },
                  { name: 'Adversarial Inputs', size: '34 samples', updated: 'May 22, 2026', version: 'v1.5' },
                ].map(ds => (
                  <div key={ds.name} className="flex items-center justify-between p-2 rounded-lg bg-surface-800/20">
                    <div>
                      <p className="text-xs font-medium text-surface-300">{ds.name}</p>
                      <p className="text-[10px] text-surface-500">{ds.size} &middot; {ds.updated}</p>
                    </div>
                    <span className="text-[10px] font-mono text-surface-400">{ds.version}</span>
                  </div>
                ))}
              </div>
            </GlassCardContent>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
