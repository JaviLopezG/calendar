import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { Printer, X, Plus, Trash2, Settings, Lock, Users, Link as LinkIcon, Loader2, Edit3, Check, Calendar } from 'lucide-react';

// --- CONFIGURACIÓN FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyBTyBYnINBYaQ0hlZnUNYR1SbcKOiUBCI4",
  authDomain: "planner-compartido.firebaseapp.com",
  projectId: "planner-compartido",
  storageBucket: "planner-compartido.firebasestorage.app",
  messagingSenderId: "703694152396",
  appId: "1:703694152396:web:211484602dae67ae079869"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

const COLLECTION_NAME = 'planners';

// --- CONSTANTES ---
const monthColors = [
  { name: 'Jan', full: 'January', bg: '#fff5f5', weekend: '#fed7d7' },
  { name: 'Feb', full: 'February', bg: '#f0f9ff', weekend: '#bae6fd' },
  { name: 'Mar', full: 'March', bg: '#f0fdf4', weekend: '#bbf7d0' },
  { name: 'Abr', full: 'April', bg: '#fefce8', weekend: '#fef08a' },
  { name: 'May', full: 'May', bg: '#faf5ff', weekend: '#e9d5ff' },
  { name: 'Jun', full: 'June', bg: '#fff7ed', weekend: '#fed7aa' },
  { name: 'Jul', full: 'July', bg: '#ecfeff', weekend: '#a5f3fc' },
  { name: 'Aug', full: 'August', bg: '#fdf2f8', weekend: '#fbcfe8' },
  { name: 'Sep', full: 'September', bg: '#eef2ff', weekend: '#c7d2fe' },
  { name: 'Oct', full: 'October', bg: '#f7fee7', weekend: '#d9f99d' },
  { name: 'Nov', full: 'November', bg: '#f0fdfa', weekend: '#99f6e4' },
  { name: 'Dec', full: 'December', bg: '#fffbeb', weekend: '#fde68a' },
];

const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

