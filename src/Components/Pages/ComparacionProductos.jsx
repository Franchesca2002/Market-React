import React, { useState, useEffect } from 'react';
import {db} from "../../Configuracion";
import { collection, getDocs} from "firebase/firestore";
import "./ComparacionProductos.css"

const ComparacionProductos = ({  }) => {
    const [mes1, setMes1] = useState("");
    const [mes2, setMes2] = useState("");
    const [comparacion, setComparacion] = useState([]);
    const [historialPrecios, setHistorialPrecios] = useState()
    //const [historialPrecios, setHistorialPrecios] = useState ({});

    const obtenerHistorialPrecios = async () => {
        const productosCollection = collection(db,"products");
        const productosSnapshot= await getDocs(productosCollection);
        console.log(productosCollection)

        const preciosData = {};
        productosSnapshot.forEach((doc) => {
            preciosData[doc.id]=doc.data() || [];
        });
        setHistorialPrecios(preciosData);
    };

    useEffect(() => {
        obtenerHistorialPrecios();
    }, []);


    
    const obtenerPreciosPorMes = (id, mes) => {
        const registros = historialPrecios[id];
        return registros.precio
    };

    
    const compararPrecios = () => {
        if (!mes1 || !mes2) return;
        console.log(historialPrecios)
        const resultado = Object.keys(historialPrecios).map((id) => {
            const precios = historialPrecios[id];
            if (!precios) return null;

            const precioMes1 = obtenerPreciosPorMes(id, mes1);
            const precioMes2 = obtenerPreciosPorMes(id, mes2);

            if (precioMes1 !== null && precioMes2 !== null) {
                return {
                    id,
                    precioMes1,
                    precioMes2,
                    diferencia: precioMes2 - precioMes1,
                };
            }
            return null;
        }).filter(Boolean); 
        console.log(historialPrecios)
        setComparacion(resultado);  
    };

    return (
        <div className="Comparacion-productos">
            <h2>Comparar precios entre Meses</h2>
            <div>
                <input
                    type="text"
                    placeholder="Mes 1 (Ej: 02/2025)"
                    value={mes1}
                    onChange={(e) => setMes1(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Mes 2 (Ej: 03/2025)"
                    value={mes2}
                    onChange={(e) => setMes2(e.target.value)}
                />
                <button onClick={compararPrecios}>Comparar</button>
            </div>

            {comparacion.length > 0 && (
                <div className="resultados-comparacion">
                    <h3>Resultados de la comparación:</h3>
                    {comparacion.map(({ id, precioMes1, precioMes2, diferencia }) => (
                        <div key={id} className="producto">
                            <div className="producto-id">
                                <strong>ID Producto:</strong> {id}
                            </div>
                            <div className="producto-precios">
                                <strong>Precio {mes1}:</strong> ${precioMes1}
                            </div>
                            <div className="producto-precios">
                                <strong>Precio {mes2}:</strong> ${precioMes2}
                            </div>
                            <div
                                className="producto-diferencia"
                                style={{ color: diferencia >= 0 ? "green" : "red" }}
                            >
                                <strong>Diferencia:</strong> ${diferencia || 0}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ComparacionProductos;
