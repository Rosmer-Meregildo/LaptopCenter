import { User, Lock, Eye, EyeOff, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// 🔴 🔴 PEGA TU URL DE APPS SCRIPT AQUÍ: 🔴 🔴
const API_URL = "https://script.google.com/macros/s/AKfycbz2W0Bbn6Yn4hlzVdK52afvB5QLaI7_3_pl67Sx6J3YZEP1jYwK3yziLbhliC-HGzoW/exec";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'

    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!usuario || !password) {
            Swal.fire({
                icon: 'warning',
                title: 'Faltan datos',
                text: 'Por favor ingresa usuario y contraseña',
                confirmButtonColor: '#F59E0B',
                customClass: { popup: 'rounded-[2rem]' }
            });
            return;
        }

        setStatus('loading');

        try {
            const response = await fetch(`${API_URL}?action=login&user=${usuario}&pass=${password}`);
            const data = await response.json();

            if (data.success) {
                // ✅ 1. ESTO LO NECESITA TU DASHBOARD (RESTAURADO)
                sessionStorage.setItem('token_taller', 'autorizado');
                sessionStorage.setItem('usuario_nombre', data.nombre || usuario);
                sessionStorage.setItem('usuario_foto', data.foto || '');

                // ✅ 2. ESTO LO NECESITA EL INVENTARIO (NUEVO - PARA EL ROL)
                localStorage.setItem('usuarioTaller', JSON.stringify({
                    nombre: data.nombre || usuario,
                    rol: data.rol || 'user', // Aquí guardamos si es admin o user
                    foto: data.foto || ''
                }));

                setStatus('success');

                // Notificación Toast
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true
                });

                Toast.fire({
                    icon: 'success',
                    title: `Bienvenido, ${data.nombre || 'Administrador'}`
                });

                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500);

            } else {
                setStatus('error');
                Swal.fire({
                    icon: 'error',
                    title: 'Acceso Denegado',
                    text: 'Usuario o contraseña incorrectos',
                    confirmButtonColor: '#ef4444',
                    background: '#fff',
                    backdrop: `rgba(0,0,0,0.6)`,
                    customClass: {
                        popup: 'rounded-[2rem] shadow-2xl p-6',
                        title: 'text-gray-800 font-black',
                        confirmButton: 'rounded-xl px-6 py-3 font-bold'
                    }
                }).then(() => {
                    setStatus('idle');
                });
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
            Swal.fire({
                icon: 'error',
                title: 'Error de Conexión',
                text: 'No se pudo conectar con el servidor. Revisa tu internet.',
                customClass: { popup: 'rounded-[2rem]' }
            }).then(() => setStatus('idle'));
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#F3F4F6] p-4 font-sans">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-sm transition-all duration-300 hover:shadow-blue-500/10 border border-white">

                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-gradient-to-tr from-blue-600 to-blue-400 p-4 rounded-2xl shadow-lg shadow-blue-500/40 mb-4 transform transition-transform hover:scale-110 duration-300">
                        <ShieldCheck className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-800 tracking-tight">Bienvenido</h1>
                    <p className="text-gray-400 font-medium text-sm mt-1">Sistema de Inventario 2026</p>
                </div>

                {/* Inputs */}
                <div className="space-y-5">
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Usuario"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            disabled={status !== 'idle' && status !== 'error'}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl focus:outline-none focus:bg-white transition-all font-medium text-gray-700 disabled:opacity-50"
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={status !== 'idle' && status !== 'error'}
                            className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl focus:outline-none focus:bg-white transition-all font-medium text-gray-700 disabled:opacity-50"
                        />
                        <button
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={status !== 'idle' && status !== 'error'}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* Botón Inteligente */}
                    <button
                        onClick={handleLogin}
                        disabled={status !== 'idle' && status !== 'error'}
                        className={`
              w-full py-4 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-2 transition-all duration-300 transform
              ${status === 'success'
                                ? 'bg-green-500 shadow-green-500/40 scale-105 cursor-default'
                                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/40 active:scale-95 text-white'
                            }
              ${status === 'loading' ? 'cursor-wait opacity-80' : ''}
            `}
                    >
                        {status === 'loading' && (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin text-white" />
                                <span className="text-white">Verificando...</span>
                            </>
                        )}

                        {status === 'success' && (
                            <>
                                <CheckCircle2 className="w-6 h-6 text-white animate-bounce" />
                                <span className="text-white">¡Sesión Lista!</span>
                            </>
                        )}

                        {(status === 'idle' || status === 'error') && (
                            <>
                                <span className="text-white">INGRESAR</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}