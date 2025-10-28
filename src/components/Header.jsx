export default function Header({ user, dateStr }) {
    return (
        <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
                </div>
                <div className="ml-4">
                <h1 className="text-xl font-semibold text-gray-900">Sistema de Gestión de Inventario</h1>
                <p className="text-sm text-gray-500">Pañol Institucional - Control de Stock</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Usuario: {user}</p>
                <p className="text-xs text-gray-500">{dateStr}</p>
            </div>
            </div>
        </div>
        </header>
    );
}
