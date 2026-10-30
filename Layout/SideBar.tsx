import { ClipboardList, Folder, LayoutDashboard, Tag } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard, end: true },
  { to: '/dashboard/orders', label: 'Orders', Icon: ClipboardList, end: false },
  { to: '/dashboard/products', label: 'Products', Icon: Tag, end: false },
  { to: '/dashboard/other', label: 'Other', Icon: Folder, end: false },
]

export default function SideBar() {
  return (
    <aside className="fixed bottom-0 left-0 top-16 z-10 w-[205px] bg-[#1d2639] px-2.5 pt-7 max-md:top-auto max-md:h-[68px] max-md:w-full max-md:px-2 max-md:py-1">
      <nav aria-label="Main navigation" className="h-full">
        <ul className="space-y-2.5 max-md:flex max-md:h-full max-md:space-y-0">
          {links.map(({ to, label, Icon, end }) => (
            <li key={to} className="max-md:flex-1">
              <NavLink to={to} end={end} className={({ isActive }) => `flex h-[54px] items-center gap-4 rounded-[5px] px-4 text-base transition-colors max-md:h-full max-md:flex-col max-md:justify-center max-md:gap-1 max-md:rounded-md max-md:px-1 max-md:text-[10px] ${ isActive ? 'bg-white text-[#46506a]' : 'text-white hover:bg-white/10'}`}>
                <Icon aria-hidden="true" className="size-6 shrink-0 max-md:size-5" />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
