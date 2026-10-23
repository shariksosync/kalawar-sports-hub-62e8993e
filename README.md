# Kalawar Sports Hub

copy this repo:
https://github.com/shariksosync/kalawar-sports-hub-a0be3a12

and finish it 

Almost all of it is built. What's left is fixing errors so the preview loads, then testing.

Built so far:
- Look and pictures: the dark and gold style, the fonts, and 8 sports photos.
- Home page: the navbar and a 5-slide carousel. The first slide has your text on the left and 4 normal-sized boxes on the right (Kalawar, GYM & Fitness, Sports Academy, Media). Below the carousel are a stats strip, featured gyms, academies, trending Media posts and a "become a partner" section.
- GYM & Fitness: a list of gyms you can search and filter by city, a page for each gym, a 3-step "Join as a Partner" form and a gym login page.
- Gym admin panel: Dashboard with charts, Members, Membership Plans, Subscriptions, Employees, Attendance, Sales, Expenses, Sales Reports (filter by date and download) and Profile & Settings. You can add, edit and delete records in every section.
- Sports Academy: a list of academies you can filter by sport, a page for each academy, a registration form and a login page.
- Academy admin panel: Dashboard, Students, Batches & Schedule, Coaches & Staff, Fee Collection, Payments, Attendance, Events & Tournaments, Performance, Revenue Reports and Profile & Settings.
- Media: a feed and a grid view, filters for videos, photos and people you follow, and photo/video upload. Users can like, comment, subscribe and follow, and send follow requests to private accounts. There are profiles with follower and following lists, and a notifications page where you accept or decline requests. Visitors who aren't signed in can watch and browse; any action shows a "Register first" pop-up.
- Login: one shared sign-in page with tabs for Media, Gym, Academy and Kalawar members, plus separate login pages for each portal. Sample accounts can be filled in with one tap.
- There are no demo-role or role-switching tools anywhere.

Still left:
1. Fix errors that stop the preview from loading. The project's strict code settings reject how the admin panels and Media pages read their sample data. This is a quick, mechanical fix.
2. Test everything in the browser:
   - the home carousel
   - registering a gym and an academy, then landing in its admin panel
   - adding and editing records
   - the reports
   - Media actions as a visitor and as a signed-in user
3. Small cleanup. Make sure every page looks right on phones, and write down the main project decisions.

I need from you: the web address where your Kalawar website runs. The Kalawar box and navbar link currently point to a made-up address (kalawar.in) until you send the real one.

Say "continue" and I'll fix the errors and finish the testing.


plan was
# Kalawar Sports Hub - Premium Demo

A polished demo portal using mock data only (no database). Data is kept in the browser so registrations, uploads, likes and follows persist during a demo session. No "demo role" switchers or testing tools anywhere - every user goes through real-looking login and registration pages.

## Visual direction

Dark, premium sports look: deep charcoal background, warm gold accent, bold condensed display headings (Bebas Neue style) with a clean body font, glassy cards, large action photography (generated images), subtle motion.

## Pages

**Home (/)**

- Sticky navbar: Home, Kalawar, GYM & Fitness, Sports Academy, Media, plus Login / account menu.
- Carousel directly under navbar, 5 slides, auto-play with arrows and dots:
  1. Welcome slide: headline + text on the left, 4 normal-sized boxes in a 2x2 grid on the right (Kalawar, GYM & Fitness, Sports Academy, Media).
  2. Kalawar championships highlight
  3. Featured gyms
  4. Sports academies spotlight
  5. Media community / trending creators
- Below: stats strip, featured partners, latest media, call-to-action to join as partner, footer.

**Kalawar** - your existing Kalawar project ("Kalawar_main_website_6_aug") is used exactly as it is, not recreated or modified. It runs on its own system, which cannot run inside this app, so it stays a separate website (hosted as it is today). The Kalawar box and navbar link open it, just like they do now.

**GYM & Fitness (/gyms)** - searchable/filterable list of registered gyms (city, facilities, price), gym detail page, "Join as a Partner" button.

- /gyms/register - multi-step registration form (owner, gym details, plans, facilities).
- /gyms/login - dedicated gym login.
- Gym admin panel: Dashboard (KPIs, revenue chart), Members, Membership Plans, Subscriptions (active/expiring/expired, renewals), Employees/Trainers, Attendance, Sales & Revenue reports (by month/plan, export CSV), Expenses, Gym Profile & Settings.

**Sports Academy (/academies)** - list of academies (sport, city, age groups), detail page, "Join as a Partner".

- /academies/register and /academies/login.
- Academy admin panel: Dashboard, Students, Batches & Schedules, Coaches/Staff, Fee Collection & Payments, Attendance, Events & Tournaments, Performance/Progress reports, Revenue reports, Profile & Settings.

**Media (/media)** - Instagram-style feed and explore grid of videos and images, creator profiles, stream videos.

- Guests can browse, stream and view profiles; any action (upload, like, subscribe, follow, follow request, comment) opens a "Please register / log in first" prompt.
- Signed-in users: upload video/image, like, comment, subscribe, follow, send follow requests (accept/decline, mutual followers), notifications, own profile with followers/following.
- /media/register and /media/login.

## Shared login

One account system across the app. A single login page with tabs for Media, GYM & Fitness, Sports Academy, and Kalawar members (player, coach, referee, club, state association, district association). Any account type can use Media; gym and academy accounts also get their admin panel. Pre-made sample accounts exist so the demo looks populated (shown as a small "sample credentials" note only on login pages).

## Technical details

- TanStack routes per page; admin panels under a protected layout per partner type.
- Mock data modules (gyms, academies, members, posts, users) + a client-side store persisted to localStorage; uploads stored as local preview URLs.
- shadcn components, recharts for reports, design tokens in styles.css, generated hero/slide images.
- Unique page titles/descriptions for every route.

## Open item

- The web address where your Kalawar project is running, so the Kalawar link points to it (a placeholder is used until you share it).
- Kalawar members sign in to Media with sample Kalawar-role accounts here; true single sign-on with the Kalawar site is not possible because it is a separate system.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b896a499-127c-44fb-92d9-368ac4f8d72d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
