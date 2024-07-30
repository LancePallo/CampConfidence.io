import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xwxvzcvrtsdkzbdjicft.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3eHZ6Y3ZydHNka3piZGppY2Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk0NTUyMjYsImV4cCI6MjAzNTAzMTIyNn0.rpYM8KX0w_EPEuDrpBy8OgJre22Fyv3iw5NX5EfkfTc';

//console.log("Supabase URL:", supabaseUrl);
//console.log("Supabase Key:", supabaseKey);

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };