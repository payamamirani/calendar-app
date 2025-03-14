export function getDateString(date: Date): string {
  const correctDate = new Date(date);
  const year = correctDate.getFullYear();
  const month = String(correctDate.getMonth() + 1).padStart(2, '0');
  const day = String(correctDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getTimeString(date: Date): string {
  const correctDate = new Date(date);
  const hour = String(correctDate.getHours()).padStart(2, '0');
  const minute = String(correctDate.getMinutes()).padStart(2, '0');

  return `${hour}:${minute}:00`;
}
