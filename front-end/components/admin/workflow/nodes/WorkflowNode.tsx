'use client';

import React, { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { NODE_CONFIGS } from './nodeTypes';

interface WorkflowNodeData {
  type: string;
  label: string;
  config: Record<string, unknown>;
  [key: string]: unknown;
}

function WorkflowNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as WorkflowNodeData;
  const nodeConfig = NODE_CONFIGS[nodeData.type];
  if (!nodeConfig) return null;

  const isSource = nodeConfig.category === 'source';
  const isDestination = nodeConfig.category === 'destination';

  return (
    <div
      className={`rounded-lg border-2 bg-white shadow-sm transition-shadow min-w-[180px] ${
        selected ? 'shadow-lg' : 'hover:shadow-md'
      }`}
      style={{
        borderColor: selected ? nodeConfig.color : '#e2e8f0',
      }}
    >
      {/* Input Handle */}
      {!isSource && (
        <Handle
          type="target"
          position={Position.Left}
          className="!w-3 !h-3 !border-2 !border-white"
          style={{ backgroundColor: nodeConfig.color }}
        />
      )}

      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-t-md"
        style={{ backgroundColor: `${nodeConfig.color}15` }}
      >
        <div
          className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: nodeConfig.color }}
        >
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={nodeConfig.icon} />
          </svg>
        </div>
        <span className="text-xs font-semibold truncate" style={{ color: nodeConfig.color }}>
          {nodeData.label || nodeConfig.label}
        </span>
      </div>

      {/* Body - Key config preview */}
      <div className="px-3 py-2 space-y-1">
        {nodeData.type === 'httpSource' && (
          <>
            <div className="flex items-center gap-1.5">
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: getMethodColor(nodeData.config.method as string),
                  color: 'white',
                }}
              >
                {(nodeData.config.method as string) || 'GET'}
              </span>
              <code className="text-[11px] text-gray-600 truncate max-w-[120px]">
                {(nodeData.config.path as string) || '/api/...'}
              </code>
            </div>
          </>
        )}
        {nodeData.type === 'timer' && (
          <div className="text-[11px] text-gray-500">
            Every {(nodeData.config.interval as number) || 5000}ms
          </div>
        )}
        {nodeData.type === 'transform' && (
          <div className="text-[11px] text-gray-500 truncate">
            {(nodeData.config.language as string) || 'simple'}: {(nodeData.config.expression as string) || '...'}
          </div>
        )}
        {nodeData.type === 'filter' && (
          <div className="text-[11px] text-gray-500 truncate">
            {(nodeData.config.condition as string) || 'Set condition...'}
          </div>
        )}
        {nodeData.type === 'rateLimit' && (
          <div className="text-[11px] text-gray-500">
            {(nodeData.config.maxRequests as number) || 100} / {(nodeData.config.timeWindow as number) || 60}s
          </div>
        )}
        {nodeData.type === 'httpProxy' && (
          <code className="text-[11px] text-gray-500 truncate block max-w-[160px]">
            {(nodeData.config.targetUrl as string) || 'http://...'}
          </code>
        )}
        {nodeData.type === 'response' && (
          <div className="text-[11px] text-gray-500">
            Status: {(nodeData.config.statusCode as number) || 200}
          </div>
        )}
        {nodeData.type === 'logger' && (
          <div className="text-[11px] text-gray-500">
            [{(nodeData.config.level as string) || 'INFO'}]
          </div>
        )}
        {nodeData.type === 'loadBalancer' && (
          <div className="text-[11px] text-gray-500">
            {(nodeData.config.strategy as string) || 'round-robin'}
          </div>
        )}
        {nodeData.type === 'contentRouter' && (
          <div className="text-[11px] text-gray-500">
            Content-based routing
          </div>
        )}
      </div>

      {/* Output Handle */}
      {!isDestination && (
        <Handle
          type="source"
          position={Position.Right}
          className="!w-3 !h-3 !border-2 !border-white"
          style={{ backgroundColor: nodeConfig.color }}
        />
      )}
    </div>
  );
}

function getMethodColor(method: string): string {
  const colors: Record<string, string> = {
    GET: '#10b981',
    POST: '#3b82f6',
    PUT: '#f59e0b',
    DELETE: '#ef4444',
    PATCH: '#8b5cf6',
    ALL: '#6b7280',
  };
  return colors[method] || colors.ALL;
}

export default memo(WorkflowNode);
