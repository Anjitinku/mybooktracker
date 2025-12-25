// Import React hooks for state management and side effects
import { useState, useEffect } from 'react';
// Import navigation hook from React Router for programmatic navigation
import { useNavigate } from 'react-router-dom';
// Import icons from lucide-react icon library
import { BookOpen, Loader2 } from 'lucide-react';
// Import UI components from shadcn/ui component library
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// Import custom authentication hook for user auth operations
import { useAuth } from '@/hooks/useAuth';
// Import toast hook for showing notification messages
import { useToast } from '@/hooks/use-toast';
// Import Zod library for form validation schema
import { z } from 'zod';

// Define validation schema for authentication form using Zod
// Validates email format and password minimum length
const authSchema = z.object({
  email: z.string().email('Please enter a valid email address'), // Email must be valid format
  password: z.string().min(6, 'Password must be at least 6 characters'), // Password min 6 chars
});

// Login component - handles user sign in and sign up
const Login = () => {
  // Hook to navigate between routes programmatically
  const navigate = useNavigate();
  // Destructure auth methods and state from useAuth hook
  const { user, signIn, signUp, loading } = useAuth();
  // Hook to display toast notifications
  const { toast } = useToast();
  // State to track if form is being submitted
  const [isSubmitting, setIsSubmitting] = useState(false);
  // State for email input value
  const [email, setEmail] = useState('');
  // State for password input value
  const [password, setPassword] = useState('');

  // Effect to redirect user to books page if already logged in
  useEffect(() => {
    // If user exists (logged in), navigate to books page
    if (user) {
      navigate('/books');
    }
  }, [user, navigate]); // Re-run when user or navigate changes

  // Handler function for authentication (signin or signup)
  const handleAuth = async (mode: 'signin' | 'signup') => {
    // Validate form data against schema
    const validation = authSchema.safeParse({ email, password });
    
    // If validation fails, show error toast and return early
    if (!validation.success) {
      toast({
        title: 'Validation Error',
        description: validation.error.errors[0].message, // Show first error message
        variant: 'destructive', // Red error styling
      });
      return;
    }

    // Set submitting state to show loading indicator
    setIsSubmitting(true);
    
    try {
      // Call appropriate auth method based on mode
      const { error } = mode === 'signin' 
        ? await signIn(email, password) // Sign in existing user
        : await signUp(email, password); // Create new user account

      // Handle authentication errors
      if (error) {
        let message = error.message;
        // Provide user-friendly error messages for common errors
        if (message.includes('Invalid login credentials')) {
          message = 'Invalid email or password. Please try again.';
        } else if (message.includes('User already registered')) {
          message = 'This email is already registered. Please sign in instead.';
        }
        
        // Display error toast
        toast({
          title: 'Authentication Error',
          description: message,
          variant: 'destructive',
        });
      } else if (mode === 'signup') {
        // Show success toast for new account creation
        toast({
          title: 'Account created!',
          description: 'You can now start tracking your books.',
        });
        // Navigate to books page after successful signup
        navigate('/books');
      }
    } catch (err) {
      // Handle unexpected errors
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      // Reset submitting state regardless of outcome
      setIsSubmitting(false);
    }
  };

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        {/* Spinning loader icon */}
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Render the login/signup form
  return (
    // Full screen container with centered content
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      {/* Logo and title section with fade-in animation */}
      <div className="mb-8 text-center animate-fade-in">
        {/* Book icon in a rounded container */}
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 mb-4">
          <BookOpen className="h-8 w-8 text-primary" />
        </div>
        {/* App title with serif font */}
        <h1 className="font-serif text-3xl font-bold text-foreground">BookTracker</h1>
        {/* Subtitle/tagline */}
        <p className="mt-2 text-muted-foreground">
          Track your reading journey
        </p>
      </div>

      {/* Card container for auth form with slide-up animation */}
      <Card className="w-full max-w-md animate-slide-up shadow-soft">
        {/* Card header with title and description */}
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-xl">Welcome</CardTitle>
          <CardDescription>
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        {/* Card content with tabbed form */}
        <CardContent>
          {/* Tabs component for switching between signin and signup */}
          <Tabs defaultValue="signin" className="w-full">
            {/* Tab buttons */}
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* Sign In tab content */}
            <TabsContent value="signin" className="space-y-4">
              {/* Email input field */}
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // Update email state on change
                  className="bg-background"
                />
              </div>
              {/* Password input field */}
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // Update password state on change
                  className="bg-background"
                />
              </div>
              {/* Sign in submit button */}
              <Button
                onClick={() => handleAuth('signin')} // Call handleAuth with signin mode
                className="w-full"
                disabled={isSubmitting} // Disable while submitting
              >
                {/* Show spinner when submitting */}
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Sign In
              </Button>
            </TabsContent>

            {/* Sign Up tab content - same structure as signin */}
            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background"
                />
              </div>
              {/* Create account submit button */}
              <Button
                onClick={() => handleAuth('signup')} // Call handleAuth with signup mode
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create Account
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

// Export Login component as default export
export default Login;
