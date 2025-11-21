import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv';
dotenv.config({ path: './supabase.env' });
//const dotenv = dotenv.config();
const supabaseUrl = 'https://kjtbrqhsvdakypduvhdp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqdGJycWhzdmRha3lwZHV2aGRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNTA0NjUsImV4cCI6MjA3NzgyNjQ2NX0.dQ7A4waTq4d1TqXMZs9ppAM3KvR0kd2AzMKCh7yYqSs'//'process.env.supabaseKey'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;