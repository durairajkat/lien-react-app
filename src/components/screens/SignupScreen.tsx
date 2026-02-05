import { useState } from 'react';
import { UserPlus, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { validateEmail, validatePassword } from '../../utils/validation';
import { useAppDispatch } from '../../store/hooks';
import { useSignupMutation } from '../../features/auth/authApi';
import { setCredentials } from '../../features/auth/authSlice';

export default function SignupScreen() {

    const dispatch = useAppDispatch();
    const [signup] = useSignupMutation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


    const validateForm = (): boolean => {

        const emailError = validateEmail(email);
        if (emailError) setError(emailError);

        const passwordError = validatePassword(password);
        if (passwordError) setError(passwordError);

        return emailError === null && passwordError === null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const res = await signup({
                email,
                password,
                password_confirmation: confirmPassword,
            }).unwrap();

            dispatch(setCredentials(res));
        } catch (err: any) {
            if (err?.data?.errors) {
                const firstKey = Object.keys(err.data.errors)[0];
                setError(err.data.errors[firstKey][0]);
            } else if (err?.data?.message) {
                setError(err.data.message);
            } else {
                setError("Signup failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-4">
                            <UserPlus className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
                        <p className="text-slate-600">Start managing your projects today</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="At least 6 characters"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Confirm your password"
                                    required
                                />
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                            <div className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-slate-700">Your account will be created instantly</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-slate-700">No email verification required</p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-slate-600">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
