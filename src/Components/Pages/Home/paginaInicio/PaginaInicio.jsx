import React, { useState } from 'react';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../../../../Configuracion';
import './paginaInicio.css';

const PaginaInicio = () => {
  const [registrando, setRegistrando] = useState(false); 

  const functionAutenticacion = async (e) => {
    e.preventDefault();
    const correo = e.target.email.value;
    const contraseña = e.target.password.value;

    if (registrando) {
      try {
        await createUserWithEmailAndPassword(auth, correo, contraseña);
        alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
      } catch (error) {
        alert("Error al registrar: Asegúrate de que la contraseña tenga al menos 6 caracteres.");
      }
    } else {
      try {
        await signInWithEmailAndPassword(auth, correo, contraseña);
      } catch (error) {
        alert("Error al iniciar sesión: El correo o la contraseña son incorrectos.");
      }
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      alert("Error al iniciar sesión con Google");
    }
  };

  const signInWithGitHub = async () => {
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error al iniciar sesión con GitHub:", error);
      alert("Error al iniciar sesión con GitHub");
    }
  };

  return (
    <div className='Container'>
      <div className='row'>
        
        <div className='col-md-4'>
          <div className='padre'>
            <div className='card card-body shadow-lg'>
              <form onSubmit={functionAutenticacion}>
                <input
                  type="text"
                  placeholder="Ingrese Email"
                  className='cajatexto'
                  id="email"
                  name="email"
                />
                <input
                  type="password"
                  placeholder="Ingresar Contraseña"
                  className="cajatexto"
                  id="password"
                  name="password"
                />
                <button className='btnForm'>
                  {registrando ? "Registrate" : "Inicia sesión"}
                </button>
              </form>
              
              <div className="social-login">
                <button onClick={signInWithGoogle} className="btn-social google">
                  Iniciar con Google
                </button>
                <button onClick={signInWithGitHub} className="btn-social github">
                  Iniciar con GitHub
                </button>
              </div>
              
              <h4 className='texto'>
                {registrando ? "Si ya tienes cuenta" : "No tienes cuenta"}
                <button
                  className="btnswicth"
                  onClick={() => setRegistrando(!registrando)}
                >
                  {registrando ? "Inicia sesión" : "Regístrate"}
                </button>
              </h4>
            </div>
          </div>
        </div>

        <div className='col-md-8'>
          {/* Contenido adicional aquí */}
        </div>
      </div>
    </div>
  );
};

export default PaginaInicio;
