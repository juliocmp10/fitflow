import React from 'react';
import { useStore } from '../context/StoreContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, YAxis, CartesianGrid } from 'recharts';
import { Calendar, Trophy, Zap, Activity, ChevronRight, Play, Dumbbell } from 'lucide-react';
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

  // Verificações de segurança robustas
  const safePlans = Array.isArray(plans) ? plans : [];
  const safeSessions = Array.isArray(sessions) ? sessions : [];
  
  // Encontra plano ativo ou o primeiro disponível
  const activePlan = safePlans.find(p => p.isActive) || safePlans[0];

  // Dados para o gráfico (últimas 7 sessões ou placeholders vazios)
  const chartData = safeSessions.slice(0, 7).reverse().map((s, i) => ({
    name: `T${i + 1}`,
    volume: s.totalVolume || 0
  }));

  // Se não tiver dados suficientes para o gráfico, mostra placeholders
  if (chartData.length === 0) {
     chartData.push({ name: 'T1', volume: 0 }, { name: 'T2', volume: 0 }, { name: 'T3', volume: 0 });
  }

  const safeProfileName = profile?.name || 'Atleta';
  const totalVolume = safeSessions.reduce((acc, s) => acc + (s.totalVolume || 0), 0);
  const totalTreinos = safeSessions.length;
  
  // Formata o volume para 'k' se for muito grande
  const displayVolume = totalVolume > 1000 ? `${(totalVolume / 1000).toFixed(1)}k` : totalVolume;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Olá, <span className="text-orange-500">{safeProfileName}</span></h1>
          <p className="text-neutral-400 mt-1">Vamos superar seus limites hoje?</p>
        </div>
        <div className="w-12 h-12 bg-neutral-800 rounded-full border border-neutral-700 flex items-center justify-center font-bold text-lg text-white">
             {safeProfileName.charAt(0)}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
            icon={Trophy} 
            label="Treinos" 
            value={totalTreinos} 
            gradient="bg-gradient-to-br from-neutral-800 to-neutral-900" 
        />
        <StatCard 
            icon={Zap} 
            label="Volume Total" 
            value={displayVolume} 
            gradient="bg-gradient-to-br from-orange-900/40 to-orange-800/20 border-orange-500/20" 
        />
        <StatCard 
            icon={Activity} 
            label="Sequência" 
            value="0 dias" 
            gradient="bg-gradient-to-br from-neutral-800 to-neutral-900" 
        />
        <StatCard 
            icon={Calendar} 
            label="Nível" 
            value={profile?.level || 'Iniciante'} 
            gradient="bg-gradient-to-br from-neutral-800 to-neutral-900" 
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Active Plan Card */}
        <div className="md:col-span-2 bg-neutral-900 rounded-3xl p-6 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 transition-opacity group-hover:opacity-10">
                <Dumbbell size={150} />
            </div>
            
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <span className="text-xs font-bold text-orange-500 uppercase tracking-wider bg-orange-500/10 px-2 py-1 rounded mb-2 inline-block">Plano Atual</span>
                        <h2 className="text-2xl font-bold text-white mt-1">
                            {activePlan ? activePlan.name : 'Nenhum plano ativo'}
                        </h2>
                        <p className="text-neutral-400 text-sm mt-1">
                            {activePlan ? `${activePlan.days?.length || 0} divisões de treino` : 'Crie um plano para começar'}
                        </p>
                    </div>
                </div>

                {activePlan ? (
                    <div className="grid gap-3">
                        {activePlan.days?.slice(0, 3).map((day, idx) => (
                             <div key={day.id || idx} className="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/5 hover:border-white/10 transition">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center font-bold text-sm text-neutral-300">
                                        {idx + 1}
                                    </div>
                                    <span className="font-medium text-neutral-200">{day.name}</span>
                                </div>
                                <Link 
                                    to={`/session/${activePlan.id}/${day.id}`} 
                                    className="p-2 bg-orange-600 rounded-lg text-white hover:bg-orange-500 transition shadow-lg shadow-orange-900/20"
                                >
                                    <Play size={16} fill="currentColor" />
                                </Link>
                             </div>
                        ))}
                        {activePlan.days?.length > 3 && (
                            <div className="text-center text-xs text-neutral-500 mt-1">
                                + {activePlan.days.length - 3} outros treinos
                            </div>
                        )}
                        <Link to={`/plan/${activePlan.id}`} className="mt-4 w-full py-3 bg-white text-neutral-950 rounded-xl font-bold text-center hover:bg-neutral-200 transition flex justify-center items-center gap-2">
                            Ver Plano Completo <ChevronRight size={16} />
                        </Link>
                    </div>
                ) : (
                    <div className="py-8 text-center">
                        <Link to="/create-plan" className="px-6 py-3 bg-orange-600 text-white rounded-xl font-bold shadow-lg hover:bg-orange-700 transition inline-flex items-center gap-2">
                           <Dumbbell size={18} /> Criar Primeiro Treino
                        </Link>
                    </div>
                )}
            </div>
        </div>

        {/* Mini Chart */}
        <div className="bg-neutral-900 rounded-3xl p-6 border border-white/5 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-6">Volume Recente</h3>
            <div className="flex-1 min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                        <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                            cursor={{fill: '#ffffff10'}}
                            contentStyle={{ backgroundColor: '#171717', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Bar dataKey="volume" fill="#f97316" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;