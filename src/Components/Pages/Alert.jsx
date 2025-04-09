import React, { createContext, useState, useContext, useEffect } from 'react';
import './Alert.css';


const AlertContext = createContext();


export const AlertProvider = ({ children }) => {
    const [alerta, setAlerta] = useState(null);

    const mostrarAlerta = (mensaje, tipo = 'info') => {
        setAlerta({ mensaje, tipo });

        
        setTimeout(() => {
            setAlerta(null);
        }, 3000);
    };

    return (
        <AlertContext.Provider value={{ alerta, mostrarAlerta }}>
            {children}
        </AlertContext.Provider>
    );
};


export const useAlert = () => {
    return useContext(AlertContext);
};


const Alert = () => {
    const { alerta } = useAlert();

    if (!alerta) return null; 

    return (
        <div className={`alert ${alerta.tipo}`}>
            <p>{alerta.mensaje}</p>
        </div>
    );
};

export default Alert;
