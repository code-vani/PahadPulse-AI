interface CardProps {
  title: string;
  description: string;
}

export default function Card({ title, description }: CardProps) {
  return (
    <div className="relative bg-white/60 border border-brand/10 rounded-2xl shadow-sm p-6 w-full sm:w-72 hover:-translate-y-1 hover:shadow-md transition-all">
      <div className="w-8 h-1 bg-accent rounded-full mb-4" />
      <h3 className="font-display font-semibold text-lg text-brand">{title}</h3>
      <p className="text-sm text-foreground/70 mt-2">{description}</p>
    </div>
  );
}