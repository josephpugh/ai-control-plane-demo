import type {
  Initiative, McpServer, TaggedRelease, RuntimeEval,
  Signal, DataSource, ClassificationDimension, ValueMetric, ChatMessage, TestResult
} from '../types';

export const currentUser = {
  name: 'Joe Pugh',
  email: 'joe.pugh@enterprise.com',
  role: 'Architecture Governance Lead',
  team: 'Platform Engineering',
  avatar: 'JP',
};

export const dataSources: DataSource[] = [
  { name: 'ServiceNow', type: 'servicenow', status: 'connected', lastSync: '2026-05-24T14:30:00Z', recordCount: 1247 },
  { name: 'Dynatrace', type: 'dynatrace', status: 'connected', lastSync: '2026-05-24T14:32:00Z', recordCount: 89420 },
  { name: 'Azure AD / Entra', type: 'azure-ad', status: 'connected', lastSync: '2026-05-24T14:28:00Z', recordCount: 3891 },
  { name: 'Mulesoft Gateway', type: 'mulesoft', status: 'connected', lastSync: '2026-05-24T14:31:00Z', recordCount: 156 },
  { name: 'LLM Gateway', type: 'llm-gateway', status: 'connected', lastSync: '2026-05-24T14:33:00Z', recordCount: 45200 },
  { name: 'CI/CD Pipeline', type: 'cicd', status: 'connected', lastSync: '2026-05-24T14:25:00Z', recordCount: 892 },
  { name: 'Evidence Store', type: 'evidence-store', status: 'connected', lastSync: '2026-05-24T14:29:00Z', recordCount: 234 },
  { name: 'Jira', type: 'jira', status: 'degraded', lastSync: '2026-05-24T13:45:00Z', recordCount: 5601 },
];

const classificationDimensions = (overrides: Partial<Record<string, [number, string]>> = {}): ClassificationDimension[] => {
  const defaults: Record<string, { name: string; maxLevel: number; default: [number, string] }> = {
    IA: { name: 'Interaction Autonomy', maxLevel: 5, default: [2, 'Bounded conversational with human review'] },
    IB: { name: 'Training Data Sensitivity', maxLevel: 4, default: [2, 'Internal non-sensitive data'] },
    IC: { name: 'Information Sources', maxLevel: 5, default: [2, 'Bounded approved sources'] },
    ID: { name: 'Data Reach', maxLevel: 5, default: [2, 'Curated internal content'] },
    IE: { name: 'Action Authority', maxLevel: 4, default: [1, 'No system action'] },
    IF: { name: 'Chained Capability', maxLevel: 4, default: [1, 'Standalone'] },
    IG: { name: 'Identity & Attribution', maxLevel: 4, default: [2, 'Service principal with user context'] },
    IH: { name: 'Model Provenance', maxLevel: 3, default: [1, 'Enterprise-approved model'] },
    II: { name: 'Prompt & Instruction', maxLevel: 4, default: [2, 'Template-constrained prompts'] },
    IJ: { name: 'Output Persistence', maxLevel: 4, default: [2, 'Session-scoped output'] },
    IK: { name: 'Audience & Exposure', maxLevel: 4, default: [2, 'Firmwide internal'] },
    IL: { name: 'Regulatory Overlay', maxLevel: 3, default: [1, 'Non-regulated domain'] },
    IM: { name: 'Lifecycle Maturity', maxLevel: 3, default: [1, 'Experimental / POC'] },
  };

  return Object.entries(defaults).map(([id, def]) => {
    const [level, description] = overrides[id] || def.default;
    const riskContribution = level >= def.maxLevel - 1 ? 'critical' :
      level >= Math.ceil(def.maxLevel * 0.6) ? 'high' :
      level >= Math.ceil(def.maxLevel * 0.3) ? 'medium' : 'low';
    return {
      id, name: def.name, measure: `${id}${level}`, level, maxLevel: def.maxLevel,
      description, riskContribution,
    };
  });
};

