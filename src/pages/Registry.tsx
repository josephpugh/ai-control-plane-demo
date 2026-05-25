import { useState } from 'react';
import {
  Database, Cpu, Search, Filter, Globe, Lock,
  Activity, Clock, Server, ChevronDown, ChevronRight, Wrench,
} from 'lucide-react';
import { clsx } from 'clsx';
import { GlassCard, GlassCardHeader, GlassCardContent } from '../components/common/GlassCard';
import { StatusBadge, RiskBadge } from '../components/common/StatusBadge';
import { MetricCard } from '../components/common/MetricCard';
import { mcpServers, initiatives } from '../data/mockData';

export function Registry() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [expandedServer, setExpandedServer] = useState<string | null>(null);

  const filteredServers = mcpServers.filter(s => {
    const matchesSearch = searchQuery === '' ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tools.some(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSource = filterSource === 'all' || s.source === filterSource;
    return matchesSearch && matchesSource;
  });

  const totalTools = mcpServers.reduce((sum, s) => sum + s.tools.length, 0);
  const externalCount = mcpServers.filter(s => s.riskMetadata.externalAccess).length;
  const sources = [...new Set(mcpServers.map(s => s.source))];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-100">MCP Server & Tool Registry</h1>
          <p className="text-sm text-surface-400 mt-1">Authoritative inventory of all registered MCP servers, tools, and their governed risk metadata</p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <MetricCard label="MCP Servers" value={mcpServers.length} icon={<Cpu size={18} />} accentColor="purple" />
        <MetricCard label="Total Tools" value={totalTools} icon={<Wrench size={18} />} accentColor="blue" />
        <MetricCard label="Active" value={mcpServers.filter(s => s.status === 'active').length} icon={<Activity size={18} />} accentColor="emerald" />
        <MetricCard label="External Access" value={externalCount} icon={<Globe size={18} />} accentColor="red" />
        <MetricCard label="Sources" value={sources.length} subtitle="Mulesoft, Internal, Azure, 3rd-party" icon={<Database size={18} />} accentColor="cyan" />
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search servers, tools, or descriptions..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-800 border border-surface-700 text-sm text-surface-200 placeholder:text-surface-600 outline-none focus:border-brand-500"
          />
        </div>
        <div className="flex items-center gap-2 bg-surface-800 rounded-lg border border-surface-700 p-0.5">
          <button
            onClick={() => setFilterSource('all')}
            className={clsx(
              'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
              filterSource === 'all' ? 'bg-brand-600 text-white' : 'text-surface-400 hover:text-surface-200',
            )}
          >
            All
          </button>
          {sources.map(source => (
            <button
              key={source}
              onClick={() => setFilterSource(source)}
              className={clsx(
                'px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize',
                filterSource === source ? 'bg-brand-600 text-white' : 'text-surface-400 hover:text-surface-200',
              )}
            >
              {source === 'third-party' ? '3rd Party' : source}
            </button>
          ))}
        </div>
      </div>

      {/* Server List */}
      <div className="space-y-3">
        {filteredServers.map(server => {
          const isExpanded = expandedServer === server.id;
          const connectedInits = initiatives.filter(i => i.connectedMcpServers.includes(server.id));

          return (
            <GlassCard key={server.id}>
              <div
                onClick={() => setExpandedServer(isExpanded ? null : server.id)}
                className="px-5 py-4 cursor-pointer hover:bg-surface-800/20 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {isExpanded ? <ChevronDown size={16} className="text-surface-400" /> : <ChevronRight size={16} className="text-surface-400" />}
                    <div className={clsx(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      server.riskMetadata.externalAccess ? 'bg-red-500/10' : 'bg-purple-500/10',
                    )}>
                      {server.riskMetadata.externalAccess ? (
                        <Globe size={18} className="text-red-400" />
                      ) : (
                        <Cpu size={18} className="text-purple-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-surface-200">{server.name}</h3>
                        <StatusBadge status={server.status} size="xs" />
                      </div>
                      <p className="text-xs text-surface-400 mt-0.5">{server.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-surface-300">{server.tools.length} tools</p>
                      <p className="text-[10px] text-surface-500">{server.requestsPerDay.toLocaleString()} req/day</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={clsx(
                        'text-[9px] px-1.5 py-0.5 rounded capitalize',
                        server.source === 'mulesoft' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        server.source === 'internal' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        server.source === 'azure' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                        'bg-orange-500/10 text-orange-400 border border-orange-500/20',
                      )}>
                        {server.source}
                      </span>
                      {server.riskMetadata.externalAccess && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">External</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-surface-800/50 animate-slide-up">
                  <div className="grid grid-cols-3 gap-0 divide-x divide-surface-800/30">
                    {/* Risk Metadata */}
                    <div className="p-5">
                      <h4 className="text-[10px] text-surface-500 uppercase tracking-wider font-medium mb-3">Risk Metadata</h4>
                      <div className="space-y-3">
                        <div>
                          <span className="text-[10px] text-surface-500">Data Reach</span>
                          <p className="text-xs text-surface-300 mt-0.5">{server.riskMetadata.dataReach}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-surface-500">Action Capability</span>
                          <p className="text-xs text-surface-300 mt-0.5">{server.riskMetadata.actionCapability}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-surface-500">Classification Impact</span>
                          <div className="mt-1 space-y-1">
                            {Object.entries(server.riskMetadata.classificationImpact).map(([dim, val]) => (
                              <div key={dim} className="flex items-center justify-between px-2 py-1 rounded bg-surface-800/30">
                                <span className="text-[10px] font-mono text-brand-400">{dim}</span>
                                <span className="text-[10px] text-surface-300">{val}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] text-surface-500">Owner</span>
                          <p className="text-xs text-surface-300 mt-0.5">{server.owner}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-surface-500">Registered</span>
                          <p className="text-xs text-surface-300 mt-0.5">{new Date(server.registeredAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    {/* Tools */}
                    <div className="p-5">
                      <h4 className="text-[10px] text-surface-500 uppercase tracking-wider font-medium mb-3">Tools ({server.tools.length})</h4>
                      <div className="space-y-2">
                        {server.tools.map(tool => (
                          <div key={tool.id} className="p-3 rounded-lg bg-surface-800/20 border border-surface-700/20">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono text-surface-200">{tool.name}</span>
                              <RiskBadge risk={tool.riskLevel} size="xs" />
                            </div>
                            <p className="text-[10px] text-surface-500 mt-1">{tool.description}</p>
                            <div className="flex gap-3 mt-1.5 text-[9px] text-surface-500">
                              <span>{tool.invocations24h.toLocaleString()} calls/24h</span>
                              <span>{tool.avgLatency}ms avg</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Access & Connections */}
                    <div className="p-5">
                      <h4 className="text-[10px] text-surface-500 uppercase tracking-wider font-medium mb-3">Access & Connections</h4>
                      <div className="space-y-4">
                        <div>
                          <span className="text-[10px] text-surface-500">AD Groups</span>
                          <div className="mt-1.5 space-y-1">
                            {server.adGroups.map(g => (
                              <div key={g} className="flex items-center gap-2 px-2 py-1.5 rounded bg-surface-800/30 border border-surface-700/20">
                                <Lock size={10} className="text-emerald-400" />
                                <span className="text-[10px] font-mono text-surface-300 truncate">{g}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] text-surface-500">Connected Initiatives</span>
                          <div className="mt-1.5 space-y-1">
                            {connectedInits.length > 0 ? connectedInits.map(init => (
                              <div key={init.id} className="flex items-center justify-between px-2 py-1.5 rounded bg-surface-800/30 border border-surface-700/20">
                                <span className="text-[10px] text-surface-300">{init.name}</span>
                                <RiskBadge risk={init.riskTier} size="xs" />
                              </div>
                            )) : (
                              <p className="text-[10px] text-surface-500">No initiatives connected</p>
                            )}
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] text-surface-500">Health</span>
                          <div className="mt-1.5 space-y-1">
                            <div className="flex justify-between text-[10px]">
                              <span className="text-surface-500">Last Health Check</span>
                              <span className="text-surface-300">{new Date(server.lastHealthCheck).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-[10px]">
                              <span className="text-surface-500">P99 Latency</span>
                              <span className="text-surface-300">{server.latencyP99}ms</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
