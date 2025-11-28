// src/components/Register/RotationsTable.jsx
import { useState } from "react";
import { useStore } from "../../context/StoreProvider";
import EditRotationModal from "../modals/EditRotationModal";
import DeleteRotationModal from "../modals/DeleteRotationModal";
import { toast } from 'sonner';

function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' };
    return new Date(dateString).toLocaleDateString('es-AR', options);
}

const isCurrentRotation = (rotation) => {
    const today = new Date();
    const startDate = new Date(rotation.Inicio);
    const endDate = new Date(rotation.Final);
    today.setHours(0, 0, 0, 0);
    // The dates from database are UTC, so we create UTC dates for comparison
    const startUTC = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate()));
    const endUTC = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate()));

    return today >= startUTC && today <= endUTC;
};

export default function RotationsTable() {
    const { rotations, removeRotation } = useStore();
    const [q, setQ] = useState("");
    const [edit, setEdit] = useState(null);
    const [del, setDel] = useState(null);

    const rows = rotations
        .filter(r =>
            formatDate(r.Inicio).includes(q) ||
            formatDate(r.Final).includes(q)
        )
        .sort((a, b) => new Date(b.Inicio) - new Date(a.Inicio));

    const handleConfirmDelete = async () => {
        if (!del) return;
        try {
            await removeRotation(del.Id_Rotacion);
            setDel(null);
            toast.success("Rotación eliminada exitosamente");
        } catch (error) {
            toast.error(error.message || "Ocurrió un error inesperado.");
        }
    };

    return (
        <div className="bg-white shadow-custom rounded-lg mt-6">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium text-gray-900">Rotaciones Registradas</h3>
                    <p className="mt-1 text-sm text-gray-500">Listado y gestión de rotaciones (la actual está resaltada)</p>
                </div>
                <div className="relative">
                    <input
                        value={q}
                        onChange={e => setQ(e.target.value)}
                        placeholder="Buscar por fecha..."
                        className="block w-72 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {rows.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500 text-sm">
                    No hay rotaciones que coincidan con la búsqueda o no hay rotaciones registradas.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Inicio</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Fin</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {rows.map(r => (
                                <tr key={r.Id_Rotacion} className={`${isCurrentRotation(r) ? 'bg-blue-100' : ''} hover:bg-gray-50`}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatDate(r.Inicio)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(r.Final)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <button onClick={() => setEdit(r)} className="text-blue-600 hover:text-blue-900 mr-3">Editar</button>
                                        <button onClick={() => setDel(r)} className="text-red-600 hover:text-red-900">Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {edit && <EditRotationModal rotation={edit} onClose={()=>setEdit(null)} />}
            {del && <DeleteRotationModal rotation={del} onCancel={()=>setDel(null)} onConfirm={handleConfirmDelete} />}
        </div>
    );
}