export const initiatives: Initiative[] = [
  {
    id: 'init-001',
    name: 'Advisor Knowledge Assistant',
    description: 'Conversational assistant for financial advisors providing real-time market insights, client portfolio analysis, and regulatory guidance from approved internal sources.',
    owner: 'Joe Pugh',
    team: 'Platform Engineering',
    status: 'deployed',
    riskTier: 'medium',
    approvalPathway: 'proportionate-controls',
    classification: classificationDimensions({
      IC: [2, 'Bounded approved sources'],
      ID: [2, 'Curated internal content'],
      IK: [2, 'Firmwide internal'],
    }),
    createdAt: '2026-02-15T09:00:00Z',
    updatedAt: '2026-05-20T16:30:00Z',
    environment: 'production',
    hypothesis: 'Reduce advisor research time by 40% and improve client response quality by 25%',
    valueMetrics: [
      { id: 'vm-1', name: 'Research Time Reduction', hypothesis: 40, actual: 34, unit: '%', trend: 'up', confidence: 0.82 },
      { id: 'vm-2', name: 'Client Response Quality', hypothesis: 25, actual: 28, unit: '% improvement', trend: 'up', confidence: 0.76 },
      { id: 'vm-3', name: 'Daily Active Users', hypothesis: 500, actual: 423, unit: 'users', trend: 'up', confidence: 0.91 },
      { id: 'vm-4', name: 'Cost per Interaction', hypothesis: 0.12, actual: 0.08, unit: 'USD', trend: 'down', confidence: 0.88 },
    ],
    connectedMcpServers: ['mcp-001', 'mcp-002', 'mcp-005'],
    connectedModels: ['claude-sonnet-4-6', 'text-embedding-3-large'],
    agentIdentity: 'svc-advisor-assistant-prod',
    tags: ['wealth-management', 'conversational', 'internal'],
  },
  {
    id: 'init-002',
    name: 'Claims Processing Copilot',
    description: 'Assists claims adjusters with damage assessment, policy matching, and settlement recommendations using computer vision and document analysis.',
    owner: 'Sarah Chen',
    team: 'Insurance Technology',
    status: 'testing',
    riskTier: 'high',
    approvalPathway: 'enhanced-controls',
    classification: classificationDimensions({
      IA: [3, 'Autonomous with human-in-the-loop approval'],
      IB: [3, 'PII and sensitive client data'],
      IC: [3, 'Multiple curated and external sources'],
      ID: [3, 'Client-specific documents and images'],
      IE: [2, 'Read/write to claims system'],
      IK: [3, 'Client-facing via advisor'],
      IL: [2, 'Insurance-regulated domain'],
    }),
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-05-22T11:15:00Z',
    environment: 'staging',
    hypothesis: 'Reduce claims processing time by 60% while maintaining 99.5% accuracy',
    valueMetrics: [
      { id: 'vm-5', name: 'Processing Time Reduction', hypothesis: 60, actual: 47, unit: '%', trend: 'up', confidence: 0.71 },
      { id: 'vm-6', name: 'Accuracy Rate', hypothesis: 99.5, actual: 98.2, unit: '%', trend: 'up', confidence: 0.65 },
      { id: 'vm-7', name: 'Cost Savings per Claim', hypothesis: 120, actual: null, unit: 'USD', trend: 'flat', confidence: 0 },
    ],
    connectedMcpServers: ['mcp-003', 'mcp-004', 'mcp-006'],
    connectedModels: ['claude-opus-4-6', 'gpt-4o-vision'],
    agentIdentity: 'svc-claims-copilot-staging',
    tags: ['insurance', 'document-analysis', 'regulated'],
  },
  {
    id: 'init-003',
    name: 'Code Review Agent',
    description: 'Autonomous code review agent that analyzes pull requests for security vulnerabilities, code quality, and compliance with internal standards.',
    owner: 'Joe Pugh',
    team: 'Platform Engineering',
    status: 'building',
    riskTier: 'low',
    approvalPathway: 'standard',
    classification: classificationDimensions({
      IA: [2, 'Bounded analysis with suggestions'],
      IB: [1, 'Source code only'],
      IC: [1, 'Internal codebase only'],
      ID: [1, 'Repository-scoped'],
      IE: [1, 'Read-only, comment only'],
      IG: [1, 'Bot identity, human-attributed actions'],
    }),
    createdAt: '2026-04-10T08:00:00Z',
    updatedAt: '2026-05-23T14:00:00Z',
    environment: 'development',
    hypothesis: 'Catch 30% more vulnerabilities pre-merge and reduce review cycle time by 50%',
    valueMetrics: [
      { id: 'vm-8', name: 'Vulnerability Detection', hypothesis: 30, actual: null, unit: '% increase', trend: 'flat', confidence: 0 },
      { id: 'vm-9', name: 'Review Cycle Time', hypothesis: 50, actual: null, unit: '% reduction', trend: 'flat', confidence: 0 },
    ],
    connectedMcpServers: ['mcp-007'],
    connectedModels: ['claude-sonnet-4-6'],
    agentIdentity: 'svc-code-review-dev',
    tags: ['developer-tools', 'security', 'internal'],
  },
  {
    id: 'init-004',
    name: 'Client Onboarding Orchestrator',
    description: 'End-to-end orchestration of new client onboarding including KYC checks, document verification, and account provisioning across multiple systems.',
    owner: 'Maria Rodriguez',
    team: 'Digital Experience',
    status: 'intake',
    riskTier: 'critical',
    approvalPathway: 'exception-only',
    classification: classificationDimensions({
      IA: [4, 'Fully autonomous multi-step orchestration'],
      IB: [4, 'KYC/AML regulated personal data'],
      IC: [4, 'External verification services'],
      ID: [4, 'Cross-system client records'],
      IE: [3, 'Write to multiple systems of record'],
      IF: [3, 'Multi-agent orchestration'],
      IG: [3, 'NHI with delegated authority'],
      IK: [3, 'Client-facing direct'],
      IL: [3, 'Multi-regulatory (KYC/AML/Privacy)'],
    }),
    createdAt: '2026-05-10T09:00:00Z',
    updatedAt: '2026-05-24T10:00:00Z',
    environment: 'development',
    hypothesis: 'Reduce onboarding time from 5 days to 4 hours with 100% regulatory compliance',
    valueMetrics: [
      { id: 'vm-10', name: 'Onboarding Time', hypothesis: 95, actual: null, unit: '% reduction', trend: 'flat', confidence: 0 },
      { id: 'vm-11', name: 'Compliance Score', hypothesis: 100, actual: null, unit: '%', trend: 'flat', confidence: 0 },
    ],
    connectedMcpServers: ['mcp-003', 'mcp-008', 'mcp-009'],
    connectedModels: ['claude-opus-4-6'],
    agentIdentity: 'svc-onboarding-dev',
    tags: ['client-facing', 'regulated', 'orchestration'],
  },
  {
    id: 'init-005',
    name: 'Internal Policy Q&A',
    description: 'Simple RAG-based Q&A over internal HR and compliance policies for employee self-service.',
    owner: 'Alex Thompson',
    team: 'Platform Engineering',
    status: 'deployed',
    riskTier: 'low',
    approvalPathway: 'standard',
    classification: classificationDimensions(),
    createdAt: '2026-01-20T09:00:00Z',
    updatedAt: '2026-05-18T12:00:00Z',
    environment: 'production',
    hypothesis: 'Deflect 40% of HR policy inquiries from support tickets',
    valueMetrics: [
      { id: 'vm-12', name: 'Ticket Deflection', hypothesis: 40, actual: 52, unit: '%', trend: 'up', confidence: 0.94 },
      { id: 'vm-13', name: 'Employee Satisfaction', hypothesis: 4.0, actual: 4.3, unit: '/5', trend: 'up', confidence: 0.87 },
    ],
    connectedMcpServers: ['mcp-001'],
    connectedModels: ['claude-haiku-4-5'],
    agentIdentity: 'svc-policy-qa-prod',
    tags: ['hr', 'internal', 'simple'],
  },
];

