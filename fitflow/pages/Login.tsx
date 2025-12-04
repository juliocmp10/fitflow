import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Dumbbell, ArrowRight, UserPlus, LogIn, Loader2, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login, register } = useStore();
  const [isLoginView, setIsLoginView] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
        if (isLoginView) {
            await login(email, password);
        } else {
            if (password !== confirmPassword) {
                throw new Error("As senhas não coincidem.");
            }
            if (password.length < 6) {
                throw new Error("A senha deve ter pelo menos 6 caracteres.");
            }
            if (!name) {
                throw new Error("Por favor, informe seu nome.");
            }
            await register(name, email, password);
        }
    } catch (err: any) {
        setError(err.message || "Ocorreu um erro. Tente novamente.");
        setIsLoading(false);
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md animate-in zoom-in-95 duration-500">
        <div className="bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden border border-white/5">
            <div className="bg-gradient-to-br from-orange-600 to-red-600 p-8 text-center relative overflow-hidden">
                <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl mb-4 shadow-lg border border-white/20">
                        <Dumbbell className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">FitFlow</h1>
                    <p className="text-orange-50 font-medium opacity-90">
                        {isLoginView ? 'Seu personal trainer de bolso.' : 'Comece sua transformação hoje.'}
                    </p>
                </div>
            </div>
            
            <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLoginView && (
                    <div>
                        <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wide mb-1.5">Nome Completo</label>
                        <input
                            type="text"
                            required={!isLoginView}
                            className="w-full px-4 py-3.5 bg-neutral-950 border border-neutral-800 text-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition placeholder-neutral-600"
                            placeholder="Seu nome"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                )}
                
                <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wide mb-1.5">Email</label>
                <input
                    type="email"
                    required
                    className="w-full px-4 py-3.5 bg-neutral-950 border border-neutral-800 text-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition placeholder-neutral-600"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                </div>
                
                <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wide mb-1.5">Senha</label>
                <input
                    type="password"
                    required
                    className="w-full px-4 py-3.5 bg-neutral-950 border border-neutral-800 text-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition placeholder-neutral-600"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                </div>

                {!isLoginView && (
                    <div>
                        <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wide mb-1.5">Confirmar Senha</label>
                        <input
                            type="password"
                            required={!isLoginView}
                            className="w-full px-4 py-3.5 bg-neutral-950 border border-neutral-800 text-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition placeholder-neutral-600"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-red-900/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                        <AlertCircle size={18} className="shrink-0" /> {error}
                    </div>
                )}

                <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition flex items-center justify-center gap-2 shadow-lg shadow-orange-900/20 disabled:opacity-70 disabled:cursor-not-allowed mt-4 active:scale-[0.98]"
                >
                {isLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                ) : (
                    <>
                        {isLoginView ? 'Entrar' : 'Criar Conta'} 
                        <ArrowRight size={18} />
                    </>
                )}
                </button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <p className="text-neutral-500 text-sm mb-3">
                    {isLoginView ? 'Não tem uma conta?' : 'Já possui cadastro?'}
                </p>
                <button 
                    onClick={toggleView}
                    className="text-white hover:text-orange-400 font-semibold text-sm flex items-center justify-center gap-2 mx-auto transition py-2 px-4 rounded-lg hover:bg-white/5"
                >
                    {isLoginView ? (
                        <><UserPlus size={16} /> Criar conta gratuitamente</>
                    ) : (
                        <><LogIn size={16} /> Fazer login</>
                    )}
                </button>
            </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;