import gym from "@/assets/slide-gym.jpg";
import academy from "@/assets/slide-academy.jpg";
import champ from "@/assets/slide-championship.jpg";
import hero from "@/assets/slide-hero.jpg";
import boxing from "@/assets/m-boxing.jpg";
import yoga from "@/assets/m-yoga.jpg";
import cricket from "@/assets/m-cricket.jpg";
import swim from "@/assets/m-swim.jpg";

export const IMAGES = { gym, academy, champ, hero, boxing, yoga, cricket, swim };

/** Address of the existing Kalawar website (separate project, used as-is). */
export const KALAWAR_URL = "https://kalawar.in";

export type AccountType = "media" | "gym" | "academy" | "kalawar";
export const KALAWAR_ROLES = [
  "Player",
  "Coach",
  "Referee",
  "Club",
  "State Association",
  "District Association",
] as const;

export interface Account {
  id: string;
  email: string;
  password: string;
  name: string;
  handle: string;
  type: AccountType;
  role?: string;
  city?: string;
  bio?: string;
  avatar?: string;
  partnerId?: string;
  private?: boolean;
}

export interface Gym {
  id: string;
  name: string;
  city: string;
  address: string;
  image: string;
  rating: number;
  priceFrom: number;
  facilities: string[];
  timings: string;
  phone: string;
  about: string;
  ownerId?: string;
}

export interface Academy {
  id: string;
  name: string;
  sport: string;
  city: string;
  address: string;
  image: string;
  rating: number;
  ageGroups: string;
  feeFrom: number;
  coaches: number;
  students: number;
  about: string;
  phone: string;
  ownerId?: string;
}

export interface Post {
  id: string;
  authorId: string;
  kind: "image" | "video";
  src: string;
  poster?: string;
  caption: string;
  likes: string[];
  subscribers: string[];
  comments: { id: string; authorId: string; text: string; at: number }[];
  views: number;
  at: number;
}

export const seedAccounts: Account[] = [
  { id: "u-gym1", email: "owner@ironforge.in", password: "ironforge123", name: "Iron Forge Fitness", handle: "ironforge", type: "gym", partnerId: "g1", city: "Delhi", bio: "Premium strength & conditioning club.", avatar: gym },
  { id: "u-ac1", email: "admin@risingstars.in", password: "rising123", name: "Rising Stars Cricket Academy", handle: "risingstars", type: "academy", partnerId: "a1", city: "Mumbai", bio: "Building tomorrow's champions.", avatar: cricket },
  { id: "u-m1", email: "aarav@media.in", password: "aarav123", name: "Aarav Mehta", handle: "aarav.fights", type: "media", city: "Pune", bio: "Combat sports creator · fight breakdowns", avatar: boxing },
  { id: "u-m2", email: "isha@media.in", password: "isha123", name: "Isha Kapoor", handle: "isha.flow", type: "media", city: "Bengaluru", bio: "Yoga & mobility coach", avatar: yoga, private: true },
  { id: "u-k1", email: "rohit@kalawar.in", password: "rohit123", name: "Rohit Nair", handle: "rohit.kalari", type: "kalawar", role: "Player", city: "Kochi", bio: "National Kalawar gold medallist", avatar: hero },
  { id: "u-k2", email: "coach@kalawar.in", password: "coach123", name: "Guru Menon", handle: "guru.menon", type: "kalawar", role: "Coach", city: "Thrissur", bio: "Head coach · 20 yrs of training", avatar: champ },
  { id: "u-m3", email: "neha@media.in", password: "neha123", name: "Neha Swims", handle: "neha.swims", type: "media", city: "Chennai", bio: "Freestyle sprinter", avatar: swim },
];