export const mcpServers: McpServer[] = [
  {
    id: 'mcp-001', name: 'Knowledge-Base-MCP', description: 'Internal knowledge base and document retrieval',
    status: 'active',
    riskMetadata: {
      dataReach: 'Internal curated content', actionCapability: 'Read-only retrieval',
      externalAccess: false, classificationImpact: { IC: 'IC2', ID: 'ID2' },
    },
    tools: [
      { id: 't-001', name: 'search_documents', description: 'Search internal knowledge base', riskLevel: 'low', invocations24h: 12450, avgLatency: 120 },
      { id: 't-002', name: 'get_document', description: 'Retrieve specific document by ID', riskLevel: 'low', invocations24h: 8920, avgLatency: 85 },
      { id: 't-003', name: 'list_categories', description: 'List document categories', riskLevel: 'low', invocations24h: 1200, avgLatency: 45 },
    ],
    owner: 'Platform Engineering', registeredAt: '2026-01-15T09:00:00Z', lastHealthCheck: '2026-05-24T14:30:00Z',
    requestsPerDay: 22570, latencyP99: 340, source: 'internal', adGroups: ['SG-AI-Knowledge-Read'],
  },
  {
    id: 'mcp-002', name: 'Portfolio-Analytics-MCP', description: 'Client portfolio analytics and performance data',
    status: 'active',
    riskMetadata: {
      dataReach: 'Client financial data (aggregated)', actionCapability: 'Read-only analytics',
      externalAccess: false, classificationImpact: { IC: 'IC2', ID: 'ID3', IB: 'IB2' },
    },
    tools: [
      { id: 't-004', name: 'get_portfolio_summary', description: 'Get aggregated portfolio summary', riskLevel: 'medium', invocations24h: 5600, avgLatency: 230 },
      { id: 't-005', name: 'analyze_performance', description: 'Analyze portfolio performance trends', riskLevel: 'medium', invocations24h: 3200, avgLatency: 450 },
      { id: 't-006', name: 'compare_benchmarks', description: 'Compare against market benchmarks', riskLevel: 'low', invocations24h: 1800, avgLatency: 180 },
    ],
    owner: 'Wealth Technology', registeredAt: '2026-02-01T09:00:00Z', lastHealthCheck: '2026-05-24T14:31:00Z',
    requestsPerDay: 10600, latencyP99: 890, source: 'mulesoft', adGroups: ['SG-AI-Portfolio-Read', 'SG-WealthTech-API'],
  },
  {
    id: 'mcp-003', name: 'Document-Processing-MCP', description: 'Document OCR, classification, and data extraction',
    status: 'active',
    riskMetadata: {
      dataReach: 'Uploaded documents (may contain PII)', actionCapability: 'Read and classify',
      externalAccess: false, classificationImpact: { IC: 'IC3', ID: 'ID3', IB: 'IB3' },
    },
    tools: [
      { id: 't-007', name: 'extract_text', description: 'OCR text extraction from images/PDFs', riskLevel: 'medium', invocations24h: 2400, avgLatency: 1200 },
      { id: 't-008', name: 'classify_document', description: 'Classify document type and sensitivity', riskLevel: 'medium', invocations24h: 2400, avgLatency: 800 },
      { id: 't-009', name: 'extract_entities', description: 'Extract structured entities from text', riskLevel: 'high', invocations24h: 1900, avgLatency: 650 },
    ],
    owner: 'Document Services', registeredAt: '2026-01-28T09:00:00Z', lastHealthCheck: '2026-05-24T14:30:00Z',
    requestsPerDay: 6700, latencyP99: 2100, source: 'internal', adGroups: ['SG-AI-DocProcess', 'SG-Claims-Systems'],
  },
  {
    id: 'mcp-004', name: 'Claims-System-MCP', description: 'Claims management system read/write interface',
    status: 'active',
    riskMetadata: {
      dataReach: 'Claims records with PII', actionCapability: 'Read and write to claims',
      externalAccess: false, classificationImpact: { IC: 'IC3', ID: 'ID4', IE: 'IE2', IB: 'IB3' },
    },
    tools: [
      { id: 't-010', name: 'get_claim', description: 'Retrieve claim details', riskLevel: 'high', invocations24h: 3100, avgLatency: 180 },
      { id: 't-011', name: 'update_claim_status', description: 'Update claim processing status', riskLevel: 'critical', invocations24h: 890, avgLatency: 250 },
      { id: 't-012', name: 'add_claim_note', description: 'Add assessment note to claim', riskLevel: 'high', invocations24h: 1200, avgLatency: 120 },
    ],
    owner: 'Insurance Technology', registeredAt: '2026-03-05T09:00:00Z', lastHealthCheck: '2026-05-24T14:32:00Z',
    requestsPerDay: 5190, latencyP99: 450, source: 'mulesoft', adGroups: ['SG-AI-Claims-RW', 'SG-Insurance-Core'],
  },
  {
    id: 'mcp-005', name: 'Compliance-Rules-MCP', description: 'Regulatory compliance rules engine and validation',
    status: 'active',
    riskMetadata: {
      dataReach: 'Regulatory rules (non-sensitive)', actionCapability: 'Read-only validation',
      externalAccess: false, classificationImpact: { IC: 'IC2', IL: 'IL1' },
    },
    tools: [
      { id: 't-013', name: 'validate_compliance', description: 'Validate action against compliance rules', riskLevel: 'medium', invocations24h: 8900, avgLatency: 95 },
      { id: 't-014', name: 'get_applicable_rules', description: 'Get rules for a given context', riskLevel: 'low', invocations24h: 4500, avgLatency: 60 },
    ],
    owner: 'Risk & Compliance', registeredAt: '2026-02-10T09:00:00Z', lastHealthCheck: '2026-05-24T14:33:00Z',
    requestsPerDay: 13400, latencyP99: 180, source: 'internal', adGroups: ['SG-AI-Compliance-Read'],
  },
  {
    id: 'mcp-006', name: 'Image-Analysis-MCP', description: 'Computer vision for damage assessment and image analysis',
    status: 'active',
    riskMetadata: {
      dataReach: 'Uploaded images (may contain location/identity data)', actionCapability: 'Analysis only',
      externalAccess: false, classificationImpact: { IC: 'IC3', IB: 'IB2' },
    },
    tools: [
      { id: 't-015', name: 'assess_damage', description: 'Assess damage from property images', riskLevel: 'medium', invocations24h: 1200, avgLatency: 2800 },
      { id: 't-016', name: 'detect_fraud_indicators', description: 'Detect potential fraud indicators in images', riskLevel: 'high', invocations24h: 800, avgLatency: 3200 },
    ],
    owner: 'Insurance Technology', registeredAt: '2026-03-12T09:00:00Z', lastHealthCheck: '2026-05-24T14:30:00Z',
    requestsPerDay: 2000, latencyP99: 4500, source: 'azure', adGroups: ['SG-AI-Vision', 'SG-Claims-Systems'],
  },
  {
    id: 'mcp-007', name: 'GitHub-MCP', description: 'GitHub repository access for code analysis and PR management',
    status: 'active',
    riskMetadata: {
      dataReach: 'Source code repositories', actionCapability: 'Read + comment',
      externalAccess: false, classificationImpact: { IC: 'IC1', ID: 'ID1' },
    },
    tools: [
      { id: 't-017', name: 'get_pr_diff', description: 'Get pull request diff', riskLevel: 'low', invocations24h: 340, avgLatency: 200 },
      { id: 't-018', name: 'post_review_comment', description: 'Post inline review comment', riskLevel: 'low', invocations24h: 120, avgLatency: 150 },
      { id: 't-019', name: 'get_file_content', description: 'Get file content from repository', riskLevel: 'low', invocations24h: 890, avgLatency: 100 },
    ],
    owner: 'Platform Engineering', registeredAt: '2026-04-15T09:00:00Z', lastHealthCheck: '2026-05-24T14:31:00Z',
    requestsPerDay: 1350, latencyP99: 380, source: 'internal', adGroups: ['SG-AI-GitHub-Read'],
  },
  {
    id: 'mcp-008', name: 'KYC-Verification-MCP', description: 'Know Your Customer identity verification and screening',
    status: 'active',
    riskMetadata: {
      dataReach: 'Personal identity documents and screening databases', actionCapability: 'Verify and screen',
      externalAccess: true, classificationImpact: { IC: 'IC4', ID: 'ID4', IB: 'IB4', IL: 'IL3' },
    },
    tools: [
      { id: 't-020', name: 'verify_identity', description: 'Verify client identity against documents', riskLevel: 'critical', invocations24h: 450, avgLatency: 3500 },
      { id: 't-021', name: 'screen_sanctions', description: 'Screen against sanctions and PEP lists', riskLevel: 'critical', invocations24h: 450, avgLatency: 2800 },
      { id: 't-022', name: 'check_adverse_media', description: 'Check adverse media coverage', riskLevel: 'high', invocations24h: 320, avgLatency: 4200 },
    ],
    owner: 'Compliance Technology', registeredAt: '2026-05-01T09:00:00Z', lastHealthCheck: '2026-05-24T14:28:00Z',
    requestsPerDay: 1220, latencyP99: 5800, source: 'third-party', adGroups: ['SG-AI-KYC-Verify', 'SG-Compliance-Core'],
  },
  {
    id: 'mcp-009', name: 'Account-Provisioning-MCP', description: 'Core banking account creation and provisioning',
    status: 'active',
    riskMetadata: {
      dataReach: 'Core banking systems', actionCapability: 'Create and modify accounts',
      externalAccess: false, classificationImpact: { IE: 'IE3', ID: 'ID4', IB: 'IB4' },
    },
    tools: [
      { id: 't-023', name: 'create_account', description: 'Create new client account', riskLevel: 'critical', invocations24h: 180, avgLatency: 1500 },
      { id: 't-024', name: 'set_account_features', description: 'Configure account features and limits', riskLevel: 'critical', invocations24h: 180, avgLatency: 800 },
    ],
    owner: 'Core Banking', registeredAt: '2026-05-05T09:00:00Z', lastHealthCheck: '2026-05-24T14:29:00Z',
    requestsPerDay: 360, latencyP99: 2200, source: 'mulesoft', adGroups: ['SG-AI-Banking-Write', 'SG-CoreBanking-Admin'],
  },
  {
    id: 'mcp-010', name: 'Market-Data-MCP', description: 'External market data feeds and financial analytics',
    status: 'active',
    riskMetadata: {
      dataReach: 'External market data (public + licensed)', actionCapability: 'Read-only lookup',
      externalAccess: true, classificationImpact: { IC: 'IC4', ID: 'ID5' },
    },
    tools: [
      { id: 't-025', name: 'get_market_quote', description: 'Get real-time market quotes', riskLevel: 'medium', invocations24h: 15000, avgLatency: 45 },
      { id: 't-026', name: 'get_market_analysis', description: 'Get market analysis and trends', riskLevel: 'medium', invocations24h: 4200, avgLatency: 320 },
      { id: 't-027', name: 'search_external_research', description: 'Search external research and news', riskLevel: 'high', invocations24h: 2800, avgLatency: 580 },
    ],
    owner: 'Market Data Services', registeredAt: '2026-03-20T09:00:00Z', lastHealthCheck: '2026-05-24T14:33:00Z',
    requestsPerDay: 22000, latencyP99: 920, source: 'third-party', adGroups: ['SG-AI-MarketData', 'SG-WealthTech-API'],
  },
];

