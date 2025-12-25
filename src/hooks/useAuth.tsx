// Import React hooks and types for context and state management
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// Import Supabase types for user and session
import { User, Session } from '@supabase/supabase-js';
// Import Supabase client instance
import { supabase } from '@/integrations/supabase/client';

// Define the shape of the authentication context
interface AuthContextType {
  user: User | null; // Current authenticated user or null
  session: Session | null; // Current session or null
  loading: boolean; // Whether auth state is being determined
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>; // Sign up function
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>; // Sign in function
  signOut: () => Promise<void>; // Sign out function
}

// Create the auth context with undefined default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component - provides auth state and methods to children
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // State to store current user
  const [user, setUser] = useState<User | null>(null);
  // State to store current session
  const [session, setSession] = useState<Session | null>(null);
  // State to track if initial auth check is loading
  const [loading, setLoading] = useState(true);

  // Effect to set up auth state listener and check existing session
  useEffect(() => {
    // Set up auth state change listener FIRST (before checking session)
    // This ensures we don't miss any auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Update session state when auth state changes
        setSession(session);
        // Update user state (null if no session)
        setUser(session?.user ?? null);
        // Auth check complete
        setLoading(false);
      }
    );

    // THEN check for existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      // Update session state with existing session
      setSession(session);
      // Update user state
      setUser(session?.user ?? null);
      // Auth check complete
      setLoading(false);
    });

    // Cleanup function to unsubscribe from auth listener on unmount
    return () => subscription.unsubscribe();
  }, []); // Empty dependency array - only run on mount

  // Function to sign up a new user
  const signUp = async (email: string, password: string) => {
    // Build redirect URL for email confirmation (points to home page)
    const redirectUrl = `${window.location.origin}/`;
    
    // Call Supabase signUp method
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl // Where to redirect after email confirmation
      }
    });
    // Return error (or null if successful)
    return { error };
  };

  // Function to sign in an existing user
  const signIn = async (email: string, password: string) => {
    // Call Supabase signInWithPassword method
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    // Return error (or null if successful)
    return { error };
  };

  // Function to sign out the current user
  const signOut = async () => {
    // Call Supabase signOut method
    await supabase.auth.signOut();
  };

  // Render the context provider with auth state and methods
  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  // Get context value
  const context = useContext(AuthContext);
  // Throw error if hook is used outside of AuthProvider
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  // Return context value
  return context;
};
