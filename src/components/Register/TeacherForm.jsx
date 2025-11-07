// src/components/Register/TeacherForm.jsx
import { useState } from "react";
import { useStore } from "../../context/StoreProvider";

const DEPARTAMENTOS = ["Construcción","Carpintería","Electricidad","Mecánica","Administración","Informática","Soldadura","Plomería"];

export default function TeacherForm() {
const { addTeacher } = useStore();
const [name, setName] = useState("");
const [department, setDepartment] = useState(DEPARTAMENTOS[0]);
const [email, setEmail] = useState("");

const onSubmit = (e) => {
    e.preventDefault();
    try {
    addTeacher({ name, department, email });
    setName(""); setDepartment(DEPARTAMENTOS[0]); setEmail("");
    alert("Profesor registrado exitosamente");
    } catch (err) {
    alert(err.message || "Error al registrar profesor");
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
            <input value={name} onChange={e=>setName(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2 border" required />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Departamento *</label>
            <select value={department} onChange={e=>setDepartment(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2 border">
            {DEPARTAMENTOS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Email *</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2 border" required />
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