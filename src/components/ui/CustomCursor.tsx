'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const mousePos = useRef({ x: -100, y: -100 });
    const ringPos = useRef({ x: -100, y: -100 });
    const animFrameRef = useRef<number | undefined>(undefined);

    const updateCursor = useCallback(() => {
        if (dotRef.current) {
            dotRef.current.style.transform = `translate(${mousePos.current.x}px, ${mousePos.current.y}px)`;
        }

        // Ring follows with spring-like delay
        ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.15;
        ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.15;

        if (ringRef.current) {
            ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) scale(${isHovering ? 1.5 : 1})`;
        }

        animFrameRef.current = requestAnimationFrame(updateCursor);
    }, [isHovering]);

    useEffect(() => {
        // Only show on devices with pointer (not touch)
        const hasPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        if (!hasPointer) return;

        setIsVisible(true);
        document.body.classList.add('cursor-custom');

        const handleMouseMove = (e: MouseEvent) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.closest('a') ||
                target.closest('button') ||
                target.closest('[role="button"]') ||
                target.closest('input') ||
                target.closest('label')
            ) {
                setIsHovering(true);
            }
        };

        const handleMouseOut = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.closest('a') ||
                target.closest('button') ||
                target.closest('[role="button"]') ||
                target.closest('input') ||
                target.closest('label')
            ) {
                setIsHovering(false);
            }
        };

        const handleMouseLeave = () => {
            if (dotRef.current) dotRef.current.style.opacity = '0';
            if (ringRef.current) ringRef.current.style.opacity = '0';
        };

        const handleMouseEnter = () => {
            if (dotRef.current) dotRef.current.style.opacity = '1';
            if (ringRef.current) ringRef.current.style.opacity = '1';
        };

        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseout', handleMouseOut);
        document.documentElement.addEventListener('mouseleave', handleMouseLeave);
        document.documentElement.addEventListener('mouseenter', handleMouseEnter);

        animFrameRef.current = requestAnimationFrame(updateCursor);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseout', handleMouseOut);
            document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
            document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
            document.body.classList.remove('cursor-custom');
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [updateCursor]);

    if (!isVisible) return null;

    return (
        <>
            {/* Inner dot */}
            <div
                ref={dotRef}
                className="fixed top-0 left-0 pointer-events-none z-[9999]"
                style={{
                    width: '8px',
                    height: '8px',
                    marginLeft: '-4px',
                    marginTop: '-4px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #e36414, #fb8b24)',
                    boxShadow: '0 0 12px 3px rgba(227, 100, 20, 0.5), 0 0 24px 6px rgba(227, 100, 20, 0.2)',
                    transition: 'opacity 0.3s ease',
                    willChange: 'transform',
                }}
            />
            {/* Outer ring */}
            <div
                ref={ringRef}
                className="fixed top-0 left-0 pointer-events-none z-[9998]"
                style={{
                    width: '36px',
                    height: '36px',
                    marginLeft: '-18px',
                    marginTop: '-18px',
                    borderRadius: '50%',
                    border: `1.5px solid ${isHovering ? 'rgba(251, 139, 36, 0.6)' : 'rgba(227, 100, 20, 0.3)'}`,
                    boxShadow: isHovering ? '0 0 20px 4px rgba(227, 100, 20, 0.15)' : 'none',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease',
                    willChange: 'transform',
                }}
            />
        </>
    );
}
