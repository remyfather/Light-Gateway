'use client';

import React, { useState, useCallback, useRef, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  type Connection,
  type Edge,
  type Node,
  type NodeTypes,
  type ReactFlowInstance,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import WorkflowNode from './nodes/WorkflowNode';
import NodePalette from './NodePalette';
import PropertiesPanel from './PropertiesPanel';
import { NODE_CONFIGS } from './nodes/nodeTypes';

interface WorkflowMeta {
  name: string;
  description: string;
}

const INITIAL_NODES: Node[] = [
  {
    id: 'source-1',
    type: 'workflowNode',
    position: { x: 100, y: 200 },
    data: {
      type: 'httpSource',
      label: 'HTTP Source',
      config: { path: '/api/v1/users', method: 'GET', contentType: 'application/json' },
    },
  },
  {
    id: 'filter-1',
    type: 'workflowNode',
    position: { x: 380, y: 120 },
    data: {
      type: 'rateLimit',
      label: 'Rate Limit',
      config: { maxRequests: 1000, timeWindow: 60, unit: 'seconds' },
    },
  },
  {
    id: 'transform-1',
    type: 'workflowNode',
    position: { x: 380, y: 280 },
    data: {
      type: 'transform',
      label: 'Transform',
      config: { expression: '${body}', language: 'simple' },
    },
  },
  {
    id: 'proxy-1',
    type: 'workflowNode',
    position: { x: 660, y: 200 },
    data: {
      type: 'httpProxy',
      label: 'User Service',
      config: { targetUrl: 'http://user-service:8080/users', timeout: 5000, retries: 1 },
    },
  },
];

const INITIAL_EDGES: Edge[] = [
  {
    id: 'e-source1-filter1',
    source: 'source-1',
    target: 'filter-1',
    animated: true,
    style: { stroke: '#00ed64', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#00ed64' },
  },
  {
    id: 'e-source1-transform1',
    source: 'source-1',
    target: 'transform-1',
    animated: true,
    style: { stroke: '#00ed64', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#00ed64' },
  },
  {
    id: 'e-filter1-proxy1',
    source: 'filter-1',
    target: 'proxy-1',
    animated: true,
    style: { stroke: '#00ed64', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#00ed64' },
  },
  {
    id: 'e-transform1-proxy1',
    source: 'transform-1',
    target: 'proxy-1',
    animated: true,
    style: { stroke: '#00ed64', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#00ed64' },
  },
];

let nodeIdCounter = 10;

export default function WorkflowBuilder() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [workflowMeta, setWorkflowMeta] = useState<WorkflowMeta>({
    name: 'User API Pipeline',
    description: 'Routes user API requests through rate limiting and transformation',
  });
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const nodeTypes: NodeTypes = useMemo(() => ({
    workflowNode: WorkflowNode,
  }), []);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: { stroke: '#00ed64', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#00ed64' },
          },
          eds,
        ),
      );
    },
    [setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type || !reactFlowInstance || !reactFlowWrapper.current) return;

      const nodeConfig = NODE_CONFIGS[type];
      if (!nodeConfig) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const newNode: Node = {
        id: `node-${++nodeIdCounter}`,
        type: 'workflowNode',
        position,
        data: {
          type,
          label: nodeConfig.label,
          config: { ...nodeConfig.defaultData },
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [reactFlowInstance, setNodes],
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const onUpdateNode = useCallback(
    (nodeId: string, data: Record<string, unknown>) => {
      setNodes((nds) =>
        nds.map((n) => (n.id === nodeId ? { ...n, data } : n)),
      );
      setSelectedNode((prev) => (prev?.id === nodeId ? { ...prev, data } : prev));
    },
    [setNodes],
  );

  const onDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
      setSelectedNode(null);
    },
    [setNodes, setEdges],
  );

  const handleSave = useCallback(() => {
    const workflow = {
      meta: workflowMeta,
      nodes: nodes.map((n) => ({
        id: n.id,
        type: (n.data as { type: string }).type,
        label: (n.data as { label: string }).label,
        config: (n.data as { config: Record<string, unknown> }).config,
        position: n.position,
      })),
      edges: edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
      })),
    };
    const json = JSON.stringify(workflow, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflowMeta.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setSavedMessage('Workflow exported!');
    setTimeout(() => setSavedMessage(null), 2000);
  }, [nodes, edges, workflowMeta]);

  const handleClear = useCallback(() => {
    if (confirm('Clear all nodes and edges?')) {
      setNodes([]);
      setEdges([]);
      setSelectedNode(null);
    }
  }, [setNodes, setEdges]);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-4 py-2 bg-white border-b"
        style={{ borderColor: '#e2e8f0' }}
      >
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={workflowMeta.name}
            onChange={(e) => setWorkflowMeta((m) => ({ ...m, name: e.target.value }))}
            className="text-sm font-semibold border-0 bg-transparent focus:outline-none focus:ring-0 p-0"
            style={{ color: '#001e2b' }}
          />
          <span className="text-[11px] px-2 py-0.5 rounded" style={{ backgroundColor: '#f0fdf4', color: '#00ed64' }}>
            {nodes.length} nodes
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded" style={{ backgroundColor: '#f0fdf4', color: '#00ed64' }}>
            {edges.length} connections
          </span>
        </div>
        <div className="flex items-center gap-2">
          {savedMessage && (
            <span className="text-xs font-medium" style={{ color: '#00ed64' }}>
              {savedMessage}
            </span>
          )}
          <button
            onClick={handleClear}
            className="px-3 py-1.5 text-xs font-medium border rounded hover:bg-gray-50"
            style={{ borderColor: '#e2e8f0', color: '#6b7280' }}
          >
            Clear
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 text-xs font-semibold text-white rounded"
            style={{ backgroundColor: '#00ed64' }}
          >
            Export JSON
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Node Palette */}
        <NodePalette />

        {/* Center: Canvas */}
        <div className="flex-1" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            snapToGrid
            snapGrid={[20, 20]}
            defaultEdgeOptions={{
              animated: true,
              style: { stroke: '#00ed64', strokeWidth: 2 },
              markerEnd: { type: MarkerType.ArrowClosed, color: '#00ed64' },
            }}
            proOptions={{ hideAttribution: true }}
          >
            <Controls
              position="bottom-left"
              style={{ display: 'flex', flexDirection: 'row' }}
            />
            <MiniMap
              position="bottom-right"
              nodeColor={(node) => {
                const nd = node.data as { type: string };
                return NODE_CONFIGS[nd.type]?.color || '#6b7280';
              }}
              maskColor="rgba(0,0,0,0.08)"
              style={{ border: '1px solid #e2e8f0' }}
            />
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#d1d5db" />
          </ReactFlow>
        </div>

        {/* Right: Properties Panel */}
        <PropertiesPanel
          selectedNode={selectedNode}
          onUpdateNode={onUpdateNode}
          onDeleteNode={onDeleteNode}
        />
      </div>
    </div>
  );
}