export const taggedReleases: TaggedRelease[] = [
  {
    id: 'rel-001', version: 'v2.4.1', initiativeId: 'init-001', artifactHash: 'sha256:a3f8c9d2e1b4',
    createdAt: '2026-05-20T16:00:00Z', environment: 'production',
    overallStatus: 'passed',
    gates: [
      { id: 'g-001', name: 'Classification Validation', description: 'Verify classification matches declared properties', category: 'compliance', status: 'passed', required: true, lastChecked: '2026-05-20T15:30:00Z', details: 'All 13 dimensions validated against declared properties' },
      { id: 'g-002', name: 'Security Scan', description: 'SAST/DAST and dependency vulnerability scan', category: 'security', status: 'passed', required: true, lastChecked: '2026-05-20T15:35:00Z', details: '0 critical, 0 high, 2 medium (accepted), 5 low findings' },
      { id: 'g-003', name: 'Golden Dataset Tests', description: 'Regression tests against golden datasets', category: 'quality', status: 'passed', required: true, lastChecked: '2026-05-20T15:40:00Z', details: '147/147 passed (100%)' },
      { id: 'g-004', name: 'Safety Evaluation', description: 'Safety probe suite for harmful content detection', category: 'quality', status: 'passed', required: true, lastChecked: '2026-05-20T15:45:00Z', details: 'All 89 safety probes passed, 0 failures' },
      { id: 'g-005', name: 'Prompt Injection Tests', description: 'Adversarial prompt injection test suite', category: 'security', status: 'passed', required: true, lastChecked: '2026-05-20T15:50:00Z', details: '56/56 injection attempts blocked' },
      { id: 'g-006', name: 'Evidence Pack Integrity', description: 'Verify evidence pack is signed and tamper-evident', category: 'evidence', status: 'passed', required: true, lastChecked: '2026-05-20T15:55:00Z', details: 'SHA-256 hash verified, signature valid' },
      { id: 'g-007', name: 'Architecture Review', description: 'Architecture governance sign-off', category: 'approval', status: 'passed', required: true, lastChecked: '2026-05-19T14:00:00Z', details: 'Approved by Architecture Review Board' },
    ],
    evidencePack: {
      id: 'ep-001', signed: true, integrity: 'verified',
      tests: generateTestResults('init-001', 'passed'),
      createdAt: '2026-05-20T15:30:00Z', boundToRelease: 'v2.4.1',
    },
  },
  {
    id: 'rel-002', version: 'v0.9.0-rc.3', initiativeId: 'init-002', artifactHash: 'sha256:b7e2f1a4c8d3',
    createdAt: '2026-05-22T11:00:00Z', environment: 'staging',
    overallStatus: 'failed',
    gates: [
      { id: 'g-008', name: 'Classification Validation', description: 'Verify classification matches declared properties', category: 'compliance', status: 'passed', required: true, lastChecked: '2026-05-22T10:30:00Z', details: 'All dimensions validated' },
      { id: 'g-009', name: 'Security Scan', description: 'SAST/DAST and dependency vulnerability scan', category: 'security', status: 'passed', required: true, lastChecked: '2026-05-22T10:35:00Z', details: '0 critical, 1 high (remediation scheduled), 4 medium' },
      { id: 'g-010', name: 'Golden Dataset Tests', description: 'Regression tests against golden datasets', category: 'quality', status: 'failed', required: true, lastChecked: '2026-05-22T10:40:00Z', details: '189/203 passed (93.1%) — below 95% threshold' },
      { id: 'g-011', name: 'Safety Evaluation', description: 'Safety probe suite', category: 'quality', status: 'passed', required: true, lastChecked: '2026-05-22T10:45:00Z', details: '112/112 passed' },
      { id: 'g-012', name: 'PII Detection Tests', description: 'Verify PII handling and redaction', category: 'compliance', status: 'failed', required: true, lastChecked: '2026-05-22T10:50:00Z', details: '3 test cases showed PII leakage in edge cases' },
      { id: 'g-013', name: 'Bias Evaluation', description: 'Bias and fairness evaluation suite', category: 'quality', status: 'pending', required: true, lastChecked: '2026-05-22T10:55:00Z', details: 'Awaiting bias evaluation run on updated golden dataset' },
      { id: 'g-014', name: 'Evidence Pack Integrity', description: 'Verify evidence pack', category: 'evidence', status: 'passed', required: true, lastChecked: '2026-05-22T11:00:00Z', details: 'Hash verified' },
      { id: 'g-015', name: 'Enhanced Controls Review', description: 'Enhanced controls governance review', category: 'approval', status: 'pending', required: true, lastChecked: '2026-05-22T11:00:00Z', details: 'Blocked pending gate failures resolution' },
    ],
    evidencePack: {
      id: 'ep-002', signed: true, integrity: 'verified',
      tests: generateTestResults('init-002', 'mixed'),
      createdAt: '2026-05-22T10:30:00Z', boundToRelease: 'v0.9.0-rc.3',
    },
  },
];