export const seedGyms: Gym[] = [
  { id: "g1", name: "Iron Forge Fitness", city: "Delhi", address: "Connaught Place, New Delhi", image: gym, rating: 4.8, priceFrom: 2499, facilities: ["Strength", "Cardio", "Personal Training", "Steam", "Parking"], timings: "5:00 AM – 11:00 PM", phone: "+91 98100 11223", about: "A premium strength and conditioning club with Olympic lifting platforms and certified coaches.", ownerId: "u-gym1" },
  { id: "g2", name: "Pulse Boxing Club", city: "Mumbai", address: "Bandra West, Mumbai", image: boxing, rating: 4.7, priceFrom: 3200, facilities: ["Boxing Ring", "MMA", "Conditioning", "Lockers"], timings: "6:00 AM – 10:00 PM", phone: "+91 98200 44556", about: "Boxing and MMA training for all levels, from first-timers to competitive fighters." },
  { id: "g3", name: "Zen Flow Studio", city: "Bengaluru", address: "Indiranagar, Bengaluru", image: yoga, rating: 4.9, priceFrom: 1800, facilities: ["Yoga", "Pilates", "Meditation", "Showers"], timings: "6:00 AM – 9:00 PM", phone: "+91 99000 77889", about: "Sunlit studio for yoga, pilates and breathwork led by senior instructors." },
  { id: "g4", name: "AquaCore Fitness", city: "Chennai", address: "Adyar, Chennai", image: swim, rating: 4.6, priceFrom: 2800, facilities: ["Pool", "Cardio", "Strength", "Sauna", "Cafe"], timings: "5:30 AM – 10:30 PM", phone: "+91 94440 22334", about: "Full-service club with a temperature-controlled pool and recovery zone." },
  { id: "g5", name: "Titan Arena", city: "Pune", address: "Koregaon Park, Pune", image: champ, rating: 4.5, priceFrom: 1999, facilities: ["CrossFit", "Strength", "Group Classes", "Parking"], timings: "5:00 AM – 11:00 PM", phone: "+91 98220 55667", about: "High-energy functional training with daily group classes." },
  { id: "g6", name: "Kalari Strength House", city: "Kochi", address: "MG Road, Kochi", image: hero, rating: 4.7, priceFrom: 1500, facilities: ["Martial Arts", "Strength", "Mobility"], timings: "5:00 AM – 9:00 PM", phone: "+91 94470 99887", about: "Traditional conditioning blended with modern strength science." },
];

export const seedAcademies: Academy[] = [
  { id: "a1", name: "Rising Stars Cricket Academy", sport: "Cricket", city: "Mumbai", address: "Shivaji Park, Mumbai", image: cricket, rating: 4.8, ageGroups: "U-10 to U-19", feeFrom: 3500, coaches: 8, students: 240, about: "Turf wickets, bowling machines and BCCI level-2 coaches.", phone: "+91 98201 33445", ownerId: "u-ac1" },
  { id: "a2", name: "Blue Lane Swim Academy", sport: "Swimming", city: "Chennai", address: "Velachery, Chennai", image: swim, rating: 4.7, ageGroups: "5 yrs & above", feeFrom: 2800, coaches: 6, students: 180, about: "Olympic-size pool, stroke correction and competitive squads.", phone: "+91 94441 22110" },
  { id: "a3", name: "Kalari Warriors Academy", sport: "Kalaripayattu", city: "Kochi", address: "Fort Kochi", image: hero, rating: 4.9, ageGroups: "8 yrs & above", feeFrom: 2000, coaches: 5, students: 150, about: "Traditional Kalaripayattu with championship-track training.", phone: "+91 94470 11223" },
  { id: "a4", name: "Goal Line Football Academy", sport: "Football", city: "Bengaluru", address: "Whitefield, Bengaluru", image: academy, rating: 4.6, ageGroups: "U-8 to U-17", feeFrom: 3000, coaches: 10, students: 320, about: "AIFF-licensed coaches and weekend league fixtures.", phone: "+91 99001 44556" },
  { id: "a5", name: "Champion Combat Academy", sport: "Boxing", city: "Delhi", address: "Saket, New Delhi", image: boxing, rating: 4.5, ageGroups: "10 yrs & above", feeFrom: 2500, coaches: 4, students: 110, about: "Amateur boxing pathway to state and national events.", phone: "+91 98110 66778" },
];

const H = 3600_000;
const now = Date.UTC(2026, 9, 22, 12);
const SAMPLE_VIDEO = "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

export const seedPosts: Post[] = [
  { id: "p1", authorId: "u-k1", kind: "image", src: hero, caption: "Morning drills before nationals. Discipline over motivation. 🔥", likes: ["u-m1", "u-m2", "u-k2"], subscribers: ["u-m1"], comments: [{ id: "c1", authorId: "u-k2", text: "Perfect form. Keep the hip high.", at: now - 2 * H }], views: 4820, at: now - 3 * H },
  { id: "p2", authorId: "u-m1", kind: "video", src: SAMPLE_VIDEO, poster: boxing, caption: "Combination breakdown: jab, cross, slip, hook.", likes: ["u-k1"], subscribers: ["u-k1", "u-m3"], comments: [], views: 12030, at: now - 6 * H },
  { id: "p3", authorId: "u-m2", kind: "image", src: yoga, caption: "Sunrise flow — 20 minutes to reset your spine.", likes: ["u-m3", "u-m1"], subscribers: [], comments: [{ id: "c2", authorId: "u-m3", text: "Doing this tomorrow!", at: now - 9 * H }], views: 3310, at: now - 10 * H },
  { id: "p4", authorId: "u-ac1", kind: "image", src: cricket, caption: "U-16 squad net session. Selections open next week.", likes: ["u-k1"], subscribers: ["u-m1"], comments: [], views: 2210, at: now - 20 * H },
  { id: "p5", authorId: "u-gym1", kind: "image", src: gym, caption: "New Olympic platforms are live at Iron Forge.", likes: ["u-m1", "u-m3"], subscribers: [], comments: [], views: 5400, at: now - 26 * H },
  { id: "p6", authorId: "u-m3", kind: "image", src: swim, caption: "Race-day start practice. 0.68s reaction.", likes: ["u-m2"], subscribers: ["u-m2"], comments: [], views: 1980, at: now - 30 * H },
  { id: "p7", authorId: "u-k2", kind: "image", src: champ, caption: "State Championship finals this Sunday. See you there.", likes: ["u-k1", "u-m1", "u-m2"], subscribers: ["u-k1"], comments: [], views: 8800, at: now - 40 * H },
  { id: "p8", authorId: "u-m1", kind: "image", src: academy, caption: "Visited a youth academy today — the future is bright.", likes: [], subscribers: [], comments: [], views: 970, at: now - 50 * H },
];

