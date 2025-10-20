import React from 'react';
import { Calendar } from './ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Plus, Clock, FileText } from 'lucide-react';
import { format, isSameDay, setHours, setMinutes } from 'date-fns';
import { es } from 'date-fns/locale';

interface Activity {
  id: string;
  date: Date;
  title: string;
  description: string;
  time?: string;
  subjectId?: string;
}

interface ScheduleDay {
  day: string;
  startTime: string;
  endTime: string;
}

interface Subject {
  id: string;
  title: string;
  schedules: ScheduleDay[];
  color: string;
}

interface CalendarViewProps {
  subjects: Subject[];
}

const DAY_MAP: { [key: string]: number } = {
  'Lunes': 0,
  'Martes': 1,
  'Miércoles': 2,
  'Jueves': 3,
  'Viernes': 4,
  'Sábado': 5,
  'Domingo': 6,
};

export function CalendarView({ subjects }: CalendarViewProps) {
  // Convertir materias al formato esperado
  const convertedSubjects = subjects.map(subject => ({
    id: subject.id,
    name: subject.title,
    color: subject.color,
    schedule: subject.schedules.map(schedule => ({
      day: DAY_MAP[schedule.day] ?? -1,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
    })).filter(s => s.day !== -1),
  }));
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [isAddActivityOpen, setIsAddActivityOpen] = React.useState(false);
  const [activities, setActivities] = React.useState<Activity[]>([
    {
      id: '1',
      date: new Date(2025, 9, 13), // Octubre 13, 2025
      title: 'Examen práctico',
      description: 'Simulación de sistemas',
    },
    {
      id: '2',
      date: new Date(2025, 9, 13), // Octubre 13, 2025
      title: 'Entrega de proyecto',
      description: 'Programación web',
    },
    {
      id: '3',
      date: new Date(2025, 9, 14), // Octubre 14, 2025
      title: 'Reunión de equipo',
      description: 'Proyecto final',
    },
    {
      id: '4',
      date: new Date(2025, 9, 15), // Octubre 15, 2025
      title: 'Presentación',
      description: 'Diseño de interfaces',
    },
  ]);
  
  const [activityType, setActivityType] = React.useState<'free' | 'subject'>('free');
  const [selectedSubject, setSelectedSubject] = React.useState<string>('');
  const [selectedTime, setSelectedTime] = React.useState<string>('');
  const [selectedDay, setSelectedDay] = React.useState<number | null>(null);
  const [freeActivityDay, setFreeActivityDay] = React.useState<string>('');
  const [freeActivityMonth, setFreeActivityMonth] = React.useState<string>('');
  const [freeActivityYear, setFreeActivityYear] = React.useState<string>('');
  
  const [newActivity, setNewActivity] = React.useState({
    title: '',
    description: '',
  });

  const handleAddActivity = () => {
    if (!newActivity.title) return;

    let activityDate: Date;
    let activityTime: string | undefined = undefined;

    // Si es actividad libre, crear fecha desde los selectores
    if (activityType === 'free') {
      if (!freeActivityDay || !freeActivityMonth || !freeActivityYear) return;
      activityDate = new Date(
        parseInt(freeActivityYear),
        parseInt(freeActivityMonth),
        parseInt(freeActivityDay)
      );
    } else {
      // Si es actividad asociada a materia, verificar que haya seleccionado materia y día
      if (!selectedDate || !selectedSubject || selectedDay === null) return;
      
      const subject = convertedSubjects.find(s => s.id === selectedSubject);
      if (!subject) return;
      
      const scheduleForDay = subject.schedule.find(s => s.day === selectedDay);
      if (!scheduleForDay) return;
      
      activityDate = selectedDate;
      activityTime = scheduleForDay.startTime;
    }

    const activity: Activity = {
      id: Date.now().toString(),
      date: activityDate,
      title: newActivity.title,
      description: newActivity.description,
      time: activityTime,
      subjectId: activityType === 'subject' ? selectedSubject : undefined,
    };

    setActivities([...activities, activity]);
    setNewActivity({ title: '', description: '' });
    setActivityType('free');
    setSelectedSubject('');
    setSelectedTime('');
    setSelectedDay(null);
    setFreeActivityDay('');
    setFreeActivityMonth('');
    setFreeActivityYear('');
    setIsAddActivityOpen(false);
  };

  const handleDeleteActivity = (id: string) => {
    setActivities(activities.filter(activity => activity.id !== id));
  };

  const selectedDayActivities = selectedDate
    ? activities.filter(activity => isSameDay(activity.date, selectedDate))
    : [];

  const daysWithActivities = activities.map(activity => activity.date);

  return (
    <div className="px-6 py-4">
      <h2 className="text-blue-300 text-xl text-center mb-6">Calendario</h2>

      {/* Modal para agregar actividad */}
      <Dialog open={isAddActivityOpen} onOpenChange={setIsAddActivityOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nueva actividad</DialogTitle>
            <DialogDescription>
              {activityType === 'free' 
                ? 'Crea una actividad personalizada' 
                : `Agrega una actividad para el ${selectedDate && format(selectedDate, "d 'de' MMMM", { locale: es })}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label>Tipo de actividad</Label>
              <RadioGroup value={activityType} onValueChange={(value: 'free' | 'subject') => setActivityType(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="free" id="free" />
                  <Label htmlFor="free" className="font-normal cursor-pointer">Actividad libre</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="subject" id="subject" />
                  <Label htmlFor="subject" className="font-normal cursor-pointer">Asociada a una materia</Label>
                </div>
              </RadioGroup>
            </div>

            {activityType === 'free' && (
              <div className="space-y-2">
                <Label>Fecha</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="day-select" className="text-sm text-gray-500">Día</Label>
                    <Select value={freeActivityDay} onValueChange={setFreeActivityDay}>
                      <SelectTrigger id="day-select">
                        <SelectValue placeholder="Día" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                          <SelectItem key={day} value={day.toString()}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="month-select" className="text-sm text-gray-500">Mes</Label>
                    <Select value={freeActivityMonth} onValueChange={setFreeActivityMonth}>
                      <SelectTrigger id="month-select">
                        <SelectValue placeholder="Mes" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
                        ].map((month, index) => (
                          <SelectItem key={index} value={index.toString()}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="year-select" className="text-sm text-gray-500">Año</Label>
                    <Select value={freeActivityYear} onValueChange={setFreeActivityYear}>
                      <SelectTrigger id="year-select">
                        <SelectValue placeholder="Año" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 5 }, (_, i) => 2025 + i).map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {activityType === 'subject' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="subject-select">Materia</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger id="subject-select">
                      <SelectValue placeholder="Selecciona una materia" />
                    </SelectTrigger>
                    <SelectContent>
                      {convertedSubjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedSubject && (
                  <div className="space-y-2">
                    <Label htmlFor="day-select">Día de la semana</Label>
                    <Select 
                      value={selectedDay !== null ? selectedDay.toString() : ''} 
                      onValueChange={(value) => setSelectedDay(parseInt(value))}
                    >
                      <SelectTrigger id="day-select">
                        <SelectValue placeholder="Selecciona un día" />
                      </SelectTrigger>
                      <SelectContent>
                        {convertedSubjects
                          .find(s => s.id === selectedSubject)
                          ?.schedule.map((sched) => {
                            const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
                            return (
                              <SelectItem key={sched.day} value={sched.day.toString()}>
                                {dayNames[sched.day]} ({sched.startTime} - {sched.endTime})
                              </SelectItem>
                            );
                          })}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            )}



            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                placeholder="Ej: Examen de matemáticas"
                value={newActivity.title}
                onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Ej: Capítulos 1-5"
                value={newActivity.description}
                onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddActivityOpen(false);
                setNewActivity({ title: '', description: '' });
                setActivityType('free');
                setSelectedSubject('');
                setSelectedTime('');
                setSelectedDay(null);
                setFreeActivityDay('');
                setFreeActivityMonth('');
                setFreeActivityYear('');
              }}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleAddActivity}
              className="flex-1"
              disabled={
                !newActivity.title || 
                (activityType === 'free' && (!freeActivityDay || !freeActivityMonth || !freeActivityYear)) ||
                (activityType === 'subject' && (!selectedSubject || selectedDay === null))
              }
            >
              Agregar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Calendario */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 mb-6 px-2 py-3">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="calendar-gendy"
          modifiers={{
            hasActivity: daysWithActivities,
          }}
          modifiersStyles={{
            hasActivity: {
              position: 'relative',
            },
          }}
          modifiersClassNames={{
            hasActivity: 'has-activity',
          }}
        />
        <style>{`
          .calendar-gendy button {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .calendar-gendy .has-activity::after {
            content: '';
            position: absolute;
            bottom: 4px;
            left: 50%;
            transform: translateX(-50%);
            width: 5px;
            height: 5px;
            background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
            border-radius: 50%;
          }
          
          .calendar-gendy button[aria-selected="true"].has-activity::after {
            background: white;
          }
          
          .calendar-gendy-modal button {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}</style>
      </div>

      {/* Actividades del día seleccionado */}
      {selectedDate && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-700">
              {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
            </h3>
            <Button
              onClick={() => setIsAddActivityOpen(true)}
              size="sm"
              className="bg-cyan-500 hover:bg-cyan-600 rounded-xl"
            >
              <Plus size={16} className="mr-1" />
              Agregar
            </Button>
          </div>

          {selectedDayActivities.length > 0 ? (
            <div className="space-y-3">
              {selectedDayActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`${activity.subjectId ? convertedSubjects.find(s => s.id === activity.subjectId)?.color || 'bg-cyan-100' : 'bg-cyan-100'} p-2 rounded-lg`}>
                        <Clock size={16} className="text-white" />
                      </div>
                      <div>
                        <h4 className="text-gray-800">{activity.title}</h4>
                        {activity.time && (
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteActivity(activity.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15 5L5 15M5 5L15 15"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                  {activity.description && (
                    <div className="flex items-start gap-2 mt-2">
                      <FileText size={14} className="text-gray-400 mt-0.5" />
                      <p className="text-gray-600 text-sm">{activity.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-400">No hay actividades para este día</p>
              <Button
                onClick={() => setIsAddActivityOpen(true)}
                variant="outline"
                size="sm"
                className="mt-4"
              >
                <Plus size={16} className="mr-1" />
                Agregar actividad
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
