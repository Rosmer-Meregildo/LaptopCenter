import { LogOut, User, Wrench, PackageSearch, Search, Wallet, Laptop2, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function Dashboard() {
    const navigate = useNavigate();

    // Recuperamos datos de sesión
    const usuario = sessionStorage.getItem('usuario_nombre') || 'User';
    const rol = sessionStorage.getItem('usuario_rol') || 'Bienvenido'; // Asumimos Admin si no hay rol
    const rawFoto = sessionStorage.getItem('usuario_foto');
    
    const [saludo, setSaludo] = useState('');

    // Función para corregir imágenes de Google Drive
    const getFotoUrl = (url) => {
        if (!url) return null;
        if (url.includes('drive.google.com')) {
            const idMatch = url.match(/\/d\/(.*?)\//);
            if (idMatch && idMatch[1]) return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
        }
        return url;
    };

    const fotoPerfil = getFotoUrl(rawFoto);

    useEffect(() => {
        const hora = new Date().getHours();
        if (hora >= 5 && hora < 12) setSaludo('Buenos días,');
        else if (hora >= 12 && hora < 19) setSaludo('Buenas tardes,');
        else setSaludo('Buenas noches,');
    }, []);

    const handleLogout = () => {
        Swal.fire({
            title: '¿Cerrar sesión?',
            text: "Cerraremos tu sesión de forma segura.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#1e293b', // Color oscuro elegante
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Sí, salir',
            cancelButtonText: 'Cancelar',
            background: '#fff',
            customClass: {
                popup: 'rounded-3xl shadow-2xl',
                title: 'text-gray-800 font-bold',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                sessionStorage.clear();
                navigate('/');
            }
        });
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-6 pb-10 font-sans relative overflow-hidden selection:bg-blue-100 selection:text-blue-900">
            
            {/* Elementos de fondo decorativos (Blur sutil) */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

            <div className="max-w-6xl mx-auto relative z-10">

                {/* --- HEADER --- */}
                <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    
                    {/* Perfil del Usuario */}
                    <div className="flex items-center gap-5 w-full md:w-auto bg-white/60 backdrop-blur-xl p-4 rounded-[2rem] border border-white shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-br from-blue-500 to-purple-500">
                                <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center">
                                    {fotoPerfil ? (
                                        <img src={fotoPerfil} alt="Perfil" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="text-gray-300 w-8 h-8" />
                                    )}
                                </div>
                            </div>
                            {/* Indicador Online */}
                            <div className="absolute bottom-1 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-gray-500 font-medium text-sm">{saludo}</span>
                            </div>
                            <h1 className="text-2xl font-black text-gray-800 tracking-tight leading-none mb-1">
                                {usuario}
                            </h1>
                            {/* Badge de ROL */}
                            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 border border-blue-100">
                                <ShieldCheck size={12} className="text-blue-600" />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                                    {rol}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Botón Salir */}
                    <button 
                        onClick={handleLogout}
                        className="group flex items-center gap-2 px-5 py-3 rounded-full bg-white text-gray-400 font-semibold text-sm hover:text-red-500 hover:bg-red-50 transition-all shadow-sm border border-transparent hover:border-red-100"
                    >
                        <span>Cerrar Sesión</span>
                        <div className="p-1 rounded-full bg-gray-100 group-hover:bg-red-200 transition-colors">
                            <LogOut size={16} className="text-gray-500 group-hover:text-red-600" />
                        </div>
                    </button>
                </header>

                {/* --- TÍTULO DE SECCIÓN --- */}
                <div className="flex items-center gap-3 mb-6 pl-2 opacity-80">
                    <Laptop2 className="text-gray-400" size={20} />
                    <h2 className="text-gray-500 font-bold text-sm uppercase tracking-widest">Panel de Control</h2>
                </div>

                {/* --- GRID DE MÓDULOS --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* CARD 1: TALLER (Principal) */}
                    <div 
                        onClick={() => navigate('/Reparaciones')}
                        className="group relative bg-white rounded-[2.5rem] p-8 cursor-pointer border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                    >
                        {/* Fondo decorativo hover */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100"></div>
                        
                        <div className="flex items-start justify-between relative z-10">
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Wrench size={28} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Taller y Reparaciones</h3>
                                <p className="text-gray-400 font-medium text-sm leading-relaxed max-w-xs">
                                    Gestión completa de ingresos, diagnósticos y entregas de equipos.
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* CARD 2: INVENTARIO */}
                    <div
                    onClick={() => navigate('/Inventario')}
                    className="group relative bg-white rounded-[2.5rem] p-8 cursor-pointer border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100"></div>

                        <div className="flex items-start justify-between relative z-10">
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <PackageSearch size={28} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Inventario</h3>
                                <p className="text-gray-400 font-medium text-sm leading-relaxed max-w-xs">
                                    Control de stock, repuestos y accesorios disponibles.
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* CARD 3: GARANTÍAS */}
                    <div className="group relative bg-white rounded-[2.5rem] p-8 cursor-pointer border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100"></div>

                        <div className="flex items-start justify-between relative z-10">
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Search size={28} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Garantías</h3>
                                <p className="text-gray-400 font-medium text-sm leading-relaxed max-w-xs">
                                    Historial de reparaciones y búsqueda por cliente.
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* CARD 4: CAJA */}
                    <div className="group relative bg-white rounded-[2.5rem] p-8 cursor-pointer border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100"></div>

                        <div className="flex items-start justify-between relative z-10">
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Wallet size={28} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Caja Chica</h3>
                                <p className="text-gray-400 font-medium text-sm leading-relaxed max-w-xs">
                                    Movimientos, ingresos y reporte de caja diario.
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}