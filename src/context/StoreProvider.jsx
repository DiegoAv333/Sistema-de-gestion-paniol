import { createContext, useContext, useMemo, useState, useEffect, useCallback } from "react";

const StoreCtx = createContext();

export function StoreProvider({ children }) {
    const [materials, setMaterials]   = useState([]);
    const [teachers, setTeachers]     = useState([]);
    const [movements, setMovements]   = useState([]);
    const [talleres, setTalleres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const fetchMaterials = async () => {
                const [allMaterialsRes, materialsWithStateRes] = await Promise.all([
                    fetch('http://localhost:3001/api/materiales'),
                    fetch('http://localhost:3001/api/inventario/estado/1/1')
                ]);
    
                if (!allMaterialsRes.ok) throw new Error('Network response was not ok for all materials');
    
                const allMaterials = await allMaterialsRes.json();
                const materialsWithState = materialsWithStateRes.ok ? await materialsWithStateRes.json() : [];
    
                const materialsWithStateMap = new Map(materialsWithState.map(m => [m.Id_Material, m]));
    
                return allMaterials.map(material => {
                    const stateInfo = materialsWithStateMap.get(material.Id_Material);
                    return stateInfo ? { ...material, ...stateInfo } : { ...material, Estado: 'DISPONIBLE', Requerimiento: '-' };
                });
            };
    
            const [materialsData, teachersData, talleresData, reportesData] = await Promise.all([
                fetchMaterials(),
                fetch('http://localhost:3001/api/docentes').then(res => {
                    if (!res.ok) throw new Error('Network response was not ok for teachers');
                    return res.json();
                }),
                fetch('http://localhost:3001/api/talleres').then(res => {
                    if (!res.ok) throw new Error('Network response was not ok for talleres');
                    return res.json();
                }),
                fetch('http://localhost:3001/api/reportes').then(res => {
                    if (!res.ok) throw new Error('Network response was not ok for reportes');
                    return res.json();
                })
            ]);
            
            setMaterials(materialsData);
            setTeachers(teachersData);
            setTalleres(talleresData);
            const formattedMovements = reportesData.map(r => ({
                id: r.id,
                materialId: r.materialId,
                materialName: r.material,
                type: r.tipo,
                quantity: r.cantidad,
                department: r.departamento,
                responsible: r.responsable,
                observations: r.observacion,
                date: new Date(r.fecha)
            }));
            setMovements(formattedMovements);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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
        await fetchData(); // Refetch
    };

    const updateMaterial = (id, patch) => {
        // This is a client-side only update, for quick UI feedback.
        // A proper implementation would have a backend endpoint and refetch.
        setMaterials(prev => prev.map(m => m.Id_Material === id ? { ...m, ...patch } : m));
    };

    const removeMaterial = async (id) => {
        const response = await fetch(`http://localhost:3001/api/materiales/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete material');
        }
        await fetchData(); // Refetch
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
        // Aseguramos que el estado se actualice correctamente
        setTeachers(prev => [...prev, createdTeacher].sort((a, b) => a.Nombre.localeCompare(b.Nombre)));
    };

    const addTaller = async (taller) => {
        try {
            const response = await fetch('http://localhost:3001/api/talleres', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taller)
            });
            if (!response.ok) {
                throw new Error('Error al registrar el taller');
            }
            const nuevoTaller = await response.json();
            setTalleres(prev => [...prev, nuevoTaller].sort((a, b) => a.Denominacion.localeCompare(b.Denominacion)));
        } catch (err) {
            console.error("Error al agregar taller:", err);
            // Lanzamos el error para que el formulario pueda capturarlo y mostrar un mensaje
            throw err;
        }
        await fetchData(); // Refetch
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
        await fetchData(); // Refetch
    };

    const removeTeacher = async (id) => {
        const response = await fetch(`http://localhost:3001/api/docentes/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete teacher');
        }
        await fetchData(); // Refetch
    };

    const updateTaller = async (id, patch) => {
        const response = await fetch(`http://localhost:3001/api/talleres/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(patch),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'No se pudo actualizar el taller' }));
            throw new Error(errorData.message);
        }
        const updatedTaller = { Id_Taller: id, ...patch };
        setTalleres(prev => prev.map(t => t.Id_Taller === id ? updatedTaller : t));
    };
    
    const removeTaller = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/api/talleres/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                // Intentamos leer el error como JSON, si falla, damos un mensaje genérico.
                let errorMessage = 'No se pudo eliminar el taller.';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    // La respuesta no era JSON, probablemente HTML de error. No hacemos nada y usamos el mensaje por defecto.
                }
                throw new Error(errorMessage);
            }
            setTalleres(prev => prev.filter(t => t.Id_Taller !== id));
        } catch (err) {
            console.error("Error al eliminar taller:", err);
            // Lanzamos el error para que el componente que lo llama pueda manejarlo
            throw err;
        }
    };

    const registerMovement = async ({ materialId, movementType, quantity, responsible, observations, department }) => {
        // 1. Guardar estado original para un posible rollback
        const originalMaterials = materials;
        const originalMovements = movements;

        // 2. Realizar la actualización optimista en la UI
        quantity = Number(quantity);
        const materialIndex = materials.findIndex(m => m.Id_Material === materialId);
        if (materialIndex === -1) throw new Error("Material no encontrado");
        
        const materialToUpdate = materials[materialIndex];

        // Validar stock para egresos
        if (movementType === "Egreso" && materialToUpdate.StockActual < quantity) {
            // Lanzar un error que pueda ser capturado en la UI
            throw new Error("No hay suficiente stock para este egreso.");
        }

        const newStock = movementType === "Ingreso"
            ? materialToUpdate.StockActual + quantity
            : materialToUpdate.StockActual - quantity;

        const updatedMaterials = materials.map(m =>
            m.Id_Material === materialId ? { ...m, StockActual: newStock } : m
        );
        setMaterials(updatedMaterials);

        const newMovement = {
            id: `optimistic-${Date.now()}`, // ID temporal
            materialId,
            materialName: materialToUpdate.Nombre_Descripcion ?? "",
            type: movementType,
            quantity,
            responsible,
            observations,
            department: department || "",
            date: new Date()
        };
        setMovements(prev => [newMovement, ...prev]);

        // 3. Enviar la petición al backend
        try {
            let idTaller = null;
            let idDocente = null;

            if (department) {
                const taller = talleres.find(t => t.Denominacion === department);
                if (taller) idTaller = taller.Id_Taller;
            }

            if (responsible) {
                const teacher = teachers.find(t => `${t.Nombre} ${t.Apellido}` === responsible);
                if (teacher) idDocente = teacher.Id_Docente;
            }
            
            const body = {
                materialId: Number(materialId),
                movementType,
                quantity: Number(quantity),
                idTaller,
                idDocente,
                observations
            };
        
            const response = await fetch('http://localhost:3001/api/movimientos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
        
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.mensaje || 'Error al registrar el movimiento');
            }
        
            // 4. En caso de éxito, refrescar los datos desde el servidor para mantener la consistencia.
            await fetchData();

        } catch (error) {
            // 5. Si falla la petición, revertir la actualización optimista
            console.error("Falló el registro del movimiento, revirtiendo:", error);
            setMaterials(originalMaterials);
            setMovements(originalMovements);
            // Re-lanzar el error para que el componente que llama pueda manejarlo (ej. mostrar una notificación)
            throw error;
        }
    };

    const getTallerName = (id) => {
        const taller = talleres.find(t => t.Id_Taller === id);
        return taller ? taller.Denominacion : "";
    }

    const value = {
        materials, teachers, movements, stats, loading, error, talleres,
        addMaterial, updateMaterial, removeMaterial,
        addTeacher, updateTeacher, removeTeacher, addTaller, updateTaller, removeTaller,
        registerMovement, getTallerName,
    };

    return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export const useStore = () => useContext(StoreCtx);