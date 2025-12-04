import React from 'react';
import { useStore } from '../context/StoreContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, YAxis, CartesianGrid } from 'recharts';
import { Calendar, Trophy, Zap, Activity, ChevronRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ icon: Icon, label, value, gradient }: any) => (
  <div className={`relative overflow-hidden p-5 rounded-2xl border border-white/5 shadow-lg ${gradient}`}>
    <div className="absolute -right-4 -top-4 opacity-10 rotate-12">
        <Icon size={80} />
    </div>
    
    <div className="relative z-10">
        <div className="p-2.5 bg-white/10 w-fit rounded-xl backdrop-blur-sm mb-3">
            <Icon className="w-5 h-5 text-white" />
        </div>
        <p className="text-sm text-white/70 font-medium mb-0.5">{label}</p>
        <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { profile, plans, sessions } = useStore();

  // Safety checks
  const safePlans = Array.isArray(plans) ? plans : [];
  const safeSessions = Array.isArray(sessions) ? sessions : [];
  
  const activePlan = safePlans.find(p => p.isActive) || safePlans[0];

  // Prepare chart data (Last 7 sessions volume)
  const chartData = safeSessions.slice(0, 7).reverse().map((s, i) => ({
    name: `T${i + 1}`,
    volume: s.totalVolume
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
                Olá, <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">{profile?.name || 'Atleta'}</span>!
            </h1>
            <p className="text-neutral-400 mt-1">Sua jornada hoje começa agora.</p>
        </div>
        <div className="text-sm font-medium bg-neutral-900 border border-white/10 px-4 py-2 rounded-full text-neutral-300 flex items-center gap-2 w-fit">
            <Calendar size={16} className="text-orange-500" />
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
            icon={Trophy} 
            label="Treinos" 
            value={safeSessions.length} 
            gradient="bg-gradient-to-br from-neutral-800 to-neutral-900" 
        />
        <StatCard 
            icon={Zap} 
            label="Nível" 
            value={profile?.level ? (profile.level.charAt(0).toUpperCase() + profile.level.slice(1)) : 'Iniciante'} 
            gradient="bg-gradient-to-br from-orange-900/50 to-neutral-900" 
        />
        <StatCard 
            icon={Activity} 
            label="Volume Total" 
            value={`${(safeSessions.reduce((acc, s) => acc + s.totalVolume, 0) / 1000).toFixed(1)}k kg`} 
            gradient="bg-gradient-to-br from-blue-900/40 to-neutral-900" 
        />
        <StatCard 
            icon={Calendar} 
            label="Plano Ativo" 
            value={activePlan ? (activePlan.name.length > 12 ? activePlan.name.substring(0,10) + '...' : activePlan.name) : 'Nenhum'} 
            gradient="bg-gradient-to-br from-purple-900/40 to-neutral-900" 
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Plan / Quick Start */}
        <div className="lg:col-span-2 bg-neutral-900/50 backdrop-blur-sm p-6 rounded-3xl border border-white/5 shadow-xl flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Zap className="text-orange-500 w-5 h-5" fill="currentColor" /> Próximo Treino
                </h2>
                <Link to="/workouts" className="text-orange-400 text-sm font-semibold hover:text-orange-300 transition flex items-center gap-1">
                    Ver todos <ChevronRight size={16} />
                </Link>
            </div>
            
            {activePlan ? (
                <div className="grid sm:grid-cols-2 gap-4">
                    {activePlan.days && activePlan.days.slice(0, 4).map((day, idx) => (
                        <div key={day.id} className="group relative bg-neutral-800/40 hover:bg-neutral-800/80 p-4 rounded-2xl border border-white/5 hover:border-orange-500/30 transition-all duration-300">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold">
                                            {String.fromCharCode(65 + idx)}
                                        </span>
                                        <h3 className="font-bold text-white text-sm truncate max-w-[120px]">{day.name}</h3>
                                    </div>
                                    <p className="text-xs text-neutral-400">{day.exercises?.length || 0} exercícios</p>
                                </div>
                                <Link 
                                    to={`/session/${activePlan.id}/${day.id}`}
                                    className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-900/30 hover:scale-110 hover:bg-orange-500 transition-all"
                                >
                                    <Play size={18} fill="currentColor" className="ml-1" />
                                </Link>
                            </div>
                        </div>
                    ))}
                    {(!activePlan.days || activePlan.days.length === 0) && <p className="text-neutral-500">Este plano não tem dias configurados.</p>}
                </div>
            ) : (
                <div className="text-center py-10 bg-neutral-800/20 rounded-2xl border border-dashed border-white/10">
                    <p className="text-neutral-400 mb-4">Você não tem um plano ativo.</p>
                    <Link to="/onboarding" className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition">Criar Plano Agora</Link>
                </div>
            )}
        </div>

        {/* Progress Chart */}
        <div className="bg-neutral-900/50 backdrop-blur-sm p-6 rounded-3xl border border-white/5 shadow-xl flex flex-col">
            <h2 className="text-xl font-bold text-white mb-6">Evolução de Carga</h2>
            <div className="flex-1 min-h-[200px]">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#737373', fontSize: 12}} 
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#737373', fontSize: 12}} 
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#171717', border: '1px solid #333', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }} 
                                cursor={{fill: '#ffffff10', radius: 4}}
                            />
                            <Bar 
                                dataKey="volume" 
                                fill="#f97316" 
                                radius={[6, 6, 6, 6]} 
                                barSize={32}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-neutral-500 gap-2">
                        <Activity className="w-8 h-8 opacity-50" />
                        <span className="text-sm">Sem dados recentes</span>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;