import { useState, useEffect } from 'react'; // Ajout de useEffect
import { useSimulatedAnnealing } from './hooks/useSimulatedAnnealing';
import GraphView from './components/GraphView';

export default function App() {
  const { 
    nodes, edges, colors, temperature, energy, 
    lastLog, nextStep, addColor, reset 
  } = useSimulatedAnnealing();
  
  const [autoPlay, setAutoPlay] = useState(false); 
  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [newColor, setNewColor] = useState('#22c55e');

  useEffect(() => {
    let interval: number | undefined;

    if (autoPlay && temperature >= 0.1) {
      interval = window.setInterval(() => {
        nextStep();
      }, 100); 
    } else {
      setAutoPlay(false); 
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [autoPlay, temperature, nextStep]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* EN-TÊTE */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap gap-4 justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Recuit Simulé</h1>
            <p className="text-slate-500 text-sm">Problème d'Emploi du Temps</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-orange-50 px-4 py-2 rounded-lg border border-orange-100 min-w-[120px]">
              <span className="block text-xs text-orange-600 font-bold uppercase">Température</span>
              <span className="text-xl font-mono font-bold text-orange-700">{temperature.toFixed(3)}</span>
            </div>
            <div className="bg-red-50 px-4 py-2 rounded-lg border border-red-100 min-w-[120px]">
              <span className="block text-xs text-red-600 font-bold uppercase">Conflits</span>
              <span className="text-xl font-mono font-bold text-red-700">{energy}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            <GraphView nodes={nodes} edges={edges} />
            
            {/* PANNEAU */}
            <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl shadow-lg border border-slate-800 font-mono text-sm">
               {/* ... (contenu du log précédent) */}
               <h2 className="text-slate-400 font-sans font-bold uppercase text-xs mb-3">Console de calcul</h2>
               {lastLog ? `MUTATION: ${lastLog.nodeId} | ΔE: ${lastLog.deltaE} | ACCEPTE: ${lastLog.accepted}` : "En attente..."}
            </div>
          </div>

          {/* CONTRÔLES */}
          <div className="space-y-6">
            
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-3">
              <h2 className="font-bold text-slate-800 mb-2">Exécution</h2>
              
              <button 
                onClick={nextStep} 
                disabled={temperature < 0.1 || autoPlay}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all active:scale-95"
              >
                Étape Suivante ➔
              </button>

              <button 
                onClick={() => setAutoPlay(!autoPlay)}
                disabled={temperature < 0.1}
                className={`w-full font-bold py-3 px-4 rounded-xl shadow-md transition-all ${
                  autoPlay 
                  ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                  : 'bg-slate-800 hover:bg-slate-900 text-white'
                }`}
              >
                {autoPlay ? 'Arrêter Pause ⏸' : 'Lancer Simulation ▶'}
              </button>

              <button 
                onClick={() => { setAutoPlay(false); reset(); }}
                className="w-full bg-white border-2 border-slate-200 text-slate-500 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Réinitialiser ↺
              </button>
            </div>
            
            {/* Édition des Couleurs */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="font-bold text-slate-800 mb-3">Couleurs Disponibles ({colors.length})</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {colors.map(c => (
                  <div key={c} className="w-8 h-8 rounded-full shadow-inner border-2 border-slate-100" style={{ backgroundColor: c }}></div>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="color" value={newColor} onChange={e => setNewColor(e.target.value)} className="h-10 w-14 rounded cursor-pointer" />
                <button onClick={() => addColor(newColor)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-sm font-bold rounded-lg transition">Ajouter Couleur</button>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}