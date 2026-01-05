import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Edit, Plus, Search, Package, Lock, Eye, EyeOff, X, Save, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';

// 🔴 TU URL DE APPS SCRIPT AQUÍ 🔴
const API_URL = "https://script.google.com/macros/s/AKfycbx9F1NdDumt2pRdYeHTFXLl1gNX3PKJBteH7LYsF4LEgTuqavXrkmV-dJxV-ZEmLE4d/exec";

// Lista de marcas predefinidas
const MARCAS_COMUNES = [
    "Dell", "HP", "Lenovo", "Asus", "Acer", "Samsung", "Logitech", "Arctic", "Sony", "LG", "Kingston", "Gigabyte", "MSI"
];

// --- FUNCIÓN AUXILIAR: CALCULAR GARANTÍA ---
const calcularGarantia = (fechaIngreso, mesesGarantia) => {
    if (!fechaIngreso || !mesesGarantia || mesesGarantia == 0) return { estado: 'SIN GARANTÍA', color: 'text-gray-400', dias: null };

    const ingreso = new Date(fechaIngreso);
    const vencimiento = new Date(ingreso);
    vencimiento.setMonth(ingreso.getMonth() + Number(mesesGarantia));

    const hoy = new Date();
    const diffTime = vencimiento - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
        return { estado: 'VIGENTE', color: 'text-green-600 font-bold', dias: diffDays };
    } else {
        return { estado: 'VENCIDA', color: 'text-red-500 font-bold', dias: diffDays };
    }
};

