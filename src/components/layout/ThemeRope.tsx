import React, { useRef, useEffect } from 'react';
import { flushSync } from 'react-dom';
import './ThemeRope.css';

interface ThemeRopeProps {
  toggleTheme: () => void;
}

export const ThemeRope: React.FC<ThemeRopeProps> = ({ toggleTheme }) => {
  const isTransitioning = useRef(false);
  
  // DOM Refs
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  
  const NUM_POINTS = 12;
  const SEG_LENGTH = 5;

  const physics = useRef({
    points: Array.from({length: NUM_POINTS}, (_, i) => ({
      x: 50, y: i * SEG_LENGTH + 3, oldX: 50, oldY: i * SEG_LENGTH + 3, pinned: i === 0
    })),
    mouseX: 50,
    mouseY: (NUM_POINTS - 1) * SEG_LENGTH + 3,
    isDragging: false,
    hasActivated: false,
    dragStartX: 0,
    dragStartY: 0,
    grabTargetX: 50,
    grabTargetY: (NUM_POINTS - 1) * SEG_LENGTH + 3,
    currentSegLength: SEG_LENGTH
  });

  const frameId = useRef<number>(0);

  // Flexible Rope Physics Engine
  useEffect(() => {
    const loop = () => {
      const p = physics.current;
      
      // 1. Verlet Integration (Gravity & Inertia)
      for (let i = 0; i < p.points.length; i++) {
        const pt = p.points[i];
        if (pt.pinned) {
          pt.x = 50; 
          pt.y = 3; // Start slightly below anchor
          continue;
        }
        
        // Air resistance / friction (increased damping for slower, heavier feel)
        const vx = (pt.x - pt.oldX) * 0.80; 
        const vy = (pt.y - pt.oldY) * 0.80;
        
        pt.oldX = pt.x;
        pt.oldY = pt.y;
        
        pt.x += vx;
        pt.y += vy + 0.4; // Softer gravity
      }
      
      // 2. Mouse Pull (Strong tracking on Handle during drag)
      if (p.isDragging) {
        const last = p.points[p.points.length - 1];
        last.x += (p.mouseX - last.x) * 0.8; // Closely follow pointer
        last.y += (p.mouseY - last.y) * 0.8;
        
        // Dynamically allow the rope to stretch so it can travel downward freely
        const dist = Math.max(0, p.mouseY - p.points[0].y);
        const resting = (NUM_POINTS - 1) * SEG_LENGTH;
        let targetSeg = SEG_LENGTH;
        if (dist > resting) {
           targetSeg = dist / (NUM_POINTS - 1);
        }
        // Quickly stretch during drag
        p.currentSegLength += (targetSeg - p.currentSegLength) * 0.5;
      } else {
        // Slowly return to resting length after release for a natural, soft recoil
        p.currentSegLength += (SEG_LENGTH - p.currentSegLength) * 0.08;
      }
      
      // 3. Constraints (Rigid Links)
      for (let k = 0; k < 15; k++) { // Fewer iterations = slight natural elasticity
        for (let i = 0; i < p.points.length - 1; i++) {
          const pt1 = p.points[i];
          const pt2 = p.points[i + 1];
          
          const dx = pt2.x - pt1.x;
          const dy = pt2.y - pt1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist > 0) {
            const diff = p.currentSegLength - dist;
            const percent = (diff / dist) / 2;
            const offsetX = dx * percent;
            const offsetY = dy * percent;
            
            if (!pt1.pinned) {
              pt1.x -= offsetX;
              pt1.y -= offsetY;
            }
            if (!pt2.pinned) {
              pt2.x += offsetX;
              pt2.y += offsetY;
            }
          }
        }
      }
      
      // 4. Render to DOM
      if (pathRef.current && handleRef.current) {
        let d = `M ${p.points[0].x} ${p.points[0].y}`;
        // Using bezier curves makes it look perfectly soft and round
        for (let i = 1; i < p.points.length - 1; i++) {
          const xc = (p.points[i].x + p.points[i + 1].x) / 2;
          const yc = (p.points[i].y + p.points[i + 1].y) / 2;
          d += ` Q ${p.points[i].x} ${p.points[i].y}, ${xc} ${yc}`;
        }
        const last = p.points[p.points.length - 1];
        d += ` L ${last.x} ${last.y}`;
        
        pathRef.current.setAttribute('d', d);
        
        handleRef.current.style.transform = `translate(calc(-50% + ${last.x - 50}px), ${last.y}px)`;
      }

      frameId.current = requestAnimationFrame(loop);
    };

    frameId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId.current);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isTransitioning.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    
    const p = physics.current;
    p.isDragging = true;
    p.hasActivated = false;
    
    p.dragStartX = e.clientX;
    p.dragStartY = e.clientY;
    
    const last = p.points[p.points.length - 1];
    p.mouseX = last.x;
    p.mouseY = last.y;
    
    p.grabTargetX = p.mouseX;
    p.grabTargetY = p.mouseY;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const p = physics.current;
    if (!p.isDragging || p.hasActivated) return;
    
    const dx = e.clientX - p.dragStartX;
    const dy = e.clientY - p.dragStartY;
    
    // Direct 1:1 mapping on Y for strong drag control
    p.mouseX = p.grabTargetX + dx * 0.5; // Dampen horizontal movement slightly
    p.mouseY = p.grabTargetY + dy;
    
    // Calculate total pull distance from the natural resting position
    const restingY = (NUM_POINTS - 1) * SEG_LENGTH + 3;
    const pullDist = p.mouseY - restingY;
    
    // Activation Threshold (requires a deliberate ~75px pull)
    if (pullDist > 75 && !p.hasActivated) { 
      activateSwitch(e.clientX, e.clientY);
    }
  };

  const handlePointerUp = () => {
    const p = physics.current;
    if (p.isDragging) {
      p.isDragging = false;
    }
  };

  const activateSwitch = (x: number, y: number) => {
    const p = physics.current;
    p.hasActivated = true;
    p.isDragging = false;
    
    const last = p.points[p.points.length - 1];
    
    // Tiny mechanical catch/click at handle
    last.y += 4; 
    // Soft upward recoil impulse (the rest is handled by currentSegLength shrinking)
    last.oldY = last.y + 6; 
    // Slight side sway kick
    last.oldX += (Math.random() > 0.5 ? 1 : -1) * 5; 
    
    if (navigator.vibrate) navigator.vibrate(10);
    
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
      
      const duration = 900;
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
    <div className="theme-rope-wrapper" ref={wrapperRef}>
      <div className="theme-rope-anchor" />
      <svg 
        className="theme-rope-svg" 
        width="100" 
        height="150" 
        style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', overflow: 'visible', zIndex: 1 }}
      >
        <path ref={pathRef} stroke="#a8a29e" strokeWidth="2.5" fill="none" strokeDasharray="5 3" strokeLinecap="round" />
      </svg>
      <div 
        className="theme-rope-handle"
        ref={handleRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ zIndex: 3 }}
      />
    </div>
  );
};
