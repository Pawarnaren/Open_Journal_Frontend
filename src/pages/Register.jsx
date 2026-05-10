import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { BookOpen } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Input from '../components/Input';
import Button from '../components/Button';
import logger from '../utils/logger';

const MODULE = 'Register';

const schema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const Register = () => {
  const { register: registerUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    try {
      logger.info(MODULE, 'Registration submitted', { email: data.email, name: data.name });
      await registerUser({ name: data.name, email: data.email, password: data.password });
      toast.success('Account created! Welcome to OpenJournal 🎉');
      navigate('/');
    } catch (err) {
      logger.error(MODULE, 'Registration failed', err.message);
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Account — OpenJournal</title>
        <meta name="description" content="Create your free OpenJournal account and start writing." />
      </Helmet>

      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-900/15 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-sm relative z-10 animate-slide-up">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center shadow-lg shadow-primary-900/50 group-hover:scale-110 transition-transform">
                <BookOpen size={20} className="text-white" />
              </div>
              <span className="font-bold text-xl text-slate-100">
                Open<span className="gradient-text">Journal</span>
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-slate-100 mt-6 mb-1">Create your account</h1>
            <p className="text-slate-400 text-sm">Start writing. Start reflecting.</p>
          </div>

          <div className="glass-card p-8 space-y-5">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <Input
                id="register-name"
                label="Full Name"
                type="text"
                placeholder="Jane Doe"
                error={errors.name?.message}
                {...register('name')}
              />
              <Input
                id="register-email"
                label="Email"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email')}
              />
              <Input
                id="register-password"
                label="Password"
                type="password"
                placeholder="At least 6 characters"
                error={errors.password?.message}
                {...register('password')}
              />
              <Input
                id="register-confirm-password"
                label="Confirm Password"
                type="password"
                placeholder="Repeat password"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              <Button
                id="register-submit"
                type="submit"
                loading={isSubmitting}
                className="w-full justify-center mt-2"
              >
                Create Account
              </Button>
            </form>

            <p className="text-center text-slate-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
