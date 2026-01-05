import { useState } from 'react';
import { ArrowLeft, Save, User, Smartphone, Laptop, Wrench, DollarSign, PackagePlus, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 🔴 TU URL DE APPS SCRIPT:
const API_URL = "https://script.google.com/macros/s/AKfycbwazEc28rpBBqhg8Sh5yZly-JrcSg-mCpsWD9nKvTRxX5PilnrR2ZRnch_SpYODjrQw/exec";

export default function NuevaOrden() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Estado del formulario
    const [formData, setFormData] = useState({
        cliente: '',
        celular: '',
        equipo: '',
        accesorios: '', // <--- Aquí guardamos "Cargador, funda, etc."
        falla: '',
        costo: '',
        acuenta: '',
        metodo: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Convertimos los datos a parámetros de URL
            const params = new URLSearchParams(formData).toString();

            const response = await fetch(`${API_URL}?action=guardarReparacion&${params}`);
            const data = await response.json();

            if (data.success) {
                alert(`¡Orden creada con éxito! ID: ${data.id}`);
                navigate('/reparaciones'); // Volver a la lista
            } else {
                alert("Hubo un error al guardar.");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F3F4F6] p-4 md:p-6 font-sans">

            {/* HEADER */}
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate('/reparaciones')} className="p-3 bg-white rounded-xl shadow-sm text-gray-600 hover:bg-gray-50">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-black text-gray-800">Nueva Orden de Servicio</h1>
            </div>

            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* COLUMNA 1: Datos del Cliente (Izquierda) */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm space-y-6 h-fit">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <User className="text-blue-500" size={20} /> Cliente
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Nombre Completo</label>
                                <input
                                    required name="cliente" value={formData.cliente} onChange={handleChange}
                                    type="text" placeholder="Ej: Juan Pérez"
                                    className="w-full p-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Celular / WhatsApp</label>
                                <input
                                    required name="celular" value={formData.celular} onChange={handleChange}
                                    type="tel" placeholder="999 000 000"
                                    className="w-full p-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    {/* COLUMNA 2: Equipo y Detalles (Centro - Más ancha) */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm space-y-6 md:col-span-2">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <Laptop className="text-purple-500" size={20} /> Datos del Equipo
                        </h3>

                        {/* Fila doble: Equipo y Accesorios */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Equipo / Marca / Modelo</label>
                                <input
                                    required name="equipo" value={formData.equipo} onChange={handleChange}
                                    type="text" placeholder="Ej: Laptop HP Pavilion 15"
                                    className="w-full p-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-purple-500 focus:bg-white outline-none transition-all font-medium"
                                />
                            </div>

                            {/* --- AQUÍ ESTÁ LO QUE PEDISTE --- */}
                            <div>
                                <label className="text-xs font-bold text-gray-400 ml-1 uppercase flex items-center gap-1">
                                    <PackagePlus size={12} /> Accesorios y Estado
                                </label>
                                <input
                                    name="accesorios" value={formData.accesorios} onChange={handleChange}
                                    type="text" placeholder="Ej: Solo cargador, Pantalla rayada..."
                                    className="w-full p-3 bg-orange-50 text-orange-800 placeholder-orange-300 rounded-xl border-2 border-transparent focus:border-orange-400 focus:bg-white outline-none transition-all font-medium"
                                />
                                <p className="text-[10px] text-gray-400 mt-1 ml-1">¿Deja cargador? ¿Mochila? ¿Tiene golpes?</p>
                            </div>
                        </div>

                        {/* Falla Reportada */}
                        <div>
                            <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Falla Reportada</label>
                            <textarea
                                required name="falla" value={formData.falla} onChange={handleChange}
                                rows="3" placeholder="Describe el problema que indica el cliente..."
                                className="w-full p-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-purple-500 focus:bg-white outline-none transition-all font-medium resize-none"
                            ></textarea>
                        </div>
                    </div>

                    {/* COLUMNA 3: Costos (Abajo completa) */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm space-y-6 md:col-span-3">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <DollarSign className="text-green-500" size={20} /> Presupuesto Inicial
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div>
                                <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Costo Estimado (S/)</label>
                                <input
                                    name="costo" type="number" value={formData.costo} onChange={handleChange}
                                    className="w-full p-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-green-500 focus:bg-white outline-none transition-all font-bold text-gray-700"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 ml-1 uppercase">A Cuenta / Adelanto (S/)</label>
                                <input
                                    name="acuenta" type="number" value={formData.acuenta} onChange={handleChange}
                                    className="w-full p-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-green-500 focus:bg-white outline-none transition-all font-bold text-gray-700"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Método de Pago</label>
                                <select
                                    name="metodo" value={formData.metodo} onChange={handleChange}
                                    className="w-full p-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-green-500 focus:bg-white outline-none transition-all font-medium cursor-pointer"
                                >
                                    <option value="">-- Seleccionar --</option>
                                    <option value="Efectivo">💵 Efectivo</option>
                                    <option value="Yape/Plin">📱 Yape / Plin</option>
                                    <option value="Transferencia">🏦 Transferencia</option>
                                </select>
                            </div>
                        </div>
                    </div>

                </div>

                {/* BOTÓN GUARDAR */}
                <div className="mt-8 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`
              px-8 py-4 rounded-2xl font-bold text-lg shadow-xl flex items-center gap-3 transition-all
              ${loading ? 'bg-gray-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 shadow-blue-500/30 text-white'}
            `}
                    >
                        {loading ? 'Guardando...' : <><Save size={24} /> Registrar Orden</>}
                    </button>
                </div>

            </form>
        </div>
    );
}