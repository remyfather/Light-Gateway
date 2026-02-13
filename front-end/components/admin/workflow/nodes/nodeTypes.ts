export interface NodeConfig {
  label: string;
  type: string;
  category: 'source' | 'processing' | 'routing' | 'destination';
  color: string;
  icon: string;
  description: string;
  defaultData: Record<string, unknown>;
}

export const NODE_CONFIGS: Record<string, NodeConfig> = {
  httpSource: {
    label: 'HTTP Source',
    type: 'httpSource',
    category: 'source',
    color: '#3b82f6',
    icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
    description: 'Receive HTTP requests',
    defaultData: {
      path: '/api/v1/example',
      method: 'GET',
      contentType: 'application/json',
    },
  },
  timer: {
    label: 'Timer',
    type: 'timer',
    category: 'source',
    color: '#3b82f6',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    description: 'Trigger on schedule',
    defaultData: {
      interval: 5000,
      unit: 'ms',
    },
  },
  transform: {
    label: 'Transform',
    type: 'transform',
    category: 'processing',
    color: '#8b5cf6',
    icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
    description: 'Transform request/response data',
    defaultData: {
      expression: '',
      language: 'simple',
    },
  },
  filter: {
    label: 'Filter',
    type: 'filter',
    category: 'processing',
    color: '#f59e0b',
    icon: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z',
    description: 'Filter messages by condition',
    defaultData: {
      condition: '',
      language: 'simple',
    },
  },
  rateLimit: {
    label: 'Rate Limit',
    type: 'rateLimit',
    category: 'processing',
    color: '#f59e0b',
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    description: 'Limit request rate',
    defaultData: {
      maxRequests: 100,
      timeWindow: 60,
      unit: 'seconds',
    },
  },
  loadBalancer: {
    label: 'Load Balancer',
    type: 'loadBalancer',
    category: 'routing',
    color: '#10b981',
    icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
    description: 'Distribute across targets',
    defaultData: {
      strategy: 'round-robin',
    },
  },
  contentRouter: {
    label: 'Content Router',
    type: 'contentRouter',
    category: 'routing',
    color: '#10b981',
    icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    description: 'Route by content condition',
    defaultData: {
      conditions: [{ expression: '', target: '' }],
    },
  },
  httpProxy: {
    label: 'HTTP Proxy',
    type: 'httpProxy',
    category: 'destination',
    color: '#ef4444',
    icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2',
    description: 'Forward to backend service',
    defaultData: {
      targetUrl: 'http://localhost:8080',
      timeout: 5000,
      retries: 0,
    },
  },
  response: {
    label: 'Response',
    type: 'response',
    category: 'destination',
    color: '#ef4444',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    description: 'Return response to client',
    defaultData: {
      statusCode: 200,
      contentType: 'application/json',
      body: '',
    },
  },
  logger: {
    label: 'Logger',
    type: 'logger',
    category: 'destination',
    color: '#ef4444',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    description: 'Log messages',
    defaultData: {
      level: 'INFO',
      message: '${body}',
    },
  },
};

export const CATEGORY_LABELS: Record<string, string> = {
  source: 'Sources',
  processing: 'Processing',
  routing: 'Routing',
  destination: 'Destinations',
};