const App = () => {
  const [user, setUser] = useState(null);
  const [calendarId, setCalendarId] = useState(null);
  const [calendarData, setCalendarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEventText, setNewEventText] = useState('');
  
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  
  // Estado local para el cambio de año en ajustes
  const [yearInput, setYearInput] = useState('');

  // 1. AUTH & TIMEOUT
  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(() => {
      if (isMounted && loading) {
        setAuthError("Connection timeout. Please reload.");
      }
    }, 8000);

    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (e) {
        console.error("Auth error:", e);
        if (isMounted) setAuthError("Authentication error: " + e.message);
      }
    };

    initAuth();

    const unsub = onAuthStateChanged(auth, (u) => {
      if (isMounted) setUser(u);
    });

    return () => {
      isMounted = false;
      clearTimeout(timer);
      unsub();
    };
  }, []);

  // 2. ROUTING
  useEffect(() => {
    if (!user) return;
    const resolveCalendar = async () => {
      const params = new URLSearchParams(window.location.search);
      let targetId = params.get('id') || localStorage.getItem('fixed_planner_id');
      if (targetId) setCalendarId(targetId);
      else await createNewCalendar();
    };
    resolveCalendar();
  }, [user]);

  // 3. DATA SYNC
  useEffect(() => {
    if (!user || !calendarId) return;

    setLoading(true);
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', COLLECTION_NAME, calendarId);

    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setCalendarData(data);
        // Set year input default value when data loads
        if (!settingsOpen) setYearInput(data.year || 2026);
        localStorage.setItem('fixed_planner_id', calendarId);
        setAuthError(null);
      } else {
        createNewCalendar(calendarId); 
      }
      setLoading(false);
    }, (err) => {
      console.error("Firestore Error:", err);
      setAuthError("Permission denied or connection error.");
      setLoading(false);
    });

    return () => unsub();
  }, [calendarId, user]);

  // --- ACTIONS ---

  const createNewCalendar = async (forceId = null) => {
    if (!user) return;
    
    // Lógica del año por defecto
    const now = new Date();
    // Si estamos en Diciembre (mes 11), crear año siguiente, si no, año actual.
    const defaultYear = now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();
    
    const newId = forceId || Math.random().toString(36).substring(2, 9);
    const defaultData = {
      ownerId: user.uid,
      isPublic: false,
      year: defaultYear,
      title: `${defaultYear} Year Planner`,
      createdAt: new Date().toISOString(),
      events: {}
    };

    try {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', COLLECTION_NAME, newId);
      await setDoc(docRef, defaultData);
      setCalendarId(newId);
      const newUrl = `${window.location.pathname}?id=${newId}`;
      window.history.replaceState({ path: newUrl }, '', newUrl);
    } catch (e) {
      setAuthError("Error creating calendar: " + e.message);
    }
  };

  const saveTitle = async () => {
    if (!tempTitle.trim()) return setIsEditingTitle(false);
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', COLLECTION_NAME, calendarId);
    await updateDoc(docRef, { title: tempTitle });
    setIsEditingTitle(false);
  };

  const togglePublic = async () => {
    if (calendarData.ownerId !== user.uid) return;
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', COLLECTION_NAME, calendarId);
    await updateDoc(docRef, { isPublic: !calendarData.isPublic });
  };

  const updateYear = async () => {
    if (calendarData.ownerId !== user.uid) return;
    const newYear = parseInt(yearInput);
    
    // Validación: Año 2000+
    if (isNaN(newYear) || newYear < 2000) {
      alert("Please enter a valid year (2000 or later).");
      return;
    }

    if (newYear === calendarData.year) return; // No hay cambios

    // MIGRACIÓN DE EVENTOS
    // Recorremos todos los eventos antiguos y actualizamos su clave YYYY-M-D al nuevo año
    const oldEvents = calendarData.events || {};
    const newEvents = {};
    const oldYearPrefix = `${calendarData.year || 2026}-`;
    const newYearPrefix = `${newYear}-`;

    Object.keys(oldEvents).forEach(key => {
      // Si la clave empieza por el año viejo, la reemplazamos
      // Si por alguna razón la clave no tiene el formato esperado, intentamos preservarla
      if (key.startsWith(oldYearPrefix)) {
        const suffix = key.substring(oldYearPrefix.length); // M-D
        newEvents[`${newYearPrefix}${suffix}`] = oldEvents[key];
      } else {
        // Fallback para claves extrañas, intentar parsear o descartar
        // Asumimos formato YYYY-M-D. Si el año no coincide, podría ser basura o de otra migración
        // Para seguridad, intentamos reconstruir:
        const parts = key.split('-');
        if (parts.length === 3) {
            newEvents[`${newYear}-${parts[1]}-${parts[2]}`] = oldEvents[key];
        }
      }
    });

    const docRef = doc(db, 'artifacts', appId, 'public', 'data', COLLECTION_NAME, calendarId);
    
    // Actualizamos año y eventos migrados. Opcional: actualizamos título si contiene el año viejo
    let newTitle = calendarData.title;
    if (newTitle.includes(String(calendarData.year))) {
        newTitle = newTitle.replace(String(calendarData.year), String(newYear));
    }

    await updateDoc(docRef, { 
        year: newYear,
        events: newEvents,
        title: newTitle
    });
    setSettingsOpen(false);
  };

  const saveEvent = async () => {
    if (!newEventText.trim()) return;
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', COLLECTION_NAME, calendarId);
    const key = selectedDate.dateKey;
    const currentEvents = calendarData.events[key] || [];
    
    await updateDoc(docRef, {
      [`events.${key}`]: [...currentEvents, { id: Date.now().toString(), text: newEventText }]
    });
    setNewEventText('');
  };

  const removeEvent = async (eventId) => {
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', COLLECTION_NAME, calendarId);
    const key = selectedDate.dateKey;
    const currentEvents = calendarData.events[key] || [];
    const filtered = currentEvents.filter(e => e.id !== eventId);
    
    await updateDoc(docRef, { [`events.${key}`]: filtered });
  };

  const copyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?id=${calendarId}`;
    navigator.clipboard.writeText(url);
    alert("Link copied!");
  };

  // --- RENDERING LOGIC ---

  const generateMonths = () => {
    const months = Array.from({ length: 12 }, () => []);
    // Usar el año guardado o 2026 por defecto (para calendarios viejos)
    const year = calendarData?.year || 2026; 
    const eventMap = calendarData?.events || {};

    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${year}-${month}-${day}`;
        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay();
        
        months[month].push({
          dateKey, day, month, dayOfWeek,
          isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
          events: eventMap[dateKey] || []
        });
      }
    }
    return months;
  };

  const renderCellContent = (day) => {
    const evs = day.events;
    if (evs.length === 0) return null;

    if (evs.length === 1) {
      return (
        <div className="w-full h-full text-[8px] leading-[9px] text-slate-700 font-medium px-1 flex items-center">
          <span className="line-clamp-2 w-full">{evs[0].text}</span>
        </div>
      );
    }
    if (evs.length === 2) {
      return (
        <div className="w-full h-full flex flex-col justify-center px-1">
          {evs.map((ev, i) => (
            <div key={i} className="text-[8px] leading-[9px] truncate text-slate-700 font-medium h-[10px]">
              {ev.text}
            </div>
          ))}
        </div>
      );
    }
    return (
      <div className="w-full h-full flex flex-col justify-center px-1">
        <div className="text-[8px] leading-[9px] truncate text-slate-700 font-medium h-[10px]">
          {evs[0].text}
        </div>
        <div className="text-[8px] leading-[9px] text-slate-500 italic h-[10px] flex items-center">
          <Plus size={8} className="mr-0.5" /> {evs.length - 1} more...
        </div>
      </div>
    );
  };

  // --- RENDER HELPERS ---
  
  const DayRow = ({ dayObj, heightClass, styleHeight }) => {
    const isFirst = dayObj.day === 1;
    const config = monthColors[dayObj.month];
    const bg = dayObj.isWeekend ? config.weekend : config.bg;

    return (
      <React.Fragment>
        {isFirst && (
          <div 
            className="text-center font-bold text-[10px] uppercase tracking-widest py-1 border-b border-slate-300 text-slate-600 print:text-slate-800"
            style={{ backgroundColor: config.weekend }}
          >
            {config.name}
          </div>
        )}
        <div 
          onClick={() => {
            if (canEdit || dayObj.events.length > 0) {
                setSelectedDate(dayObj);
                setNewEventText('');
                setModalOpen(true);
            }
          }}
          className={`
            group relative border-b border-slate-200 flex overflow-hidden transition-colors
            ${(canEdit || dayObj.events.length > 0) ? 'cursor-pointer hover:brightness-95' : 'cursor-default'}
            ${heightClass}
          `}
          style={{ backgroundColor: bg, height: styleHeight }}
        >
          <div className="w-5 flex-shrink-0 flex flex-col items-center justify-center border-r border-slate-300/50 text-[9px] leading-none text-slate-500 font-medium bg-white/30 print:bg-transparent">
            <span>{dayObj.day}</span>
            <span className="text-[7px] opacity-70">{daysOfWeek[dayObj.dayOfWeek]}</span>
          </div>
          <div className="flex-1 min-w-0">
            {renderCellContent(dayObj)}
          </div>
        </div>
      </React.Fragment>
    );
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  const isOwner = calendarData?.ownerId === user?.uid;
  const canEdit = isOwner || calendarData?.isPublic;
  const currentYear = calendarData?.year || 2026;
  const allMonths = generateMonths();

  return (
    // IMPORTANTE: bg-white forzado en print para evitar página gris
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 print:bg-white print:h-auto print:min-h-0 print:overflow-visible">
      
      {/* HEADER (No Print) */}
      <div className="bg-white border-b p-4 mb-8 no-print sticky top-0 z-20 shadow-sm">
        <div className="max-w-[210mm] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-2 h-8">
              {isEditingTitle ? (
                <div className="flex items-center gap-1 w-full max-w-[300px]">
                  <input 
                    autoFocus
                    className="flex-1 text-lg font-bold px-2 py-0.5 border rounded border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none"
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveTitle()}
                  />
                  <button onClick={saveTitle} className="bg-green-500 text-white p-1 rounded hover:bg-green-600"><Check size={16} /></button>
                </div>
              ) : (
                <h1 className="text-lg font-bold flex items-center gap-2 group cursor-pointer" onClick={() => { if(isOwner){ setTempTitle(calendarData.title || `${currentYear} Planner`); setIsEditingTitle(true); }}}>
                  {calendarData.title || `${currentYear} Planner`}
                  {isOwner && <Edit3 size={14} className="opacity-0 group-hover:opacity-100 text-slate-400" />}
                </h1>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
               {isOwner ? 'Owner Access' : 'Guest Access'}
            </div>
          </div>

          <div className="flex gap-2">
            {isOwner && (
              <button 
                onClick={() => {
                    setYearInput(calendarData.year || 2026);
                    setSettingsOpen(true);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs border transition ${calendarData.isPublic ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}
              >
                {calendarData.isPublic ? <Users size={14} /> : <Lock size={14} />}
                {calendarData.isPublic ? 'Public' : 'Private'}
              </button>
            )}
            <button onClick={copyLink} className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-200 transition">
                <LinkIcon size={14} /> Link
            </button>
            <button onClick={() => window.print()} className="flex items-center gap-2 bg-slate-800 text-white px-4 py-1.5 rounded text-xs font-medium hover:bg-black transition">
              <Printer size={14} /> Print
            </button>
          </div>
        </div>
      </div>

      {/* --- WEB VIEW --- */}
      <div className="flex justify-center pb-10 print:hidden">
        <div className="bg-white w-full max-w-[210mm] shadow-lg">
           <div className="text-center py-4 border-b border-slate-100">
             <h2 className="text-xl font-bold text-slate-700 uppercase tracking-widest">{calendarData.title || `${currentYear} Planner`}</h2>
           </div>
           <div className="grid grid-cols-6 border-l border-b border-slate-300">
              {Array.from({ length: 6 }).map((_, colIndex) => {
                  const monthA = allMonths[colIndex * 2];
                  const monthB = allMonths[colIndex * 2 + 1];
                  return (
                    <div key={colIndex} className="border-r border-slate-300 flex flex-col">
                        {monthA.map(day => (<DayRow key={day.dateKey} dayObj={day} styleHeight="24px" />))}
                        {monthB.map(day => (<DayRow key={day.dateKey} dayObj={day} styleHeight="24px" />))}
                    </div>
                  );
              })}
           </div>
        </div>
      </div>

      {/* --- PRINT VIEW --- */}
      <div className="hidden print:block">
        
        {/* Page 1 */}
        <div className="w-full h-[297mm] px-[10mm] py-[10mm] bg-white break-after-page box-border overflow-hidden">
            <div className="text-center mb-1">
                <h1 className="text-xl font-bold uppercase tracking-widest text-slate-800">
                {calendarData.title || `${currentYear} Planner`} <span className="text-sm text-slate-400">(Jan - Jun)</span>
                </h1>
            </div>
            <div className="grid grid-cols-6 border-l border-t border-slate-300">
                {allMonths.slice(0, 6).map((monthDays, i) => (
                    <div key={i} className="border-r border-slate-300">
                        {monthDays.map(day => (
                            <DayRow key={day.dateKey} dayObj={day} styleHeight="28px" />
                        ))}
                    </div>
                ))}
            </div>
        </div>

        {/* Page 2 */}
        <div className="w-full h-[297mm] px-[10mm] py-[10mm] bg-white box-border overflow-hidden">
            <div className="text-center mb-1">
                <h1 className="text-xl font-bold uppercase tracking-widest text-slate-800">
                {calendarData.title || `${currentYear} Planner`} <span className="text-sm text-slate-400">(Jul - Dec)</span>
                </h1>
            </div>
            <div className="grid grid-cols-6 border-l border-t border-slate-300">
                {allMonths.slice(6, 12).map((monthDays, i) => (
                    <div key={i} className="border-r border-slate-300">
                        {monthDays.map(day => (
                            <DayRow key={day.dateKey} dayObj={day} styleHeight="28px" />
                        ))}
                    </div>
                ))}
            </div>
        </div>

      </div>

      {/* MODALS */}
      {modalOpen && selectedDate && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 no-print backdrop-blur-[1px]" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-lg shadow-xl w-80 overflow-hidden border border-slate-200" onClick={e => e.stopPropagation()}>
            <div className="p-3 bg-slate-50 border-b flex justify-between items-center">
              <span className="font-bold text-sm text-slate-700">{selectedDate.day} {monthColors[selectedDate.month].full} {currentYear}</span>
              <button onClick={() => setModalOpen(false)}><X size={16} className="text-slate-400" /></button>
            </div>
            <div className="p-3 max-h-60 overflow-y-auto">
              {calendarData.events[selectedDate.dateKey]?.length > 0 ? (
                 calendarData.events[selectedDate.dateKey].map(ev => (
                  <div key={ev.id} className="flex justify-between items-start text-xs p-2 mb-1 bg-gray-50 rounded border border-gray-100 group">
                    <span className="break-words w-full pr-2">{ev.text}</span>
                    {canEdit && <button onClick={() => removeEvent(ev.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={12} /></button>}
                  </div>
                ))
              ) : <p className="text-gray-400 text-xs italic text-center py-2">No events</p>}
            </div>
            {canEdit && (
                <div className="p-3 border-t bg-slate-50 flex gap-2">
                    <input autoFocus className="flex-1 text-xs border rounded px-2 py-1.5 outline-none focus:border-blue-400" placeholder="Add event..." value={newEventText} onChange={e => setNewEventText(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveEvent()} />
                    <button onClick={saveEvent} disabled={!newEventText.trim()} className="bg-slate-800 text-white rounded p-1.5 hover:bg-black disabled:opacity-50"><Plus size={16} /></button>
                </div>
            )}
          </div>
        </div>
      )}

      {settingsOpen && isOwner && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 no-print" onClick={() => setSettingsOpen(false)}>
          <div className="bg-white rounded-xl shadow-2xl p-6 w-96 max-w-full" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Settings size={20} /> Settings</h2>
            
            <div className="space-y-4">
                {/* Year Setting */}
                <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                    <h3 className="font-semibold text-sm mb-2 text-slate-700 flex items-center gap-2">
                      <Calendar size={16} /> Calendar Year
                    </h3>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="number" 
                        min="2000"
                        className="border border-slate-300 rounded px-3 py-1.5 text-sm w-24 outline-none focus:ring-2 focus:ring-blue-500"
                        value={yearInput}
                        onChange={(e) => setYearInput(e.target.value)}
                      />
                      <button 
                        onClick={updateYear}
                        disabled={parseInt(yearInput) === calendarData.year}
                        className="bg-slate-800 text-white px-3 py-1.5 rounded text-sm hover:bg-black disabled:opacity-50"
                      >
                        Update Year
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2 leading-tight">
                        Warning: Updating the year will move all existing events to the new dates.
                    </p>
                </div>

                {/* Privacy Setting */}
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h3 className="font-semibold text-sm mb-2 text-slate-700">Privacy</h3>
                    <div className="flex gap-2 mb-2">
                        <button onClick={() => calendarData.isPublic && togglePublic()} className={`flex-1 py-2 text-xs rounded-md border flex flex-col items-center gap-1 ${!calendarData.isPublic ? 'bg-white border-blue-500 text-blue-700 shadow-sm ring-1 ring-blue-500' : 'text-slate-500 border-transparent hover:bg-white'}`}><Lock size={16} /> Private</button>
                        <button onClick={() => !calendarData.isPublic && togglePublic()} className={`flex-1 py-2 text-xs rounded-md border flex flex-col items-center gap-1 ${calendarData.isPublic ? 'bg-white border-green-500 text-green-700 shadow-sm ring-1 ring-green-500' : 'text-slate-500 border-transparent hover:bg-white'}`}><Users size={16} /> Public</button>
                    </div>
                    <p className="text-[11px] text-slate-500">{calendarData.isPublic ? "Anyone with the link can edit events." : "Only you can edit. Others can only view."}</p>
                </div>
            </div>
            <div className="mt-6 flex justify-end"><button onClick={() => setSettingsOpen(false)} className="px-4 py-2 bg-slate-800 text-white rounded text-sm">Close</button></div>
          </div>
        </div>
      )}

      {/* IMPORTANTE: @page margin: 0 para eliminar encabezados/pies y márgenes del navegador */}
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 0; }
          body, html, #root { 
            width: 210mm;
            height: 100%;
            margin: 0; 
            padding: 0;
            background-color: white !important;
          }
          /* Reset total para evitar herencias del contenedor padre */
          .min-h-screen { min-height: 0 !important; }
          .bg-slate-100 { background-color: white !important; }
          
          .no-print { display: none !important; }
          .break-after-page { page-break-after: always; break-after: page; }
          
          /* Ajuste para asegurar que los colores de fondo se imprimen */
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>
    </div>
  );
};

export default App;
