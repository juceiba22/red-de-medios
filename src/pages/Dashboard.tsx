import { useMockDB } from '../lib/store';
import { QRCodeSVG } from 'qrcode.react';
import { BadgeCheck, Info, Clock, AlertCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Dashboard() {
  const { currentUser } = useMockDB();

  if (!currentUser) return null;

  const isActiva = currentUser.status_suscripcion === 'activa';

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-100 py-8 px-4 font-sans">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">Tu Credencial</h1>

        {!isActiva && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 flex gap-3 border border-red-200">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-bold">Suscripción Inactiva</p>
              <p>Tu pago no ha sido procesado o tu suscripción ha expirado. Por favor, regulariza tu pago para acceder a los beneficios.</p>
            </div>
          </div>
        )}

        {/* The Card */}
        <div className="relative group w-full mb-8 perspective-1000">
          <div className={`relative w-full rounded-[2rem] overflow-hidden shadow-2xl transition-transform duration-500 bg-gradient-to-br ${isActiva ? 'from-slate-900 to-slate-800 border-slate-700' : 'from-slate-400 to-slate-500 border-slate-300'} border`}>
            
            {/* Background Texture/Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay"></div>
            
            {/* Top Shine */}
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-white/10 to-transparent"></div>

            <div className="relative p-8 h-full flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-white/50 text-xs font-bold tracking-widest uppercase mb-1">MEMBRESÍA RED</h2>
                  <p className="text-white font-black text-xl tracking-tight">The Bundle.</p>
                </div>
                {isActiva ? (
                  <div className="bg-accent/20 text-accent-hover p-1.5 rounded-full backdrop-blur-md">
                    <BadgeCheck className="w-6 h-6 text-accent" />
                  </div>
                ) : (
                  <div className="bg-red-500/20 p-1.5 rounded-full backdrop-blur-md">
                    <Clock className="w-6 h-6 text-red-400" />
                  </div>
                )}
              </div>

              {/* QR and Code Row */}
              <div className="flex items-center gap-6 mb-8">
                <div className="bg-white p-2.5 rounded-xl shadow-inner w-fit">
                  <QRCodeSVG 
                    value={currentUser.id} 
                    size={100} 
                    fgColor={isActiva ? "#0f172a" : "#64748b"} 
                    bgColor="transparent"
                  />
                </div>
                <div>
                  <p className="text-white/50 text-xs font-bold uppercase mb-1">CÓDIGO ÚNICO</p>
                  <p className="text-white font-mono text-2xl tracking-widest font-bold">
                    {currentUser.codigo_alfanumerico}
                  </p>
                </div>
              </div>

              {/* User Info */}
              <div className="mt-auto">
                <p className="text-white/50 text-xs font-bold uppercase mb-1">PARTNER</p>
                <p className="text-white font-medium text-lg leading-tight mb-4 truncate text-ellipsis overflow-hidden">
                  {currentUser.email}
                </p>
                
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-white/50 text-[10px] font-bold uppercase mb-1">VÁLIDA HASTA</p>
                    <p className="text-slate-300 font-mono text-sm">
                      {currentUser.fecha_vencimiento 
                        ? format(parseISO(currentUser.fecha_vencimiento), "dd MMM yyyy", { locale: es }).toUpperCase()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                     <p className={`text-xs font-bold uppercase ${isActiva ? 'text-accent' : 'text-red-400'}`}>
                        {isActiva ? 'ACTIVA' : 'INACTIVA'}
                     </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
            <Info className="w-5 h-5 text-accent" />
            ¿Cómo usar esta credencial?
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Muestra este código QR o facilita tu código alfanumérico en cualquier evento presencial organizado por los medios asociados. También puedes usar el código en los sitios de la red para vincular tu cuenta sin pagar nuevamente.
          </p>
        </div>

      </div>
    </div>
  );
}
