import React, { useState, useEffect } from 'react';
import { db } from "../../Configuracion";
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import './ResumenGastosPorMes.css'



const ResumenGastosPorMes = () => {
    const [mes, setMes] = useState('');
    const [gastos, setGastos] = useState([]);
    const [totalGastos, setTotalGastos] = useState(0);
    const [productos, setProductos] = useState([]);


    const obtenerGastos = async () => {
        if (!mes) return; 

        try {
           
            const inicioMes = new Date(`${mes}-01T00:00:00`); 
            const finMes = new Date(new Date(inicioMes.getFullYear(),inicioMes.getMonth() + 1, 0).setHours(23, 59, 59));  

            
            const q = query(
                collection(db, 'gastos'),
                where('fecha', '>=', inicioMes),
                where('fecha', '<=', finMes)
            );

            const querySnapshot = await getDocs(q);
            const listaGastos = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));


            const productosAgrupados = listaGastos.reduce((acc, gasto) => {
                
                if (acc[gasto.nombre]) {
                  acc[gasto.nombre].total += gasto.total;
                } else {
                  acc[gasto.nombre] = {
                    nombre: gasto.nombre,
                    cantidad: gasto.cantidad,
                    precio_unitario: gasto.precio_unitario,
                    total: gasto.total,
                  };
                }
                return acc;
              }, {});
        
              
              setProductos(Object.values(productosAgrupados));

            const total = listaGastos.reduce((acc, gasto) => acc + gasto.total, 0);
            setTotalGastos(total);

            setGastos(listaGastos);
            
        } catch (error) {
            console.error('Error al obtener los gastos: ', error);
        }
    };

    useEffect(() => {
        obtenerGastos(); 
    }, [mes]);

    return (
        <div>
            <h2>Resumen de Gastos por Mes</h2>
            <input
                type="month"
                value={mes}
                onChange={(e) => setMes(e.target.value)}
                placeholder="Selecciona un mes"
            />
            <h3>Total Gastos: ${totalGastos}</h3>

            <div>
                <h3>Gastos del Mes {mes}</h3>
                {gastos.length > 0 ? (
                    <ul>
                        {gastos.map((gasto) => (
                            <li key={gasto.id}>
                                <p><strong>Producto:</strong> {gasto.nombre}</p>
                                <p><strong>Cantidad:</strong> {gasto.cantidad}</p>
                                <p><strong>Precio Unitario:</strong> ${gasto.precio_unitario}</p>
                                <p><strong>Total:</strong> ${gasto.total}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay gastos para este mes.</p>
                )}
            </div>
        </div>
    );
};

export default ResumenGastosPorMes;