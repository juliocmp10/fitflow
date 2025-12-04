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
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="bg-neutral-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-neutral-800">
        <div className="bg-orange-600 p-8 text-center relative overflow-hidden">
           {/* Decorative circles */}
           <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500 rounded-full opacity-20"></div>
           <div className="absolute top-10 -left-10 w-24 h-24 bg-orange-400 rounded-full opacity-20"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-900 rounded-full mb-4 shadow-lg">
                <Dumbbell className="w-8 h-8 text-orange-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">FitFlow</h1>
            <p className="text-orange-100 font-medium">
                {isLoginView ? 'Bem-vindo de volta, atleta!' : 'Comece sua transformação hoje.'}
            </p>
          </div>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginView && (
                <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">Nome Completo</label>
                    <input
                        type="text"
                        required={!isLoginView}
                        className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition placeholder-neutral-500"
                        placeholder="Seu nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition placeholder-neutral-500"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Senha</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition placeholder-neutral-500"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {!isLoginView && (
                <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">Confirmar Senha</label>
                    <input
                        type="password"
                        required={!isLoginView}
                        className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition placeholder-neutral-500"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
            )}

            {error && (
                <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition flex items-center justify-center gap-2 shadow-lg shadow-orange-900/20 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
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
          
          <div className="mt-6 text-center">
            <p className="text-neutral-400 text-sm mb-2">
                {isLoginView ? 'Não tem uma conta?' : 'Já possui cadastro?'}
            </p>
            <button 
                onClick={toggleView}
                className="text-orange-500 hover:text-orange-400 font-semibold text-sm flex items-center justify-center gap-1 mx-auto transition"
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
  );
};

export default Login;