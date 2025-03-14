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
  saved: string;
  appointment: Appointment | undefined | null;
  timeSlot?: TimeSlot;
  date?: Date;
}
