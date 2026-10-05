import React, { useRef, useEffect } from 'react';
import { flushSync } from 'react-dom';
import './ThemeRope.css';

interface ThemeRopeProps {
  isDarkTheme: boolean;
  toggleTheme: () => void;
}

export const ThemeRope: React.FC<ThemeRopeProps> = ({ isDarkTheme, toggleTheme }) => {
  const isTransitioning = useRef(false);
  
  // DOM Refs for direct manipulation (bypass React state for 60fps physics)
  const ropeContainerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  
  // Physics State
  const physics = useRef({
    currentY: 0,
    targetY: 0,
    velocityY: 0,
    swayAngle: 0,
    swayVelocity: 0,
    isDragging: false,
    hasActivated: false,
    startY: 0
  });

  const frameId = useRef<number>(0);

  // Physics Loop
  useEffect(() => {
    const loop = () => {
      const p = physics.current;
      
      // Vertical Spring Physics
      // Stiffness determines how closely currentY follows targetY.
      // Damping determines how much it bounces when released.
      const forceY = (p.targetY - p.currentY) * 0.25; 
      p.velocityY = (p.velocityY + forceY) * 0.65; 
      p.currentY += p.velocityY;
      
      // Sway (Pendulum) Physics
      if (!p.isDragging) {
        // Gravity pulls angle back to 0
        p.swayVelocity -= p.swayAngle * 0.15; 
        p.swayVelocity *= 0.90; // Air resistance/damping
        p.swayAngle += p.swayVelocity;
      } else {
        // Dampen sway heavily while being held
        p.swayAngle *= 0.7; 
      }

      // Render to DOM
      if (ropeContainerRef.current && lineRef.current) {
        lineRef.current.style.height = `${Math.max(4, 40 + p.currentY)}px`;
        ropeContainerRef.current.style.transform = `rotate(${p.swayAngle}deg)`;
      }

      frameId.current = requestAnimationFrame(loop);
    };

    frameId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId.current);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isTransitioning.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    
    physics.current.isDragging = true;
    physics.current.hasActivated = false;
    
    // We base startY on the *raw pointer*, offsetting by the current target
    // so if they grab it while it's bouncing, it doesn't snap.
    physics.current.startY = e.clientY - physics.current.targetY;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const p = physics.current;
    if (!p.isDragging || p.hasActivated) return;
    
    const rawY = Math.max(0, e.clientY - p.startY);
    
    // Variable Pull Resistance (makes it feel like a mechanical switch)
    let pull = rawY;
    if (rawY > 20) {
      pull = 20 + (rawY - 20) * 0.5; // Starts getting heavier
    }
    if (rawY > 40) {
      pull = 20 + (20 * 0.5) + (rawY - 40) * 0.15; // Very heavy near threshold
    }
    
    p.targetY = pull;

    // Activation Threshold
    if (pull > 38 && !p.hasActivated) { 
      activateSwitch(e.clientX, e.clientY);
    }
  };

  const handlePointerUp = () => {
    const p = physics.current;
    if (p.isDragging) {
      p.isDragging = false;
      p.targetY = 0; // Spring back to 0
    }
  };

  const activateSwitch = (x: number, y: number) => {
    const p = physics.current;
    p.hasActivated = true;
    p.isDragging = false;
    
    // Mechanical Snap & Recoil Simulation
    // 1. Instantly force the rope down a bit more (the "catch")
    p.currentY += 8; 
    // 2. Apply a violent upward velocity (the "snap/recoil")
    p.velocityY = -18; 
    // 3. Reset target to 0
    p.targetY = 0;
    // 4. Introduce a side-to-side sway kick from the recoil
    p.swayVelocity = (Math.random() > 0.5 ? 1 : -1) * 12; 

    // Haptic mechanical tick (if supported on mobile)
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }

    triggerThemeSwitch(x, y);
  };

  const triggerThemeSwitch = (x: number, y: number) => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!document.startViewTransition || prefersReducedMotion) {
      toggleTheme();
      isTransitioning.current = false;
      return;
    }
    
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );
    
    const transition = document.startViewTransition(() => {
      document.body.classList.add('theme-transitioning');
      flushSync(() => {
        toggleTheme();
      });
    });
    
    transition.finished.then(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.body.classList.remove('theme-transitioning');
          isTransitioning.current = false;
          document.documentElement.style.removeProperty('--origin-x');
          document.documentElement.style.removeProperty('--origin-y');
          document.documentElement.style.removeProperty('--mask-radius');
        });
      });
    });
    
    transition.ready.then(() => {
      document.documentElement.style.setProperty('--origin-x', `${x}px`);
      document.documentElement.style.setProperty('--origin-y', `${y}px`);
      
      const duration = 1800;
      let start = performance.now();
      
      function tick(now: number) {
        const elapsed = Math.max(0, now - start);
        const progress = Math.min(1, elapsed / duration);
        const ease = 1 - Math.pow(1 - progress, 4);
        
        const currentRadius = ease * (endRadius + 200); 
        document.documentElement.style.setProperty('--mask-radius', `${currentRadius}px`);
        
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          dummyAnimation.cancel();
        }
      }
      
      const dummyAnimation = document.documentElement.animate(
        { opacity: [1, 1] },
        { duration: 10000, pseudoElement: '::view-transition-new(root)' }
      );
      
      requestAnimationFrame(tick);
    });
  };
  
  return (
    <div className="theme-rope-wrapper">
      <div className="theme-rope-anchor" />
      <div 
        className="theme-rope-sway-container" 
        ref={ropeContainerRef}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transformOrigin: 'top center' }}
      >
        <div className="theme-rope-line" ref={lineRef} />
        <div 
          className="theme-rope-handle"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
      </div>
    </div>
  );
};
