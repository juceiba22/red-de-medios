import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMockDB } from '../lib/store';
import { MonitorPlay, Newspaper, Radio, Users } from 'lucide-react';

export default function Landing() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mediaId = searchParams.get('media_id');
  const { login, medios, currentUser } = useMockDB();

  const medioReferente = medios.find(m => m.id === mediaId);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.status_suscripcion === 'activa') {
        navigate('/dashboard');
      } else {
        navigate('/checkout');
      }
    }
  }, [currentUser, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    login(email, mediaId || undefined);
    navigate('/checkout');
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <div className="bg-primary text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80')] opacity-10 bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          {medioReferente && (
            <div className="inline-block bg-accent/20 text-accent-hover border border-accent/30 rounded-full px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide backdrop-blur-md">
              Vienes invitado por <span className="text-white">{medioReferente.nombre}</span>
            </div>
          )}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            La red más grande de <span className="text-accent">periodismo independiente</span>.
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Una sola suscripción. 39 medios aliados. Acceso total a contenido exclusivo, newsletters premium y eventos presenciales.
          </p>
          
          <div className="bg-white/10 p-2 rounded-2xl max-w-xl mx-auto backdrop-blur-sm border border-white/10 shadow-2xl">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Tu correo electrónico..." 
                className="flex-grow px-5 py-4 rounded-xl bg-white text-slate-900 border-0 focus:ring-2 focus:ring-accent outline-none text-lg placeholder:text-slate-400"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <button 
                type="submit" 
                className="px-8 py-4 bg-accent hover:bg-accent-hover transition-all text-white font-bold rounded-xl text-lg whitespace-nowrap shadow-lg shadow-accent/30"
              >
                Suscribirme
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">¿Qué incluye el bundle The Red?</h2>
          <p className="text-slate-600 text-lg">Tu aporte mensual se distribuye equitativamente entre los 39 medios para sostener el periodismo libre.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            { icon: <Newspaper className="h-8 w-8 text-accent" />, title: 'Contenido Sin Paywall', text: 'Lee artículos de investigación, opinión cortas y largas sin límites de paywall en todos los medios asociados.' },
            { icon: <MonitorPlay className="h-8 w-8 text-accent" />, title: 'Streaming y Podcasts', text: 'Recibe acceso anticipado o exclusivo a episodios especiales, documentales y streams en vivo.' },
            { icon: <Users className="h-8 w-8 text-accent" />, title: 'Comunidad y Eventos', text: 'Acceso a la comunidad privada de Discord y descuentos o entradas liberadas a eventos presenciales.' }
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="bg-slate-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        {/* Media grid snippet */}
        <div className="bg-slate-900 rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10"><Radio className="w-64 h-64 text-white" /></div>
          <h3 className="text-2xl font-bold text-white mb-8 relative z-10">4 Medios Líderes + 35 Medios Locales</h3>
          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            {medios.slice(0, 10).map(m => (
              <div key={m.id} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm font-medium border border-slate-700">
                {m.nombre}
              </div>
            ))}
            <div className="px-4 py-2 bg-slate-800/50 text-slate-400 rounded-lg text-sm font-medium border border-slate-800 border-dashed">
              + 29 medios más
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
