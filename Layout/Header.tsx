import { useState } from 'react'
import { Bell, ChevronDown, Search } from 'lucide-react'
import { useSelector } from 'react-redux'
import logo from '../src/assets/Group 1116606595 (1).png'
import type { RootState } from '../src/Store/Store'

type AdminClaims = {
  name?: string
  userName?: string
  unique_name?: string
  email?: string
  role?: string
}

export default function Header() {
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false)
  const admin = useSelector((state: RootState) => state.auth.user) as AdminClaims | null
  const adminName = admin?.name ?? admin?.userName ?? admin?.unique_name ?? 'Admin'
  const initial = adminName.charAt(0).toUpperCase()

  return (
    <header className="fixed inset-x-0 top-0 z-20 flex h-16 items-center bg-[#1d2639] px-8 text-white max-md:px-3">
      <img src={logo} alt="Fastcart" className="h-12 w-[210px] object-contain object-left max-md:h-8 max-md:w-[120px]" />

      <div className="ml-28 flex items-center gap-3 text-white/90 max-md:ml-4 max-md:min-w-0 max-md:flex-1 max-md:gap-1.5">
        <Search aria-hidden="true" className="size-6 max-md:size-4" />
        <input type="search" placeholder="Search..." aria-label="Search" className="w-48 bg-transparent text-base text-white outline-none placeholder:text-white/75 max-md:w-full max-md:text-sm"/>
      </div>

      <div className="ml-auto flex items-center gap-4 max-md:ml-2 max-md:gap-2">
        <div aria-label="Notifications" className="relative grid size-9 place-items-center max-md:size-7">
          <Bell aria-hidden="true" className="size-6 max-md:size-5" />
          <span className="absolute right-0 top-0 grid size-4 place-items-center rounded-full bg-[#2860ed] text-[9px] font-semibold">
            5
          </span>
        </div>
        <div className="relative">
          <button
            type="button"
            aria-label="Admin account"
            aria-expanded={isAdminMenuOpen}
            onClick={() => setIsAdminMenuOpen((isOpen) => !isOpen)}
            className="flex items-center gap-3 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-white/70 max-md:gap-2"
          >
            <span aria-hidden="true" className="grid size-10 place-items-center rounded-full bg-emerald-500 text-lg font-semibold max-md:size-8 max-md:text-sm">
              {initial}
            </span>
            <span className="text-base max-md:hidden">{adminName}</span>
            <ChevronDown aria-hidden="true" className={`size-5 transition-transform max-md:hidden ${isAdminMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          {isAdminMenuOpen && (
            <div className="absolute right-0 top-full z-30 mt-3 w-64 rounded-md bg-white p-4 text-[#171d2a] shadow-xl">
              <p className="text-sm font-semibold">{adminName}</p>
              {admin?.email && <p className="mt-1 break-all text-sm text-[#777]">{admin.email}</p>}
              {admin?.role && <p className="mt-3 border-t border-[#dedede] pt-3 text-sm text-[#777]">{admin.role}</p>}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
