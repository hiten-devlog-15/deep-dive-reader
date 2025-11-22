-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create roles enum and table
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'staff');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS for user_roles
CREATE POLICY "Users can view all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Only admins can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create warehouses table
CREATE TABLE public.warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  address TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view warehouses"
ON public.warehouses FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Only managers can manage warehouses"
ON public.warehouses FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));

-- Create product categories table
CREATE TABLE public.product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view categories"
ON public.product_categories FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Only managers can manage categories"
ON public.product_categories FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sku TEXT NOT NULL UNIQUE,
  category_id UUID REFERENCES public.product_categories(id),
  unit_of_measure TEXT NOT NULL,
  reorder_level INTEGER DEFAULT 0,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view products"
ON public.products FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Only managers can manage products"
ON public.products FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));

-- Create stock table (current stock levels per warehouse)
CREATE TABLE public.stock (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (product_id, warehouse_id)
);

ALTER TABLE public.stock ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view stock"
ON public.stock FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Only managers can manage stock"
ON public.stock FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));

-- Create movement types enum
CREATE TYPE public.movement_type AS ENUM ('receipt', 'delivery', 'transfer', 'adjustment');

-- Create movement status enum
CREATE TYPE public.movement_status AS ENUM ('draft', 'waiting', 'ready', 'done', 'canceled');

-- Create stock movements table (history of all movements)
CREATE TABLE public.stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  movement_type movement_type NOT NULL,
  status movement_status NOT NULL DEFAULT 'draft',
  reference_number TEXT NOT NULL UNIQUE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  from_warehouse_id UUID REFERENCES public.warehouses(id),
  to_warehouse_id UUID REFERENCES public.warehouses(id),
  quantity INTEGER NOT NULL,
  notes TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view movements"
ON public.stock_movements FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "All authenticated users can create movements"
ON public.stock_movements FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Only managers can update movements"
ON public.stock_movements FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));

-- Create update timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_warehouses_updated_at
BEFORE UPDATE ON public.warehouses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_stock_updated_at
BEFORE UPDATE ON public.stock
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default warehouse
INSERT INTO public.warehouses (name, code, address) 
VALUES ('Main Warehouse', 'WH-MAIN', '123 Warehouse St');

-- Insert default categories
INSERT INTO public.product_categories (name, description)
VALUES 
  ('Raw Materials', 'Basic materials for production'),
  ('Finished Goods', 'Completed products ready for delivery'),
  ('Components', 'Parts and components for assembly');