import { useState, useCallback } from 'react';

export type Node = { id: string; x: number; y: number; color: string };
export type Edge = { source: string; target: string };
export type StepLog = {
  nodeId: string; oldColor: string; newColor: string;
  oldEnergy: number; newEnergy: number; deltaE: number;
  prob: number | null; accepted: boolean;
};

export function useSimulatedAnnealing() {

  // États dynamiques
  const [colors, setColors] = useState<string[]>(['#ef4444', '#3b82f6']); // Rouge, Bleu au départ
  const [nodes, setNodes] = useState<Node[]>([
    { id: 'A', x: 250, y: 50,  color: '#ef4444' },
    { id: 'B', x: 400, y: 150, color: '#ef4444' },
    { id: 'C', x: 400, y: 350, color: '#ef4444' },
    { id: 'D', x: 250, y: 450, color: '#ef4444' },
    { id: 'E', x: 100, y: 350, color: '#ef4444' },
    { id: 'F', x: 100, y: 150, color: '#ef4444' },
    { id: 'G', x: 250, y: 250, color: '#ef4444' }, 
    { id: 'H', x: 290, y: 140, color: '#ef4444' },
  ]);
  const [edges, setEdges] = useState<Edge[]>([
    { source: 'A', target: 'B' }, { source: 'B', target: 'C' },
    { source: 'C', target: 'D' }, { source: 'D', target: 'E' },
    { source: 'E', target: 'F' }, { source: 'F', target: 'A' },
    { source: 'G', target: 'A' }, { source: 'G', target: 'C' },
    { source: 'G', target: 'E' }, { source: 'H', target: 'B' },
    { source: 'H', target: 'G' }, { source: 'F', target: 'D' },
  ]);

  const [lastLog, setLastLog] = useState<StepLog | null>(null);

  // Paramètres algorithmiques
  const [temperature, setTemperature] = useState(10); // température initiale
  const coolingRate = 0.90; // paramètre de refroidissement

  // Fonction de calcul de l'énergie (nombre de conflits)
  const calculateEnergy = (currentNodes: Node[], currentEdges: Edge[]) => {
    let conflicts = 0;
    currentEdges.forEach(edge => {
      const source = currentNodes.find(n => n.id === edge.source);
      const target = currentNodes.find(n => n.id === edge.target);
      if (source && target && source.color === target.color) conflicts++;
    });
    return conflicts;
  };
  const energy = calculateEnergy(nodes, edges);

  const nextStep = useCallback(() => {
    if (temperature < 0.1 || nodes.length === 0 || colors.length < 2) return;

    const newNodes = [...nodes];
    const targetIndex = Math.floor(Math.random() * newNodes.length);
    const targetNode = newNodes[targetIndex];
    
    const oldColor = targetNode.color;
    const availableColors = colors.filter(c => c !== oldColor);
    const newColor = availableColors.length > 0 
      ? availableColors[Math.floor(Math.random() * availableColors.length)]
      : oldColor; // Sécurité s'il n'y a qu'une couleur

    targetNode.color = newColor;

    const newEnergy = calculateEnergy(newNodes, edges);
    const deltaE = newEnergy - energy;

    let accepted = false;
    let prob = null;

    if (deltaE <= 0) {
      accepted = true;
    } else {
      prob = Math.exp(-deltaE / temperature);
      if (Math.random() < prob) accepted = true;
    }

    // Enregistrement des mathématiques pour l'interface
    setLastLog({
      nodeId: targetNode.id, oldColor, newColor,
      oldEnergy: energy, newEnergy, deltaE, prob, accepted
    });

    if (accepted) setNodes(newNodes);
    setTemperature(prev => prev * coolingRate);
  }, [nodes, edges, temperature, energy, colors]);

  // --- Méthodes d'ajout dynamique ---
  // const addNode = () => {
  //   const id = String.fromCharCode(65 + nodes.length);
  //   const color = colors[Math.floor(Math.random() * colors.length)];
  //   setNodes([...nodes, { id, x: Math.random() * 400 + 50, y: Math.random() * 400 + 50, color }]);
  // };

  // const addEdge = (source: string, target: string) => {
  //   if (source !== target && !edges.find(e => (e.source === source && e.target === target) || (e.source === target && e.target === source))) {
  //     setEdges([...edges, { source, target }]);
  //   }
  // };

  const addColor = (hex: string) => {
    if (!colors.includes(hex)) setColors([...colors, hex]);
  };

  const reset = () => {
  setTemperature(10); 
  setLastLog(null);   
  
  setNodes(prevNodes => prevNodes.map(node => ({
    ...node,
    color: colors[0]
  })));
};

  return { nodes, edges, colors, temperature, energy, lastLog, nextStep, addColor, reset };
}