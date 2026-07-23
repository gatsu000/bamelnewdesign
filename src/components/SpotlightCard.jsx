import { useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
const SpotlightCard = ({ children, className = '', spotlightColor = 'rgba(255, 255, 255, 0.05)', as: Component = 'div', ...props }) => {
  const divRef = useRef(null);
  const reduced = useReducedMotion();

  const handlePointerMove = e => {
    if (reduced || e.pointerType === 'touch') return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    divRef.current.style.setProperty('--mouse-x', `${x}px`);
    divRef.current.style.setProperty('--mouse-y', `${y}px`);
    divRef.current.style.setProperty('--spotlight-color', spotlightColor);
  };

  return (
    <Component ref={divRef} onPointerMove={handlePointerMove} className={`card-spotlight ${className}`} {...props}>
      {children}
    </Component>
  );
};

export default SpotlightCard;
