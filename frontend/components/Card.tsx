interface CardProps {
  title: string;
  description: string;
}

export default function Card({ title, description }: CardProps) {
  return (
    <div className="border rounded-lg shadow-sm p-4 bg-white w-full sm:w-64">
      <h3 className="font-semibold text-lg text-green-700">{title}</h3>
      <p className="text-sm text-gray-600 mt-2">{description}</p>
    </div>
  );
}
