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
  timeSlot?: TimeSlot;
  date?: Date;
}
