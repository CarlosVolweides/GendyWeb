import React from 'react';
import { ScheduleGrid } from './components/schedule-grid';
import { ActivityCard } from './components/activity-card';
import { BottomNavigation } from './components/bottom-navigation';
import { SubjectsView } from './components/subjects-view';
import { SettingsView } from './components/settings-view';
import { CalendarView } from './components/calendar-view';
import { Wifi, Battery, Signal, ChevronLeft, ChevronRight, Settings, Moon, Sun } from 'lucide-react';
import { startOfWeek, endOfWeek, addWeeks, format } from 'date-fns';
import { es } from 'date-fns/locale';

const activities = [
  {
    date: 'Lunes 13',
    title: 'Examen práctico',
    description: 'Simulación de sistemas',
  },
  {
    date: 'Lunes 13',
    title: 'Examen práctico',
    description: 'Simulación de sistemas',
  },
  {
    date: 'Lunes 13',
    title: 'Examen práctico',
    description: 'Simulación de sistemas',
  },
  {
    date: 'Martes 14',
    title: 'Reunión de equipo',
    description: 'Proyecto final',
  },
  {
    date: 'Miércoles 15',
    title: 'Presentación',
    description: 'Diseño de interfaces',
  },
];

export interface ScheduleDay {
  day: string;
  startTime: string;
  endTime: string;
}

export interface Subject {
  id: string;
  title: string;
  schedules: ScheduleDay[];
  color: string;
}

export interface Schedule {
  id: string;
  name: string;
  subjects: Subject[];
}

const initialSchedules: Schedule[] = [
  {
    id: '1',
    name: '6to semestre v1',
    subjects: [
      {
        id: '1',
        title: 'Desarrollo de software II',
        schedules: [
          { day: 'Lunes', startTime: '08:00', endTime: '09:30' },
          { day: 'Miércoles', startTime: '08:00', endTime: '09:30' },
        ],
        color: 'bg-pink-500',
      },
      {
        id: '2',
        title: 'Simulación de sistemas',
        schedules: [
          { day: 'Martes', startTime: '08:00', endTime: '09:30' },
          { day: 'Jueves', startTime: '08:00', endTime: '09:30' },
        ],
        color: 'bg-yellow-400',
      },
      {
        id: '3',
        title: 'Inteligencia Artificial',
        schedules: [
          { day: 'Lunes', startTime: '10:00', endTime: '11:30' },
          { day: 'Miércoles', startTime: '10:00', endTime: '11:30' },
        ],
        color: 'bg-cyan-500',
      },
      {
        id: '4',
        title: 'Arquitectura del computador',
        schedules: [
          { day: 'Martes', startTime: '14:00', endTime: '16:00' },
          { day: 'Jueves', startTime: '14:00', endTime: '16:00' },
        ],
        color: 'bg-purple-500',
      },
    ],
  },
];

