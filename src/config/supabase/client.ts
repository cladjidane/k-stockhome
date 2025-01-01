import { createClient } from "@supabase/supabase-js";
import { Database } from "../../types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
