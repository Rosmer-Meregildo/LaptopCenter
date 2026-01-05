import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Search, Plus, Laptop, Smartphone, Calendar,
    Trash2, Edit, Filter, Wallet, CheckCircle2, Clock, X, Save, CreditCard, Wrench
} from 'lucide-react';
import Swal from 'sweetalert2';

// 🔴 🔴 IMPORTANTE: PEGA AQUÍ TU URL ACTUALIZADA DEL PASO ANTERIOR 🔴 🔴
const API_URL = "https://script.google.com/macros/s/AKfycbwazEc28rpBBqhg8Sh5yZly-JrcSg-mCpsWD9nKvTRxX5PilnrR2ZRnch_SpYODjrQw/exec";

export default function Reparaciones() {
    const navigate = useNavigate();
    const [reparaciones, setReparaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('todos');
    const [itemEditando, setItemEditando] = useState(null);

    const cargarDatos = () => {
        setLoading(true);
        fetch(`${API_URL}?action=obtenerReparaciones`)
            .then(res => res.json())
            .then(data => {
                if (data.success && Array.isArray(data.data)) {
                    setReparaciones(data.data.reverse());
                } else {
                    setReparaciones([]);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => { cargarDatos(); }, []);

    const handleDelete = (id) => {
        Swal.fire({
            title: '¿Eliminar?', text: "Se borrará permanentemente.", icon: 'warning',
            showCancelButton: true, confirmButtonColor: '#ef4444', confirmButtonText: 'Sí, borrar',
            customClass: { popup: 'rounded-2xl' }
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.showLoading();
                fetch(`${API_URL}?action=borrarReparacion&id=${id}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) { Swal.fire({ title: 'Eliminado', icon: 'success', timer: 1500, showConfirmButton: false, customClass: { popup: 'rounded-2xl' } }); cargarDatos(); }
                    });
            }
        });
    };

    const guardarEdicion = (e) => {
        e.preventDefault();
        Swal.showLoading();

        // Protección: Verificar que tenemos ID
        if (!itemEditando || !itemEditando.id) {
            Swal.fire('Error', 'No hay datos para editar', 'error');
            return;
        }

        // Formatear la fecha para enviarla bien
        let fechaParaEnviar = '';
        // Solo enviamos fecha si está "Entregado" y la fecha es válida
        if (itemEditando.estado === 'Entregado' && itemEditando.fecha_entrega) {
            fechaParaEnviar = itemEditando.fecha_entrega;
        }

        const params = new URLSearchParams({
            action: 'editarReparacion',
            id: itemEditando.id,
            cliente: itemEditando.cliente,
            celular: itemEditando.celular || '',
            equipo: itemEditando.equipo,
            falla: itemEditando.falla,
            trabajo: itemEditando.trabajo || '',
            costo: itemEditando.costo,
            acuenta: itemEditando.a_cuenta,
            estado: itemEditando.estado,
            metodo: itemEditando.metodo_pago,
            fecha_entrega: fechaParaEnviar
        }).toString();

        fetch(`${API_URL}?${params}`)
            .then(res => {
                // Si la respuesta no es correcta (ej. error 404 o 500), lanzamos error manual
                if (!res.ok) throw new Error("Error en la conexión con Google Sheets");
                return res.json();
            })
            .then(data => {
                if (data.success) {
                    // Cerramos el modal ANTES de mostrar la alerta para evitar conflictos
                    setItemEditando(null);

                    // Alerta Bonita (Simplificada para evitar errores visuales)
                    Swal.fire({
                        icon: 'success',
                        title: '¡Excelente!',
                        text: 'Orden actualizada correctamente',
                        timer: 2000,
                        showConfirmButton: false,
                        confirmButtonColor: '#2563EB',
                        backdrop: true
                    });

                    cargarDatos();
                } else {
                    throw new Error("Google Sheets no guardó los cambios");
                }
            })
            .catch(error => {
                console.error("Error al guardar:", error);
                // Esto evita la pantalla blanca y te avisa qué pasó
                Swal.fire({
                    icon: 'error',
                    title: 'Ocurrió un error',
                    text: 'Revisa tu conexión o que la URL del Script sea la correcta.',
                    confirmButtonText: 'Entendido'
                });
            });
    };

    // Lógica inteligente para cambio de estado
    const cambiarEstado = (nuevoEstado) => {
        let nuevaFecha = itemEditando.fecha_entrega;
        // Si pone entregado y no hay fecha, sugerimos HOY
        if (nuevoEstado === 'Entregado' && !nuevaFecha) {
            nuevaFecha = new Date().toISOString().split('T')[0];
        }
        // Si quita entregado, limpiamos fecha (opcional)
        if (nuevoEstado !== 'Entregado') {
            nuevaFecha = '';
        }
        setItemEditando({
            ...itemEditando,
            estado: nuevoEstado,
            fecha_entrega: nuevaFecha
        });
    };

    const formatDateForInput = (isoDate) => {
        if (!isoDate) return '';
        const d = new Date(isoDate);
        if (isNaN(d.getTime())) return '';
        return d.toISOString().split('T')[0];
    };

    const formatDateDisplay = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    const datosFiltrados = reparaciones.filter(item => {
        const texto = busqueda.toLowerCase();
        const matchTexto = (item.cliente || '').toLowerCase().includes(texto) || (item.equipo || '').toLowerCase().includes(texto);
        let matchTipo = true;
        const est = (item.estado || '').toLowerCase();
        if (filtroTipo === 'deudores') matchTipo = (item.saldo > 0);
        else if (filtroTipo === 'pendientes') matchTipo = !est.includes('entregado') && !est.includes('listo');
        else if (filtroTipo === 'listos') matchTipo = est.includes('listo');
        return matchTexto && matchTipo;
    });

    const getIcon = (equipoName) => {
        const name = (equipoName || '').toLowerCase();
        return name.includes('celular') || name.includes('iphone') ? <Smartphone className="text-blue-600" size={20} /> : <Laptop className="text-purple-600" size={20} />;
    };

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans pb-20">

            {/* HEADER */}
            <div className="bg-white px-6 pt-6 pb-6 shadow-sm sticky top-0 z-10">
                <div className="flex justify-between items-center mb-4 max-w-6xl mx-auto">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft /></button>
                        <h1 className="text-xl font-black text-gray-800">Taller</h1>
                    </div>
                    <button onClick={() => navigate('/nueva-orden')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full font-bold shadow-lg hover:bg-blue-700 transition">
                        <Plus size={20} /> <span className="hidden sm:inline">Nueva Orden</span>
                    </button>
                </div>

                <div className="max-w-6xl mx-auto space-y-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
                        <input type="text" placeholder="Buscar cliente..." className="w-full bg-gray-100 py-3 pl-11 pr-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setBusqueda(e.target.value)} />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                        {[
                            { id: 'todos', label: 'Todos', icon: Filter },
                            { id: 'pendientes', label: 'En Taller', icon: Clock },
                            { id: 'listos', label: 'Listos', icon: CheckCircle2 },
                            { id: 'deudores', label: 'Deudores', icon: Wallet },
                        ].map(f => (
                            <button key={f.id} onClick={() => setFiltroTipo(f.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border ${filtroTipo === f.id ? 'bg-gray-800 text-white' : 'bg-white text-gray-600'}`}>
                                <f.icon size={14} /> {f.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* GRID CON SKELETON LOADING */}
            <div className="px-4 mt-6 max-w-7xl mx-auto">
                {loading ? (
                    // 👻 SKELETON LOADING
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
                        {[...Array(8)].map((_, n) => (
                            <div key={n} className="bg-white rounded-2xl p-5 border border-gray-100 h-48 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-3 items-center w-full">
                                        <div className="bg-gray-200 h-10 w-10 rounded-xl"></div>
                                        <div className="space-y-2 w-3/4">
                                            <div className="bg-gray-200 h-4 w-1/2 rounded-full"></div>
                                            <div className="bg-gray-200 h-3 w-1/3 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="bg-gray-100 h-3 w-full rounded-full"></div>
                                    <div className="bg-gray-100 h-3 w-5/6 rounded-full"></div>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                                    <div className="bg-gray-200 h-6 w-16 rounded-lg"></div>
                                    <div className="flex gap-2">
                                        <div className="bg-gray-100 h-8 w-8 rounded-lg"></div>
                                        <div className="bg-gray-100 h-8 w-16 rounded-lg"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // DATOS REALES
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {datosFiltrados.map((item, i) => (
                            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">

                                {item.saldo > 0 && (
                                    <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-bold px-2 py-1 rounded-bl-xl">DEUDA S/{item.saldo}</div>
                                )}

                                <div>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex gap-3 items-center">
                                            <div className="bg-gray-50 p-2.5 rounded-xl">{getIcon(item.equipo)}</div>
                                            <div>
                                                <h3 className="font-bold text-gray-800 leading-tight truncate w-32">{item.cliente}</h3>
                                                <p className="text-xs text-gray-500">{item.equipo}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase border 
                                ${(item.estado || '').includes('Listo') ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                (item.estado || '').includes('Pendiente') ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                    (item.estado || '').includes('Entregado') ? 'bg-gray-100 text-gray-500 border-gray-200' : 'bg-blue-50 text-blue-500'}`}>
                                            {item.estado}
                                        </span>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-2.5 mb-3 space-y-2">
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">Falla</p>
                                            <p className="text-xs text-gray-600 line-clamp-1">{item.falla}</p>
                                        </div>
                                        {item.trabajo && (
                                            <div className="border-t border-gray-200 pt-1">
                                                <p className="text-[10px] text-blue-500 font-bold uppercase">Trabajo</p>
                                                <p className="text-xs text-blue-700 font-medium line-clamp-2">{item.trabajo}</p>
                                            </div>
                                        )}
                                        {item.fecha_entrega && (
                                            <div className="border-t border-gray-200 pt-1 flex items-center gap-1">
                                                <CheckCircle2 size={10} className="text-green-500" />
                                                <p className="text-[10px] text-green-600 font-medium">Entregado: {formatDateDisplay(item.fecha_entrega)}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Saldo</p>
                                        <p className={`font-black text-lg leading-none ${item.saldo > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                            {item.saldo > 0 ? `S/${item.saldo}` : 'Pagado'}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                        <button onClick={() => {
                                            setItemEditando({
                                                ...item,
                                                fecha_entrega: formatDateForInput(item.fecha_entrega)
                                            })
                                        }} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 flex items-center gap-1">
                                            <Edit size={14} /> Editar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* --- MODAL DE EDICIÓN --- */}
            {itemEditando && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">

                        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b">
                            <h2 className="font-bold text-lg text-gray-800">Editar Orden #{itemEditando.id}</h2>
                            <button onClick={() => setItemEditando(null)} className="p-2 bg-white rounded-full text-gray-500 hover:bg-gray-200"><X size={20} /></button>
                        </div>

                        <form onSubmit={guardarEdicion} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Cliente</label>
                                    <input type="text" className="w-full p-2 bg-gray-50 rounded-lg border outline-none font-medium"
                                        value={itemEditando.cliente} onChange={(e) => setItemEditando({ ...itemEditando, cliente: e.target.value })} required />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Equipo</label>
                                    <input type="text" className="w-full p-2 bg-gray-50 rounded-lg border outline-none font-medium"
                                        value={itemEditando.equipo} onChange={(e) => setItemEditando({ ...itemEditando, equipo: e.target.value })} required />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Falla</label>
                                    <input type="text" className="w-full p-2 bg-gray-50 rounded-lg border outline-none font-medium"
                                        value={itemEditando.falla} onChange={(e) => setItemEditando({ ...itemEditando, falla: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-blue-500 uppercase flex items-center gap-1">
                                        <Wrench size={12} /> Trabajo Realizado
                                    </label>
                                    <textarea rows="2" className="w-full p-2 bg-blue-50 text-blue-900 rounded-lg border border-blue-100 outline-none font-medium"
                                        value={itemEditando.trabajo || ''}
                                        onChange={(e) => setItemEditando({ ...itemEditando, trabajo: e.target.value })} />
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase">Total</label>
                                        <input type="number" className="w-full p-2 bg-white rounded-lg font-bold text-gray-700 outline-none"
                                            value={itemEditando.costo} onChange={(e) => setItemEditando({ ...itemEditando, costo: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase">A Cuenta</label>
                                        <input type="number" className="w-full p-2 bg-white rounded-lg font-bold text-green-600 outline-none"
                                            value={itemEditando.a_cuenta} onChange={(e) => setItemEditando({ ...itemEditando, a_cuenta: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-red-400 uppercase">Deuda</label>
                                        <div className="w-full p-2 text-center font-black text-red-500 text-lg">
                                            S/ {itemEditando.costo - itemEditando.a_cuenta}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Estado</label>
                                    <select className="w-full p-3 bg-gray-50 rounded-lg border outline-none font-medium"
                                        value={itemEditando.estado} onChange={(e) => cambiarEstado(e.target.value)}>
                                        <option value="Pendiente">🟡 Pendiente</option>
                                        <option value="En Revisión">🔵 En Revisión</option>
                                        <option value="Listo">🟢 Listo para entregar</option>
                                        <option value="Entregado">⚪ Entregado / Cerrado</option>
                                    </select>
                                </div>

                                {itemEditando.estado === 'Entregado' && (
                                    <div className="col-span-1 animate-fade-in">
                                        <label className="text-xs font-bold text-green-600 uppercase flex items-center gap-1">
                                            <Calendar size={12} /> Fecha Entrega
                                        </label>
                                        <input type="date" className="w-full p-3 bg-green-50 text-green-800 rounded-lg border border-green-200 outline-none font-bold"
                                            value={itemEditando.fecha_entrega || ''}
                                            onChange={(e) => setItemEditando({ ...itemEditando, fecha_entrega: e.target.value })} />
                                    </div>
                                )}

                                <div className="col-span-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1">
                                        <CreditCard size={12} /> Método Pago
                                    </label>
                                    <select className="w-full p-3 bg-gray-50 rounded-lg border outline-none font-medium"
                                        value={itemEditando.metodo_pago || ''} onChange={(e) => setItemEditando({ ...itemEditando, metodo_pago: e.target.value })}>
                                        <option value="">Seleccionar...</option>
                                        <option value="Efectivo">💵 Efectivo</option>
                                        <option value="Yape/Plin">📱 Yape / Plin</option>
                                        <option value="Transferencia">🏦 Transferencia</option>
                                    </select>
                                </div>
                            </div>

                            <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex justify-center gap-2 items-center shadow-lg shadow-blue-500/30 transition-transform active:scale-95">
                                <Save size={20} /> Guardar Cambios
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}