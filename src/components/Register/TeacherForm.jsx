// src/components/Register/TeacherForm.jsx
import { useState, useEffect } from "react";
import { useStore } from "../../context/StoreProvider";
import { toast } from 'sonner';

export default function TeacherForm() {
    const { addTeacher, talleres } = useStore();
    const [name, setName] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [idTaller, setIdTaller] = useState(""); // Change to idTaller, initialized as empty string

    useEffect(() => {
        if (talleres.length > 0 && idTaller === "") {
            setIdTaller(talleres[0].Id_Taller); // Select the first taller by default
        }
    }, [talleres, idTaller]);

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await addTeacher({ Nombre: name, Apellido: apellido, Email: email, Id_Taller: parseInt(idTaller) });
            setName("");
            setApellido("");
            setEmail("");
            toast.success("Profesor registrado exitosamente");
        } catch (err) {
            toast.error(err.message || "Error al registrar profesor");
        }
    };

    return (
        <div className="bg-white shadow-custom rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Registro de Profesor</h3>
                <p className="mt-1 text-sm text-gray-500">Agregar nuevos responsables al sistema</p>
            </div>
            <div className="px-6 py-4">
                <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre *</label>
                        <input value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2 border" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Apellido *</label>
                        <input value={apellido} onChange={e => setApellido(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2 border" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email *</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2 border" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Taller *</label>
                        <select value={idTaller} onChange={e => setIdTaller(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2 border" required>
                            <option value="">Seleccione un Taller</option>
                            {talleres.map(t => (
                                <option key={t.Id_Taller} value={t.Id_Taller}>{t.Denominacion}</option>
                            ))}
                        </select>
                    </div>
                    <div className="sm:col-span-3 flex items-end">
                        <button type="submit" className="w-full inline-flex justify-center py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700">
                            Registrar Profesor
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}