import { useEffect, useRef, useState } from 'react';
import { Sliders, Play } from 'lucide-react';

const VirtualLab = () => {
  const [activeTab, setActiveTab] = useState('wave');

  // Wave Simulation States
  const [freq, setFreq] = useState(2.0);
  const [amp, setAmp] = useState(40);
  const [isHarmonic, setIsHarmonic] = useState(false);
  const waveCanvasRef = useRef(null);

  // Projectile States
  const [velocity, setVelocity] = useState(25);
  const [angle, setAngle] = useState(45);
  const [projectileStats, setProjectileStats] = useState('Range: -- m | Max Height: -- m');
  const projCanvasRef = useRef(null);
  const animRef = useRef(null);

  // 1. Wave Animation Loop
  useEffect(() => {
    if (activeTab !== 'wave') return;
    const canvas = waveCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let waveTime = 0;
    let animationId;

    const renderWave = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
      const w = canvas.width;
      const h = canvas.height;
      const centerY = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Axis Line
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(71, 85, 105, 0.45)';
      ctx.setLineDash([4, 4]);
      ctx.moveTo(0, centerY);
      ctx.lineTo(w, centerY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Glowing Sine Wave
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#38bdf8';
      ctx.shadowColor = 'rgba(56, 189, 248, 0.6)';
      ctx.shadowBlur = 12;

      const wavelength = 240 / freq;
      const k = (2 * Math.PI) / wavelength;
      const omega = freq * 2.2;

      for (let x = 0; x < w; x += 2) {
        let y = centerY + Math.sin(k * x - waveTime * omega) * amp;
        if (isHarmonic) {
          y += Math.sin(2 * (k * x - waveTime * omega)) * (amp * 0.35);
        }
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Particle Nodes
      for (let i = 1; i < 8; i++) {
        const x = (w / 8) * i;
        let y = centerY + Math.sin(k * x - waveTime * omega) * amp;
        if (isHarmonic) {
          y += Math.sin(2 * (k * x - waveTime * omega)) * (amp * 0.35);
        }
        ctx.beginPath();
        ctx.arc(x, y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = '#818cf8';
        ctx.shadowColor = '#818cf8';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      waveTime += 0.035;
      animationId = requestAnimationFrame(renderWave);
    };

    renderWave();
    return () => cancelAnimationFrame(animationId);
  }, [activeTab, freq, amp, isHarmonic]);

  // 2. Projectile Static Curve Update
  const drawTrajectory = () => {
    const canvas = projCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const theta = (angle * Math.PI) / 180;
    const g = 9.81;
    const totalTime = (2 * velocity * Math.sin(theta)) / g;
    const range = (velocity * velocity * Math.sin(2 * theta)) / g;
    const maxHeight = (velocity * velocity * Math.sin(theta) * Math.sin(theta)) / (2 * g);

    setProjectileStats(
      `Range: ${range.toFixed(1)} m | Max Height: ${maxHeight.toFixed(1)} m | Flight: ${totalTime.toFixed(1)} s`
    );

    const margin = 40;
    const scaleX = (w - margin * 2) / Math.max(range * 1.15, 60);
    const scaleY = (h - margin * 2) / Math.max(maxHeight * 1.3, 30);
    const originX = margin;
    const originY = h - margin;

    // Ground
    ctx.beginPath();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.moveTo(0, originY);
    ctx.lineTo(w, originY);
    ctx.stroke();

    // Trajectory dashed curve
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.65)';
    ctx.lineWidth = 2;

    for (let i = 0; i <= 60; i++) {
      const t = (totalTime / 60) * i;
      const x = velocity * Math.cos(theta) * t;
      const y = velocity * Math.sin(theta) * t - 0.5 * g * t * t;
      const sx = originX + x * scaleX;
      const sy = originY - y * scaleY;
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  };

  useEffect(() => {
    if (activeTab === 'projectile') {
      drawTrajectory();
    }
  }, [activeTab, velocity, angle]);

  // Fire Projectile Action
  const handleFire = () => {
    const canvas = projCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    const theta = (angle * Math.PI) / 180;
    const g = 9.81;
    const totalTime = (2 * velocity * Math.sin(theta)) / g;
    const range = (velocity * velocity * Math.sin(2 * theta)) / g;
    const maxHeight = (velocity * velocity * Math.sin(theta) * Math.sin(theta)) / (2 * g);

    const margin = 40;
    const scaleX = (w - margin * 2) / Math.max(range * 1.15, 60);
    const scaleY = (h - margin * 2) / Math.max(maxHeight * 1.3, 30);
    const originX = margin;
    const originY = h - margin;

    let startTime = null;
    if (animRef.current) cancelAnimationFrame(animRef.current);

    const runAnim = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = ((timestamp - startTime) / 1000) * 1.2;

      drawTrajectory();

      if (elapsed <= totalTime) {
        const x = velocity * Math.cos(theta) * elapsed;
        const y = velocity * Math.sin(theta) * elapsed - 0.5 * g * elapsed * elapsed;
        const sx = originX + x * scaleX;
        const sy = originY - Math.max(0, y) * scaleY;

        ctx.beginPath();
        ctx.arc(sx, sy, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#06b6d4';
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.shadowBlur = 0;

        animRef.current = requestAnimationFrame(runAnim);
      } else {
        const finalX = originX + range * scaleX;
        ctx.beginPath();
        ctx.arc(finalX, originY, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#06b6d4';
        ctx.fill();
      }
    };
    animRef.current = requestAnimationFrame(runAnim);
  };

  return (
    <section id="simulator" className="py-14 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-widest">Interactive Lab Station</span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Real-Time Physics Simulations</h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Experiment with physical parameters. Toggle between Wave Superposition and Projectile Kinematics.
          </p>
        </div>

        <div className="flex rounded-lg bg-slate-900/90 backdrop-blur p-1 border border-slate-700 w-fit font-mono text-xs shadow-sm">
          <button
            onClick={() => setActiveTab('wave')}
            className={`px-4 py-1.5 rounded-md font-semibold transition ${
              activeTab === 'wave' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Wave Dynamics
          </button>
          <button
            onClick={() => setActiveTab('projectile')}
            className={`px-4 py-1.5 rounded-md font-semibold transition ${
              activeTab === 'projectile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Projectile Motion
          </button>
        </div>
      </div>

      <div className="blueprint-card rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-xl">
        {activeTab === 'wave' ? (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-mono text-slate-300">
                  <span>Frequency (f)</span>
                  <span className="text-cyan-400 font-bold">{freq.toFixed(1)} Hz</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="5.0"
                  step="0.1"
                  value={freq}
                  onChange={(e) => setFreq(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-mono text-slate-300">
                  <span>Amplitude (A)</span>
                  <span className="text-cyan-400 font-bold">{amp} px</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="70"
                  step="1"
                  value={amp}
                  onChange={(e) => setAmp(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setIsHarmonic(!isHarmonic)}
                  className={`w-full py-2 px-3 rounded-lg border text-xs font-mono transition flex items-center justify-center gap-2 ${
                    isHarmonic
                      ? 'border-indigo-500 bg-indigo-950/60 text-cyan-300'
                      : 'border-slate-700 bg-slate-800 text-slate-300'
                  }`}
                >
                  <Sliders size={14} className="text-cyan-400" />
                  <span>Superposition: {isHarmonic ? 'ACTIVE' : 'OFF'}</span>
                </button>
              </div>
            </div>

            <div className="relative w-full h-64 sm:h-72 bg-[#090e1f] rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
              <canvas ref={waveCanvasRef} className="w-full h-full"></canvas>
              <div className="absolute top-3 left-4 bg-slate-900/90 backdrop-blur px-3 py-1 rounded border border-slate-700 font-mono text-xs text-cyan-400 font-semibold">
                y = A · sin(kx - ωt)
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-mono text-slate-300">
                  <span>Initial Velocity (u)</span>
                  <span className="text-cyan-400 font-bold">{velocity} m/s</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="45"
                  step="1"
                  value={velocity}
                  onChange={(e) => setVelocity(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-mono text-slate-300">
                  <span>Launch Angle (θ)</span>
                  <span className="text-cyan-400 font-bold">{angle}°</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="80"
                  step="1"
                  value={angle}
                  onChange={(e) => setAngle(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleFire}
                  className="w-full py-2.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
                >
                  <Play size={14} />
                  <span>Launch Trajectory</span>
                </button>
              </div>
            </div>

            <div className="relative w-full h-64 sm:h-72 bg-[#090e1f] rounded-xl border border-slate-800 overflow-hidden">
              <canvas ref={projCanvasRef} className="w-full h-full"></canvas>
              <div className="absolute top-3 left-4 bg-slate-900/90 backdrop-blur px-3 py-1 rounded border border-slate-700 font-mono text-xs text-cyan-400 font-semibold">
                R = (u² · sin 2θ) / g
              </div>
              <div className="absolute bottom-3 right-4 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded border border-slate-700 font-mono text-[11px] text-slate-300">
                {projectileStats}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default VirtualLab;