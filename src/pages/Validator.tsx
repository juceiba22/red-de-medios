import { useState } from 'react';
import { useMockDB, type User } from '../lib/store';
import { Search, CheckCircle, XCircle, ShieldCheck, QrCode } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Validator() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<{ user: User | null; checked: boolean }>({ user: null, checked: false });
  const { validateMembership } = useMockDB();

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const user = validateMembership(code.trim());
    setResult({ user, checked: true });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <div className="bg-slate-800 p-4 rounded-full inline-flex mb-6">
            <ShieldCheck className="w-12 h-12 text-accent" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Portal Administrador</h2>
          <p className="text-slate-400">Exclusivo para la administración del portal.</p>
        </div>

        <form onSubmit={handleValidate} className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Ingresa código o escanea QR..."
              value={code}
              onChange={(e) => { setCode(e.target.value.toUpperCase()); setResult({ user: null, checked: false }); }}
              className="w-full bg-slate-800 text-white border border-slate-700 rounded-2xl py-5 pl-14 pr-32 text-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent font-mono placeholder:font-sans"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
            <button 
              type="submit" 
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent hover:bg-accent-hover text-white py-3 px-6 rounded-xl font-bold transition flex items-center gap-2"
            >
              Validar
            </button>
          </div>
          <div className="mt-4 flex justify-center">
             <button type="button" className="text-slate-400 hover:text-white text-sm flex items-center gap-2 transition" onClick={() => alert("MVP: Simulación de cámara. En producción abriría la cámara del dispositivo.")}>
                <QrCode className="w-4 h-4"/> Usar cámara
             </button>
          </div>
        </form>

        {result.checked && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            {result.user ? (
              <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl relative overflow-hidden">
                {result.user.status_suscripcion === 'activa' ? (
                  <div className="absolute top-0 right-0 p-4">
                     <CheckCircle className="w-16 h-16 text-emerald-500/20" />
                  </div>
                ) : (
                  <div className="absolute top-0 right-0 p-4">
                     <XCircle className="w-16 h-16 text-red-500/20" />
                  </div>
                )}
                
                <h3 className="text-slate-400 text-sm font-bold tracking-widest uppercase mb-6">Resultado</h3>
                
                <div className="flex items-center gap-4 mb-8">
                  {result.user.status_suscripcion === 'activa' ? (
                    <div className="bg-emerald-500/10 text-emerald-400 p-3 rounded-xl">
                      <CheckCircle className="w-10 h-10" />
                    </div>
                  ) : (
                    <div className="bg-red-500/10 text-red-400 p-3 rounded-xl">
                      <XCircle className="w-10 h-10" />
                    </div>
                  )}
                  <div>
                    <h4 className={`text-2xl font-bold ${result.user.status_suscripcion === 'activa' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {result.user.status_suscripcion === 'activa' ? 'Socio Activo' : 'Suscripción Inactiva'}
                    </h4>
                    <p className="text-slate-300 font-medium">Validación exitosa</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                    <p className="text-slate-500 text-xs font-bold mb-1 uppercase">Usuario / Email</p>
                    <p className="text-white font-medium break-all">{result.user.email}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                      <p className="text-slate-500 text-xs font-bold mb-1 uppercase">Vencimiento</p>
                      <p className="text-white font-medium">
                        {result.user.fecha_vencimiento 
                           ? format(parseISO(result.user.fecha_vencimiento), "dd MMM yyyy", { locale: es })
                           : "-"}
                      </p>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                      <p className="text-slate-500 text-xs font-bold mb-1 uppercase">Aportado Por</p>
                      <p className="text-white font-medium truncate">
                        {result.user.medio_referente_id || "Directo"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-800 rounded-3xl p-8 border border-red-500/30 text-center">
                <div className="bg-red-500/10 text-red-500 p-4 rounded-full inline-block mb-4">
                  <XCircle className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Código No Reconocido</h4>
                <p className="text-slate-400">El código ingresado no corresponde a ningún socio en nuestra base de datos. Verifica e intenta nuevamente.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
