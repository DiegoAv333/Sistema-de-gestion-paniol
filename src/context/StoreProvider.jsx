import { createContext, useContext, useMemo, useState, useEffect } from "react";
import initialMovements from "../data/movements";

const StoreCtx = createContext();

export function StoreProvider({ children }) {
    const [materials, setMaterials]   = useState([]);
    const [teachers, setTeachers]     = useState([]);
    const [movements, setMovements]   = useState(initialMovements);
    const [talleres, setTalleres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMaterials = async () => {
            const [allMaterialsRes, materialsWithStateRes] = await Promise.all([
                fetch('http://localhost:3001/api/materiales'),
                fetch('http://localhost:3001/api/inventario/estado/1/1')
            ]);

            if (!allMaterialsRes.ok) throw new Error('Network response was not ok for all materials');
            // No es un error si no hay materiales con estado, puede ser un array vacío
            // if (!materialsWithStateRes.ok) throw new Error('Network response was not ok for materials with state');

            const allMaterials = await allMaterialsRes.json();
            const materialsWithState = materialsWithStateRes.ok ? await materialsWithStateRes.json() : [];

            const materialsWithStateMap = new Map(materialsWithState.map(m => [m.Id_Material, m]));

            return allMaterials.map(material => {
                const stateInfo = materialsWithStateMap.get(material.Id_Material);
                // Si el material tiene info de estado, se combina. Si no, se le pone DISPONIBLE.
                // Los datos de `stateInfo` (como StockActual, Balance, etc. de la vista) tienen prioridad.
                return stateInfo ? { ...material, ...stateInfo } : { ...material, Estado: 'DISPONIBLE', Requerimiento: '-' };
            });
        };

        Promise.all([
            fetchMaterials(),
            fetch('http://localhost:3001/api/docentes').then(res => {
                if (!res.ok) throw new Error('Network response was not ok for teachers');
                return res.json();
            }),
            fetch('http://localhost:3001/api/talleres').then(res => {
                if (!res.ok) throw new Error('Network response was not ok for talleres');
                return res.json();
            })
        ]).then(([materialsData, teachersData, talleresData]) => {
            setMaterials(materialsData);
            setTeachers(teachersData);
            setTalleres(talleresData);
            setLoading(false);
        }).catch(error => {
            setError(error);
            setLoading(false);
        });
    }, []);

    const stats = useMemo(() => {
        const total = materials.length;
        const adequate = materials.filter(m => m.Estado === 'DISPONIBLE').length;
        const low = materials.filter(m => m.Estado === 'LIMITADO').length;
        const critical = materials.filter(m => m.Estado === 'FALTANTE').length;
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

    const addTeacher = async (teacher) => {
        const response = await fetch('http://localhost:3001/api/docentes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(teacher),
        });
        if (!response.ok) {
            throw new Error('Failed to add teacher');
        }
        const createdTeacher = await response.json();
        setTeachers(prev => [...prev, createdTeacher]);
    };

    const updateTeacher = async (id, patch) => {
        const response = await fetch(`http://localhost:3001/api/docentes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(patch),
        });
        if (!response.ok) {
            throw new Error('Failed to update teacher');
        }
        setTeachers(prev => prev.map(t => t.Id_Docente === id ? { ...t, ...patch } : t));
    };

    const removeTeacher = async (id) => {
        const response = await fetch(`http://localhost:3001/api/docentes/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete teacher');
        }
        setTeachers(prev => prev.filter(t => t.Id_Docente !== id));
    };

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

    const getTallerName = (id) => {
        const taller = talleres.find(t => t.Id_Taller === id);
        return taller ? taller.Denominacion : "";
    }

    const value = {
        materials, teachers, movements, stats, loading, error, talleres,
        addMaterial, updateMaterial, removeMaterial,
        addTeacher, updateTeacher, removeTeacher,
        registerMovement, getTallerName,
    };

    return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export const useStore = () => useContext(StoreCtx);