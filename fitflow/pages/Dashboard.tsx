import React from 'react';
import { useStore } from '../context/StoreContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, YAxis } from 'recharts';
import { Calendar, Trophy, Zap, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ icon: Icon, label, value, color }: any) => (
  <div className="bg-neutral-900 p-4 rounded-xl shadow-sm border border-neutral-800 flex items-center gap-4">
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-sm text-neutral-400">{label}</p>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { profile, plans, sessions } = useStore();
  const activePlan = plans.find(p => p.isActive) || plans[0];

  // Prepare chart data (Last 7 sessions volume)
  const chartData = sessions.slice(0, 7).reverse().map((s, i) => ({
    name: `Sessão ${i + 1}`,
    volume: s.totalVolume
  }));

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      <header>
        <h1 className="text-2xl font-bold text-white">Olá, {profile?.name || 'Atleta'}! 👋</h1>
        <p className="text-neutral-400">Vamos continuar sua evolução hoje?</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Trophy} label="Treinos Completos" value={sessions.length} color="bg-yellow-600" />
        <StatCard icon={Zap} label="Nível Atual" value={profile?.level} color="bg-orange-600" />
        <StatCard icon={Calendar} label="Plano Atual" value={activePlan?.name || 'Nenhum'} color="bg-blue-600" />
        <StatCard icon={Activity} label="Vol. Total (kg)" value={sessions.reduce((acc, s) => acc + s.totalVolume, 0)} color="bg-purple-600" />
      </div>

      {/* Active Plan / Quick Start */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-neutral-900 p-6 rounded-2xl shadow-sm border border-neutral-800">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-white">Seu Treino Atual</h2>
                <Link to="/workouts" className="text-orange-500 text-sm font-medium hover:underline hover:text-orange-400">Ver todos</Link>
            </div>
            
            {activePlan ? (
                <div className="space-y-3">
                    {activePlan.days.map((day, idx) => (
                        <div key={day.id} className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg border border-neutral-700 hover:border-orange-500/50 transition">
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-orange-900/50 text-orange-400 flex items-center justify-center font-bold text-sm border border-orange-500/20">
                                    {String.fromCharCode(65 + idx)}
                                </span>
                                <span className="font-medium text-neutral-200">{day.name}</span>
                            </div>
                            <Link 
                                to={`/session/${activePlan.id}/${day.id}`}
                                className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition"
                            >
                                Iniciar
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-neutral-500 mb-4">Nenhum plano ativo.</p>
                    <Link to="/onboarding" className="text-orange-500 font-semibold">Criar Novo Plano</Link>
                </div>
            )}
        </div>

        {/* Progress Chart */}
        <div className="bg-neutral-900 p-6 rounded-2xl shadow-sm border border-neutral-800">
            <h2 className="text-lg font-bold text-white mb-4">Evolução de Carga (Volume)</h2>
            <div className="h-64">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" hide />
                            <YAxis stroke="#525252" tick={{fill: '#a3a3a3'}} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '8px', color: '#fff' }} 
                                cursor={{fill: '#262626'}}
                            />
                            <Bar dataKey="volume" fill="#f97316" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full text-neutral-500">
                        Complete treinos para ver dados
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;