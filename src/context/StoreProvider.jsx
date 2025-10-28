import { createContext, useContext, useMemo, useState } from "react";
import initialMaterials from "../data/materiales";
import initialTeachers from "../data/teachers";
import initialMovements from "../data/movements";

const StoreCtx = createContext();

export function StoreProvider({ children }) {
    const [materials, setMaterials]   = useState(initialMaterials);
    const [teachers, setTeachers]     = useState(initialTeachers);
    const [movements, setMovements]   = useState(initialMovements);

    const stats = useMemo(() => {
        const total = materials.length;
        const adequate = materials.filter(m => m.quantity >= 20).length;
        const low = materials.filter(m => m.quantity >= 10 && m.quantity < 20).length;
        const critical = materials.filter(m => m.quantity < 10).length;
        return { total, adequate, low, critical };
    }, [materials]);

    // acciones
    const addMaterial = (name, quantity) => {
        setMaterials(prev => [...prev, { id: Date.now(), name, quantity: Number(quantity) }]);
    };

    const updateMaterial = (id, patch) => {
        setMaterials(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m));
    };

    const removeMaterial = (id) => {
        setMaterials(prev => prev.filter(m => m.id !== id));
    };

    const addTeacher = (teacher) => {
        // evitar emails duplicados
        if (teachers.some(t => t.email === teacher.email)) throw new Error("Ya existe un profesor con este email");
        setTeachers(prev => [...prev, { id: Date.now(), ...teacher }]);
    };

    const updateTeacher = (id, patch) => {
        // evitar emails duplicados al editar
        if (patch.email && teachers.some(t => t.email === patch.email && t.id !== id))
        throw new Error("Ya existe un profesor con este email");
        setTeachers(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
    };

    const removeTeacher = (id) => setTeachers(prev => prev.filter(t => t.id !== id));

    const registerMovement = ({ materialId, movementType, quantity, responsible, observations, department }) => {
        quantity = Number(quantity);
        setMaterials(prev => {
        const idx = prev.findIndex(m => m.id === materialId);
        if (idx === -1) return prev;
        const mat = prev[idx];
        if (movementType === "Ingreso") {
            const updated = [...prev];
            updated[idx] = { ...mat, quantity: mat.quantity + quantity };
            return updated;
        } else {
            if (mat.quantity < quantity) throw new Error("Stock insuficiente para egreso");
            const updated = [...prev];
            updated[idx] = { ...mat, quantity: mat.quantity - quantity };
            return updated;
        }
        });

        setMovements(prev => [
        {
            id: Date.now(),
            materialId,
            materialName: materials.find(m => m.id === materialId)?.name ?? "",
            type: movementType,
            quantity,
            responsible,
            observations,
            department: department || "",
            date: new Date()
        },
        ...prev
        ]);
    };

    const value = {
        materials, teachers, movements, stats,
        addMaterial, updateMaterial, removeMaterial,
        addTeacher, updateTeacher, removeTeacher,
        registerMovement,
    };

    return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export const useStore = () => useContext(StoreCtx);