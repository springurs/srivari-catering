export type IconName = "home" | "people" | "menu" | "calendar" | "gallery" | "mail" | "rings" | "cake" | "office" | "lotus" | "pin" | "arrow";

const paths: Record<IconName, React.ReactNode> = {
  home: <><path d="m3 10 9-7 9 7M6 8v13h12V8"/><path d="M10 21v-8h4v8"/></>,
  people: <><circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3H3ZM16 4a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 5v2"/></>,
  menu: <><path d="M4 3v6a3 3 0 0 0 6 0V3M7 3v18M20 3c-4 0-5 6-5 10h5M20 3v18"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M7 14h2M12 14h2M17 14h1M7 18h2M12 18h2"/></>,
  gallery: <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8" cy="8" r="1.5"/><path d="m3 17 5-5 4 3 4-6 5 7"/></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 6 9 7 9-7"/></>,
  rings: <><ellipse cx="8" cy="14" rx="6" ry="7"/><ellipse cx="16" cy="14" rx="6" ry="7"/><path d="m10 3 2 2 2-2-2-2-2 2Z"/></>,
  cake: <><path d="M4 21v-9h16v9H4ZM2 21h20M6 12V8h12v4M8 8V5M12 8V4M16 8V5M4 15c2 3 4-3 6 0s4-3 6 0 4 0 4 0"/><path d="M8 2v1M12 1v1M16 2v1"/></>,
  office: <><circle cx="12" cy="6" r="3"/><circle cx="4" cy="8" r="2"/><circle cx="20" cy="8" r="2"/><path d="M6 21v-4a6 6 0 0 1 12 0v4H6ZM2 21v-6a3 3 0 0 1 3-3M22 21v-6a3 3 0 0 0-3-3"/></>,
  lotus: <><path d="M12 20C4 15 8 6 12 2c4 4 8 13 0 18ZM12 20C4 20 1 13 2 9c5 0 9 5 10 11ZM12 20c8 0 11-7 10-11-5 0-9 5-10 11ZM4 21c4 2 12 2 16 0"/></>,
  pin: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
  arrow: <path d="M4 12h15m-6-6 6 6-6 6"/>,
};

export function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
