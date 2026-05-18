import React, { useState, useEffect } from 'react';
import { 
  Shuffle, 
  Users, 
  Trash2, 
  Plus, 
  Settings, 
  Download, 
  Copy, 
  Sparkles, 
  Grid, 
  FileText, 
  X, 
  LayoutGrid, 
  Layers, 
  AlertCircle,
  Cloud,
  CloudOff,
  Database,
  Check,
  Sun,
  Moon,
  Mars,
  Venus
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const THEMES = {
  indigo: {
    name: 'Indigo Canvas',
    primary: 'indigo',
    accent: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    textAccent: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-zinc-50 dark:bg-zinc-950',
    card: 'bg-white dark:bg-zinc-900 border-zinc-200/60 dark:border-zinc-800/80',
    text: 'text-zinc-800 dark:text-zinc-100',
    badge: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300',
    ring: 'focus:ring-indigo-500/20 focus:border-indigo-500',
    border: 'border-zinc-200/60 dark:border-zinc-800/80',
    bullet: 'bg-indigo-500'
  },
  pink: {
    name: 'Pink Blush',
    primary: 'pink',
    accent: 'bg-rose-500 hover:bg-rose-600 text-white',
    textAccent: 'text-rose-500 dark:text-rose-400',
    bg: 'bg-stone-50/50 dark:bg-neutral-950',
    card: 'bg-white dark:bg-neutral-900 border-stone-200/60 dark:border-neutral-800/80',
    text: 'text-stone-800 dark:text-neutral-100',
    badge: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
    ring: 'focus:ring-rose-500/20 focus:border-rose-500',
    border: 'border-stone-200/60 dark:border-neutral-800/80',
    bullet: 'bg-rose-400'
  },
  violet: {
    name: 'Violet Velvet',
    primary: 'violet',
    accent: 'bg-violet-600 hover:bg-violet-700 text-white',
    textAccent: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-neutral-50 dark:bg-stone-950',
    card: 'bg-white dark:bg-stone-900 border-neutral-200/60 dark:border-stone-800/80',
    text: 'text-neutral-800 dark:text-stone-100',
    badge: 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300',
    ring: 'focus:ring-violet-500/20 focus:border-violet-500',
    border: 'border-neutral-200/60 dark:border-stone-800/80',
    bullet: 'bg-violet-500'
  }
};

const SAMPLE_MEMBERS = [
  { name: "Rian Ardianto", gender: "male" }, { name: "Siti Rahmawati", gender: "female" },
  { name: "Budi Santoso", gender: "male" }, { name: "Laras Amalia", gender: "female" },
  { name: "Ahmad Fauzi", gender: "male" }, { name: "Dewi Lestari", gender: "female" },
  { name: "Eko Prasetyo", gender: "male" }, { name: "Nadia Safitri", gender: "female" },
  { name: "Dimas Pratama", gender: "male" }, { name: "Amelia Putri", gender: "female" },
  { name: "Fajar Nugraha", gender: "male" }, { name: "Rina Susanti", gender: "female" },
  { name: "Yusuf Ibrahim", gender: "male" }, { name: "Mega Wijaya", gender: "female" },
  { name: "Aditya Perkasa", gender: "male" }, { name: "Gita Ayu", gender: "female" }
];

export default function App() {
  const [themeKey, setThemeKey] = useState(() => localStorage.getItem('papatong-theme') || 'indigo');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('papatong-dark-mode') === 'true');
  const currentTheme = THEMES[themeKey];

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('papatong-dark-mode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('papatong-theme', themeKey);
  }, [themeKey]);

  const [members, setMembers] = useState(SAMPLE_MEMBERS);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberGender, setNewMemberGender] = useState('male');
  const [bulkText, setBulkText] = useState('');
  const [isBulkMode, setIsBulkMode] = useState(false);

  const [splitMode, setSplitMode] = useState('numGroups');
  const [targetCount, setTargetCount] = useState(4); 
  const [leftoverStrategy, setLeftoverStrategy] = useState('distribute'); 
  
  const [shuffledGroups, setShuffledGroups] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [shuffleStatusText, setShuffleStatusText] = useState('');
  const [draggedMember, setDraggedMember] = useState(null);
  
  const [toast, setToast] = useState({ show: false, message: '' });
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); 

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [savedRosters, setSavedRosters] = useState([]);
  const [showRosterPicker, setShowRosterPicker] = useState(false);
  const [rosterName, setRosterName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isOnline, setIsOnline] = useState(
    !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 2500);
  };

  const handleAddMember = (e) => {
    if (e) e.preventDefault();
    const name = newMemberName.trim();
    if (!name) return;
    if (members.some(m => m.name === name)) {
      showToast('Nama anggota sudah terdaftar!');
      return;
    }
    setMembers([...members, { name, gender: newMemberGender }]);
    setNewMemberName('');
    showToast(`Ditambahkan: ${name}`);
  };

  const handleBulkAdd = () => {
    const lines = bulkText.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    if (lines.length === 0) {
      showToast('Masukkan baris teks terlebih dahulu!');
      return;
    }

    const existingNames = members.map(m => m.name);
    const uniqueNew = lines.filter(name => !existingNames.includes(name));
    setMembers([...members, ...uniqueNew.map(name => ({ name, gender: 'female' }))]);
    setBulkText('');
    setIsBulkMode(false);
    showToast(`Berhasil mengimpor ${uniqueNew.length} anggota.`);
  };

  const handleToggleGender = (index) => {
    setMembers(members.map((m, idx) =>
      idx === index ? { ...m, gender: m.gender === 'male' ? 'female' : 'male' } : m
    ));
  };

  const handleRemoveMember = (indexToRemove) => {
    const name = members[indexToRemove].name;
    setMembers(members.filter((_, idx) => idx !== indexToRemove));
    showToast(`Dihapus: ${name}`);
  };

  const confirmClearAll = () => {
    setMembers([]);
    setShuffledGroups([]);
    setShowClearConfirm(false);
    showToast('Semua anggota dibersihkan');
  };

  const handleLoadSample = () => {
    setMembers(SAMPLE_MEMBERS);
    showToast('Data contoh dimuat!');
  };

  const runShuffle = () => {
    if (members.length === 0) {
      showToast('Daftar anggota masih kosong!');
      return;
    }

    setIsShuffling(true);
    setShuffleStatusText('Mengacak urutan...');
    
    setTimeout(() => {
      setShuffleStatusText('Menghitung pembagian...');
      setTimeout(() => {
        performSplit();
        setIsShuffling(false);
        showToast('Kelompok berhasil dibagikan');
      }, 500);
    }, 500);
  };

  const shuffleArray = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const performSplit = () => {
    const shuffledMales = shuffleArray([...members.filter(m => m.gender === 'male')]);
    const shuffledFemales = shuffleArray([...members.filter(m => m.gender !== 'male')]);

    let numGroups;
    if (splitMode === 'numGroups') {
      numGroups = Math.min(targetCount, members.length);
    } else {
      const sizeLimit = Math.max(1, targetCount);
      if (leftoverStrategy === 'leaveOut') {
        numGroups = Math.floor(members.length / sizeLimit) || 1;
      } else {
        numGroups = Math.ceil(members.length / sizeLimit) || 1;
      }
    }

    const groups = Array.from({ length: numGroups }, (_, i) => ({
      id: i + 1,
      name: `Grup ${i + 1}`,
      members: []
    }));
    const groupTotals = Array(numGroups).fill(0);
    const groupMales = Array(numGroups).fill(0);

    const baseMales = Math.floor(shuffledMales.length / numGroups);
    const extraMales = shuffledMales.length % numGroups;
    const maleTargets = Array.from({ length: numGroups }, (_, i) =>
      i < extraMales ? baseMales + 1 : baseMales
    );

    shuffledMales.forEach(member => {
      let bestIdx = -1;
      let bestScore = Infinity;
      const candidates = [];

      for (let g = 0; g < numGroups; g++) {
        if (groupMales[g] >= maleTargets[g]) continue;
        const score = groupTotals[g] * 100;
        if (score < bestScore) {
          bestScore = score;
          candidates.length = 0;
          candidates.push(g);
        } else if (score === bestScore) {
          candidates.push(g);
        }
      }

      const idx = candidates[Math.floor(Math.random() * candidates.length)];
      groups[idx].members.push(member);
      groupTotals[idx]++;
      groupMales[idx]++;
    });

    shuffledFemales.forEach(member => {
      let bestScore = Infinity;
      const candidates = [];

      for (let g = 0; g < numGroups; g++) {
        const score = groupTotals[g] * 100;
        if (score < bestScore) {
          bestScore = score;
          candidates.length = 0;
          candidates.push(g);
        } else if (score === bestScore) {
          candidates.push(g);
        }
      }

      const idx = candidates[Math.floor(Math.random() * candidates.length)];
      groups[idx].members.push(member);
      groupTotals[idx]++;
    });

    if (splitMode !== 'numGroups') {
      const sizeLimit = Math.max(1, targetCount);
      if (leftoverStrategy === 'leaveOut') {
        let overflow = [];
        groups.forEach(g => {
          if (g.members.length > sizeLimit) {
            overflow.push(...g.members.splice(sizeLimit));
          }
        });
        if (overflow.length > 0) {
          groups.push({
            id: 'unassigned', name: 'Cadangan (Sisa)', isSpecial: true, members: overflow
          });
        }
      } else if (leftoverStrategy === 'distribute') {
        let overflow = [];
        groups.forEach(g => {
          if (g.members.length > sizeLimit) {
            overflow.push(...g.members.splice(sizeLimit));
          }
        });
        overflow.forEach((m, i) => {
          groups[i % numGroups].members.push(m);
        });
      }
    }

    setShuffledGroups(groups);
  };

  const handleDragStart = (e, member, sourceGroupIdx) => {
    setDraggedMember({ name: member, sourceIdx: sourceGroupIdx });
    e.dataTransfer.setData('text/plain', member);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetGroupIdx) => {
    e.preventDefault();
    if (!draggedMember) return;

    const { name, sourceIdx } = draggedMember;
    if (sourceIdx === targetGroupIdx) return;

    const updatedGroups = [...shuffledGroups];
    updatedGroups[sourceIdx].members = updatedGroups[sourceIdx].members.filter(m => m !== name);
    updatedGroups[targetGroupIdx].members.push(name);

    setShuffledGroups(updatedGroups);
    setDraggedMember(null);
    showToast(`Dipindah ke ${updatedGroups[targetGroupIdx].name}`);
  };

  const handleCopyToClipboard = () => {
    if (shuffledGroups.length === 0) return;

    let text = "=== HASIL PEMBAGIAN KELOMPOK ===\n\n";
    shuffledGroups.forEach(g => {
      text += `📍 ${g.name} (${g.members.length} Anggota):\n`;
      g.members.forEach((m, i) => {
        text += `   ${i + 1}. ${m}\n`;
      });
      text += "\n";
    });

    navigator.clipboard.writeText(text).then(() => {
      showToast('Teks berhasil disalin!');
    });
  };

  const handleDownloadCSV = () => {
    if (shuffledGroups.length === 0) return;

    let csvContent = "data:text/csv;charset=utf-8,Kelompok,Nama Anggota\n";
    shuffledGroups.forEach(g => {
      g.members.forEach(m => {
        csvContent += `"${g.name}","${m.replace(/"/g, '""')}"\n`;
      });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `group_shuffled.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV diunduh!');
  };

  const handleSaveToCloud = async () => {
    if (!rosterName.trim()) {
      showToast('Masukkan nama roster!');
      return;
    }
    if (members.length === 0) {
      showToast('Daftar anggota kosong!');
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('rosters')
        .insert({ name: rosterName.trim(), members });

      if (error) throw error;
      showToast(`Roster "${rosterName}" tersimpan!`);
      setShowSaveDialog(false);
      setRosterName('');
    } catch (err) {
      showToast(`Gagal menyimpan: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadRosters = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('rosters')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedRosters(data || []);
      setShowRosterPicker(true);
    } catch (err) {
      showToast(`Gagal memuat: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRoster = (roster) => {
    const normalized = roster.members.map(m =>
      typeof m === 'string' ? { name: m, gender: 'female' } : m
    );
    setMembers(normalized);
    setShuffledGroups([]);
    setShowRosterPicker(false);
    showToast(`Roster "${roster.name}" dimuat!`);
  };

  const handleDeleteRoster = async (id) => {
    try {
      const { error } = await supabase
        .from('rosters')
        .delete()
        .match({ id });

      if (error) throw error;
      setSavedRosters(savedRosters.filter(r => r.id !== id));
      showToast('Roster dihapus');
    } catch (err) {
      showToast(`Gagal menghapus: ${err.message}`);
    }
  };

  const maxPossibleGroups = Math.max(2, members.length);
  const maxPossibleSize = Math.max(1, members.length);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${currentTheme.bg} pb-10 font-sans ${currentTheme.text}`}>
      
      {toast.show && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 px-4 py-2.5 rounded-full shadow-lg border border-neutral-800 dark:border-neutral-200 text-xs font-medium tracking-wide animate-fade-in">
          <span>{toast.message}</span>
        </div>
      )}

      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-neutral-950/20 dark:bg-neutral-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`p-6 rounded-2xl border max-w-sm w-full shadow-xl ${currentTheme.card}`}>
            <h4 className="font-bold text-sm mb-2">Kosongkan Daftar?</h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6 leading-relaxed">Semua nama anggota dan hasil kelompok saat ini akan dihapus secara permanen.</p>
            <div className="flex gap-2 justify-end">
              <button 
                onClick={() => setShowClearConfirm(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              >
                Batal
              </button>
              <button 
                onClick={confirmClearAll}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-rose-500 hover:bg-rose-600 text-white"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {showSaveDialog && (
        <div className="fixed inset-0 z-50 bg-neutral-950/20 dark:bg-neutral-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`p-6 rounded-2xl border max-w-sm w-full shadow-xl ${currentTheme.card}`}>
            <h4 className="font-bold text-sm mb-2">Simpan Roster</h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">{members.length} anggota akan disimpan.</p>
            <input
              type="text"
              placeholder="Nama roster..."
              value={rosterName}
              onChange={(e) => setRosterName(e.target.value)}
              className={`w-full bg-neutral-50 dark:bg-neutral-950/60 border text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-1 mb-4 ${currentTheme.ring} ${currentTheme.border}`}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveToCloud()}
            />
            <div className="flex gap-2 justify-end">
              <button 
                onClick={() => { setShowSaveDialog(false); setRosterName(''); }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              >
                Batal
              </button>
              <button 
                onClick={handleSaveToCloud}
                disabled={isSaving}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50`}
              >
                {isSaving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showRosterPicker && (
        <div className="fixed inset-0 z-50 bg-neutral-950/20 dark:bg-neutral-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`p-6 rounded-2xl border max-w-sm w-full shadow-xl ${currentTheme.card}`}>
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-sm">Roster Tersimpan</h4>
              <button onClick={() => setShowRosterPicker(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            {savedRosters.length === 0 ? (
              <p className="text-xs text-neutral-400 text-center py-6">Belum ada roster tersimpan.</p>
            ) : (
              <div className="space-y-1.5 max-h-64 overflow-y-auto">
                {savedRosters.map((roster) => (
                  <div key={roster.id} className="flex items-center justify-between p-2.5 rounded-lg border border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-950/60">
                    <button
                      onClick={() => handleSelectRoster(roster)}
                      className="flex-1 text-left"
                    >
                      <p className="text-xs font-medium">{roster.name}</p>
                      <p className="text-[10px] text-neutral-400">{roster.members?.length || 0} anggota</p>
                    </button>
                    <button
                      onClick={() => handleDeleteRoster(roster.id)}
                      className="p-1 text-rose-400 hover:text-rose-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <header className="border-b border-neutral-200/50 dark:border-neutral-800/60 bg-white/40 dark:bg-neutral-950/40 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg ${currentTheme.badge}`}>
              <Shuffle className="h-4.5 w-4.5" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight">
                Papatong<span className={currentTheme.textAccent}>.</span>
              </h1>
              <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">MINIMALIST GROUP DIVIDER</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-lg">
              {Object.keys(THEMES).map((key) => (
                <button
                  key={key}
                  onClick={() => setThemeKey(key)}
                  className={`px-3 py-1 text-[11px] font-medium rounded-md transition-all ${
                    themeKey === key 
                      ? 'bg-white dark:bg-neutral-800 shadow-sm font-semibold' 
                      : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  {THEMES[key].name.split(' ')[0]}
                </button>
              ))}
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-all text-xs ${
                darkMode
                  ? 'bg-neutral-800 text-amber-400 hover:bg-neutral-700'
                  : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
              }`}
              title={darkMode ? 'Mode Terang' : 'Mode Gelap'}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>

        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-10">
        
        <div className="mb-10 text-center sm:text-left">
          <h2 className="text-2xl font-light tracking-tight text-neutral-900 dark:text-neutral-100">
            Atur kelompok dengan <span className={`font-semibold ${currentTheme.textAccent}`}>seimbang</span> dan efisien.
          </h2>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">Masukkan nama, pilih aturan pembagian kelompok, dan biarkan sistem mengacak instan.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-5 space-y-6">
            
            <div className={`rounded-xl border p-5 transition-all ${currentTheme.card}`}>
              
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-neutral-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Anggota</span>
                </div>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${currentTheme.badge}`}>
                  {members.length} Orang
                </span>
              </div>

              <div className="flex border-b border-neutral-100 dark:border-neutral-800 mb-4 text-xs">
                <button
                  onClick={() => setIsBulkMode(false)}
                  className={`flex-1 pb-2 font-medium transition-all ${
                    !isBulkMode 
                      ? `border-b-2 border-${currentTheme.primary}-500 text-neutral-800 dark:text-neutral-200 font-semibold` 
                      : 'text-neutral-400'
                  }`}
                >
                  Tambah Satu
                </button>
                <button
                  onClick={() => setIsBulkMode(true)}
                  className={`flex-1 pb-2 font-medium transition-all ${
                    isBulkMode 
                      ? `border-b-2 border-${currentTheme.primary}-500 text-neutral-800 dark:text-neutral-200 font-semibold` 
                      : 'text-neutral-400'
                  }`}
                >
                  Bulk Input
                </button>
              </div>

              {!isBulkMode ? (
                <form onSubmit={handleAddMember} className="flex gap-1.5 mb-4">
                  <button
                    type="button"
                    onClick={() => setNewMemberGender(g => g === 'male' ? 'female' : 'male')}
                    className={`p-2 rounded-lg border transition-colors ${
                      newMemberGender === 'male'
                        ? 'border-sky-400 bg-sky-50 text-sky-600 dark:border-sky-600 dark:bg-sky-950/30 dark:text-sky-400'
                        : 'border-rose-300 bg-rose-50 text-rose-500 dark:border-rose-600 dark:bg-rose-950/30 dark:text-rose-400'
                    }`}
                    title={newMemberGender === 'male' ? 'Laki-laki' : 'Perempuan'}
                  >
                    {newMemberGender === 'male' ? <Mars className="h-4 w-4" /> : <Venus className="h-4 w-4" />}
                  </button>
                  <input
                    type="text"
                    placeholder="Nama anggota..."
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className={`flex-1 bg-neutral-50 dark:bg-neutral-950/60 border text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-1 ${currentTheme.ring} ${currentTheme.border}`}
                  />
                  <button
                    type="submit"
                    className={`px-3.5 rounded-lg ${currentTheme.accent} transition-colors flex items-center justify-center`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </form>
              ) : (
                <div className="space-y-2 mb-4">
                  <textarea
                    rows="3"
                    placeholder="Ketik satu nama per baris..."
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    className={`w-full bg-neutral-50 dark:bg-neutral-950/60 border text-xs p-3 rounded-lg focus:outline-none focus:ring-1 ${currentTheme.ring} ${currentTheme.border}`}
                  />
                  <div className="flex gap-1.5">
                    <button
                      onClick={handleBulkAdd}
                      className={`flex-1 py-2 text-xs font-medium rounded-lg ${currentTheme.accent}`}
                    >
                      Impor Anggota
                    </button>
                    <button
                      onClick={() => setIsBulkMode(false)}
                      className="px-3 py-2 border border-neutral-200 dark:border-neutral-800 text-xs font-medium rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-500"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={handleLoadSample}
                  className="text-[11px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors flex items-center gap-1 font-medium"
                >
                  <Sparkles className="h-3 w-3" /> Muat Sampel
                </button>
                <div className="flex items-center gap-2">
                  {isOnline && (
                    <>
                      <button
                        onClick={() => setShowSaveDialog(true)}
                        className="text-[11px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors flex items-center gap-1 font-medium"
                      >
                        <Cloud className="h-3 w-3" /> Simpan
                      </button>
                      <button
                        onClick={handleLoadRosters}
                        disabled={isLoading}
                        className="text-[11px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors flex items-center gap-1 font-medium disabled:opacity-40"
                      >
                        <Database className="h-3 w-3" /> Muat
                      </button>
                    </>
                  )}
                  {members.length > 0 && (
                    <button
                      onClick={() => setShowClearConfirm(true)}
                      className="text-[11px] text-rose-500 hover:text-rose-600 transition-colors flex items-center gap-1 font-medium"
                    >
                      <Trash2 className="h-3 w-3" /> Bersihkan
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-44 overflow-y-auto border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/30 p-2.5 rounded-lg">
                {members.length === 0 ? (
                  <p className="text-center py-4 text-neutral-400 text-xs italic">Belum ada anggota.</p>
                ) : (
              <div className="flex flex-wrap gap-1">
                {members.map((member, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 pl-1.5 pr-1.5 py-1 bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800 text-[11px] rounded-md text-neutral-600 dark:text-neutral-300"
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleGender(idx)}
                      className={`p-0.5 rounded transition-colors ${
                        member.gender === 'male'
                          ? 'text-sky-500 hover:text-sky-700'
                          : 'text-rose-400 hover:text-rose-600'
                      }`}
                      title={member.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
                    >
                      {member.gender === 'male' ? <Mars className="h-3 w-3" /> : <Venus className="h-3 w-3" />}
                    </button>
                    {member.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(idx)}
                      className="hover:text-rose-500 p-0.5"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}
              </div>
                )}
              </div>

            </div>

            <div className={`rounded-xl border p-5 transition-all ${currentTheme.card}`}>
              
              <div className="flex items-center gap-1.5 mb-5">
                <Settings className="h-4 w-4 text-neutral-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Aturan</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 block mb-1.5">METODE PEMBAGIAN</label>
                  <div className="grid grid-cols-2 gap-1 bg-neutral-100 dark:bg-neutral-900 p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => {
                        setSplitMode('numGroups');
                        setTargetCount(4);
                      }}
                      className={`py-1.5 text-[11px] font-medium rounded-md flex items-center justify-center gap-1 transition-all ${
                        splitMode === 'numGroups'
                          ? 'bg-white dark:bg-neutral-800 shadow-sm font-semibold'
                          : 'text-neutral-400'
                      }`}
                    >
                      <LayoutGrid className="h-3 w-3" /> Jumlah Grup
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSplitMode('membersPerGroup');
                        setTargetCount(3);
                      }}
                      className={`py-1.5 text-[11px] font-medium rounded-md flex items-center justify-center gap-1 transition-all ${
                        splitMode === 'membersPerGroup'
                          ? 'bg-white dark:bg-neutral-800 shadow-sm font-semibold'
                          : 'text-neutral-400'
                      }`}
                    >
                      <Layers className="h-3 w-3" /> Anggota / Grup
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-bold text-neutral-400">
                      {splitMode === 'numGroups' ? 'TARGET JUMLAH GRUP' : 'MAKS ANGGOTA / GRUP'}
                    </label>
                    <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                      {targetCount} {splitMode === 'numGroups' ? 'Grup' : 'Orang'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTargetCount(prev => Math.max(1, prev - 1))}
                      className="h-8 w-8 border border-neutral-200 dark:border-neutral-800 rounded-lg flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="1"
                      max={splitMode === 'numGroups' ? maxPossibleGroups : maxPossibleSize}
                      value={targetCount}
                      onChange={(e) => setTargetCount(parseInt(e.target.value) || 1)}
                      className="flex-1 accent-neutral-800 dark:accent-neutral-200 h-1 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => setTargetCount(prev => {
                        const max = splitMode === 'numGroups' ? maxPossibleGroups : maxPossibleSize;
                        return Math.min(max, prev + 1);
                      })}
                      className="h-8 w-8 border border-neutral-200 dark:border-neutral-800 rounded-lg flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                {splitMode === 'membersPerGroup' && (
                  <div className="p-3 bg-neutral-50/50 dark:bg-neutral-900/40 rounded-lg border border-neutral-200/40 dark:border-neutral-800/60">
                    <label className="text-[9px] font-bold text-neutral-400 block mb-1.5 uppercase tracking-wide">
                      Jika ada anggota sisa
                    </label>
                    <div className="space-y-1.5 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer text-neutral-600 dark:text-neutral-300">
                        <input
                          type="radio"
                          name="leftover"
                          checked={leftoverStrategy === 'distribute'}
                          onChange={() => setLeftoverStrategy('distribute')}
                          className="accent-neutral-800 dark:accent-neutral-200"
                        />
                        Bagikan rata ke grup lain
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-neutral-600 dark:text-neutral-300">
                        <input
                          type="radio"
                          name="leftover"
                          checked={leftoverStrategy === 'newGroup'}
                          onChange={() => setLeftoverStrategy('newGroup')}
                          className="accent-neutral-800 dark:accent-neutral-200"
                        />
                        Buat grup baru tersendiri
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-neutral-600 dark:text-neutral-300">
                        <input
                          type="radio"
                          name="leftover"
                          checked={leftoverStrategy === 'leaveOut'}
                          onChange={() => setLeftoverStrategy('leaveOut')}
                          className="accent-neutral-800 dark:accent-neutral-200"
                        />
                        Kelompokkan sebagai sisa/cadangan
                      </label>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={runShuffle}
                  disabled={members.length === 0 || isShuffling}
                  className={`w-full py-3 rounded-lg text-xs font-bold ${currentTheme.accent} transition-transform active:scale-[0.99] flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm`}
                >
                  <Shuffle className="h-3.5 w-3.5" />
                  {isShuffling ? 'MENGACAK...' : 'KOCOK SEKARANG'}
                </button>
              </div>

            </div>

          </div>

          <div className="lg:col-span-7 space-y-6">
            
            <div className={`rounded-xl border p-5 transition-all min-h-[460px] flex flex-col justify-between ${currentTheme.card}`}>
              
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-100 dark:border-neutral-800/80">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                      Hasil Kelompok
                    </span>
                  </div>

                  {shuffledGroups.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <div className="flex bg-neutral-100 dark:bg-neutral-900 p-0.5 rounded-lg text-neutral-400">
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`p-1 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 shadow-sm' : ''}`}
                        >
                          <Grid className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setViewMode('list')}
                          className={`p-1 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 shadow-sm' : ''}`}
                        >
                          <FileText className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => setShuffledGroups([])}
                        className="px-2 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 text-[10px] font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800"
                      >
                        Reset
                      </button>
                    </div>
                  )}
                </div>

                {isShuffling ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-3">
                    <div className="w-10 h-10 border-2 border-neutral-300 dark:border-neutral-700 border-t-neutral-800 dark:border-t-neutral-200 rounded-full animate-spin"></div>
                    <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider">{shuffleStatusText}</p>
                  </div>
                ) : shuffledGroups.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 text-center space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-center text-neutral-400">
                      <Shuffle className="h-5 w-5 stroke-1" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-neutral-600 dark:text-neutral-300">Belum Ada Pembagian</h4>
                      <p className="text-[11px] text-neutral-400 mt-1 max-w-xs">Tentukan aturan lalu klik tombol Kocok di sebelah kiri.</p>
                    </div>
                  </div>
                ) : (
                  <div className={`grid gap-3.5 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                    {shuffledGroups.map((group, groupIdx) => (
                      <div
                        key={group.id}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, groupIdx)}
                        className={`p-4 rounded-lg border transition-all ${
                          group.isSpecial
                            ? 'bg-amber-50/20 dark:bg-amber-950/10 border-amber-200/50 dark:border-amber-900/30'
                            : 'bg-neutral-50/40 dark:bg-neutral-950/20 border-neutral-200/50 dark:border-neutral-800/60'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2.5">
                          <h4 className="font-bold text-xs flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${group.isSpecial ? 'bg-amber-500' : currentTheme.bullet}`}></span>
                            {group.name}
                          </h4>
                          <span className="text-[10px] text-neutral-400 font-medium">
                            {group.members.length} Orang
                          </span>
                        </div>

                        <div className="space-y-1 min-h-[45px]">
                          {group.members.length === 0 ? (
                            <div className="h-[45px] border border-dashed border-neutral-200/60 dark:border-neutral-800/40 rounded-md flex items-center justify-center text-[10px] text-neutral-400 italic">
                              Letakkan anggota di sini
                            </div>
                          ) : (
                            group.members.map((member, mIdx) => (
                              <div
                                key={mIdx}
                                draggable
                                onDragStart={(e) => handleDragStart(e, member, groupIdx)}
                                className="px-2.5 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200/40 dark:border-neutral-800/60 rounded-md flex items-center justify-between cursor-grab active:cursor-grabbing text-xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                              >
                                <span className="flex items-center gap-1.5 truncate">
                                  <span className="text-neutral-400 text-[9px] font-mono">{mIdx + 1}</span>
                                  <span className={member.gender === 'male' ? 'text-sky-500' : 'text-rose-400'}>
                                    {member.gender === 'male' ? <Mars className="h-3 w-3" /> : <Venus className="h-3 w-3" />}
                                  </span>
                                  {member.name}
                                </span>
                                <span className="text-neutral-300 text-[10px]">☰</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {shuffledGroups.length > 0 && !isShuffling && (
                <div className="mt-8 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
                  <div className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>Tarik kartu anggota untuk memindahkan grup</span>
                  </div>

                  <div className="flex gap-1.5 w-full sm:w-auto">
                    <button
                      onClick={handleCopyToClipboard}
                      className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-[11px] font-bold flex items-center justify-center gap-1"
                    >
                      <Copy className="h-3 w-3" /> Salin Teks
                    </button>
                    <button
                      onClick={handleDownloadCSV}
                      className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90 text-[11px] font-bold flex items-center justify-center gap-1"
                    >
                      <Download className="h-3 w-3" /> Ekspor CSV
                    </button>
                  </div>
                </div>
              )}

            </div>

            {shuffledGroups.length > 0 && !isShuffling && (
              <div className="grid grid-cols-3 gap-3">
                <div className={`p-3.5 rounded-lg border text-center ${currentTheme.card}`}>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">Total</p>
                  <p className="text-base font-bold mt-0.5">{members.length}</p>
                </div>
                <div className={`p-3.5 rounded-lg border text-center ${currentTheme.card}`}>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">Grup</p>
                  <p className="text-base font-bold mt-0.5">{shuffledGroups.filter(g => !g.isSpecial).length}</p>
                </div>
                <div className={`p-3.5 rounded-lg border text-center ${currentTheme.card}`}>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">Rata-Rata</p>
                  <p className="text-base font-bold mt-0.5">
                    {Math.round(members.length / shuffledGroups.filter(g => !g.isSpecial).length) || 0}
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>

      </main>

      <footer className="mt-20 border-t border-neutral-200/50 dark:border-neutral-800/60 py-8 bg-white/10 dark:bg-neutral-950/10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500 font-mono tracking-wide">
            &copy; {new Date().getFullYear()}{' '}
            <a
              href="https://github.com/RakaMuttaqin"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-neutral-600 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              RakaMuttaqin
            </a>
            . ALL RIGHTS RESERVED.
          </p>
          <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono uppercase tracking-widest flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${currentTheme.bullet}`}></span> Papatong
          </p>
        </div>
      </footer>

    </div>
  );
}
