import { useState } from 'react';
import { clsx } from 'clsx';
import {
  Network, Cpu, Brain, Shield, Users, Key, Database,
  ArrowRight, Maximize2, ZoomIn, ZoomOut, Lock,
  Globe, Server,
} from 'lucide-react';
import { GlassCard, GlassCardHeader, GlassCardContent } from '../components/common/GlassCard';
import { StatusBadge, RiskBadge } from '../components/common/StatusBadge';
import { initiatives, mcpServers } from '../data/mockData';

const NODE_COLORS: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  initiative: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', icon: 'text-blue-400' },
  mcp: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', icon: 'text-purple-400' },
  model: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', icon: 'text-cyan-400' },
  identity: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', icon: 'text-amber-400' },
  adGroup: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', icon: 'text-emerald-400' },
  datasource: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', icon: 'text-red-400' },
};

interface TopologyNode {
  id: string;
  type: keyof typeof NODE_COLORS;
  label: string;
  sublabel?: string;
  risk?: string;
  status?: string;
  x: number;
  y: number;
}

interface TopologyEdge {
  from: string;
  to: string;
  label?: string;
  animated?: boolean;
}

export function Topology() {
  const [selectedInit, setSelectedInit] = useState(initiatives[0].id);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  const initiative = initiatives.find(i => i.id === selectedInit)!;
  const connectedMcp = mcpServers.filter(m => initiative.connectedMcpServers.includes(m.id));

  // Build node positions for the selected initiative
  const nodes: TopologyNode[] = [
    // Center: the initiative
    { id: initiative.id, type: 'initiative', label: initiative.name, sublabel: initiative.team, risk: initiative.riskTier, x: 450, y: 280 },
    // Agent identity
    { id: `identity-${initiative.id}`, type: 'identity', label: initiative.agentIdentity, sublabel: 'Service Principal', x: 450, y: 100 },
    // Models
    ...initiative.connectedModels.map((m, i) => ({
      id: `model-${m}`, type: 'model' as const, label: m, sublabel: 'LLM Model', x: 150 + i * 200, y: 450,
    })),
    // MCP Servers
    ...connectedMcp.map((m, i) => {
      const angle = (i / connectedMcp.length) * Math.PI + Math.PI / 6;
      return {
        id: m.id, type: 'mcp' as const, label: m.name, sublabel: `${m.tools.length} tools`,
        risk: m.riskMetadata.externalAccess ? 'high' : 'low',
        status: m.status,
        x: 450 + Math.cos(angle) * 300,
        y: 280 + Math.sin(angle) * 180,
      };
    }),
    // AD Groups from connected MCP servers
    ...connectedMcp.flatMap((m, mi) =>
      m.adGroups.slice(0, 1).map((g, gi) => ({
        id: `ad-${m.id}-${gi}`, type: 'adGroup' as const, label: g, sublabel: 'Azure AD Group',
        x: 450 + Math.cos((mi / connectedMcp.length) * Math.PI + Math.PI / 6) * 480,
        y: 280 + Math.sin((mi / connectedMcp.length) * Math.PI + Math.PI / 6) * 280,
      }))
    ),
  ];

  const edges: TopologyEdge[] = [
    // Initiative -> identity
    { from: initiative.id, to: `identity-${initiative.id}`, label: 'owns identity', animated: true },
    // Initiative -> models
    ...initiative.connectedModels.map(m => ({
      from: initiative.id, to: `model-${m}`, label: 'uses model',
    })),
    // Initiative -> MCP servers
    ...connectedMcp.map(m => ({
      from: initiative.id, to: m.id, label: 'connects', animated: true,
    })),
    // MCP -> AD Groups
    ...connectedMcp.flatMap((m, mi) =>
      m.adGroups.slice(0, 1).map((g, gi) => ({
        from: m.id, to: `ad-${m.id}-${gi}`, label: 'gated by',
      }))
    ),
  ];

  const selectedNodeData = selectedNode ? nodes.find(n => n.id === selectedNode) : null;
  const selectedMcp = selectedNode ? mcpServers.find(m => m.id === selectedNode) : null;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-100">Integration Topology</h1>
          <p className="text-sm text-surface-400 mt-1">Visualize how your AI initiative connects to MCP servers, tools, models, and identity</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedInit}
            onChange={e => { setSelectedInit(e.target.value); setSelectedNode(null); }}
            className="px-3 py-2 rounded-lg bg-surface-800 border border-surface-700 text-sm text-surface-200 outline-none focus:border-brand-500"
          >
            {initiatives.map(i => (
              <option key={i.id} value={i.id}>{i.name}</option>
            ))}
          </select>
          <div className="flex items-center gap-1 bg-surface-800 rounded-lg border border-surface-700 p-0.5">
            <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-1.5 rounded hover:bg-surface-700 transition-colors">
              <ZoomOut size={14} className="text-surface-400" />
            </button>
            <span className="text-[10px] text-surface-400 px-2">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(1.5, z + 0.1))} className="p-1.5 rounded hover:bg-surface-700 transition-colors">
              <ZoomIn size={14} className="text-surface-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        {Object.entries(NODE_COLORS).map(([type, colors]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className={clsx('w-3 h-3 rounded-sm border', colors.bg, colors.border)} />
            <span className="text-[10px] text-surface-400 capitalize">{type === 'mcp' ? 'MCP Server' : type === 'adGroup' ? 'AD Group' : type}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Topology Canvas */}
        <div className="col-span-3">
          <GlassCard className="overflow-hidden">
            <div className="relative h-[600px] bg-[radial-gradient(circle_at_50%_50%,_rgba(59,130,246,0.03)_0%,_transparent_70%)]">
              {/* Grid dots */}
              <svg className="absolute inset-0 w-full h-full" style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}>
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="20" cy="20" r="0.5" fill="#1e293b" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Edges */}
                {edges.map((edge, i) => {
                  const fromNode = nodes.find(n => n.id === edge.from);
                  const toNode = nodes.find(n => n.id === edge.to);
                  if (!fromNode || !toNode) return null;
                  return (
                    <g key={i}>
                      <line
                        x1={fromNode.x} y1={fromNode.y}
                        x2={toNode.x} y2={toNode.y}
                        stroke={edge.animated ? '#3b82f6' : '#334155'}
                        strokeWidth={edge.animated ? 1.5 : 1}
                        strokeDasharray={edge.animated ? '6 4' : undefined}
                        opacity={0.5}
                      >
                        {edge.animated && (
                          <animate attributeName="stroke-dashoffset" from="20" to="0" dur="1.5s" repeatCount="indefinite" />
                        )}
                      </line>
                      {edge.label && (
                        <text
                          x={(fromNode.x + toNode.x) / 2}
                          y={(fromNode.y + toNode.y) / 2 - 6}
                          textAnchor="middle"
                          fill="#64748b"
                          fontSize="9"
                        >
                          {edge.label}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Nodes */}
              <div className="absolute inset-0" style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}>
                {nodes.map(node => {
                  const colors = NODE_COLORS[node.type];
                  const isSelected = selectedNode === node.id;
                  const IconComponent = node.type === 'initiative' ? Shield :
                    node.type === 'mcp' ? Cpu :
                    node.type === 'model' ? Brain :
                    node.type === 'identity' ? Key :
                    node.type === 'adGroup' ? Lock :
                    Database;

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(isSelected ? null : node.id)}
                      className={clsx(
                        'topology-node absolute cursor-pointer',
                        'flex flex-col items-center',
                      )}
                      style={{
                        left: node.x,
                        top: node.y,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <div className={clsx(
                        'rounded-xl p-3 border backdrop-blur-sm transition-all',
                        colors.bg, colors.border,
                        isSelected && 'ring-2 ring-brand-500/50 shadow-lg shadow-brand-500/10',
                      )}>
                        <IconComponent size={node.type === 'initiative' ? 24 : 18} className={colors.icon} />
                      </div>
                      <div className="mt-1.5 text-center max-w-[140px]">
                        <p className={clsx('text-[11px] font-medium truncate', colors.text)}>{node.label}</p>
                        {node.sublabel && (
                          <p className="text-[9px] text-surface-500 truncate">{node.sublabel}</p>
                        )}
                      </div>
                      {node.risk && (
                        <div className="mt-1">
                          <RiskBadge risk={node.risk} size="xs" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Details Panel */}
        <div className="space-y-4">
          {selectedMcp ? (
            <>
              <GlassCard>
                <GlassCardHeader>
                  <div className="flex items-center gap-2">
                    <Cpu size={14} className="text-purple-400" />
                    <h3 className="text-sm font-semibold text-surface-200">{selectedMcp.name}</h3>
                  </div>
                </GlassCardHeader>
                <GlassCardContent>
                  <p className="text-xs text-surface-400 mb-4">{selectedMcp.description}</p>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[10px] text-surface-500">Status</span>
                      <StatusBadge status={selectedMcp.status} size="xs" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] text-surface-500">Source</span>
                      <span className="text-xs text-surface-300 capitalize">{selectedMcp.source}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] text-surface-500">External Access</span>
                      <span className={clsx('text-xs', selectedMcp.riskMetadata.externalAccess ? 'text-red-400' : 'text-emerald-400')}>
                        {selectedMcp.riskMetadata.externalAccess ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] text-surface-500">Data Reach</span>
                      <span className="text-xs text-surface-300">{selectedMcp.riskMetadata.dataReach}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] text-surface-500">Requests/Day</span>
                      <span className="text-xs text-surface-300">{selectedMcp.requestsPerDay.toLocaleString()}</span>
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>

              <GlassCard>
                <GlassCardHeader>
                  <h3 className="text-sm font-semibold text-surface-200">Tools ({selectedMcp.tools.length})</h3>
                </GlassCardHeader>
                <div className="divide-y divide-surface-800/30">
                  {selectedMcp.tools.map(tool => (
                    <div key={tool.id} className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-surface-200">{tool.name}</span>
                        <RiskBadge risk={tool.riskLevel} size="xs" />
                      </div>
                      <p className="text-[10px] text-surface-500 mt-0.5">{tool.description}</p>
                      <div className="flex gap-3 mt-1">
                        <span className="text-[9px] text-surface-500">{tool.invocations24h.toLocaleString()} calls/24h</span>
                        <span className="text-[9px] text-surface-500">{tool.avgLatency}ms avg</span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard>
                <GlassCardHeader>
                  <h3 className="text-sm font-semibold text-surface-200">AD Group Access</h3>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-2">
                    {selectedMcp.adGroups.map(g => (
                      <div key={g} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-800/30 border border-surface-700/20">
                        <Lock size={12} className="text-emerald-400 shrink-0" />
                        <span className="text-xs font-mono text-surface-300 truncate">{g}</span>
                      </div>
                    ))}
                  </div>
                </GlassCardContent>
              </GlassCard>

              <GlassCard>
                <GlassCardHeader>
                  <h3 className="text-sm font-semibold text-surface-200">Classification Impact</h3>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-2">
                    {Object.entries(selectedMcp.riskMetadata.classificationImpact).map(([dim, val]) => (
                      <div key={dim} className="flex items-center justify-between px-3 py-1.5 rounded bg-surface-800/20">
                        <span className="text-xs font-mono text-brand-400">{dim}</span>
                        <span className="text-xs text-surface-300">{val}</span>
                      </div>
                    ))}
                  </div>
                </GlassCardContent>
              </GlassCard>
            </>
          ) : selectedNodeData ? (
            <GlassCard>
              <GlassCardHeader>
                <h3 className="text-sm font-semibold text-surface-200">{selectedNodeData.label}</h3>
              </GlassCardHeader>
              <GlassCardContent>
                <p className="text-xs text-surface-400">
                  {selectedNodeData.type === 'initiative' ? initiative.description :
                   selectedNodeData.type === 'model' ? `LLM model used by ${initiative.name}` :
                   selectedNodeData.type === 'identity' ? `Service principal identity for this initiative` :
                   selectedNodeData.type === 'adGroup' ? `Azure AD security group controlling access` :
                   `Data source connected to the initiative`}
                </p>
                {selectedNodeData.risk && (
                  <div className="mt-3">
                    <span className="text-[10px] text-surface-500 block mb-1">Risk Level</span>
                    <RiskBadge risk={selectedNodeData.risk} />
                  </div>
                )}
              </GlassCardContent>
            </GlassCard>
          ) : (
            <GlassCard>
              <GlassCardContent>
                <div className="text-center py-8">
                  <Network size={32} className="text-surface-600 mx-auto mb-3" />
                  <p className="text-xs text-surface-500">Click a node to view details</p>
                  <p className="text-[10px] text-surface-600 mt-1">
                    Connections show how your initiative integrates with MCP servers, models, and identity
                  </p>
                </div>
              </GlassCardContent>
            </GlassCard>
          )}

          <GlassCard>
            <GlassCardHeader>
              <h3 className="text-sm font-semibold text-surface-200">Connection Summary</h3>
            </GlassCardHeader>
            <GlassCardContent>
              <div className="space-y-2">
                {[
                  { icon: <Cpu size={12} />, label: 'MCP Servers', count: connectedMcp.length, color: 'text-purple-400' },
                  { icon: <Brain size={12} />, label: 'Models', count: initiative.connectedModels.length, color: 'text-cyan-400' },
                  { icon: <Key size={12} />, label: 'Identities', count: 1, color: 'text-amber-400' },
                  { icon: <Lock size={12} />, label: 'AD Groups', count: connectedMcp.reduce((sum, m) => sum + m.adGroups.length, 0), color: 'text-emerald-400' },
                  { icon: <Server size={12} />, label: 'Tools', count: connectedMcp.reduce((sum, m) => sum + m.tools.length, 0), color: 'text-orange-400' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={item.color}>{item.icon}</span>
                      <span className="text-xs text-surface-400">{item.label}</span>
                    </div>
                    <span className="text-xs font-medium text-surface-200">{item.count}</span>
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
