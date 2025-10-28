export default function Stats({ stats }) {
    const { total, adequate, low, critical } = stats;
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div><div className="text-2xl font-bold text-blue-600">{total}</div><div className="text-xs text-gray-500">Total Materiales</div></div>
        <div><div className="text-2xl font-bold text-green-600">{adequate}</div><div className="text-xs text-gray-500">Stock Adecuado</div></div>
        <div><div className="text-2xl font-bold text-yellow-600">{low}</div><div className="text-xs text-gray-500">Stock Bajo</div></div>
        <div><div className="text-2xl font-bold text-red-600">{critical}</div><div className="text-xs text-gray-500">Stock Crítico</div></div>
        </div>
    );
}
