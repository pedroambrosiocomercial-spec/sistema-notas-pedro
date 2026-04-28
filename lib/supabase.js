import { createClient } from "@supabase/supabase-js";

// Nós vamos trocar essas frases pelas suas chaves reais depois
const supabaseUrl = "https://dzeviyrsaxxxyhgheube.supabase.co"; 
const supabaseAnonKey = "sb_publishable_gq9AwL7lTLECguEMcpf3QQ_dp4LuEda";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);