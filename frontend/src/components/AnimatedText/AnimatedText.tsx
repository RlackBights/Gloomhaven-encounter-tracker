import { useEffect, useRef, type JSX, type ReactNode } from "react";
import './AnimatedText.css'

export default function AnimatedText({ children, Element = "p", animationFunction }: { children: ReactNode, Element?: React.ElementType, animationFunction: (i: number, t: number) => number })
{
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const letters = containerRef.current?.querySelectorAll(".animated-text-letter");
        let start: number | null = null;

        function animate(time: number) {
            if (!start) start = time;
            const t = (time - start) / 1000;

            letters?.forEach((el, i) => {
                const y = animationFunction(i, t);
                (el as HTMLSpanElement).style.setProperty("--offset", `${y}px`);
            });

            requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
    }, []);
    return (
        <div ref={containerRef} className="animated-text-container">
            {children?.toString().split('').map((c: string, i: number) => (
                <Element className="animated-text-letter" key={i}>{c === ' ' ? '\u00A0' : c}</Element>  
            ))}
        </div>
    )
}