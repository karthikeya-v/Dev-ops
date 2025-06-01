import React, { useState, useEffect } from 'react';
import ReactFlow, { Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import { getWorkItems } from '../api/workItemApi';
import { WorkItem } from '../types/WorkItem';

interface NodeData {
  label: string;
  status: string;
}

const DependencyFlowView: React.FC = () => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const items = await getWorkItems();
        const nodeMap = new Map<string, any>();
        
        // Create nodes
        const newNodes = items.map((item, index) => ({
          id: item.id,
          data: { label: `${item.title}\n(${item.status})` },
          position: { x: index * 200, y: 0 },
          style: {
            border: '1px solid #ccc',
            padding: 10,
            borderRadius: 5,
            backgroundColor: '#fff',
          },
        }));

        // Create edges based on dependencies
        const newEdges = items.flatMap(item => 
          item.dependencies.map(depId => ({
            id: `e${item.id}-${depId}`,
            source: depId,
            target: item.id,
            animated: true,
          }))
        );

        setNodes(newNodes);
        setEdges(newEdges);
      } catch (err) {
        setError('Failed to load dependencies');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-4">Loading dependencies...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="h-[600px] bg-white rounded-lg shadow-md p-4">
      <ReactFlow 
        nodes={nodes}
        edges={edges}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default DependencyFlowView;
