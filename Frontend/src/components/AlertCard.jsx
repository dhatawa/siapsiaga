const colorMap = {
  red: { border: 'border-red-500', bg: 'bg-red-50', icon: 'text-red-500' },
  yellow: { border: 'border-yellow-400', bg: 'bg-yellow-50', icon: 'text-yellow-500' },
};

export default function AlertCard({ icon: Icon, title, time, description, color = 'red' }) {
  const c = colorMap[color];
  return (
    <div className={`border-l-4 ${c.border} ${c.bg} rounded-lg p-4 flex-1`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Icon size={16} className={c.icon} />
          <p className="text-sm font-semibold text-gray-900">{title}</p>
        </div>
        <span className="text-xs text-gray-400">{time}</span>
      </div>
      <p className="text-xs text-gray-500 mt-2 leading-relaxed">{description}</p>
    </div>
  );
}
