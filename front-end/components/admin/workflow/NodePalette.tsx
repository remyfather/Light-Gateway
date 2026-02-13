'use client';

import React from 'react';
import { NODE_CONFIGS, CATEGORY_LABELS } from './nodes/nodeTypes';

export default function NodePalette() {
  const grouped = Object.entries(NODE_CONFIGS).reduce(
    (acc, [key, config]) => {
      if (!acc[config.category]) acc[config.category] = [];
      acc[config.category].push({ key, ...config });
      return acc;
    },
    {} as Record<string, Array<typeof NODE_CONFIGS[string] & { key: string }>>
  );

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-56 bg-white border-r flex flex-col h-full" style={{ borderColor: '#e2e8f0' }}>
      <div className="p-3 border-b" style={{ borderColor: '#e2e8f0' }}>
        <h3 className="text-sm font-semibold" style={{ color: '#001e2b' }}>
          Node Palette
        </h3>
        <p className="text-[11px] mt-0.5" style={{ color: '#6b7280' }}>
          Drag nodes to the canvas
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {(['source', 'processing', 'routing', 'destination'] as const).map((category) => (
          <div key={category}>
            <div
              className="text-[10px] font-bold uppercase tracking-wider mb-2"
              style={{ color: '#6b7280' }}
            >
              {CATEGORY_LABELS[category]}
            </div>
            <div className="space-y-1.5">
              {(grouped[category] || []).map((node) => (
                <div
                  key={node.key}
                  className="flex items-center gap-2 p-2 rounded border cursor-grab hover:shadow-sm transition-shadow active:cursor-grabbing"
                  style={{ borderColor: '#e2e8f0' }}
                  draggable
                  onDragStart={(e) => onDragStart(e, node.key)}
                >
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: node.color }}
                  >
                    <svg
                      className="w-3.5 h-3.5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={node.icon}
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium truncate" style={{ color: '#001e2b' }}>
                      {node.label}
                    </div>
                    <div className="text-[10px] truncate" style={{ color: '#9ca3af' }}>
                      {node.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
