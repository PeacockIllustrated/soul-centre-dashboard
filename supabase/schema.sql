-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Clients
create table clients (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  preferred_contact_method text check (preferred_contact_method in ('email', 'phone')),
  source text,
  notes text,
  is_active boolean default true
);

-- 2. Services
create table services (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  name text not null,
  category text check (category in ('energy_healing', 'counselling', 'coaching', 'other')),
  description text,
  duration_minutes integer not null,
  base_price numeric(10, 2) not null,
  is_active boolean default true
);

-- 3. Event Templates
create table event_templates (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  name text not null,
  default_description text,
  default_duration_minutes integer,
  default_price numeric(10, 2),
  default_capacity integer,
  default_location text,
  is_active boolean default true
);

-- 4. Event Instances
create table event_instances (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  event_template_id uuid references event_templates(id) on delete cascade,
  title text not null,
  description text,
  start_time timestamptz not null,
  end_time timestamptz not null,
  location text,
  capacity integer,
  price numeric(10, 2),
  status text check (status in ('scheduled', 'completed', 'cancelled')) default 'scheduled'
);

-- 5. Event Attendees
create table event_attendees (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  event_instance_id uuid references event_instances(id) on delete cascade,
  client_id uuid references clients(id) on delete cascade,
  status text check (status in ('booked', 'cancelled', 'attended', 'no_show')) default 'booked',
  payment_status text check (payment_status in ('unpaid', 'paid', 'comped')) default 'unpaid',
  amount_paid numeric(10, 2)
);

-- 6. Sessions (1:1)
create table sessions (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  client_id uuid references clients(id) on delete cascade,
  service_id uuid references services(id) on delete restrict,
  start_time timestamptz not null,
  end_time timestamptz not null,
  location text,
  status text check (status in ('booked', 'completed', 'cancelled', 'no_show')) default 'booked',
  payment_status text check (payment_status in ('unpaid', 'paid', 'comped')) default 'unpaid',
  amount_paid numeric(10, 2)
);

-- 7. Session Notes
create table session_notes (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  session_id uuid references sessions(id) on delete cascade,
  note_type text check (note_type in ('pre', 'post', 'general')),
  content text
);

-- 8. Brand Settings
create table brand_settings (
  id uuid primary key default uuid_generate_v4(),
  primary_quote text,
  primary_color text,
  accent_color text
);

-- RLS Policies
alter table clients enable row level security;
alter table services enable row level security;
alter table event_templates enable row level security;
alter table event_instances enable row level security;
alter table event_attendees enable row level security;
alter table sessions enable row level security;
alter table session_notes enable row level security;
alter table brand_settings enable row level security;

-- Create policies for authenticated users (Admin)
create policy "Allow all access for authenticated users" on clients for all using (auth.role() = 'authenticated');
create policy "Allow all access for authenticated users" on services for all using (auth.role() = 'authenticated');
create policy "Allow all access for authenticated users" on event_templates for all using (auth.role() = 'authenticated');
create policy "Allow all access for authenticated users" on event_instances for all using (auth.role() = 'authenticated');
create policy "Allow all access for authenticated users" on event_attendees for all using (auth.role() = 'authenticated');
create policy "Allow all access for authenticated users" on sessions for all using (auth.role() = 'authenticated');
create policy "Allow all access for authenticated users" on session_notes for all using (auth.role() = 'authenticated');
create policy "Allow all access for authenticated users" on brand_settings for all using (auth.role() = 'authenticated');

-- Triggers for updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql';

create trigger update_clients_updated_at before update on clients for each row execute procedure update_updated_at_column();
create trigger update_services_updated_at before update on services for each row execute procedure update_updated_at_column();
create trigger update_event_templates_updated_at before update on event_templates for each row execute procedure update_updated_at_column();
create trigger update_event_instances_updated_at before update on event_instances for each row execute procedure update_updated_at_column();
create trigger update_sessions_updated_at before update on sessions for each row execute procedure update_updated_at_column();
