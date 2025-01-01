
import { createClient } from "@supabase/supabase-js";
import { Database } from "../../types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let instance: ReturnType<typeof createClient<Database>> | null = null;

export const supabase = (): ReturnType<typeof createClient<Database>> => {
  if (!instance) {
    instance = createClient<Database>(supabaseUrl, supabaseKey);
  }
  return instance;
};