// --- TARJETA DE PRODUCTO (Diseño Premium) ---
const ProductCard = ({ producto, rol, onEdit, onDelete }) => {
    const [verCosto, setVerCosto] = useState(false);
    const garantiaInfo = calcularGarantia(producto.fechaIngreso, producto.garantia);
    const esStockBajo = Number(producto.stock) <= Number(producto.stockMin);
    const precioMostrar = producto.precioVenta ? `$${producto.precioVenta}` : '--';

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full hover:shadow-lg transition-all duration-300 group relative">

            {/* IMAGEN */}
            <div className="relative h-40 bg-gray-50 flex items-center justify-center p-4">
                <span className="absolute top-0 right-0 bg-slate-700 text-white text-[10px] font-mono px-2 py-1 rounded-bl-lg z-10 shadow-sm">
                    {producto.codigo}
                </span>

                {producto.foto ? (
                    <img src={producto.foto} className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" />
                ) : (
                    <Package className="text-gray-300 w-12 h-12" />
                )}

                <div className={`absolute bottom-2 left-2 px-3 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm ${esStockBajo ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}>
                    Stock: {producto.stock}
                </div>
            </div>

            {/* CUERPO */}
            <div className="p-4 flex-grow flex flex-col">
                <span className="inline-block w-max text-[9px] uppercase font-bold tracking-wider text-blue-600 border border-blue-200 px-1.5 rounded mb-2">
                    {producto.categoria}
                </span>

                <h3 className="font-bold text-gray-800 text-base leading-tight mb-1">{producto.nombre}</h3>
                <p className="text-xs text-gray-500 mb-3">{producto.marca} {producto.modelo}</p>

                <div className="flex justify-between items-end mb-3">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">Precio Venta</span>
                    <span className="text-xl font-black text-blue-600">{precioMostrar}</span>
                </div>

                <div className="border-t border-dashed border-gray-200 my-2"></div>

                {/* DATOS INTERNOS */}
                <div className="bg-slate-50 rounded-lg p-2 mt-auto border border-slate-100">
                    <div className="flex items-center gap-1 mb-2">
                        <Lock size={10} className="text-amber-500" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Datos Internos</span>
                        <button
                            onClick={() => setVerCosto(!verCosto)}
                            className="ml-auto text-[10px] text-blue-500 hover:underline cursor-pointer flex items-center gap-1"
                        >
                            {verCosto ? 'Ocultar' : 'Ver Costo'}
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-y-2 gap-x-1 text-[10px]">
                        <div className="flex flex-col">
                            <span className="text-gray-400">Costo Real</span>
                            {verCosto ? (
                                <span className="font-bold text-slate-700">${producto.costo || '0.00'}</span>
                            ) : (
                                <div className="flex gap-0.5 mt-1">
                                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1 h-1 bg-gray-300 rounded-full"></div>)}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col text-right">
                            <span className="text-gray-400">Garantía</span>
                            <span className={`${garantiaInfo.color}`}>
                                {garantiaInfo.estado}
                            </span>
                            {garantiaInfo.dias !== null && (
                                <span className="text-[9px] text-gray-400">
                                    ({garantiaInfo.dias > 0 ? `${garantiaInfo.dias} días` : 'Expirada'})
                                </span>
                            )}
                        </div>

                        <div className="col-span-2 flex justify-between items-center border-t border-gray-200 pt-1 mt-1">
                            <span className="text-gray-400">Prov:</span>
                            <span className="text-slate-600 font-medium truncate max-w-[120px]" title={producto.proveedor}>
                                {producto.proveedor || 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* BOTONES */}
                <div className="mt-3 flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                        onClick={() => onEdit(producto)}
                        className="flex-1 bg-white border border-gray-200 text-slate-600 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition flex items-center justify-center gap-1 shadow-sm"
                    >
                        <Edit size={12} /> Editar
                    </button>
                    {rol === 'admin' && (
                        <button
                            onClick={() => onDelete(producto.id)}
                            className="w-8 bg-white border border-red-100 text-red-400 rounded-lg flex items-center justify-center hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition shadow-sm"
                        >
                            <Trash2 size={12} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---
const Inventario = () => {
    const navigate = useNavigate();
    const [rolUsuario, setRolUsuario] = useState('user');
    const [vista, setVista] = useState('lista');
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [busqueda, setBusqueda] = useState("");

    // Estados para Formulario
    const [modoEdicion, setModoEdicion] = useState(false);
    const [idEditando, setIdEditando] = useState(null);

    // Estado para manejar la lógica de "Otra marca"
    const [marcaSelect, setMarcaSelect] = useState("");

    const formInicial = {
        codigo: '', nombre: '', categoria: 'Repuestos', marca: '', modelo: '',
        proveedor: '', fechaIngreso: '', garantia: 0, costo: '', precioVenta: '',
        stock: '', stockMin: 2, foto: ''
    };
    const [formData, setFormData] = useState(formInicial);

    useEffect(() => {
        const dataGuardada = localStorage.getItem('usuarioTaller');
        if (dataGuardada) {
            const user = JSON.parse(dataGuardada);
            setRolUsuario(user.rol || 'user');
        }
        fetchProductos();
    }, []);

    const fetchProductos = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}?action=getInventario`);
            const data = await res.json();
            if (data.success) setProductos(data.data);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handlePhoto = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;

                img.onload = () => {
                    // 1. Crear un canvas para redimensionar
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 400; // Reducimos ancho a 400px (suficiente para ver en tarjeta)
                    const scaleSize = MAX_WIDTH / img.width;

                    canvas.width = MAX_WIDTH;
                    canvas.height = img.height * scaleSize;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    // 2. Convertir a Base64 comprimido (JPEG calidad 0.5)
                    // Esto reduce drásticamente los caracteres para que quepa en Google Sheets
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.5);

                    setFormData({ ...formData, foto: dataUrl });
                };
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBorrar = (id) => {
        Swal.fire({
            title: '¿Eliminar producto?',
            text: "No podrás revertir esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#e2e8f0',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire({ title: 'Eliminando...', didOpen: () => Swal.showLoading() });
                await fetch(API_URL, { method: 'POST', body: JSON.stringify({ action: 'deleteProducto', id }) });
                await fetchProductos();
                Swal.fire({ title: 'Eliminado', icon: 'success', timer: 1000, showConfirmButton: false });
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.nombre) return Swal.fire('Faltan datos', 'El nombre del producto es obligatorio', 'warning');

        const action = modoEdicion ? 'editProducto' : 'addProducto';
        const payload = { action, ...formData };
        if (modoEdicion) payload.id = idEditando;

        Swal.fire({ title: 'Guardando...', html: 'Por favor espera', didOpen: () => Swal.showLoading() });

        try {
            const res = await fetch(API_URL, { method: 'POST', body: JSON.stringify(payload) });
            const data = await res.json();

            if (data.success || data.status === 'success') {
                Swal.fire({ icon: 'success', title: '¡Guardado!', timer: 1500, showConfirmButton: false });
                setFormData(formInicial);
                setModoEdicion(false);
                setVista('lista');
                fetchProductos();
            } else {
                Swal.fire('Error', data.message || 'Error desconocido', 'error');
            }
        } catch (error) { Swal.fire('Error', 'No se pudo conectar con el servidor', 'error'); }
    };

    // Preparar edición con lógica de Marcas
    const prepararEdicion = (prod) => {
        const fechaOk = prod.fechaIngreso ? new Date(prod.fechaIngreso).toISOString().split('T')[0] : '';
        setFormData({ ...prod, fechaIngreso: fechaOk });
        setIdEditando(prod.id);
        setModoEdicion(true);

        // Lógica para detectar si es marca custom o predefinida
        if (MARCAS_COMUNES.includes(prod.marca)) {
            setMarcaSelect(prod.marca);
        } else if (prod.marca) {
            setMarcaSelect("Otra");
        } else {
            setMarcaSelect("");
        }

        setVista('formulario');
    };

    const handleNuevaMarca = () => {
        setFormData(formInicial);
        setMarcaSelect(""); // Resetear marca
        setModoEdicion(false);
        setVista('formulario');
    };

    // Manejo del cambio en el Select de Marcas
    const handleMarcaSelectChange = (e) => {
        const val = e.target.value;
        setMarcaSelect(val);
        if (val !== 'Otra') {
            setFormData({ ...formData, marca: val });
        } else {
            setFormData({ ...formData, marca: '' }); // Limpiar para que escriba la nueva
        }
    };

    const filtered = productos.filter(p =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
        (p.proveedor && p.proveedor.toLowerCase().includes(busqueda.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-[#F3F4F6] p-4 md:p-8 font-sans text-slate-800">

            {/* HEADER */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 border border-gray-200 rounded-lg font-bold hover:bg-slate-50 transition shadow-sm">
                        <ArrowLeft size={18} /> Menú
                    </button>
                    <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                        📦 Inventario
                    </h1>
                </div>

                {vista === 'lista' && (
                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-grow md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar por Nombre, Código..."
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                value={busqueda}
                                onChange={e => setBusqueda(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={handleNuevaMarca}
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold shadow-md hover:bg-blue-700 transition flex items-center gap-2"
                        >
                            <Plus size={20} /> <span className="hidden sm:inline">Nuevo</span>
                        </button>
                    </div>
                )}
            </div>

            {/* VISTA LISTA */}
            {vista === 'lista' && (
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="text-center py-20 flex flex-col items-center">
                            <div className="animate-spin w-10 h-10 border-4 border-blue-500 rounded-full border-t-transparent mb-4"></div>
                            <p className="text-gray-400 font-medium">Cargando productos...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filtered.map(p => (
                                <ProductCard
                                    key={p.id}
                                    producto={p}
                                    rol={rolUsuario}
                                    onEdit={prepararEdicion}
                                    onDelete={handleBorrar}
                                />
                            ))}
                            {filtered.length === 0 && (
                                <div className="col-span-full py-20 text-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-300">
                                    <Package className="w-16 h-16 mx-auto mb-2 opacity-30" />
                                    No hay productos que coincidan
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* VISTA FORMULARIO COMPLETA */}
            {vista === 'formulario' && (
                <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

                    {/* Encabezado Form */}
                    <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                                {modoEdicion ? '✏️ Editar Producto' : '✨ Nuevo Producto'}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">Completa los detalles para el inventario</p>
                        </div>
                        <button onClick={() => setVista('lista')} className="p-2 bg-white rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition border border-gray-200">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-12 gap-8">

                        {/* COLUMNA IZQUIERDA: FOTO (3 columnas) */}
                        <div className="md:col-span-4 flex flex-col gap-4">
                            <div className="border-2 border-dashed border-blue-100 rounded-2xl bg-blue-50/50 p-6 flex flex-col items-center justify-center text-center h-full min-h-[250px] relative group">
                                {formData.foto ? (
                                    <img src={formData.foto} className="max-h-48 object-contain mb-4 rounded-lg shadow-sm bg-white p-2" />
                                ) : (
                                    <div className="mb-4 text-blue-300"><Package size={64} /></div>
                                )}
                                <label className="cursor-pointer">
                                    <span className="bg-white text-blue-600 px-4 py-2 rounded-lg font-bold text-sm shadow-sm border border-blue-100 hover:bg-blue-600 hover:text-white transition">
                                        {formData.foto ? 'Cambiar Foto' : 'Subir Imagen'}
                                    </span>
                                    <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                                </label>
                                <p className="text-xs text-gray-400 mt-2">Máx. 2MB (JPG, PNG)</p>
                            </div>
                        </div>

                        {/* COLUMNA DERECHA: DATOS (9 columnas) */}
                        <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-5">

                            {/* Sección: Información Principal */}
                            <div className="md:col-span-2 pb-2 mb-2 border-b border-gray-100">
                                <h3 className="text-xs font-black text-blue-500 uppercase tracking-wide mb-4">Información General</h3>
                            </div>

                            <Input label="Código" val={formData.codigo} set={v => setFormData({ ...formData, codigo: v })} placeholder="Ej: A-001" required />

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Categoría</label>
                                <select className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition" value={formData.categoria} onChange={e => setFormData({ ...formData, categoria: e.target.value })}>
                                    <option>Teclados</option><option>Cargadores</option><option>motherboard</option><option>Laptops</option><option>Memorias</option><option>Discos SSD / HDD</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <Input label="Nombre del Producto" val={formData.nombre} set={v => setFormData({ ...formData, nombre: v })} placeholder="Ej: Pasta Térmica Arctic MX-4" required bold />
                            </div>

                            {/* LÓGICA DE MARCA */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Marca</label>
                                <select
                                    className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none mb-2"
                                    value={marcaSelect}
                                    onChange={handleMarcaSelectChange}
                                >
                                    <option value="">-- Seleccionar --</option>
                                    {MARCAS_COMUNES.map(m => <option key={m} value={m}>{m}</option>)}
                                    <option value="Otra">Otra (Escribir manualmente)</option>
                                </select>

                                {/* Input condicional si selecciona "Otra" */}
                                {marcaSelect === 'Otra' && (
                                    <input
                                        type="text"
                                        placeholder="Escribe la marca..."
                                        value={formData.marca}
                                        onChange={e => setFormData({ ...formData, marca: e.target.value })}
                                        className="w-full p-3 border-2 border-blue-100 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none text-blue-700 font-medium animate-in fade-in slide-in-from-top-2"
                                        autoFocus
                                    />
                                )}
                            </div>

                            <Input label="Modelo" val={formData.modelo} set={v => setFormData({ ...formData, modelo: v })} placeholder="Ej: Tubo 20g" />

                            {/* Sección: Datos Financieros & Stock */}
                            <div className="md:col-span-2 pb-2 mb-2 mt-4 border-b border-gray-100">
                                <h3 className="text-xs font-black text-amber-500 uppercase tracking-wide mb-4">Stock y Finanzas</h3>
                            </div>

                            <Input label="Proveedor" val={formData.proveedor} set={v => setFormData({ ...formData, proveedor: v })} placeholder="Ej: Amazon Import" />
                            <Input label="Fecha Ingreso" type="date" val={formData.fechaIngreso} set={v => setFormData({ ...formData, fechaIngreso: v })} />

                            <div className="md:col-span-2 grid grid-cols-2 gap-5 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <Input label="Costo Compra ($)" type="number" val={formData.costo} set={v => setFormData({ ...formData, costo: v })} placeholder="0.00" />
                                {/* PRECIO VENTA NO OBLIGATORIO */}
                                <div className="flex flex-col">
                                    <label className="text-xs font-bold text-blue-600 uppercase mb-1 ml-1">Precio Venta ($) <span className="text-gray-400 font-normal normal-case">(Opcional)</span></label>
                                    <input
                                        type="number"
                                        value={formData.precioVenta}
                                        onChange={e => setFormData({ ...formData, precioVenta: e.target.value })}
                                        placeholder="0.00"
                                        className="w-full p-3 bg-white border-2 border-blue-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition font-black text-lg text-slate-700"
                                    />
                                </div>
                            </div>

                            <Input label="Stock Actual" type="number" val={formData.stock} set={v => setFormData({ ...formData, stock: v })} />
                            <Input label="Stock Mínimo" type="number" val={formData.stockMin} set={v => setFormData({ ...formData, stockMin: v })} placeholder="2" />

                            <div className="md:col-span-2">
                                <Input label="Garantía (Meses)" type="number" val={formData.garantia} set={v => setFormData({ ...formData, garantia: v })} placeholder="0 si no tiene" />
                            </div>
                        </div>

                        {/* BOTONES ACCIÓN */}
                        <div className="md:col-span-12 flex gap-4 mt-4 pt-6 border-t border-gray-100">
                            <button type="button" onClick={() => setVista('lista')} className="px-8 py-4 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition">
                                Cancelar
                            </button>
                            <button type="submit" className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/30 hover:scale-[1.01] transition transform active:scale-95 flex items-center justify-center gap-2">
                                <Save size={20} />
                                {modoEdicion ? 'Actualizar Producto' : 'Guardar Producto'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

// Componente Input Reutilizable
const Input = ({ label, val, set, type = "text", required = false, placeholder = "", bold = false }) => (
    <div className="flex flex-col w-full">
        <label className={`text-xs font-bold text-gray-500 uppercase mb-1 ml-1 ${required ? 'after:content-["*"] after:text-red-500' : ''}`}>{label}</label>
        <input
            type={type}
            value={val}
            onChange={e => set(e.target.value)}
            required={required}
            placeholder={placeholder}
            className={`w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition ${bold ? 'font-bold text-gray-800' : ''}`}
        />
    </div>
);

export default Inventario;