import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { BookOpen, Mail, Lock } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Input from '../components/Input';
import Button from '../components/Button';
import logger from '../utils/logger';

const MODULE = 'Login';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const from = state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, from, navigate]);

  const onSubmit = async (data) => {
    try {
      logger.info(MODULE, 'Form submitted', { email: data.email });
      await login(data);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      logger.error(MODULE, 'Login failed', err.message);
      const msg = err.response?.data?.message || 'Invalid email or password';
      toast.error(msg);
    }
  };

  return (
    <>
      <Helmet>
        <title>Log In — OpenJournal</title>
        <meta name="description" content="Log in to your OpenJournal account." />
      </Helmet>

      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-900/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-sm relative z-10 animate-slide-up">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center shadow-lg shadow-primary-900/50 group-hover:scale-110 transition-transform">
                <BookOpen size={20} className="text-white" />
              </div>
              <span className="font-bold text-xl text-slate-100">
                Open<span className="gradient-text">Journal</span>
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-slate-100 mt-6 mb-1">Welcome back</h1>
            <p className="text-slate-400 text-sm">Sign in to continue your journey</p>
          </div>

          <div className="glass-card p-8 space-y-5">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <Input
                id="login-email"
                label="Email"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email')}
              />
              <Input
                id="login-password"
                label="Password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />

              <Button
                id="login-submit"
                type="submit"
                loading={isSubmitting}
                className="w-full justify-center mt-2"
              >
                Sign In
              </Button>
            </form>

            <p className="text-center text-slate-400 text-sm">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
