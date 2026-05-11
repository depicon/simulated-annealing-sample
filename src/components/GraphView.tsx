import type { Node, Edge } from '../hooks/useSimulatedAnnealing';

interface Props { nodes: Node[]; edges: Edge[]; }

export default function GraphView({ nodes, edges }: Props) {
  const getNode = (id: string) => nodes.find(n => n.id === id);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative" style={{ height: '500px' }}>
      <svg width="100%" height="100%" viewBox="0 0 500 500" className="w-full h-full absolute inset-0">
        {edges.map((edge, i) => {
          const source = getNode(edge.source);
          const target = getNode(edge.target);
          if (!source || !target) return null;
          const isConflict = source.color === target.color;

          return (
            <line key={`edge-${i}`}
              x1={source.x} y1={source.y} x2={target.x} y2={target.y}
              stroke={isConflict ? "#ef4444" : "#cbd5e1"}
              strokeWidth={isConflict ? 4 : 2} strokeDasharray={isConflict ? "5,5" : "none"}
              className="transition-all duration-300"
            />
          );
        })}

        {nodes.map(node => (
          <g key={node.id} className="transition-all duration-300 transform" style={{ transform: `translate(${node.x}px, ${node.y}px)` }}>
            <circle r="20" fill={node.color} stroke="#1e293b" strokeWidth="3" className="transition-colors duration-300" />
            <text textAnchor="middle" dy=".3em" fill="white" fontWeight="bold" className="select-none pointer-events-none">
              {node.id}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}