-- Supabase / PostgreSQL Schema for Red de Medios

CREATE TYPE suscripcion_status AS ENUM ('inactiva', 'activa');

CREATE TABLE medios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(255) NOT NULL,
    total_suscriptores_aportados INTEGER DEFAULT 0
);

CREATE TABLE perfiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    status_suscripcion suscripcion_status DEFAULT 'inactiva',
    fecha_vencimiento TIMESTAMP WITH TIME ZONE,
    medio_referente_id UUID REFERENCES medios(id),
    codigo_alfanumerico VARCHAR(6) UNIQUE NOT NULL DEFAULT substr(md5(random()::text), 1, 6)
);

-- RLS (Row Level Security) Policies
ALTER TABLE medios ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede ver los medios (público)
CREATE POLICY "Medios son visibles para todos" ON medios FOR SELECT USING (true);

-- Los usuarios solo pueden ver su propio perfil
CREATE POLICY "Usuarios ven su perfil" ON perfiles FOR SELECT USING (auth.uid() = id);

-- Solo el sistema de webhook (Service Role) puede actualizar el estado de la suscripción
CREATE POLICY "Solo webhook actualiza suscripciones" ON perfiles FOR UPDATE USING (auth.role() = 'service_role');
