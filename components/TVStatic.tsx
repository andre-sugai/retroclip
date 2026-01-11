
import React, { useEffect, useRef } from 'react';

interface TVStaticProps {
  active: boolean;
  enableAudio?: boolean; // Control when audio can play
}

export const TVStatic: React.FC<TVStaticProps> = ({ active, enableAudio = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const requestRef = useRef<number>();

  // Audio Logic
  useEffect(() => {
    if (active && enableAudio) {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      const bufferSize = ctx.sampleRate * 2; // 2 seconds buffer
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate White Noise
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      const gainNode = ctx.createGain();
      // Volume level for hiss
      gainNode.gain.value = 0.05; 
      
      noiseSource.connect(gainNode);
      gainNode.connect(ctx.destination);

      noiseSource.start();
      
      sourceNodeRef.current = noiseSource;
      gainNodeRef.current = gainNode;

      // Fade in quickly
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.1);

    } else {
      // Cleanup Audio
      if (gainNodeRef.current && audioContextRef.current) {
         // Fade out
         const ctx = audioContextRef.current;
         gainNodeRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
         setTimeout(() => {
             sourceNodeRef.current?.stop();
             sourceNodeRef.current?.disconnect();
             sourceNodeRef.current = null;
         }, 200);
      }
    }

    return () => {
        if (sourceNodeRef.current) {
            sourceNodeRef.current.stop();
            sourceNodeRef.current.disconnect(); 
        }
    };
  }, [active, enableAudio]);


  // Visual Logic (Canvas)
  useEffect(() => {
    if (!active || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.width = window.innerWidth / 2; // Low res for performance & retro feel
    let h = canvas.height = window.innerHeight / 2;

    const resize = () => {
        w = canvas.width = window.innerWidth / 2;
        h = canvas.height = window.innerHeight / 2;
    };
    window.addEventListener('resize', resize);

    const animate = () => {
        const idata = ctx.createImageData(w, h);
        const buffer32 = new Uint32Array(idata.data.buffer);
        const len = buffer32.length;
        
        for (let i = 0; i < len; i++) {
            if (Math.random() < 0.5) {
                // Approximate gray noise
                buffer32[i] = 0xff000000; // Black
            } else {
                buffer32[i] = 0xffffffff; // White
            }
        }
        
        ctx.putImageData(idata, 0, 0);
        requestRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
        window.removeEventListener('resize', resize);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div className="absolute inset-0 z-40 pointer-events-none bg-black">
        <canvas 
            ref={canvasRef} 
            className="w-full h-full object-cover opacity-100"
        />
    </div>
  );
};