function generateTestResults(initiativeId: string, outcome: 'passed' | 'mixed'): TestResult[] {
  const suites: { suite: string; category: TestResult['category']; tests: string[] }[] = [
    { suite: 'Golden Dataset - Core', category: 'golden-dataset', tests: ['Query accuracy', 'Response relevance', 'Citation correctness', 'Boundary handling', 'Edge case coverage'] },
    { suite: 'Safety Probes', category: 'safety', tests: ['Harmful content generation', 'Jailbreak resistance', 'Instruction override', 'Role confusion', 'Social engineering'] },
    { suite: 'Security', category: 'security', tests: ['Prompt injection', 'Data exfiltration', 'Tool abuse', 'Privilege escalation', 'Input sanitization'] },
    { suite: 'Quality', category: 'quality', tests: ['Groundedness', 'Coherence', 'Completeness', 'Tone consistency', 'Format compliance'] },
    { suite: 'Regression', category: 'regression', tests: ['Previous bug fixes', 'Performance baseline', 'Integration stability', 'API compatibility'] },
    { suite: 'Bias & Fairness', category: 'bias', tests: ['Demographic parity', 'Equal opportunity', 'Language bias', 'Cultural sensitivity'] },
  ];

  let testId = 0;
  return suites.flatMap(s =>
    s.tests.map(t => {
      testId++;
      let status: TestResult['status'] = 'passed';
      if (outcome === 'mixed' && Math.random() > 0.85) status = 'failed';
      return {
        id: `test-${initiativeId}-${testId}`,
        name: t, suite: s.suite, status, category: s.category,
        duration: Math.floor(Math.random() * 5000) + 500,
        details: status === 'failed' ? `Threshold violation detected in ${t.toLowerCase()}` : undefined,
      };
    })
  );
}

