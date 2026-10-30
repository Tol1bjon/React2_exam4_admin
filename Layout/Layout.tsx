import SideBar from './SideBar'
import { Outlet } from 'react-router-dom'
import Header from './Header'

export default function Layout() {
  return (
    <div className="min-h-screen">
        <SideBar />
        <div className="ml-[205px] min-h-screen max-md:ml-0">
            <Header />
            <main className="px-6 pb-6 pt-20 max-md:px-3 max-md:pb-24">
                <Outlet />
            </main>
        </div>
    </div>
  )
}
