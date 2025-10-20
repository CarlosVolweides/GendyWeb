import React from 'react';
import { SubjectCard } from './subject-card';
import { Plus, X, Check, ChevronDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

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

interface Schedule {
  id: string;
  name: string;
  subjects: Subject[];
}

interface SubjectsViewProps {
  schedules: Schedule[];
  activeScheduleId: string;
  onScheduleChange: (scheduleId: string) => void;
  onAddSchedule: (name: string) => void;
  onAddSubject: (subject: Subject) => void;
  onUpdateSubject: (id: string, updatedSubject: { title: string; schedules: ScheduleDay[]; color: string }) => void;
  onDeleteSubject: (id: string) => void;
}

const DAYS_OF_WEEK = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo'
];

const COLOR_OPTIONS = [
  { name: 'Azul', class: 'bg-blue-600' },
  { name: 'Verde', class: 'bg-green-600' },
  { name: 'Rosa', class: 'bg-pink-500' },
  { name: 'Naranja', class: 'bg-yellow-600' },
  { name: 'Morado', class: 'bg-purple-600' },
  { name: 'Naranja Rojizo', class: 'bg-orange-600' },
  { name: 'Amarillo', class: 'bg-yellow-400' },
  { name: 'Cyan', class: 'bg-cyan-500' },
];

// Horarios válidos en bloques de 45 minutos desde 8:00 AM hasta 5:00 PM
const TIME_SLOTS = [
  '08:00',
  '08:45',
  '09:30',
  '10:15',
  '11:00',
  '11:45',
  '12:30',
  '13:15',
  '14:00',
  '14:45',
  '15:30',
  '16:15',
  '17:00',
];

// Función para formatear la hora en formato legible
const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

