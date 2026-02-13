'use client';

import React from 'react';
import type { Node } from '@xyflow/react';
import { NODE_CONFIGS } from './nodes/nodeTypes';

interface PropertiesPanelProps {
  selectedNode: Node | null;
  onUpdateNode: (nodeId: string, data: Record<string, unknown>) => void;
  onDeleteNode: (nodeId: string) => void;
}

export default function PropertiesPanel({
  selectedNode,
  onUpdateNode,
  onDeleteNode,
}: PropertiesPanelProps) {
  if (!selectedNode) {
    return (
      <div className="w-72 bg-white border-l flex flex-col h-full" style={{ borderColor: '#e2e8f0' }}>
        <div className="p-4 border-b" style={{ borderColor: '#e2e8f0' }}>
          <h3 className="text-sm font-semibold" style={{ color: '#001e2b' }}>
            Properties
          </h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <p className="text-xs text-center" style={{ color: '#9ca3af' }}>
            Select a node to edit its properties
          </p>
        </div>
      </div>
    );
  }

  const nodeData = selectedNode.data as {
    type: string;
    label: string;
    config: Record<string, unknown>;
  };
  const nodeConfig = NODE_CONFIGS[nodeData.type];

  const updateConfig = (key: string, value: unknown) => {
    onUpdateNode(selectedNode.id, {
      ...selectedNode.data,
      config: { ...(nodeData.config || {}), [key]: value },
    });
  };

  const updateLabel = (label: string) => {
    onUpdateNode(selectedNode.id, { ...selectedNode.data, label });
  };

  return (
    <div className="w-72 bg-white border-l flex flex-col h-full" style={{ borderColor: '#e2e8f0' }}>
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: '#e2e8f0' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded flex items-center justify-center"
              style={{ backgroundColor: nodeConfig?.color || '#6b7280' }}
            >
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={nodeConfig?.icon || ''} />
              </svg>
            </div>
            <h3 className="text-sm font-semibold" style={{ color: '#001e2b' }}>
              {nodeConfig?.label || 'Node'}
            </h3>
          </div>
          <button
            onClick={() => onDeleteNode(selectedNode.id)}
            className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50"
            title="Delete node"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        <p className="text-[11px]" style={{ color: '#9ca3af' }}>
          {nodeConfig?.description}
        </p>
      </div>

      {/* Properties Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Common: Label */}
        <FieldGroup label="Display Name">
          <input
            type="text"
            value={(nodeData.label as string) || ''}
            onChange={(e) => updateLabel(e.target.value)}
            className="w-full text-sm border rounded px-2.5 py-1.5 focus:outline-none focus:ring-2"
            style={{ borderColor: '#e2e8f0' }}
            placeholder={nodeConfig?.label}
          />
        </FieldGroup>

        {/* Type-specific fields */}
        {nodeData.type === 'httpSource' && (
          <>
            <FieldGroup label="HTTP Method">
              <select
                value={(nodeData.config?.method as string) || 'GET'}
                onChange={(e) => updateConfig('method', e.target.value)}
                className="w-full text-sm border rounded px-2.5 py-1.5 focus:outline-none focus:ring-2"
                style={{ borderColor: '#e2e8f0' }}
              >
                {['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'ALL'].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </FieldGroup>
            <FieldGroup label="Path">
              <input
                type="text"
                value={(nodeData.config?.path as string) || ''}
                onChange={(e) => updateConfig('path', e.target.value)}
                className="w-full text-sm border rounded px-2.5 py-1.5 font-mono focus:outline-none focus:ring-2"
                style={{ borderColor: '#e2e8f0' }}
                placeholder="/api/v1/example"
              />
            </FieldGroup>
            <FieldGroup label="Content Type">
              <select
                value={(nodeData.config?.contentType as string) || 'application/json'}
                onChange={(e) => updateConfig('contentType', e.target.value)}
                className="w-full text-sm border rounded px-2.5 py-1.5 focus:outline-none focus:ring-2"
                style={{ borderColor: '#e2e8f0' }}
              >
                <option value="application/json">application/json</option>
                <option value="application/xml">application/xml</option>
                <option value="text/plain">text/plain</option>
                <option value="multipart/form-data">multipart/form-data</option>
              </select>
            </FieldGroup>
          </>
        )}

        {nodeData.type === 'timer' && (
          <>
            <FieldGroup label="Interval (ms)">
              <input
                type="number"
                value={(nodeData.config?.interval as number) || 5000}
                onChange={(e) => updateConfig('interval', parseInt(e.target.value))}
                className="w-full text-sm border rounded px-2.5 py-1.5 focus:outline-none focus:ring-2"
                style={{ borderColor: '#e2e8f0' }}
                min={100}
              />
            </FieldGroup>
          </>
        )}

        {nodeData.type === 'transform' && (
          <>
            <FieldGroup label="Language">
              <select
                value={(nodeData.config?.language as string) || 'simple'}
                onChange={(e) => updateConfig('language', e.target.value)}
                className="w-full text-sm border rounded px-2.5 py-1.5 focus:outline-none focus:ring-2"
                style={{ borderColor: '#e2e8f0' }}
              >
                <option value="simple">Simple</option>
                <option value="jsonpath">JSONPath</option>
                <option value="xpath">XPath</option>
                <option value="groovy">Groovy</option>
              </select>
            </FieldGroup>
            <FieldGroup label="Expression">
              <textarea
                value={(nodeData.config?.expression as string) || ''}
                onChange={(e) => updateConfig('expression', e.target.value)}
                className="w-full text-sm border rounded px-2.5 py-1.5 font-mono focus:outline-none focus:ring-2 resize-y"
                style={{ borderColor: '#e2e8f0' }}
                rows={3}
                placeholder="${body}"
              />
            </FieldGroup>
          </>
        )}

        {nodeData.type === 'filter' && (
          <>
            <FieldGroup label="Language">
              <select
                value={(nodeData.config?.language as string) || 'simple'}
                onChange={(e) => updateConfig('language', e.target.value)}
                className="w-full text-sm border rounded px-2.5 py-1.5 focus:outline-none focus:ring-2"
                style={{ borderColor: '#e2e8f0' }}
              >
                <option value="simple">Simple</option>
                <option value="jsonpath">JSONPath</option>
                <option value="header">Header</option>
              </select>
            </FieldGroup>
            <FieldGroup label="Condition">
              <textarea
                value={(nodeData.config?.condition as string) || ''}
                onChange={(e) => updateConfig('condition', e.target.value)}
                className="w-full text-sm border rounded px-2.5 py-1.5 font-mono focus:outline-none focus:ring-2 resize-y"
                style={{ borderColor: '#e2e8f0' }}
                rows={2}
                placeholder="${header.Content-Type} == 'application/json'"
              />
            </FieldGroup>
          </>
        )}

        {nodeData.type === 'rateLimit' && (
          <>
            <FieldGroup label="Max Requests">
              <input
                type="number"
                value={(nodeData.config?.maxRequests as number) || 100}
                onChange={(e) => updateConfig('maxRequests', parseInt(e.target.value))}
                className="w-full text-sm border rounded px-2.5 py-1.5 focus:outline-none focus:ring-2"
                style={{ borderColor: '#e2e8f0' }}
                min={1}
              />
            </FieldGroup>
            <FieldGroup label="Time Window (seconds)">
              <input
                type="number"
                value={(nodeData.config?.timeWindow as number) || 60}
                onChange={(e) => updateConfig('timeWindow', parseInt(e.target.value))}
                className="w-full text-sm border rounded px-2.5 py-1.5 focus:outline-none focus:ring-2"
                style={{ borderColor: '#e2e8f0' }}
                min={1}
              />
            </FieldGroup>
          </>
        )}

        {nodeData.type === 'loadBalancer' && (
          <FieldGroup label="Strategy">
            <select
              value={(nodeData.config?.strategy as string) || 'round-robin'}
              onChange={(e) => updateConfig('strategy', e.target.value)}
              className="w-full text-sm border rounded px-2.5 py-1.5 focus:outline-none focus:ring-2"
              style={{ borderColor: '#e2e8f0' }}
            >
              <option value="round-robin">Round Robin</option>
              <option value="random">Random</option>
              <option value="sticky">Sticky</option>
              <option value="weighted">Weighted</option>
            </select>
          </FieldGroup>
        )}

        {nodeData.type === 'httpProxy' && (
          <>
            <FieldGroup label="Target URL">
              <input
                type="text"
                value={(nodeData.config?.targetUrl as string) || ''}
                onChange={(e) => updateConfig('targetUrl', e.target.value)}
                className="w-full text-sm border rounded px-2.5 py-1.5 font-mono focus:outline-none focus:ring-2"
                style={{ borderColor: '#e2e8f0' }}
                placeholder="http://backend-service:8080"
              />
            </FieldGroup>
            <FieldGroup label="Timeout (ms)">
              <input
                type="number"
                value={(nodeData.config?.timeout as number) || 5000}
                onChange={(e) => updateConfig('timeout', parseInt(e.target.value))}
                className="w-full text-sm border rounded px-2.5 py-1.5 focus:outline-none focus:ring-2"
                style={{ borderColor: '#e2e8f0' }}
                min={100}
              />
            </FieldGroup>
            <FieldGroup label="Retries">
              <input
                type="number"
                value={(nodeData.config?.retries as number) || 0}
                onChange={(e) => updateConfig('retries', parseInt(e.target.value))}
                className="w-full text-sm border rounded px-2.5 py-1.5 focus:outline-none focus:ring-2"
                style={{ borderColor: '#e2e8f0' }}
                min={0}
                max={10}
              />
            </FieldGroup>
          </>
        )}

        {nodeData.type === 'response' && (
          <>
            <FieldGroup label="Status Code">
              <input
                type="number"
                value={(nodeData.config?.statusCode as number) || 200}
                onChange={(e) => updateConfig('statusCode', parseInt(e.target.value))}
                className="w-full text-sm border rounded px-2.5 py-1.5 focus:outline-none focus:ring-2"
                style={{ borderColor: '#e2e8f0' }}
                min={100}
                max={599}
              />
            </FieldGroup>
            <FieldGroup label="Body">
              <textarea
                value={(nodeData.config?.body as string) || ''}
                onChange={(e) => updateConfig('body', e.target.value)}
                className="w-full text-sm border rounded px-2.5 py-1.5 font-mono focus:outline-none focus:ring-2 resize-y"
                style={{ borderColor: '#e2e8f0' }}
                rows={4}
                placeholder='{"message": "OK"}'
              />
            </FieldGroup>
          </>
        )}

        {nodeData.type === 'logger' && (
          <>
            <FieldGroup label="Log Level">
              <select
                value={(nodeData.config?.level as string) || 'INFO'}
                onChange={(e) => updateConfig('level', e.target.value)}
                className="w-full text-sm border rounded px-2.5 py-1.5 focus:outline-none focus:ring-2"
                style={{ borderColor: '#e2e8f0' }}
              >
                {['DEBUG', 'INFO', 'WARN', 'ERROR'].map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </FieldGroup>
            <FieldGroup label="Message Pattern">
              <input
                type="text"
                value={(nodeData.config?.message as string) || ''}
                onChange={(e) => updateConfig('message', e.target.value)}
                className="w-full text-sm border rounded px-2.5 py-1.5 font-mono focus:outline-none focus:ring-2"
                style={{ borderColor: '#e2e8f0' }}
                placeholder="${body}"
              />
            </FieldGroup>
          </>
        )}

        {nodeData.type === 'contentRouter' && (
          <FieldGroup label="Routing Expression">
            <textarea
              value={(nodeData.config?.expression as string) || ''}
              onChange={(e) => updateConfig('expression', e.target.value)}
              className="w-full text-sm border rounded px-2.5 py-1.5 font-mono focus:outline-none focus:ring-2 resize-y"
              style={{ borderColor: '#e2e8f0' }}
              rows={3}
              placeholder="${header.X-Route-To}"
            />
          </FieldGroup>
        )}

        {/* Node ID (read-only) */}
        <FieldGroup label="Node ID">
          <div className="text-[11px] font-mono px-2.5 py-1.5 rounded" style={{ backgroundColor: '#f9fafb', color: '#9ca3af' }}>
            {selectedNode.id}
          </div>
        </FieldGroup>
      </div>
    </div>
  );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold mb-1" style={{ color: '#6b7280' }}>
        {label}
      </label>
      {children}
    </div>
  );
}
