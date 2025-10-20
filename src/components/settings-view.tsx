import React from 'react';
import { 
  Upload, 
  Download, 
  Palette, 
  Bell, 
  User,
  Info,
  FileText,
  Shield,
  ChevronRight,
  Check
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface Schedule {
  id: string;
  name: string;
  subjects: any[];
}

interface SettingsViewProps {
  schedules: Schedule[];
}

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  variant?: 'default' | 'danger';
}

function SettingItem({ icon, label, onClick, variant = 'default' }: SettingItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-colors ${
        variant === 'danger'
          ? 'hover:bg-red-50'
          : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`${
          variant === 'danger' ? 'text-red-500' : 'text-gray-600'
        }`}>
          {icon}
        </div>
        <span className={`${
          variant === 'danger' ? 'text-red-500' : 'text-gray-700'
        }`}>
          {label}
        </span>
      </div>
      <ChevronRight size={20} className="text-gray-400" />
    </button>
  );
}

interface SettingSectionProps {
  title: string;
  children: React.ReactNode;
}

function SettingSection({ title, children }: SettingSectionProps) {
  return (
    <div className="mb-6">
      <h3 className="text-gray-400 text-sm mb-3 px-2">{title}</h3>
      <div className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100">
        {children}
      </div>
    </div>
  );
}

export function SettingsView({ schedules }: SettingsViewProps) {
  const [isNameDialogOpen, setIsNameDialogOpen] = React.useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = React.useState(false);
  const [selectedScheduleToExport, setSelectedScheduleToExport] = React.useState<string>('');
  const [userName, setUserName] = React.useState('Usuario');

  const handleExport = () => {
    const scheduleToExport = schedules.find(s => s.id === selectedScheduleToExport);
    if (!scheduleToExport) return;

    // Crear el objeto de datos a exportar
    const exportData = {
      name: scheduleToExport.name,
      subjects: scheduleToExport.subjects,
      exportDate: new Date().toISOString(),
    };

    // Convertir a JSON
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Crear enlace de descarga
    const link = document.createElement('a');
    link.href = url;
    link.download = `gendy-${scheduleToExport.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Cerrar el modal
    setIsExportDialogOpen(false);
    setSelectedScheduleToExport('');
  };

  return (
    <div className="px-6 py-4">
      <h2 className="text-blue-300 text-xl text-center mb-6">Configuraciones</h2>

      {/* Importar/Exportar */}
      <SettingSection title="Datos">
        <SettingItem
          icon={<Upload size={20} />}
          label="Importar"
          onClick={() => console.log('Importar')}
        />
        <SettingItem
          icon={<Download size={20} />}
          label="Exportar"
          onClick={() => setIsExportDialogOpen(true)}
        />
      </SettingSection>

      {/* Preferencias */}
      <SettingSection title="Preferencias">
        <SettingItem
          icon={<Palette size={20} />}
          label="Tema"
          onClick={() => console.log('Cambiar tema')}
        />
        <SettingItem
          icon={<Bell size={20} />}
          label="Notificaciones"
          onClick={() => console.log('Configurar notificaciones')}
        />
      </SettingSection>

      {/* Cuenta */}
      <SettingSection title="Cuenta">
        <SettingItem
          icon={<User size={20} />}
          label="Editar perfil"
          onClick={() => setIsNameDialogOpen(true)}
        />
      </SettingSection>

      {/* Información */}
      <SettingSection title="Información">
        <SettingItem
          icon={<Info size={20} />}
          label="Acerca de"
          onClick={() => console.log('Acerca de')}
        />
        <SettingItem
          icon={<FileText size={20} />}
          label="Términos y condiciones"
          onClick={() => console.log('Términos y condiciones')}
        />
        <SettingItem
          icon={<Shield size={20} />}
          label="Política de privacidad"
          onClick={() => console.log('Política de privacidad')}
        />
      </SettingSection>

      {/* Dialog para cambiar nombre */}
      <Dialog open={isNameDialogOpen} onOpenChange={setIsNameDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cambiar nombre</DialogTitle>
            <DialogDescription>
              Ingresa tu nuevo nombre de usuario
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nombre</Label>
              <Input
                id="username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Tu nombre"
                className="bg-gray-100 border-0"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsNameDialogOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setIsNameDialogOpen(false);
                // Aquí iría la lógica para guardar el nombre
              }}
              className="flex-1 bg-cyan-500 hover:bg-cyan-600"
            >
              Guardar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para exportar horario */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Exportar horario</DialogTitle>
            <DialogDescription>
              Selecciona el horario que deseas exportar
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <RadioGroup value={selectedScheduleToExport} onValueChange={setSelectedScheduleToExport}>
              <div className="space-y-2">
                {schedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedScheduleToExport === schedule.id
                        ? 'border-cyan-500 bg-cyan-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedScheduleToExport(schedule.id)}
                  >
                    <RadioGroupItem value={schedule.id} id={schedule.id} />
                    <Label htmlFor={schedule.id} className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">{schedule.name}</p>
                          <p className="text-sm text-gray-500">
                            {schedule.subjects.length} {schedule.subjects.length === 1 ? 'materia' : 'materias'}
                          </p>
                        </div>
                        {selectedScheduleToExport === schedule.id && (
                          <Check size={20} className="text-cyan-500" />
                        )}
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsExportDialogOpen(false);
                setSelectedScheduleToExport('');
              }}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleExport}
              className="flex-1 bg-cyan-500 hover:bg-cyan-600"
              disabled={!selectedScheduleToExport}
            >
              <Download size={16} className="mr-2" />
              Exportar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