export const runtimeEvals: RuntimeEval[] = [
  { id: 're-001', name: 'Groundedness', category: 'Quality', score: 0.94, threshold: 0.90, trend: 'stable', samples: 12400, lastEvaluated: '2026-05-24T14:00:00Z' },
  { id: 're-002', name: 'Response Relevance', category: 'Quality', score: 0.91, threshold: 0.85, trend: 'improving', samples: 12400, lastEvaluated: '2026-05-24T14:00:00Z' },
  { id: 're-003', name: 'Safety Score', category: 'Safety', score: 0.99, threshold: 0.98, trend: 'stable', samples: 12400, lastEvaluated: '2026-05-24T14:00:00Z' },
  { id: 're-004', name: 'Harmful Content Rate', category: 'Safety', score: 0.001, threshold: 0.005, trend: 'stable', samples: 12400, lastEvaluated: '2026-05-24T14:00:00Z' },
  { id: 're-005', name: 'Bias Detection', category: 'Fairness', score: 0.96, threshold: 0.92, trend: 'improving', samples: 5200, lastEvaluated: '2026-05-24T14:00:00Z' },
  { id: 're-006', name: 'Citation Accuracy', category: 'Quality', score: 0.88, threshold: 0.85, trend: 'degrading', samples: 8900, lastEvaluated: '2026-05-24T14:00:00Z' },
  { id: 're-007', name: 'Latency P95', category: 'Performance', score: 1.2, threshold: 2.0, trend: 'stable', samples: 12400, lastEvaluated: '2026-05-24T14:00:00Z' },
  { id: 're-008', name: 'Token Efficiency', category: 'Performance', score: 0.82, threshold: 0.70, trend: 'improving', samples: 12400, lastEvaluated: '2026-05-24T14:00:00Z' },
];

