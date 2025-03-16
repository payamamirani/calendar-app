export interface Appointment {
  id: number;
  title: string;
  date: Date;
  fromTime: Date;
  toTime: Date;
  description?: string;
}

export interface TimeSlot {
  time: string;
}

export interface DialogData {
  saved?: string;
  appointment?: Appointment;
  date?: Date;
  fromTime?: Date;
  toTime?: Date;
}

export function getDateIndexInDay(date: Date): number {
  const correctDate = new Date(date);

  const hours = correctDate.getHours();
  const minutes = correctDate.getMinutes();

  const totalMinutes = hours * 60 + minutes;

  const index = Math.floor(totalMinutes / 30);

  return index;
}
