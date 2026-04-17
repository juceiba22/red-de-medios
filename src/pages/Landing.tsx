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
          <div className="inline-block bg-accent/20 text-accent-hover border border-accent/30 rounded-full px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide backdrop-blur-md">
            Comunidad de <span className="text-white">Lectores</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Bancá el auténtico <span className="text-accent">periodismo independiente</span>.
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Hacé tu aporte al Zorzal Diario. Sumate a nuestra comunidad para acceder a newsletter exclusivos, eventos y sostener las noticias de tu barrio.
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
          <h2 className="text-3xl font-bold text-slate-900 mb-4">¿Qué incluye tu aporte a Zorzal Diario?</h2>
          <p className="text-slate-600 text-lg">Tu aporte mensual permite que sigamos cubriendo lo que pasa en San Martín y la región.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            { icon: <Newspaper className="h-8 w-8 text-accent" />, title: 'Cobertura Libre', text: 'Ayudás a que nuestros artículos y fotorreportajes sigan siendo gratuitos y accesibles para todos.' },
            { icon: <MonitorPlay className="h-8 w-8 text-accent" />, title: 'Contenido Exclusivo', text: 'Recibí nuestro newsletter para miembros con detrás de escena, análisis extra y entrevistas.' },
            { icon: <Users className="h-8 w-8 text-accent" />, title: 'Comunidad Zorzal', text: 'Participá en sorteos, descuentos en actividades culturales y eventos presenciales de la región.' }
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

        {/* CTA snippet */}
        <div className="bg-slate-900 rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10"><Radio className="w-64 h-64 text-white" /></div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 relative z-10">Periodismo Local Autogestivo</h3>
          <p className="text-slate-300 max-w-lg mx-auto relative z-10 text-lg mb-8">
            Hacer periodismo territorial lleva tiempo y trabajo. Sumate a la comunidad del Zorzal y defendamos juntos el derecho a la información en San Martín.
          </p>
        </div>
      </div>
    </div>
  );
}
