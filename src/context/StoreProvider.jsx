import { createContext, useContext, useMemo, useState, useEffect } from "react";
import initialTeachers from "../data/teachers";
import initialMovements from "../data/movements";

const StoreCtx = createContext();

export function StoreProvider({ children }) {
    const [materials, setMaterials]   = useState([]);
    const [teachers, setTeachers]     = useState(initialTeachers);
    const [movements, setMovements]   = useState(initialMovements);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3001/api/materiales')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => {
                setMaterials(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, []);

    const stats = useMemo(() => {
        const total = materials.length;
        const adequate = materials.filter(m => m.StockActual >= 20).length;
        const low = materials.filter(m => m.StockActual >= 10 && m.StockActual < 20).length;
        const critical = materials.filter(m => m.StockActual < 10).length;
        return { total, adequate, low, critical };
    }, [materials]);

    // acciones
    const addMaterial = async (name, quantity) => {
        const newMaterial = { Nombre_Descripcion: name, StockActual: Number(quantity) };
        const response = await fetch('http://localhost:3001/api/materiales', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMaterial),
        });
        if (!response.ok) {
            throw new Error('Failed to add material');
        }
        const createdMaterial = await response.json();
        setMaterials(prev => [...prev, createdMaterial]);
    };

    const updateMaterial = (id, patch) => {
        setMaterials(prev => prev.map(m => m.Id_Material === id ? { ...m, ...patch } : m));
    };

    const removeMaterial = async (id) => {
        const response = await fetch(`http://localhost:3001/api/materiales/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete material');
        }
        setMaterials(prev => prev.filter(m => m.Id_Material !== id));
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
        const idx = prev.findIndex(m => m.Id_Material === materialId);
        if (idx === -1) return prev;
        const mat = prev[idx];
        if (movementType === "Ingreso") {
            const updated = [...prev];
            updated[idx] = { ...mat, StockActual: mat.StockActual + quantity };
            return updated;
        } else {
            if (mat.StockActual < quantity) throw new Error("Stock insuficiente para egreso");
            const updated = [...prev];
            updated[idx] = { ...mat, StockActual: mat.StockActual - quantity };
            return updated;
        }
        });

        setMovements(prev => [
        {
            id: Date.now(),
            materialId,
            materialName: materials.find(m => m.Id_Material === materialId)?.Nombre_Descripcion ?? "",
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
        materials, teachers, movements, stats, loading, error,
        addMaterial, updateMaterial, removeMaterial,
        addTeacher, updateTeacher, removeTeacher,
        registerMovement,
    };

    return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export const useStore = () => useContext(StoreCtx);