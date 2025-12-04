import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { UserProfile, Goal, Level } from '../types';
import { Save, User, Settings, Check } from 'lucide-react';

const Profile = () => {
  const { profile, updateProfile } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Local state for form
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    goal: 'hipertrofia',
    level: 'iniciante',
    daysPerWeek: 3,
    equipment: [],
    limitations: '',
    preferences: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleSave = () => {
    updateProfile(formData);
    setSuccessMsg('Perfil atualizado com sucesso!');
    setIsEditing(false);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const toggleEquipment = (item: string) => {
    if (!isEditing) return;
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.includes(item)
        ? prev.equipment.filter(i => i !== item)
        : [...prev.equipment, item]
    }));
  };

  if (!profile) return <div className="p-8 text-white">Carregando perfil...</div>;

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <User className="text-orange-500" /> Meu Perfil
        </h1>
        <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition ${
                isEditing 
                ? 'bg-orange-600 text-white hover:bg-orange-700' 
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
        >
            {isEditing ? <><Save size={18} /> Salvar</> : <><Settings size={18} /> Editar</>}
        </button>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-green-900/30 border border-green-800 text-green-400 rounded-xl flex items-center gap-2">
            <Check size={20} /> {successMsg}
        </div>
      )}

      <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 space-y-6">
        
        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Nome</label>
                <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Seu nome"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-orange-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Dias de Treino (Semanal)</label>
                <div className="flex items-center gap-4">
                    <input
                        type="range"
                        min="1"
                        max="7"
                        disabled={!isEditing}
                        value={formData.daysPerWeek}
                        onChange={(e) => setFormData({...formData, daysPerWeek: parseInt(e.target.value)})}
                        className="w-full accent-orange-600 bg-neutral-800 h-2 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                    />
                    <span className="text-xl font-bold text-orange-500 w-8 text-center">{formData.daysPerWeek}</span>
                </div>
            </div>
        </div>

        {/* Selectors */}
        <div className="grid md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Objetivo Principal</label>
                <div className="grid grid-cols-2 gap-2">
                    {(['emagrecer', 'hipertrofia', 'resistencia', 'forca'] as Goal[]).map(g => (
                        <button
                            key={g}
                            disabled={!isEditing}
                            onClick={() => setFormData({...formData, goal: g})}
                            className={`p-2 rounded-lg text-sm border transition ${
                                formData.goal === g
                                ? 'bg-orange-600 text-white border-orange-600'
                                : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-600'
                            } ${!isEditing && formData.goal !== g ? 'opacity-50' : ''}`}
                        >
                            {g.charAt(0).toUpperCase() + g.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Nível de Experiência</label>
                 <div className="grid grid-cols-1 gap-2">
                    {(['iniciante', 'intermediario', 'avancado'] as Level[]).map(l => (
                        <button
                            key={l}
                            disabled={!isEditing}
                            onClick={() => setFormData({...formData, level: l})}
                            className={`p-2 rounded-lg text-sm border text-left px-4 transition ${
                                formData.level === l
                                ? 'bg-orange-600 text-white border-orange-600'
                                : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-600'
                            } ${!isEditing && formData.level !== l ? 'opacity-50' : ''}`}
                        >
                            {l.charAt(0).toUpperCase() + l.slice(1)}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Equipment */}
        <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Equipamentos Disponíveis</label>
            <div className="flex flex-wrap gap-2">
                {['Halteres', 'Barra', 'Máquinas', 'Elásticos', 'Peso do Corpo', 'Kettlebell'].map(eq => (
                    <button
                        key={eq}
                        disabled={!isEditing}
                        onClick={() => toggleEquipment(eq)}
                        className={`px-3 py-1.5 rounded-full text-xs border transition ${
                            formData.equipment.includes(eq)
                            ? 'bg-white text-neutral-950 border-white font-bold'
                            : 'bg-neutral-950 text-neutral-500 border-neutral-800'
                        }`}
                    >
                        {eq}
                    </button>
                ))}
            </div>
        </div>

        {/* Limitations */}
        <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Restrições / Lesões</label>
            <textarea
                rows={3}
                disabled={!isEditing}
                value={formData.limitations}
                onChange={(e) => setFormData({...formData, limitations: e.target.value})}
                placeholder="Descreva se houver..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-orange-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
        </div>

      </div>
    </div>
  );
};

export default Profile;