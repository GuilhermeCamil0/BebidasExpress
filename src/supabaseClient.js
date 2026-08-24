import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://konkcrqgsulzisthjmep.supabase.co';
const supabaseKey = 'sb_publishable_gffHbAMk05hHeoilY38QUQ_6N3Gul6g';

export const supabase = createClient(supabaseUrl, supabaseKey);