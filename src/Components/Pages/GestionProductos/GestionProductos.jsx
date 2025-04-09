import React, { useState, useEffect } from 'react';
import "../GestionProductos/GestionProductos.css";
import { addDoc, getDocs, getFirestore, collection } from 'firebase/firestore';

const GestionProductos = () => {
  const [tienda, setTienda] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [historialPrecios, setHistorialPrecios] = useState({});
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');

  const db = getFirestore();

  const [filtros, setFiltros] = useState({
    nombre: '',
    marca: '',
    precio: '',
    categoria: '',
  });

  // Función para obtener los productos desde Firestore
  const fetchProductos = async () => {
    try {
      const productosSnapshot = await getDocs(collection(db, "products"));
      const productosList = productosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductos(productosList);
    } catch (error) {
      console.error("Error al obtener los productos: ", error);
    }
  };

  useEffect(() => {
    fetchProductos();  // Cargar los productos desde Firestore cuando el componente se monte
  }, []);

  const seleccionarTienda = (event) => {
    setTienda(event.target.value);
  };

  const agregarCategoria = (event) => {
    event.preventDefault();
    const nuevaCategoria = event.target.categoria.value;
    if (nuevaCategoria && !categorias.includes(nuevaCategoria)) {
      setCategorias([...categorias, nuevaCategoria]);
    }
    event.target.categoria.value = '';
  };

  const agregarProducto = async (event) => {
    event.preventDefault();

    const nuevoProducto = {
      nombre: name,
      marca: brand,
      precio: parseFloat(price),
      unidadMedida: parseInt(quantity),
      categoria: category,
      activo: true,
    };

    if (
      nuevoProducto.nombre &&
      nuevoProducto.marca &&
      nuevoProducto.precio &&
      nuevoProducto.unidadMedida &&
      nuevoProducto.categoria
    ) {
      try {
        const docRef = await addDoc(collection(db, "products"), nuevoProducto);
        console.log("Producto agregado con ID: ", docRef.id);

        setProductos([...productos, { ...nuevoProducto, id: docRef.id }]);

        setName('');
        setBrand('');
        setPrice('');
        setQuantity('');
        setCategory('');
      } catch (error) {
        console.error("Error al agregar el producto: ", error);
      }
    } else {
      console.log("Por favor, completa todos los campos");
    }
  };

  const actualizarProducto = (id, campo, valor) => {
    setProductos((prevProductos) =>
      prevProductos.map((producto) =>
        producto.id === id ? { ...producto, [campo]: valor } : producto
      )
    );

    if (campo === 'precio') {
      setHistorialPrecios((prevHistorial) => ({
        ...prevHistorial,
        [id]: [
          ...(prevHistorial[id] || []),
          { fecha: new Date().toLocaleDateString(), precio: valor },
        ],
      }));
    }
  };

  const eliminarProducto = (id) => {
    setProductos(productos.filter((producto) => producto.id !== id));
    const nuevoHistorial = { ...historialPrecios };
    delete nuevoHistorial[id];
    setHistorialPrecios(nuevoHistorial);
  };

  const toggleActivo = (id) => {
    setProductos(productos.map((producto) =>
      producto.id === id ? { ...producto, activo: !producto.activo } : producto
    ));
  };

  const calcularTotal = () => {
    return productos.reduce((total, producto) => total + parseFloat(producto.precio || 0), 0);
  };

  const manejarCambioFiltro = (campo, valor) => {
    setFiltros({ ...filtros, [campo]: valor });
  };

  const productosFiltrados = productos.filter((producto) => {
    return (
      producto.activo &&
      producto.nombre.toLowerCase().includes(filtros.nombre.toLowerCase()) &&
      producto.marca.toLowerCase().includes(filtros.marca.toLowerCase()) &&
      producto.categoria.toLowerCase().includes(filtros.categoria.toLowerCase()) &&
      (filtros.precio === '' || producto.precio <= parseFloat(filtros.precio))
    );
  });

  return (
    <div>
      <h1>Gestión de Productos</h1>

      <div className="tienda-section">
        <h2>Seleccionar Tienda</h2>
        <input type="text" placeholder="Nombre de la tienda" value={tienda} onChange={seleccionarTienda} />
        <p>Tienda seleccionada: {tienda}</p>
      </div>

      <div className="categorias-section">
        <h2>Crear Categorías</h2>
        <form onSubmit={agregarCategoria}>
          <input type="text" name="categoria" placeholder="Nombre de la categoría" />
          <button type="submit">Agregar Categoría</button>
        </form>
        <ul>
          {categorias.map((categoria, index) => (
            <li key={index}>{categoria}</li>
          ))}
        </ul>
      </div>

      <div className="productos-section">
        <h2>Agregar Productos</h2>
        <form onSubmit={agregarProducto}>
          <input type="text" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="text" placeholder="Marca" value={brand} onChange={(e) => setBrand(e.target.value)} />
          <input type="number" placeholder="Precio" value={price} onChange={(e) => setPrice(e.target.value)} />
          <input type="text" placeholder="Unidad de Medida" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Selecciona una categoría</option>
            {categorias.map((categoria, index) => (
              <option key={index} value={categoria}>{categoria}</option>
            ))}
          </select>
          <button type="submit">Agregar Producto</button>
        </form>
      </div>

      <div className="filtros-section">
        <h2>Filtrar Productos</h2>
        <input type="text" placeholder="Filtrar por nombre" value={filtros.nombre} onChange={(e) => manejarCambioFiltro('nombre', e.target.value)} />
        <input type="text" placeholder="Filtrar por marca" value={filtros.marca} onChange={(e) => manejarCambioFiltro('marca', e.target.value)} />
        <input type="number" placeholder="Filtrar por precio máximo" value={filtros.precio} onChange={(e) => manejarCambioFiltro('precio', e.target.value)} />
        <select value={filtros.categoria} onChange={(e) => manejarCambioFiltro('categoria', e.target.value)}>
          <option value="">Todas las categorías</option>
          {categorias.map((categoria, index) => (
            <option key={index} value={categoria}>{categoria}</option>
          ))}
        </select>
      </div>

      <div className="productos-lista">
        <h2>Lista de Productos</h2>
        <ul>
          {productosFiltrados.map((producto) => (
            <li key={producto.id}>
              <p>Nombre: {producto.nombre}</p>
              <p>Marca: {producto.marca}</p>
              <p>Precio: ${producto.precio}</p>
              <p>Unidad de Medida: {producto.unidadMedida}</p>
              <p>Categoría: {producto.categoria}</p>
              <div className="acciones-botones">
                <button onClick={() => actualizarProducto(producto.id, 'nombre', 'Nuevo Nombre')}>Actualizar Nombre</button>
                <button onClick={() => eliminarProducto(producto.id)}>Eliminar Producto</button>
                <button onClick={() => toggleActivo(producto.id)}>
                  {producto.activo ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="total-section">
        <h2>Total de la lista de productos</h2>
        <p>Total: ${calcularTotal().toFixed(2)}</p>
      </div>
    </div>
  );
};

export default GestionProductos;