export default function App() {
  const [activeView, setActiveView] = React.useState('home');
  const [schedules, setSchedules] = React.useState<Schedule[]>(initialSchedules);
  const [activeScheduleId, setActiveScheduleId] = React.useState<string>(initialSchedules[0].id);
  const [currentWeekStart, setCurrentWeekStart] = React.useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 }) // La semana empieza el lunes
  );
  const [darkMode, setDarkMode] = React.useState(false);

  const activeSchedule = schedules.find(s => s.id === activeScheduleId);
  const subjects = activeSchedule?.subjects || [];

  // Calcular el rango de la semana actual
  const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
  const weekRangeText = `${format(currentWeekStart, 'd MMM', { locale: es })} - ${format(weekEnd, 'd MMM', { locale: es })}`;

  // Funciones para navegar entre semanas
  const goToPreviousWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, -1));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  };

  const handleAddSchedule = (name: string) => {
    const newSchedule: Schedule = {
      id: Date.now().toString(),
      name,
      subjects: [],
    };
    setSchedules([...schedules, newSchedule]);
    setActiveScheduleId(newSchedule.id);
  };

  const handleAddSubject = (subject: Subject) => {
    setSchedules(schedules.map(schedule =>
      schedule.id === activeScheduleId
        ? { ...schedule, subjects: [...schedule.subjects, subject] }
        : schedule
    ));
  };

  const handleUpdateSubject = (subjectId: string, updatedSubject: { title: string; schedules: ScheduleDay[]; color: string }) => {
    setSchedules(schedules.map(schedule =>
      schedule.id === activeScheduleId
        ? {
            ...schedule,
            subjects: schedule.subjects.map(subject =>
              subject.id === subjectId
                ? { ...subject, ...updatedSubject }
                : subject
            )
          }
        : schedule
    ));
  };

  const handleDeleteSubject = (subjectId: string) => {
    setSchedules(schedules.map(schedule =>
      schedule.id === activeScheduleId
        ? {
            ...schedule,
            subjects: schedule.subjects.filter(subject => subject.id !== subjectId)
          }
        : schedule
    ));
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile Container */}
      <div className={`max-w-md mx-auto ${darkMode ? 'bg-gray-900' : 'bg-white'} min-h-screen shadow-xl`}>
        {/* Status Bar */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} px-6 pt-3 pb-2`}>
          <div className="flex justify-between items-center text-xs">
            <span className={darkMode ? 'text-gray-300' : 'text-gray-900'}>9:41</span>
            <div className={`flex items-center gap-1 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
              <Signal size={14} />
              <Wifi size={14} />
              <Battery size={14} />
            </div>
          </div>
        </div>

        {/* Header */}
        <div className={`px-6 py-4 flex justify-between items-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h1 className="text-cyan-500 text-2xl" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>Gendy</h1>
          <div className="flex gap-2">
            <button 
              onClick={() => setDarkMode(!darkMode)} 
              className={`${darkMode ? 'text-gray-300 hover:text-yellow-400' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
            >
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            <button 
              onClick={() => setActiveView('settings')} 
              className={`${darkMode ? 'text-gray-300 hover:text-cyan-400' : 'text-gray-400 hover:text-cyan-500'} transition-colors`}
            >
              <Settings size={24} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className={`pb-24 overflow-y-auto custom-scrollbar ${darkMode ? 'bg-gray-900' : ''}`} style={{ maxHeight: 'calc(100vh - 160px)' }}>
          {activeView === 'home' && (
            <>
              {/* Schedule Section */}
              <div className="px-6 py-4">
                <h2 className={`mb-4 text-xl text-center ${darkMode ? 'text-cyan-400' : 'text-blue-300'}`}>Horario semanal</h2>
                <ScheduleGrid subjects={subjects} />
              </div>

              {/* Activities Section */}
              <div className="px-6 py-4">
                <div className="mb-4">
                  <h2 className={`text-xl text-center mb-2 ${darkMode ? 'text-cyan-400' : 'text-blue-300'}`}>Actividades de la semana</h2>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={goToPreviousWeek}
                      className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                      aria-label="Semana anterior"
                    >
                      <ChevronLeft size={20} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
                    </button>
                    <span className={`text-sm min-w-[120px] text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {weekRangeText}
                    </span>
                    <button
                      onClick={goToNextWeek}
                      className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                      aria-label="Semana siguiente"
                    >
                      <ChevronRight size={20} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  {activities.map((activity, index) => (
                    <ActivityCard
                      key={index}
                      date={activity.date}
                      title={activity.title}
                      description={activity.description}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {activeView === 'list' && (
            <SubjectsView
              schedules={schedules}
              activeScheduleId={activeScheduleId}
              onScheduleChange={setActiveScheduleId}
              onAddSchedule={handleAddSchedule}
              onAddSubject={handleAddSubject}
              onUpdateSubject={handleUpdateSubject}
              onDeleteSubject={handleDeleteSubject}
            />
          )}

          {activeView === 'settings' && <SettingsView schedules={schedules} />}

          {activeView === 'calendar' && <CalendarView subjects={subjects} />}
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation activeTab={activeView} onTabChange={setActiveView} darkMode={darkMode} />
      </div>
    </div>
  );
}
