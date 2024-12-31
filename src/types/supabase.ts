
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          quantity: number;
          unit: string;
          location: string;
          category: string | null;
          nutriscore: string | null;
          nutriments: Json | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      shopping_list: {
        Row: {
          id: string;
          product_id: string | null;
          name: string;
          quantity: number;
          unit: string;
          suggested_quantity: number | null;
          purchased: boolean;
          auto_update_stock: boolean;
          added_at: string;
        };
        Insert: Omit<Database['public']['Tables']['shopping_list']['Row'], 'id' | 'added_at'>;
        Update: Partial<Database['public']['Tables']['shopping_list']['Insert']>;
      };
    };
  };
}
