import { useState, useEffect } from 'react';
import Home from './Components/Pages/Home/Home';
import PaginaInicio from "./Components/Pages/Home/paginaInicio/PaginaInicio.jsx";
import ComparacionProductos from './Components/Pages/ComparacionProductos.jsx';
import ResumenGastosPorMes from './Components/Pages/ResumenGastosPorMes.jsx';
import Alert from './Components/Pages/Alert.jsx';

import { getAuth, onAuthStateChanged } from "firebase/auth";

// Importa la instancia de 'auth' desde tu archivo de configuración
import { auth } from './Configuracion';  

import './App.css';

function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // Escucha el estado de autenticación de Firebase
    onAuthStateChanged(auth, (usuarioFirebase) => {
      if (usuarioFirebase) {
        setUsuario(usuarioFirebase); 
      } else {
        setUsuario(null); 
      }
    });
  }, []);

  return (
    <>
      <div>
        {usuario ? <Home correoUsuario={usuario.email} /> : <PaginaInicio />} 
      </div>
    </>
  );
}

export default App;