export const signals: Signal[] = [
  { id: 'sig-001', type: 'AD Group Change', source: 'Azure AD / Entra', description: 'Service principal svc-advisor-assistant-prod added to SG-AI-MarketData group', timestamp: '2026-05-24T13:45:00Z', severity: 'high', initiativeId: 'init-001', resolved: false },
  { id: 'sig-002', type: 'Runtime Anomaly', source: 'Dynatrace', description: 'Unusual spike in tool calls to Portfolio-Analytics-MCP (3x baseline)', timestamp: '2026-05-24T12:30:00Z', severity: 'medium', initiativeId: 'init-001', resolved: false },
  { id: 'sig-003', type: 'Gate Failure', source: 'CI/CD Pipeline', description: 'Golden dataset tests failed for Claims Processing Copilot v0.9.0-rc.3', timestamp: '2026-05-22T10:40:00Z', severity: 'high', initiativeId: 'init-002', resolved: false },
  { id: 'sig-004', type: 'PII Exposure', source: 'Runtime Eval', description: 'PII detected in 3 response samples during live evaluation', timestamp: '2026-05-22T10:50:00Z', severity: 'critical', initiativeId: 'init-002', resolved: false },
  { id: 'sig-005', type: 'Model Change', source: 'LLM Gateway', description: 'Model version updated from claude-sonnet-4-5 to claude-sonnet-4-6', timestamp: '2026-05-20T09:00:00Z', severity: 'low', initiativeId: 'init-001', resolved: true },
  { id: 'sig-006', type: 'New MCP Registration', source: 'Mulesoft Gateway', description: 'New MCP server registered: Market-Data-MCP with external access', timestamp: '2026-05-19T14:00:00Z', severity: 'medium', initiativeId: '', resolved: true },
  { id: 'sig-007', type: 'Recertification Due', source: 'Control Plane', description: 'Annual recertification due for Internal Policy Q&A', timestamp: '2026-05-18T09:00:00Z', severity: 'medium', initiativeId: 'init-005', resolved: false },
  { id: 'sig-008', type: 'Compliance Alert', source: 'ServiceNow', description: 'New regulatory guidance on AI in insurance claims processing', timestamp: '2026-05-21T10:00:00Z', severity: 'high', initiativeId: 'init-002', resolved: false },
];

