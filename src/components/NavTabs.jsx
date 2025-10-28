//src/components/NavTabs.jsx
const base = "border-b-2 py-4 px-1 text-sm font-medium";
const active = "border-blue-500 text-blue-600";
const inactive = "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300";

export default function NavTabs({ tab, onChange }) {
    return (
        <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
            <button className={`${base} ${tab==='inventory'?active:inactive}`} onClick={()=>onChange("inventory")}>
                Inventario
            </button>
            <button className={`${base} ${tab==='register'?active:inactive}`} onClick={()=>onChange("register")}>
                Registrar Material
            </button>
            <button className={`${base} ${tab==='reports'?active:inactive}`} onClick={()=>onChange("reports")}>
                Informes y Movimientos
            </button>
            </div>
        </div>
        </nav>
    );
}
