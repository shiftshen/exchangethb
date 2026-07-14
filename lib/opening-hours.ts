function bangkokParts(now: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Bangkok',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value || '';
  return {
    day: value('weekday'),
    minutes: Number(value('hour')) * 60 + Number(value('minute')),
  };
}

function timeToMinutes(value: string) {
  const [hour, minute] = value.split(':').map(Number);
  return hour * 60 + minute;
}

export function getBangkokOpenState(hours: string, now = new Date()): boolean | null {
  const normalized = hours.trim();
  const { day, minutes } = bangkokParts(now);
  const timeMatch = normalized.match(/(\d{2}:\d{2})-(\d{2}:\d{2})/);
  if (!timeMatch) return null;

  const withinHours = minutes >= timeToMinutes(timeMatch[1]) && minutes < timeToMinutes(timeMatch[2]);

  if (/open daily/i.test(normalized)) return withinHours;
  if (/mon(?:day)?-sat(?:urday)?/i.test(normalized)) return day !== 'Sun' && withinHours;

  return null;
}
