import type { ReactNode } from 'react'

const base = {
  width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none',
  stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const, 'aria-hidden': true,
}
const make = (d: ReactNode) => (props: { size?: number }) => (
  <svg {...base} width={props.size ?? 22} height={props.size ?? 22}>{d}</svg>
)

export const SearchIcon = make(<><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></>)
export const HeartIcon = make(<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.4A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />)
export const BagIcon = make(<><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>)
export const EyeIcon = make(<><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3" /></>)
export const MenuIcon = make(<path d="M4 7h16M4 12h16M4 17h16" />)
export const BoxIcon = make(<><path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5v-9Z" /><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9" /></>)
export const TruckIcon = make(<><path d="M2.5 6.5h11v10h-11zM13.5 10h4l3 3v3.5h-7" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></>)
export const BloomIcon = make(<><circle cx="12" cy="12" r="2" /><path d="M12 10c-2-3-1.5-6 0-7 1.5 1 2 4 0 7ZM12 14c2 3 1.5 6 0 7-1.5-1-2-4 0-7ZM10 12c-3 2-6 1.5-7 0 1-1.5 4-2 7 0ZM14 12c3-2 6-1.5 7 0-1 1.5-4 2-7 0Z" /></>)
export const InstagramIcon = make(<><rect x="4" y="4" width="16" height="16" rx="4.5" /><circle cx="12" cy="12" r="3.6" /><circle cx="17" cy="7" r=".6" fill="currentColor" /></>)
export const PinterestIcon = make(<><circle cx="12" cy="12" r="8.5" /><path d="M11 16.5 12.5 9.5M10.2 12.8c.5 1.2 3.8 1.3 4.3-1.6.400-2.4-1.6-3.3-3.2-2.8" /></>)
export const MailIcon = make(<><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="m4 7 8 6 8-6" /></>)

export const UserIcon = make(<><circle cx="12" cy="8.5" r="3.6" /><path d="M5 20c.8-3.8 3.7-5.5 7-5.5s6.2 1.7 7 5.5" /></>)

export const Venus = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
    <circle cx="12" cy="9" r="5" /><path d="M12 14v8M8.5 18.5h7" />
  </svg>
)
