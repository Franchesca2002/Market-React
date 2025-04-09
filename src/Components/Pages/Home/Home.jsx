import React from 'react';
import GestionProductos from '../GestionProductos/GestionProductos';
import { getAuth, signOut } from 'firebase/auth'; 
import { auth } from '../../../Configuracion'; // Ahora importas auth directamente desde la configuración
import ComparacionProductos from "../ComparacionProductos";
import ResumenGastosPorMes from '../ResumenGastosPorMes';

const Home = ({ correoUsuario }) => {

  const logout = () => {
    signOut(auth)
      .then(() => {
        console.log('Usuario ha cerrado sesión');
      })
      .catch((error) => {
        console.error('Error al cerrar sesión:', error);
      });
  };

  return (
    <div>
      <h1 className='text-center'>
        Bienvenido {correoUsuario}
        <button className='btn btn-primary' onClick={logout}>Logout</button> 
      </h1>
      <div>
        <GestionProductos />
      </div>
      <div>
        <ComparacionProductos  />
      </div>
      <div>
        <ResumenGastosPorMes />
      </div>
    </div>
  );
};

export default Home;
