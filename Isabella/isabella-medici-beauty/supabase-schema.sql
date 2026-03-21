-- =============================================
-- Isabella Médici Beauty — Supabase Schema
-- Execute no SQL Editor do Supabase
-- =============================================

-- 1. Perfis de usuário (estende o auth.users do Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
  id        UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name      TEXT NOT NULL,
  phone     TEXT NOT NULL,
  email     TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: usuário só acessa seu próprio perfil
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuário lê seu perfil" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Usuário atualiza seu perfil" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Usuário cria seu perfil" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Serviços
CREATE TABLE IF NOT EXISTS public.services (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_pt      TEXT NOT NULL,
  name_en      TEXT NOT NULL,
  name_es      TEXT NOT NULL,
  desc_pt      TEXT,
  desc_en      TEXT,
  desc_es      TEXT,
  category     TEXT CHECK (category IN ('cilios', 'sobrancelhas')) NOT NULL,
  price        NUMERIC(10,2) NOT NULL,
  duration_min INTEGER NOT NULL,
  image_url    TEXT,
  active       BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Leitura pública dos serviços
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Serviços públicos" ON public.services FOR SELECT USING (active = TRUE);

-- 3. Agendamentos
CREATE TABLE IF NOT EXISTS public.appointments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  service_id   UUID REFERENCES public.services(id),
  service_name TEXT NOT NULL,
  date         DATE NOT NULL,
  time         TIME NOT NULL,
  status       TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuário vê seus agendamentos" ON public.appointments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuário cria agendamento" ON public.appointments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuário cancela agendamento" ON public.appointments FOR UPDATE USING (auth.uid() = user_id);

-- 4. Slots disponíveis
CREATE TABLE IF NOT EXISTS public.available_slots (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date      DATE NOT NULL,
  time      TIME NOT NULL,
  is_booked BOOLEAN DEFAULT FALSE,
  UNIQUE (date, time)
);

-- Leitura pública dos slots
ALTER TABLE public.available_slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Slots públicos" ON public.available_slots FOR SELECT USING (TRUE);

-- 5. Trigger: criar perfil automaticamente após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, phone, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- Dados de exemplo para slots disponíveis
-- =============================================
INSERT INTO public.available_slots (date, time) VALUES
  (CURRENT_DATE + 1, '09:00'), (CURRENT_DATE + 1, '10:30'),
  (CURRENT_DATE + 1, '14:00'), (CURRENT_DATE + 1, '16:00'),
  (CURRENT_DATE + 2, '09:00'), (CURRENT_DATE + 2, '11:00'),
  (CURRENT_DATE + 2, '14:30'), (CURRENT_DATE + 2, '17:00'),
  (CURRENT_DATE + 3, '09:00'), (CURRENT_DATE + 3, '10:00'),
  (CURRENT_DATE + 3, '15:00'), (CURRENT_DATE + 3, '16:30')
ON CONFLICT DO NOTHING;
