"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const baseUrl = 'https://sage-unrocky-cursively.ngrok-free.dev';
        try {
            if (isLogin) {
                // Login Flow
                const params = new URLSearchParams();
                params.append('username', formData.email);
                params.append('password', formData.password);

                const res = await fetch(`${baseUrl}/token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'ngrok-skip-browser-warning': 'true',
                    },
                    body: params
                });

                if (!res.ok) throw new Error('Invalid credentials');

                const data = await res.json();
                localStorage.setItem('access_token', data.access_token);
                // Force a hard reload/redirect to dashboard
                window.location.href = '/dashboard';
            } else {
                // Register Flow
                const res = await fetch(`${baseUrl}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true',
                    },
                    body: JSON.stringify(formData)
                });

                if (!res.ok) throw new Error('Registration failed');

                const data = await res.json();
                localStorage.setItem('access_token', data.access_token);
                window.location.href = '/dashboard';
            }
        } catch (error) {
            alert(error instanceof Error ? error.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        {isLogin ? 'Welcome back' : 'Create account'}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {isLogin ? 'Enter your details to access your dashboard' : 'Join us to start analyzing data'}
                    </p>
                </div>

                <div className="flex justify-center border-b border-gray-200">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`w-1/2 py-4 text-center text-sm font-medium ${isLogin ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`w-1/2 py-4 text-center text-sm font-medium ${!isLogin ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Sign Up
                    </button>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                required
                                className="block w-full rounded-md border border-gray-300 pl-10 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="password"
                                required
                                className="block w-full rounded-md border border-gray-300 pl-10 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400"
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {isLogin ? 'Sign in' : 'Register'}
                    </button>
                </form>
            </div>
        </div>
    );
};