export const sampleChatMessages: ChatMessage[] = [
  { id: 'c-1', role: 'user', content: 'What would happen if I connect the Market-Data-MCP server to the Advisor Knowledge Assistant?', timestamp: '2026-05-24T14:00:00Z' },
  { id: 'c-2', role: 'assistant', content: 'I\'ve run a what-if analysis. Adding Market-Data-MCP would change 2 classification dimensions:\n\n**IC: Information Sources** — IC2 → IC4 (exception-only)\nMarket-Data-MCP reaches external/unbounded content.\n\n**ID: Data Reach** — ID2 → ID5 (exception-only)\nExposes arbitrary vendor and web-adjacent content.\n\nThis would escalate your tier from **Medium** to **Critical** and shift the approval pathway to **Exception-Only**.\n\n**New requirements:**\n- Connector allow-listing and domain allow-lists\n- Strict instruction hierarchy enforcement\n- Enhanced monitoring with data-leak detection\n- Prompt injection test suite (mandatory)\n- Formal risk-acceptance review\n- Immediate recertification\n\nWould you like to explore a bounded alternative that stays IC2-compatible?', timestamp: '2026-05-24T14:00:30Z' },
];

export function generateTimeSeriesData(hours: number, baseValue: number, variance: number, trend: number = 0): { timestamp: string; value: number }[] {
  const data: { timestamp: string; value: number }[] = [];
  const now = new Date('2026-05-24T14:00:00Z');
  for (let i = hours; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 3600000);
    data.push({
      timestamp: t.toISOString(),
      value: Math.max(0, baseValue + (Math.random() - 0.5) * variance + (hours - i) * trend),
    });
  }
  return data;
}
