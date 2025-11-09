import { User } from '@supabase/supabase-js';

export type Phones = {
    id: string;
    number: string;
}

export interface UserWithPhones extends User {
    phones: Phones[];
}

export type UserResponse = {
    data: UserWithPhones | null;
    error: Error | null;
}