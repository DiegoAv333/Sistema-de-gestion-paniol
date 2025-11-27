// src/components/Register/TallerForm.jsx
import { useState } from "react";
import { useStore } from "../../context/StoreProvider";

export default function TallerForm() {
    const { addTaller, teachers } = useStore();
    const [denominacion, setDenominacion] = useState("");
    const [turno, setTurno] = useState("Mañana");
    const [idDocente, setIdDocente] = useState(""); // Puede no tener profesor asignado

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await addTaller({
                Denominacion: denominacion,
                Turno: turno,
                Id_Docente: idDocente || null // Envía null si no se selecciona ninguno
            });
            setDenominacion("");
            setTurno("Mañana");
            setIdDocente("");
            alert("Taller registrado exitosamente");
        } catch (err) {
            alert(err.message || "Error al registrar el taller");
        }
    };

    return (
        <div className="bg-white shadow-custom rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Registro de Taller</h3>
                <p className="mt-1 text-sm text-gray-500">Agregar un nuevo taller al sistema</p>
            </div>
            <div className="px-6 py-4">
                <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre del Taller *</label>
                        <input value={denominacion} onChange={e => setDenominacion(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2 border" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Turno *</label>
                        <select value={turno} onChange={e => setTurno(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2 border">
                            <option>Mañana</option>
                            <option>Tarde</option>
                            <option>Noche</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Profesor a Cargo (Opcional)</label>
                        <select value={idDocente} onChange={e => setIdDocente(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2 border">
                            <option value="">Sin asignar</option>
                            {teachers.map(t => <option key={t.Id_Docente} value={t.Id_Docente}>{t.Nombre} {t.Apellido}</option>)}
                        </select>
                    </div>
                    <div className="sm:col-span-3 flex items-end">
                        <button type="submit" className="w-full inline-flex justify-center py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700">
                            Registrar Taller
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}