export const seedFollows: { from: string; to: string; status: "accepted" | "pending" }[] = [
  { from: "u-m1", to: "u-k1", status: "accepted" },
  { from: "u-k1", to: "u-m1", status: "accepted" },
  { from: "u-m3", to: "u-m2", status: "accepted" },
  { from: "u-k2", to: "u-k1", status: "accepted" },
  { from: "u-m3", to: "u-m1", status: "accepted" },
];

// ---------- partner admin seed data ----------
const firstNames = ["Arjun", "Priya", "Rahul", "Sneha", "Vikram", "Ananya", "Karan", "Meera", "Rohan", "Divya", "Aditya", "Pooja", "Siddharth", "Kavya", "Nikhil", "Riya"];
const lastNames = ["Sharma", "Verma", "Iyer", "Reddy", "Singh", "Patel", "Nair", "Gupta"];
const pick = <T,>(a: readonly T[], i: number) => a[i % a.length];
const d = (offsetDays: number) => new Date(now + offsetDays * 86400000).toISOString().slice(0, 10);
export const personName = (i: number) => `${pick(firstNames, i * 7 + 3)} ${pick(lastNames, i * 3 + 1)}`;

export type Row = Record<string, string | number> & { id: string };

export function gymSeed(): Record<string, Row[]> {
  const plans: Row[] = [
    { id: "pl1", name: "Monthly", duration: "1 month", price: 2499, perks: "Gym floor + cardio" },
    { id: "pl2", name: "Quarterly", duration: "3 months", price: 6999, perks: "+ 2 PT sessions" },
    { id: "pl3", name: "Half-Yearly", duration: "6 months", price: 12999, perks: "+ Steam access" },
    { id: "pl4", name: "Annual", duration: "12 months", price: 22999, perks: "All access + 12 PT" },
  ];
  const members: Row[] = Array.from({ length: 18 }, (_, i) => ({
    id: `m${i + 1}`, name: personName(i), phone: `+91 98${(10000000 + i * 734521).toString().slice(0, 8)}`, gender: i % 2 ? "Female" : "Male", plan: pick(plans, i).name as string, joined: d(-((i * 13) % 300) - 5), status: i % 7 === 0 ? "Inactive" : "Active",
  }));
  const subscriptions: Row[] = members.map((m, i) => ({
    id: `s${i + 1}`, member: m.name, plan: m.plan, start: d(-((i * 11) % 90)), end: d(30 - ((i * 11) % 90) + (i % 4) * 30), amount: pick(plans, i).price as number, status: i % 5 === 0 ? "Expiring" : i % 7 === 0 ? "Expired" : "Active",
  }));
  const employees: Row[] = [
    { id: "e1", name: "Vikram Rathore", role: "Head Trainer", phone: "+91 98111 22001", shift: "Morning", salary: 45000, status: "Active" },
    { id: "e2", name: "Sana Sheikh", role: "Yoga Instructor", phone: "+91 98111 22002", shift: "Morning", salary: 32000, status: "Active" },
    { id: "e3", name: "Manoj Kumar", role: "Personal Trainer", phone: "+91 98111 22003", shift: "Evening", salary: 35000, status: "Active" },
    { id: "e4", name: "Ritika Das", role: "Front Desk", phone: "+91 98111 22004", shift: "Full day", salary: 22000, status: "Active" },
    { id: "e5", name: "Ajay Pal", role: "Housekeeping", phone: "+91 98111 22005", shift: "Full day", salary: 15000, status: "On leave" },
  ];
  const sales: Row[] = Array.from({ length: 24 }, (_, i) => ({
    id: `sa${i + 1}`, date: d(-i * 7), member: personName(i + 3), item: i % 4 === 3 ? "Protein Supplement" : pick(plans, i).name + " Membership", mode: pick(["UPI", "Card", "Cash"], i), amount: i % 4 === 3 ? 3200 : (pick(plans, i).price as number),
  }));
  const attendance: Row[] = Array.from({ length: 14 }, (_, i) => ({ id: `at${i}`, date: d(-i), member: personName(i), checkIn: `0${6 + (i % 3)}:${10 + i}`, checkOut: `0${8 + (i % 3)}:${20 + i}` }));
  const expenses: Row[] = [
    { id: "x1", date: d(-3), category: "Rent", note: "Monthly rent", amount: 85000 },
    { id: "x2", date: d(-5), category: "Electricity", note: "Power bill", amount: 18500 },
    { id: "x3", date: d(-12), category: "Equipment", note: "Dumbbell set", amount: 42000 },
    { id: "x4", date: d(-20), category: "Marketing", note: "Instagram ads", amount: 12000 },
  ];
  return { members, plans, subscriptions, employees, sales, attendance, expenses };
}

