import React from 'react';

interface ScheduleBlock {
  day: number;
  hour: number;
  color: string;
  duration: number;
  subjectName: string;
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

interface ScheduleGridProps {
  subjects: Subject[];
}

const DAY_MAP: { [key: string]: number } = {
  'Lunes': 0,
  'Martes': 1,
  'Miércoles': 2,
  'Jueves': 3,
  'Viernes': 4,
};

function timeToHourIndex(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  const baseHour = 8; // 8:00 am
  const totalMinutes = (hours - baseHour) * 60 + minutes;
  return Math.floor(totalMinutes / 45); // Cada slot es de 45 minutos
}

function calculateDuration(startTime: string, endTime: string): number {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  const totalMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
  return Math.ceil(totalMinutes / 45); // Redondear hacia arriba para cubrir el tiempo completo
}

export function ScheduleGrid({ subjects }: ScheduleGridProps) {
  // Convertir las materias a bloques del grid
  const scheduleBlocks: ScheduleBlock[] = subjects.flatMap(subject =>
    subject.schedules.map(schedule => ({
      day: DAY_MAP[schedule.day] ?? -1,
      hour: timeToHourIndex(schedule.startTime),
      color: subject.color,
      duration: calculateDuration(schedule.startTime, schedule.endTime),
      subjectName: subject.title,
    }))
  ).filter(block => block.day !== -1); // Filtrar días no válidos

  // Función para truncar por palabras
  const truncateWords = (text: string, maxWords: number = 3) => {
    const words = text.split(' ');
    if (words.length <= maxWords) return words;
    return [...words.slice(0, maxWords), '...'];
  };
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];
  const hours = [
    '8:00 am',
    '8:45 am',
    '9:30 am',
    '10:15 am',
    '11:00 am',
    '11:45 am',
    '12:30 pm',
    '1:15 pm',
    '2:00 pm',
    '2:45 pm',
    '3:30 pm',
    '4:15 pm',
    '5:00 pm'
  ];

  return (
    <div className="w-full overflow-x-auto pb-2 custom-scrollbar">
      <div className="min-w-max">
        {/* Header con días */}
        <div className="flex mb-2">
          <div className="w-16 flex-shrink-0" />
          {days.map((day, index) => (
            <div
              key={index}
              className="w-20 flex-shrink-0 text-center text-gray-400 text-xs mx-1"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Grid de horarios */}
        <div className="relative">
          {hours.map((hour, hourIndex) => (
            <div key={hourIndex} className="flex items-start mb-0.5 border-b border-gray-100 pb-0.5">
              <div className="w-16 flex-shrink-0 text-xs text-gray-400 pr-2 text-right">
                {hour}
              </div>
              <div className="flex flex-1 relative">
                {days.map((_, dayIndex) => {
                  const block = scheduleBlocks.find(
                    b => b.day === dayIndex && b.hour === hourIndex
                  );
                  
                  // Verificar si este espacio está ocupado por un bloque que empezó antes
                  const isOccupied = scheduleBlocks.some(
                    b => b.day === dayIndex && 
                         b.hour < hourIndex && 
                         b.hour + b.duration > hourIndex
                  );
                  
                  return (
                    <div key={dayIndex} className="w-20 h-8 mx-1 flex-shrink-0 relative">
                      {block && !isOccupied && (
                        <div
                          className={`${block.color} rounded-xl w-full cursor-pointer hover:opacity-80 transition-opacity absolute top-0 left-0 flex flex-col items-center justify-center px-1 py-1`}
                          style={{
                            height: `${block.duration * 2.125}rem`, // h-8 = 2rem, más 0.125rem por el mb-0.5
                          }}
                        >
                          {truncateWords(block.subjectName).map((word, idx) => (
                            <span key={idx} className="text-white text-[10px] leading-tight text-center font-medium">
                              {word}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
