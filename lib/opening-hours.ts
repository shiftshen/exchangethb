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
  const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  let understood=false;
  for(const section of normalized.split(/[,;]/)) {
    const time=section.match(/(\d{2}:\d{2})-(\d{2}:\d{2})/);
    const range=section.match(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\w*\s*-\s*(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\w*/i);
    const single=section.match(/\b(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\w*/i);
    const daily=/open daily/i.test(section);
    if(!time&&!/closed/i.test(section))continue;
    if(!range&&!single&&!daily)continue;
    understood=true;
    const index=(v:string)=>days.findIndex(d=>d.toLowerCase()===v.toLowerCase());
    const today=days.indexOf(day),start=range?index(range[1]):-1,end=range?index(range[2]):-1;
    const applies=daily||(range?(start<=end?today>=start&&today<=end:today>=start||today<=end):today===index(single![1]));
    if(applies&&time)return minutes>=timeToMinutes(time[1])&&minutes<timeToMinutes(time[2]);
    if(applies&&/closed/i.test(section))return false;
  }
  return understood?false:null;
}