export function academySeed(sport = "Cricket"): Record<string, Row[]> {
  const batches: Row[] = [
    { id: "b1", name: "Juniors A", ageGroup: "U-10", days: "Mon/Wed/Fri", time: "6:00–7:30 AM", coach: "Sameer Joshi", capacity: 25 },
    { id: "b2", name: "Juniors B", ageGroup: "U-13", days: "Tue/Thu/Sat", time: "4:30–6:00 PM", coach: "Anjali Rao", capacity: 25 },
    { id: "b3", name: "Elite Squad", ageGroup: "U-16", days: "Mon–Sat", time: "5:30–8:00 AM", coach: "Rakesh Pillai", capacity: 18 },
    { id: "b4", name: "Weekend Batch", ageGroup: "Open", days: "Sat/Sun", time: "7:00–9:00 AM", coach: "Sameer Joshi", capacity: 30 },
  ];
  const students: Row[] = Array.from({ length: 20 }, (_, i) => ({
    id: `st${i + 1}`, name: personName(i + 5), age: 8 + (i % 9), batch: pick(batches, i).name as string, guardian: personName(i + 11), phone: `+91 97${(20000000 + i * 512341).toString().slice(0, 8)}`, joined: d(-((i * 17) % 400) - 3), status: i % 9 === 0 ? "Inactive" : "Active",
  }));
  const coaches: Row[] = [
    { id: "co1", name: "Rakesh Pillai", specialty: `${sport} – Head Coach`, certification: "Level 3", phone: "+91 98450 10001", experience: "15 yrs", salary: 60000 },
    { id: "co2", name: "Anjali Rao", specialty: `${sport} – Skills`, certification: "Level 2", phone: "+91 98450 10002", experience: "8 yrs", salary: 40000 },
    { id: "co3", name: "Sameer Joshi", specialty: "Fitness & Conditioning", certification: "ACE CPT", phone: "+91 98450 10003", experience: "6 yrs", salary: 35000 },
  ];
  const fees: Row[] = students.map((s, i) => ({
    id: `f${i + 1}`, student: s.name, month: "Oct 2026", amount: 3500, due: d(5 - (i % 10)), status: i % 4 === 0 ? "Pending" : i % 11 === 0 ? "Overdue" : "Paid",
  }));
  const attendance: Row[] = Array.from({ length: 12 }, (_, i) => ({ id: `aa${i}`, date: d(-i), batch: pick(batches, i).name, present: 18 + (i % 6), absent: 2 + (i % 4) }));
  const events: Row[] = [
    { id: "ev1", name: "Inter-Academy Cup", date: d(12), venue: "City Stadium", category: "U-16", status: "Upcoming" },
    { id: "ev2", name: "District Trials", date: d(26), venue: "District Ground", category: "U-13", status: "Upcoming" },
    { id: "ev3", name: "Summer League Finals", date: d(-40), venue: "Home Ground", category: "Open", status: "Completed" },
  ];
  const performance: Row[] = students.slice(0, 10).map((s, i) => ({
    id: `pf${i}`, student: s.name, skill: 60 + ((i * 7) % 35), fitness: 55 + ((i * 11) % 40), discipline: 70 + ((i * 5) % 28), remarks: pick(["Excellent progress", "Needs footwork drills", "Match ready", "Improve stamina"], i),
  }));
  const payments: Row[] = Array.from({ length: 20 }, (_, i) => ({ id: `py${i}`, date: d(-i * 9), student: personName(i + 5), mode: pick(["UPI", "Card", "Cash", "Bank"], i), amount: i % 5 === 0 ? 1500 : 3500, note: i % 5 === 0 ? "Kit fee" : "Monthly fee" }));
  return { students, batches, coaches, fees, attendance, events, performance, payments };
}