export function SubjectsView({
  schedules,
  activeScheduleId,
  onScheduleChange,
  onAddSchedule,
  onAddSubject,
  onUpdateSubject,
  onDeleteSubject,
}: SubjectsViewProps) {
  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = React.useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = React.useState(false);
  const [newScheduleName, setNewScheduleName] = React.useState('');
  const [newSubject, setNewSubject] = React.useState({
    title: '',
    schedules: [] as ScheduleDay[],
    color: 'bg-green-600',
  });
  
  const [currentSchedule, setCurrentSchedule] = React.useState({
    day: '',
    startTime: '',
    endTime: '',
  });

  const activeSchedule = schedules.find(s => s.id === activeScheduleId);
  const subjects = activeSchedule?.subjects || [];

  const handleAddSchedule = () => {
    if (currentSchedule.day && currentSchedule.startTime && currentSchedule.endTime) {
      setNewSubject({
        ...newSubject,
        schedules: [...newSubject.schedules, currentSchedule],
      });
      setCurrentSchedule({ day: '', startTime: '', endTime: '' });
    }
  };

  const handleRemoveSchedule = (index: number) => {
    setNewSubject({
      ...newSubject,
      schedules: newSubject.schedules.filter((_, i) => i !== index),
    });
  };

  const handleAddSubject = () => {
    if (newSubject.title && newSubject.schedules.length > 0) {
      const subject: Subject = {
        id: Date.now().toString(),
        title: newSubject.title,
        schedules: newSubject.schedules,
        color: newSubject.color,
      };
      onAddSubject(subject);
      setNewSubject({ title: '', schedules: [], color: 'bg-green-600' });
      setCurrentSchedule({ day: '', startTime: '', endTime: '' });
      setIsSubjectDialogOpen(false);
    }
  };

  const handleCreateSchedule = () => {
    if (newScheduleName.trim()) {
      onAddSchedule(newScheduleName.trim());
      setNewScheduleName('');
      setIsScheduleDialogOpen(false);
    }
  };

  return (
    <div className="px-6 py-4">
      {/* Selector de horarios */}
      <div className="mb-4">
        <Label className="text-sm text-gray-500 mb-2 block">Horario activo</Label>
        <Select value={activeScheduleId} onValueChange={onScheduleChange}>
          <SelectTrigger className="bg-white border-gray-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {schedules.map((schedule) => (
              <SelectItem key={schedule.id} value={schedule.id}>
                {schedule.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-blue-300 text-xl">Materias</h2>
        
        {/* Dropdown para seleccionar acción */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-12 h-12 rounded-2xl bg-cyan-500 text-white flex items-center justify-center hover:bg-cyan-600 transition-colors shadow-lg">
              <Plus size={24} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => setIsScheduleDialogOpen(true)}>
              <Plus size={16} className="mr-2" />
              Nuevo horario
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsSubjectDialogOpen(true)}>
              <Plus size={16} className="mr-2" />
              Nueva materia
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Dialog para crear nuevo horario */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-blue-600">Crear nuevo horario</DialogTitle>
            <DialogDescription>
              Ingresa un nombre para identificar este horario
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="schedule-name">Nombre del horario</Label>
              <Input
                id="schedule-name"
                placeholder="Ej: 6to semestre v1, UGMA, Trabajo..."
                value={newScheduleName}
                onChange={(e) => setNewScheduleName(e.target.value)}
                className="bg-gray-100 border-0"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsScheduleDialogOpen(false);
                setNewScheduleName('');
              }}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateSchedule}
              className="flex-1 bg-cyan-500 hover:bg-cyan-600"
              disabled={!newScheduleName.trim()}
            >
              Crear horario
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para agregar materia */}
      <Dialog open={isSubjectDialogOpen} onOpenChange={setIsSubjectDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-blue-600">Nombre de la materia:</DialogTitle>
            <DialogDescription className="sr-only">
              Completa los datos de la materia que deseas agregar
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Nombre de la materia */}
            <div className="space-y-2">
              <Input
                id="title"
                placeholder="Hint del nombre"
                value={newSubject.title}
                onChange={(e) =>
                  setNewSubject({ ...newSubject, title: e.target.value })
                }
                className="bg-gray-100 border-0"
              />
            </div>

            {/* Clases */}
            <div className="space-y-3">
              <Label className="text-blue-600">Clases:</Label>
              
              {/* Lista de horarios agregados */}
              <div className="space-y-2">
                {newSubject.schedules.map((schedule, index) => (
                  <div
                    key={index}
                    className="bg-blue-500 text-white rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <span>{schedule.day}</span>
                      <span className="text-sm">
                        {schedule.startTime} a {schedule.endTime}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveSchedule(index)}
                      className="text-white hover:text-red-200 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Formulario para agregar nuevo horario */}
              <div className="space-y-2">
                <Select
                  value={currentSchedule.day}
                  onValueChange={(value) =>
                    setCurrentSchedule({ ...currentSchedule, day: value })
                  }
                >
                  <SelectTrigger className="bg-gray-100 border-0">
                    <SelectValue placeholder="Selecciona un día" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex gap-2 items-center">
                  <Select
                    value={currentSchedule.startTime}
                    onValueChange={(value) =>
                      setCurrentSchedule({
                        ...currentSchedule,
                        startTime: value,
                      })
                    }
                  >
                    <SelectTrigger className="bg-gray-100 border-0">
                      <SelectValue placeholder="Inicio" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((time) => (
                        <SelectItem key={time} value={time}>
                          {formatTime(time)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-gray-500">a</span>
                  <Select
                    value={currentSchedule.endTime}
                    onValueChange={(value) =>
                      setCurrentSchedule({
                        ...currentSchedule,
                        endTime: value,
                      })
                    }
                  >
                    <SelectTrigger className="bg-gray-100 border-0">
                      <SelectValue placeholder="Fin" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.filter(time => {
                        // Solo mostrar horas posteriores a la hora de inicio
                        if (!currentSchedule.startTime) return true;
                        return time > currentSchedule.startTime;
                      }).map((time) => (
                        <SelectItem key={time} value={time}>
                          {formatTime(time)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Botón añadir día */}
              <Button
                onClick={handleAddSchedule}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!currentSchedule.day || !currentSchedule.startTime || !currentSchedule.endTime}
              >
                Añadir +
              </Button>
            </div>

            {/* Selector de color */}
            <div className="space-y-3">
              <Label className="text-blue-600">Color de la materia:</Label>
              <div className="grid grid-cols-4 gap-3">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.class}
                    onClick={() =>
                      setNewSubject({ ...newSubject, color: color.class })
                    }
                    className={`${color.class} h-16 rounded-xl relative transition-transform hover:scale-105`}
                  >
                    {newSubject.color === color.class && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check size={32} className="text-white" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button 
            onClick={handleAddSubject} 
            className="w-full bg-cyan-500 hover:bg-cyan-600"
            disabled={!newSubject.title || newSubject.schedules.length === 0}
          >
            Agregar materia
          </Button>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        {subjects.map((subject) => (
          <SubjectCard
            key={subject.id}
            id={subject.id}
            title={subject.title}
            schedules={subject.schedules}
            color={subject.color}
            onUpdate={onUpdateSubject}
            onDelete={onDeleteSubject}
          />
        ))}
      </div>
    </div>
  );
}
