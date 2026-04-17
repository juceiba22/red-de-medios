import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMockDB } from '../lib/store';
import { Check, Shield, Loader2 } from 'lucide-react';

export default function Checkout() {
  const { currentUser, simulatePayment } = useMockDB();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = React.useState(false);

  useEffect(() => {
    if (currentUser?.status_suscripcion === 'activa') {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handlePayment = (plan: 'mensual' | 'anual') => {
    setIsProcessing(true);
    // Simulate API delay and Webhook
    setTimeout(() => {
      simulatePayment(plan);
      setIsProcessing(false);
      navigate('/dashboard');
    }, 1500);
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Completa tu Suscripción</h1>
          <p className="text-slate-600">Estás a un paso de apoyar el periodismo independiente.</p>
          <div className="mt-4 text-sm font-medium text-slate-500 bg-slate-200 inline-block px-3 py-1 rounded-full">
            Usuario: {currentUser.email}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Plan Mensual */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:border-accent/50 transition-colors relative flex flex-col">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Mensual</h3>
            <p className="text-slate-500 mb-6 text-sm">Flexibilidad total, cancela cuando quieras.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-slate-900">$5.000</span>
              <span className="text-slate-500 font-medium">/mes</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-grow">
              {['Apoyo al periodismo local', 'Sin anuncios publicitarios', 'Boletín semanal resumen'].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="text-slate-700 font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={() => handlePayment('mensual')}
              disabled={isProcessing}
              className="w-full py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition flex items-center justify-center gap-2"
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Pagar Suscripción'}
            </button>
          </div>

          {/* Plan Anual */}
          <div className="bg-primary rounded-3xl p-8 shadow-xl relative flex flex-col transform md:-translate-y-4 ring-4 ring-primary/20">
            <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-accent text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Mejor Valor
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Anual</h3>
            <p className="text-slate-300 mb-6 text-sm">Ahorra 2 meses con el pago anual.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-white">$50.000</span>
              <span className="text-slate-400 font-medium">/año</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-grow">
              {['Todo lo del plan mensual', '2 meses gratis', 'Acceso a eventos exclusivos', 'Insignia de socio fundador'].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-accent shrink-0" />
                  <span className="text-slate-200 font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={() => handlePayment('anual')}
              disabled={isProcessing}
              className="w-full py-4 rounded-xl bg-accent hover:bg-accent-hover text-white font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Pagar Suscripción'}
            </button>
          </div>
        </div>

        <div className="mt-12 text-center flex flex-col items-center gap-2 text-slate-500 text-sm">
          <div className="flex items-center gap-2 justify-center">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Pagos seguros procesados por Mercado Pago</span>
          </div>
          <p>Al continuar a abonar, este es un ambiente de demostración (MVP).</p>
        </div>
      </div>
    </div>
  );
}
