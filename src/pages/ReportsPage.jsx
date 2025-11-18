    // src/pages/ReportsPage.jsx
    import { useMemo, useState } from "react";
    import { useStore } from "../context/StoreProvider";
    import ReportsTable from "../components/Reports/ReportsTable";
    import * as XLSX from "xlsx";
    import { saveAs } from "file-saver";

    function normalize(d) {
    if (!d) return null;
    // Asegura que el filtro "hasta" incluya todo el día
    const at = new Date(d);
    at.setHours(23, 59, 59, 999);
    return at;
    }

    export default function ReportsPage() {
    const { movements, materials } = useStore();

    // Filtros
    const [material, setMaterial] = useState("Todos");
    const [type, setType] = useState("Todos");
    const [dept, setDept] = useState("Todos");
    const [responsible, setResponsible] = useState("Todos");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    const depOptions = useMemo(() => {
        const set = new Set(movements.map(m => m.department).filter(Boolean));
        return ["Todos", ...Array.from(set)];
    }, [movements]);

    const responsibleOptions = useMemo(() => {
        const set = new Set(movements.map(m => m.responsible).filter(Boolean));
        return ["Todos", ...Array.from(set).sort()];
    }, [movements]);

    const rows = useMemo(() => {
        const fromDate = from ? new Date(from) : null;
        const toDate = to ? normalize(to) : null;

        let arr = [...movements];

        // Filtro Material
        if (material !== "Todos") {
        arr = arr.filter(m => m.materialName === material);
        }

        // Tipo
        if (type !== "Todos") {
        arr = arr.filter(m => m.type === type);
        }

        // Departamento
        if (dept !== "Todos") {
        arr = arr.filter(m => (m.department || "") === dept);
        }

        // Responsable
        if (responsible !== "Todos") {
        arr = arr.filter(m => m.responsible === responsible);
        }

        // Rango de fechas
        if (fromDate) {
        arr = arr.filter(m => new Date(m.date) >= fromDate);
        }
        if (toDate) {
        arr = arr.filter(m => new Date(m.date) <= toDate);
        }

        // Orden descendente
        arr.sort((a, b) => new Date(b.date) - new Date(a.date));
        return arr;
    }, [movements, material, type, dept, responsible, from, to]);

    const reset = () => {
        setMaterial("Todos");
        setType("Todos");
        setDept("Todos");
        setResponsible("Todos");
        setFrom("");
        setTo("");
    };

    // --- EXPORTAR A EXCEL ---
    const exportToExcel = () => {
        const table = document.getElementById("ReportsTable");
        if (!table) return;

        const workbook = XLSX.utils.table_to_book(table);
        const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
        });

        const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        saveAs(data, "tabla_filtrada.xlsx");
    };

    return (
        <div className="fade-in">
        <div className="bg-white shadow-custom rounded-lg">

            {/* HEADER */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
                <h3 className="text-lg font-medium text-gray-900">Informes y Movimientos</h3>
                <p className="mt-1 text-sm text-gray-500">
                Consulta de ingresos y egresos de stock con filtros por texto, tipo, departamento y fecha.
                </p>
            </div>

            <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                <span className="font-medium">{rows.length}</span> resultado(s)
                </span>

                {/* 👉 BOTÓN EXPORTAR */}
                <button
                onClick={exportToExcel}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md shadow-md transition"
                >
                Exportar Excel
                </button>
            </div>
            </div>

            {/* FILTROS */}
            <div className="px-6 py-4 bg-gray-50 border-y border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <div className="lg:col-span-2 xl:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                <select
                    value={material}
                    onChange={e => setMaterial(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                >
                    <option>Todos</option>
                    {materials.map(m => (
                    <option key={m.Id_Material}>{m.Nombre_Descripcion}</option>
                    ))}
                </select>
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
                    {depOptions.map(d => (
                    <option key={d}>{d}</option>
                    ))}
                </select>
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                <select
                    value={responsible}
                    onChange={e => setResponsible(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                >
                    {responsibleOptions.map(r => (
                    <option key={r}>{r}</option>
                    ))}
                </select>
                </div>

                <div className="flex items-end">
                <button
                    onClick={reset}
                    className="w-full inline-flex justify-center py-2 px-4 rounded-md border border-transparent bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-medium transition"
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

            {/* TABLA */}
            <ReportsTable rows={rows} />
        </div>
        </div>
    );
    }
