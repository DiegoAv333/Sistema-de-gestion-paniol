// src/pages/ReportsPage.jsx
import { useMemo, useState } from "react";
import { useStore } from "../context/StoreProvider";
import ReportsTable from "../components/Reports/ReportsTable";

function normalize(d) {
if (!d) return null;
  // Asegura que el filtro "hasta" incluya todo el día
const at = new Date(d);
at.setHours(23, 59, 59, 999);
return at;
}

export default function ReportsPage() {
const { movements } = useStore();

  // Filtros
  const [q, setQ] = useState("");                 // texto libre (material, responsable, obs)
  const [type, setType] = useState("Todos");      // Todos | Ingreso | Egreso
  const [dept, setDept] = useState("Todos");      // Departamento
  const [from, setFrom] = useState("");           // fecha desde (yyyy-mm-dd)
  const [to, setTo] = useState("");               // fecha hasta (yyyy-mm-dd)

const depOptions = useMemo(() => {
    const set = new Set(movements.map(m => m.department).filter(Boolean));
    return ["Todos", ...Array.from(set)];
}, [movements]);

const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    const fromDate = from ? new Date(from) : null;
    const toDate   = to   ? normalize(to) : null;

    let arr = [...movements];

    // Texto: busca en materialName, responsable, observaciones
    if (term) {
    arr = arr.filter(m =>
        (m.materialName || "").toLowerCase().includes(term) ||
        (m.responsible || "").toLowerCase().includes(term) ||
        (m.observations || "").toLowerCase().includes(term)
    );
    }

    // Tipo
    if (type !== "Todos") {
    arr = arr.filter(m => m.type === type);
    }

    // Departamento
    if (dept !== "Todos") {
    arr = arr.filter(m => (m.department || "") === dept);
    }

    // Rango de fechas
    if (fromDate) {
    arr = arr.filter(m => new Date(m.date) >= fromDate);
    }
    if (toDate) {
    arr = arr.filter(m => new Date(m.date) <= toDate);
    }

    // Orden: más reciente primero
    arr.sort((a, b) => new Date(b.date) - new Date(a.date));
    return arr;
}, [movements, q, type, dept, from, to]);

const reset = () => {
    setQ("");
    setType("Todos");
    setDept("Todos");
    setFrom("");
    setTo("");
};

return (
    <div className="fade-in">
    <div className="bg-white shadow-custom rounded-lg">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
            <h3 className="text-lg font-medium text-gray-900">Informes y Movimientos</h3>
            <p className="mt-1 text-sm text-gray-500">
            Consulta de ingresos y egresos de stock con filtros por texto, tipo, departamento y fecha.
            </p>
        </div>
        <div className="text-sm text-gray-600">
            <span className="font-medium">{rows.length}</span> resultado(s)
        </div>
        </div>

        {/* Filtros */}
        <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <div className="relative">
                <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Material, responsable u observaciones…"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                </div>
            </div>
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
                <option>Todos</option>
                <option>Ingreso</option>
                <option>Egreso</option>
            </select>
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
            <select
                value={dept}
                onChange={e => setDept(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
                {depOptions.map(d => <option key={d}>{d}</option>)}
            </select>
            </div>

            <div className="md:col-span-1 flex items-end">
            <button
                onClick={reset}
                className="w-full inline-flex justify-center py-2 px-4 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-sm"
            >
                Limpiar filtros
            </button>
            </div>
        </div>

          {/* Rango de fechas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
            <input
                type="date"
                value={from}
                onChange={e => setFrom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
            <input
                type="date"
                value={to}
                onChange={e => setTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />
            </div>
        </div>
        </div>

        {/* Tabla */}
        <ReportsTable rows={rows} />
    </div>
   </div>
  );
}