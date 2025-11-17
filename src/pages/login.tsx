import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { useApp } from '../lib/context';
import { useEffect, useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export function Login() {
  const navigate = useNavigate();
  const { signIn, signUp, isAuthenticated } = useApp();
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<LoginFormData & SignUpFormData>();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      await signIn(data.email, data.password);
      // Navigation will happen automatically via useEffect
    } catch (error) {
      // Error toast is shown by context
    }
  };

  const onSignUpSubmit = async (data: SignUpFormData) => {
    if (data.password !== data.confirmPassword) {
      return;
    }
    try {
      await signUp(data.email, data.password, data.firstName, data.lastName);
      // Switch back to login mode after successful signup
      setIsSignUpMode(false);
      reset();
    } catch (error) {
      // Error toast is shown by context
    }
  };

  const toggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
    reset();
  };

  const password = watch('password');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-accent p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary p-4 shadow-2xl shadow-primary/30 transform rotate-45">
              <Send className="h-12 w-12 text-primary-foreground -rotate-45" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground flex items-center justify-center gap-2">
              Welcome to Taskie
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            </h1>
          </div>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-2 border-primary/20 bg-card backdrop-blur-xl">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {isSignUpMode ? 'Create Account' : 'Sign In'}
            </CardTitle>
            <CardDescription className="text-center text-base text-muted-foreground">
              {isSignUpMode
                ? 'Create a new account to get started'
                : 'Enter your credentials to access your account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(isSignUpMode ? onSignUpSubmit : onLoginSubmit)} className="space-y-4">
              {isSignUpMode && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">
                        First Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        {...register('firstName', {
                          required: isSignUpMode ? 'First name is required' : false,
                        })}
                        aria-invalid={errors.firstName ? 'true' : 'false'}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-destructive">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">
                        Last Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        {...register('lastName', {
                          required: isSignUpMode ? 'Last name is required' : false,
                        })}
                        aria-invalid={errors.lastName ? 'true' : 'false'}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-destructive">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  aria-invalid={errors.email ? 'true' : 'false'}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  Password <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  aria-invalid={errors.password ? 'true' : 'false'}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              {isSignUpMode && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Confirm Password <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    {...register('confirmPassword', {
                      required: isSignUpMode ? 'Please confirm your password' : false,
                      validate: (value) =>
                        !isSignUpMode || value === password || 'Passwords do not match',
                    })}
                    aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                  )}
                </div>
              )}

              {!isSignUpMode && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox id="remember" {...register('remember')} />
                    <label htmlFor="remember" className="text-sm cursor-pointer">
                      Remember me
                    </label>
                  </div>
                  <Button type="button" variant="link" className="p-0 h-auto text-sm">
                    Forgot password?
                  </Button>
                </div>
              )}

              <Button type="submit" className="w-full">
                {isSignUpMode ? 'Create Account' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button
                type="button"
                variant="link"
                className="text-sm text-primary hover:text-primary/80 font-medium"
                onClick={toggleMode}
              >
                {isSignUpMode
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-white/80 font-medium">
          © 2025 Taskie. All rights reserved.
        </p>
      </div>
    </div>
  );
}
