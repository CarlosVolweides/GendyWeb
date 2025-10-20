import React from 'react';
import { Clock, MoreVertical, Edit, Trash2, X, Check } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface ScheduleDay {
  day: string;
  startTime: string;
  endTime: string;
}

interface SubjectCardProps {
  id: string;
  title: string;
  schedules: ScheduleDay[];
  color: string;
  onUpdate?: (id: string, updatedSubject: { title: string; schedules: ScheduleDay[]; color: string }) => void;
  onDelete?: (id: string) => void;
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

export function SubjectCard({ id, title, schedules, color, onUpdate, onDelete }: SubjectCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = React.useState(false);
  const [editedSubject, setEditedSubject] = React.useState({
    title: title,
    schedules: schedules,
    color: color,
  });
  
  const [currentSchedule, setCurrentSchedule] = React.useState({
    day: '',
    startTime: '',
    endTime: '',
  });

  const handleAddSchedule = () => {
    if (currentSchedule.day && currentSchedule.startTime && currentSchedule.endTime) {
      setEditedSubject({
        ...editedSubject,
        schedules: [...editedSubject.schedules, currentSchedule],
      });
      setCurrentSchedule({ day: '', startTime: '', endTime: '' });
    }
  };

  const handleRemoveSchedule = (index: number) => {
    setEditedSubject({
      ...editedSubject,
      schedules: editedSubject.schedules.filter((_, i) => i !== index),
    });
  };

  const handleSaveEdit = () => {
    if (editedSubject.title && editedSubject.schedules.length > 0 && onUpdate) {
      onUpdate(id, editedSubject);
      setIsEditDialogOpen(false);
    }
  };

  const handleDelete = () => {
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
    setIsDeleteAlertOpen(false);
  };

  const handleOpenEdit = () => {
    setEditedSubject({
      title: title,
      schedules: schedules,
      color: color,
    });
    setCurrentSchedule({ day: '', startTime: '', endTime: '' });
    setIsEditDialogOpen(true);
  };

  return (
    <>
      <div
        className={`${color} rounded-3xl p-5 shadow-sm cursor-pointer hover:shadow-md transition-shadow relative`}
      >
        <div className="absolute top-4 right-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className="text-white/80 hover:text-white transition-colors p-1"
              >
                <MoreVertical size={20} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleOpenEdit(); }}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <h3 className="text-white mb-3 font-bold not-italic pr-8">{title}</h3>
        <div className="space-y-1 text-white/90 text-sm">
          {schedules.slice(0, 3).map((schedule, index) => (
            <div key={index} className="flex justify-between">
              <span>{schedule.day}</span>
              <span>{schedule.startTime} - {schedule.endTime}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-blue-600">Nombre de la materia:</DialogTitle>
            <DialogDescription className="sr-only">
              Edita los datos de la materia
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Nombre de la materia */}
            <div className="space-y-2">
              <Input
                id="title"
                placeholder="Hint del nombre"
                value={editedSubject.title}
                onChange={(e) =>
                  setEditedSubject({ ...editedSubject, title: e.target.value })
                }
                className="bg-gray-100 border-0"
              />
            </div>

            {/* Clases */}
            <div className="space-y-3">
              <Label className="text-blue-600">Clases:</Label>
              
              {/* Lista de horarios agregados */}
              <div className="space-y-2">
                {editedSubject.schedules.map((schedule, index) => (
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

                <div className="flex gap-2">
                  <Input
                    type="time"
                    value={currentSchedule.startTime}
                    onChange={(e) =>
                      setCurrentSchedule({
                        ...currentSchedule,
                        startTime: e.target.value,
                      })
                    }
                    className="bg-gray-100 border-0"
                  />
                  <span className="flex items-center">a</span>
                  <Input
                    type="time"
                    value={currentSchedule.endTime}
                    onChange={(e) =>
                      setCurrentSchedule({
                        ...currentSchedule,
                        endTime: e.target.value,
                      })
                    }
                    className="bg-gray-100 border-0"
                  />
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
                {COLOR_OPTIONS.map((colorOption) => (
                  <button
                    key={colorOption.class}
                    onClick={() =>
                      setEditedSubject({ ...editedSubject, color: colorOption.class })
                    }
                    className={`${colorOption.class} h-16 rounded-xl relative transition-transform hover:scale-105`}
                  >
                    {editedSubject.color === colorOption.class && (
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
            onClick={handleSaveEdit} 
            className="w-full bg-cyan-500 hover:bg-cyan-600"
            disabled={!editedSubject.title || editedSubject.schedules.length === 0}
          >
            Guardar cambios
          </Button>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la materia "{title}" y todos sus horarios.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
