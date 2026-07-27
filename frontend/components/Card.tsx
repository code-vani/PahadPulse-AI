"use client";
import { useRef } from "react";

interface CardProps {
  title: string;
  description: string;
}

export default function Card({ title, description }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / rect.height) * -8;
    const rotateY = ((x - rect.width / 2) / rect.width) * 8;
    el.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
  }

  function handleMouseLeave() {
    if (ref.current) ref.current.style.transform = "perspective(600px) rotateX(0) rotateY(0) translateZ(0)";
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: "transform 0.15s ease-out" }}
      className="relative bg-white/60 border border-brand/10 rounded-2xl shadow-sm p-6 w-full sm:w-72"
    >
      <div className="w-8 h-1 bg-accent rounded-full mb-4" />
      <h3 className="font-display font-semibold text-lg text-brand">{title}</h3>
      <p className="text-sm text-foreground/70 mt-2">{description}</p>
    </div>
  );
}