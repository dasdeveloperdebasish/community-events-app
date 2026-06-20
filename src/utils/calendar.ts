import { Event } from "@/types/Event";

const formatICSDate = (date: Date) => {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
};

export const generateICS = (event: Event) => {
  const startDate = new Date(event.date);

  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Community Events App//EN
BEGIN:VEVENT
UID:${event.id}
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(startDate)}
DTEND:${formatICSDate(endDate)}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;
};
