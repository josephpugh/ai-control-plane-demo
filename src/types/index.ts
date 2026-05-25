export type RiskTier = 'critical' | 'high' | 'medium' | 'low';
export type ApprovalPathway = 'exception-only' | 'enhanced-controls' | 'proportionate-controls' | 'standard';
export type Environment = 'development' | 'staging' | 'production';
export type GateStatus = 'passed' | 'failed' | 'pending' | 'blocked' | 'not-started';
export type InitiativeStatus = 'intake' | 'building' | 'testing' | 'gating' | 'deployed' | 'monitoring' | 'retired';

export interface ClassificationDimension {
  id: string;
  name: string;
  measure: string;
  level: number;
  maxLevel: number;
  description: string;
  riskContribution: RiskTier;
}

export interface Initiative {
  id: string;
  name: string;
  description: string;
  owner: string;
  team: string;
  status: InitiativeStatus;
  riskTier: RiskTier;
  approvalPathway: ApprovalPathway;
  classification: ClassificationDimension[];
  createdAt: string;
  updatedAt: string;
  environment: Environment;
  hypothesis: string;
  valueMetrics: ValueMetric[];
  connectedMcpServers: string[];
  connectedModels: string[];
  agentIdentity: string;
  tags: string[];
}

export interface McpServer {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'degraded';
  riskMetadata: {
    dataReach: string;
    actionCapability: string;
    externalAccess: boolean;
    classificationImpact: Record<string, string>;
  };
  tools: McpTool[];
  owner: string;
  registeredAt: string;
  lastHealthCheck: string;
  requestsPerDay: number;
  latencyP99: number;
  source: 'mulesoft' | 'internal' | 'azure' | 'third-party';
  adGroups: string[];
}

export interface McpTool {
  id: string;
  name: string;
  description: string;
  riskLevel: RiskTier;
  invocations24h: number;
  avgLatency: number;
}

export interface ReleaseGate {
  id: string;
  name: string;
  description: string;
  category: 'security' | 'quality' | 'compliance' | 'evidence' | 'approval';
  status: GateStatus;
  required: boolean;
  evidence?: string;
  lastChecked: string;
  details: string;
}

export interface TaggedRelease {
  id: string;
  version: string;
  initiativeId: string;
  artifactHash: string;
  createdAt: string;
  environment: Environment;
  gates: ReleaseGate[];
  overallStatus: GateStatus;
  evidencePack: EvidencePack;
}

export interface EvidencePack {
  id: string;
  signed: boolean;
  integrity: 'verified' | 'tampered' | 'pending';
  tests: TestResult[];
  createdAt: string;
  boundToRelease: string;
}

export interface TestResult {
  id: string;
  name: string;
  suite: string;
  status: 'passed' | 'failed' | 'skipped' | 'running';
  duration: number;
  category: 'golden-dataset' | 'safety' | 'security' | 'quality' | 'regression' | 'bias';
  details?: string;
}

export interface RuntimeMetric {
  timestamp: string;
  value: number;
  threshold?: number;
}

export interface RuntimeEval {
  id: string;
  name: string;
  category: string;
  score: number;
  threshold: number;
  trend: 'improving' | 'stable' | 'degrading';
  samples: number;
  lastEvaluated: string;
}

export interface ValueMetric {
  id: string;
  name: string;
  hypothesis: number;
  actual: number | null;
  unit: string;
  trend: 'up' | 'down' | 'flat';
  confidence: number;
}

export interface Signal {
  id: string;
  type: string;
  source: string;
  description: string;
  timestamp: string;
  severity: RiskTier;
  initiativeId: string;
  resolved: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ImpactPreview {
  dimensionChanges: {
    dimension: string;
    from: string;
    to: string;
    fromLevel: number;
    toLevel: number;
  }[];
  newControls: string[];
  newGates: string[];
  newEvidence: string[];
  tierChange: { from: RiskTier; to: RiskTier } | null;
  pathwayChange: { from: ApprovalPathway; to: ApprovalPathway } | null;
  recertificationRequired: boolean;
}

export interface DataSource {
  name: string;
  type: 'servicenow' | 'dynatrace' | 'azure-ad' | 'mulesoft' | 'llm-gateway' | 'cicd' | 'evidence-store' | 'jira';
  status: 'connected' | 'degraded' | 'disconnected';
  lastSync: string;
  recordCount: number;
}
