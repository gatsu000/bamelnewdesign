import { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

const Magnet = ({
  children,
  padding = 100,
  disabled = false,
  magnetStrength = 2,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.5s ease-in-out',
  wrapperClassName = '',
  innerClassName = '',
  onPointerEnter,
  ...props
}) => {
  const [isActive, setIsActive] = useState(false);
  const magnetRef = useRef(null);
  const innerRef = useRef(null);
  const reduced = useReducedMotion();
  const rafId = useRef(null);
  const isHovering = useRef(false);

  const latestProps = useRef({ padding, magnetStrength, activeTransition, inactiveTransition, disabled, reduced });
  latestProps.current = { padding, magnetStrength, activeTransition, inactiveTransition, disabled, reduced };

  const listenerRef = useRef();
  const resetInteractionRef = useRef();
  const removeListenersRef = useRef();

  if (!listenerRef.current) {
    removeListenersRef.current = () => {
      window.removeEventListener('pointermove', listenerRef.current);
      window.removeEventListener('blur', resetInteractionRef.current);
      document.documentElement.removeEventListener('pointerleave', resetInteractionRef.current);
    };

    resetInteractionRef.current = () => {
      removeListenersRef.current();
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
      if (innerRef.current) {
        innerRef.current.style.transition = latestProps.current.inactiveTransition;
        innerRef.current.style.transform = `translate3d(0px, 0px, 0)`;
      }
      if (isHovering.current) {
        isHovering.current = false;
        setIsActive(false);
      }
    };

    listenerRef.current = (e) => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
      rafId.current = requestAnimationFrame(() => {
        rafId.current = null;

        const { disabled, reduced, padding, magnetStrength, activeTransition } = latestProps.current;
        const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        if (disabled || reduced || !finePointer) {
          resetInteractionRef.current();
          return;
        }

        if (!magnetRef.current || !innerRef.current) return;

        const { left, top, width, height } = magnetRef.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;

        const distX = Math.abs(centerX - e.clientX);
        const distY = Math.abs(centerY - e.clientY);

        if (distX < width / 2 + padding && distY < height / 2 + padding) {
          if (!isHovering.current) {
            isHovering.current = true;
            setIsActive(true);
            innerRef.current.style.transition = activeTransition;
          }
          const offsetX = (e.clientX - centerX) / magnetStrength;
          const offsetY = (e.clientY - centerY) / magnetStrength;
          innerRef.current.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
        } else {
          resetInteractionRef.current();
        }
      });
    };
  }

  const handlePointerEnter = (e) => {
    if (onPointerEnter) {
      onPointerEnter(e);
      if (e.defaultPrevented) return;
    }

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (disabled || reduced || !finePointer) return;

    window.addEventListener('pointermove', listenerRef.current);
    window.addEventListener('blur', resetInteractionRef.current);
    document.documentElement.addEventListener('pointerleave', resetInteractionRef.current);
    listenerRef.current(e);
  };

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (disabled || reduced || !finePointer) {
      resetInteractionRef.current();
    }
  }, [disabled, reduced]);

  useEffect(() => {
    return () => {
      resetInteractionRef.current();
    };
  }, []);

  return (
    <div
      ref={magnetRef}
      className={wrapperClassName}
      style={{ position: 'relative', display: 'inline-block' }}
      onPointerEnter={handlePointerEnter}
      {...props}
    >
      <div
        ref={innerRef}
        className={innerClassName}
        style={{
          transform: 'translate3d(0px, 0px, 0)',
          transition: isActive ? activeTransition : inactiveTransition,
          willChange: 'transform'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Magnet;
