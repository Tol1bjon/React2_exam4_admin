import { Camera, Gamepad2, Grid2X2, Headphones, Monitor, Pencil, Plus, Search, Smartphone, Trash2, Watch, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addBrand, deleteBrand, getBrand, getCategory } from '../../Store/Redux'
import type { AppDispatch, RootState } from '../../Store/Store'
import AddCategory from '../../components/AddCategory'
import EditBrand from '../../components/EditBrand'
import EditCategoryModal from '../../components/EditCategory'

const tabClass = 'rounded-sm px-4 py-2 text-xs font-medium text-[#171d2a] transition'

type Brand = {
  id: number
  brandName: string
}

const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase()

  if (name.includes('phone')) return Smartphone
  if (name.includes('computer') || name.includes('laptop')) return Monitor
  if (name.includes('watch')) return Watch
  if (name.includes('headphone') || name.includes('audio')) return Headphones
  if (name.includes('camera')) return Camera
  if (name.includes('gaming') || name.includes('game')) return Gamepad2
  return Grid2X2
}

export default function Other() {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'categories' | 'brands'>('categories')
  const [categoryToEdit, setCategoryToEdit] = useState<{ id: number; categoryName: string; categoryImage?: string } | null>(null)
  const [brandToEdit, setBrandToEdit] = useState<Brand | null>(null)
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null)
  const [brandName, setBrandName] = useState('')
  const [brandError, setBrandError] = useState('')
  const [isAddingBrand, setIsAddingBrand] = useState(false)
  const [isDeletingBrand, setIsDeletingBrand] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const categories = useSelector((state: RootState) => state.auth.categorys)
  const brands = useSelector((state: RootState) => state.auth.brands ?? [])
  const [search, setSearch] = useState('')
  const filteredCategories = categories.filter((category: { categoryName: string }) =>
    category.categoryName.toLowerCase().includes(search.trim().toLowerCase())
  )

  useEffect(() => {
    dispatch(getCategory())
    dispatch(getBrand())
  }, [])

  const handleAddBrand = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedName = brandName.trim()
    setBrandError('')
    setIsAddingBrand(true)
    try {
      await dispatch(addBrand(trimmedName)).unwrap()
      setBrandName('')
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteBrand = async () => {
    if (!brandToDelete) return

    setIsDeletingBrand(true)
    try {
      await dispatch(deleteBrand(brandToDelete.id))
      setBrandToDelete(null)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
    <section className="animate-in fade-in slide-in-from-bottom-3 duration-500 min-w-0 text-[#171d2a]">
      <header className="mb-6 flex items-start justify-between gap-4 max-sm:flex-col">
        <nav aria-label="Other settings" className="flex items-center gap-1">
          <button type="button" aria-current={activeTab === 'categories' ? 'page' : undefined} onClick={() => setActiveTab('categories')} className={`${tabClass} ${activeTab === 'categories' ? 'bg-[#e4edff] text-[#2860ed]' : ''}`}>
            Categories
          </button>
          <button type="button" aria-current={activeTab === 'brands' ? 'page' : undefined} onClick={() => setActiveTab('brands')} className={`${tabClass} ${activeTab === 'brands' ? 'bg-[#e4edff] text-[#2860ed]' : ''}`}>
            Brands
          </button>
          <button type="button" className={tabClass}>
            Banners
          </button>
        </nav>

        {activeTab === 'categories' && (
          <button onClick={() => setOpen(true)} type="button" className="inline-flex h-9 shrink-0 items-center gap-2 rounded bg-[#2860ed] px-4 text-xs font-medium text-white transition hover:bg-[#1f52d4]">
            <Plus aria-hidden="true" className="size-4" />
            Add new
          </button>
        )}
      </header>

      {activeTab === 'categories' ? (
        <>
          <label className="relative block w-full max-w-[320px]">
            <span className="sr-only">Search</span>
            <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search..." className="h-10 w-full rounded border border-[#dedede] bg-white px-3 pr-10 text-xs outline-none placeholder:text-[#8a8a8a] focus:border-[#2860ed]"/>
            <Search aria-hidden="true" className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#777]" />
          </label>

          <div className="mt-5 grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredCategories.map((category: { id: number; categoryName: string }) => {
              const CategoryIcon = getCategoryIcon(category.categoryName)

              return (
                <div key={category.id} className="relative flex h-[121px] flex-col items-start justify-between rounded-sm border border-[#c9c9c9] bg-white p-4 transition hover:shadow-sm">
                  <CategoryIcon aria-hidden="true" className="size-10 stroke-[1.35] text-[#111]" />
                  <span className="truncate pr-6 text-sm text-[#171d2a]">{category.categoryName}</span>
                  <button type="button" onClick={() => setCategoryToEdit(category)} aria-label={`Edit ${category.categoryName}`} className="absolute right-5 top-5 text-[#2860ed]">
                    <Pencil aria-hidden="true" className="size-4" />
                  </button>
                </div>
              )
            })}
          </div>
          {filteredCategories.length === 0 && (
            <p className="mt-5 text-sm text-[#68728d]">No categories found.</p>
          )}
        </>
      ) : (
        <div className="grid gap-6 sm:grid-cols-[minmax(0,0.9fr)_minmax(280px,1.1fr)]">
          <div>
            <div className="grid grid-cols-[minmax(0,1fr)_72px] border-b border-[#e1e5ee] pb-3 text-xs text-[#68728d]">
              <span>Brands</span>
              <span>Action</span>
            </div>
            {brands.map((brand: Brand) => (
              <div key={brand.id} className="grid min-h-[35px] grid-cols-[minmax(0,1fr)_72px] items-center border-b border-[#e1e5ee] text-xs">
                <span className="truncate pr-2">{brand.brandName}</span>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setBrandToEdit(brand)} aria-label={`Edit ${brand.brandName}`} className="text-[#2860ed]">
                    <Pencil aria-hidden="true" className="size-3.5" />
                  </button>
                  <button type="button" onClick={() => setBrandToDelete(brand)} aria-label={`Delete ${brand.brandName}`} className="text-red-500">
                    <Trash2 aria-hidden="true" className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {brands.length === 0 && <p className="mt-3 text-xs text-[#68728d]">No brands found.</p>}
          </div>

          <form onSubmit={handleAddBrand} className="h-fit rounded-sm border border-[#dedede] bg-white p-4">
            <h2 className="mb-4 text-sm font-semibold text-[#171d2a]">Add new brand</h2>
            <input
              value={brandName}
              onChange={(event) => {
                setBrandName(event.target.value)
                setBrandError('')
              }}
              aria-label="Brand name"
              placeholder="Brand name"
              className="h-10 w-full rounded border border-[#dedede] bg-white px-3 text-xs text-[#171d2a] outline-none placeholder:text-[#8a8a8a] focus:border-[#2860ed]"
            />
            {brandError && <p role="alert" className="mt-1 text-xs text-red-600">{brandError}</p>}
            <div className="mt-3 flex justify-end">
              <button type="submit" disabled={isAddingBrand} className="h-9 min-w-[74px] rounded bg-[#2860ed] px-4 text-xs font-medium text-white transition hover:bg-[#1f52d4] disabled:cursor-not-allowed disabled:opacity-60">
                {isAddingBrand ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
    <AddCategory open={open} onClose={() => setOpen(false)} />
    <EditCategoryModal
      open={categoryToEdit !== null}
      category={categoryToEdit}
      onClose={() => setCategoryToEdit(null)}
    />
    {brandToEdit && (
      <EditBrand open brand={brandToEdit} onClose={() => setBrandToEdit(null)} />
    )}
    {brandToDelete && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isDeletingBrand) setBrandToDelete(null)
      }}>
        <div role="alertdialog" aria-modal="true" aria-labelledby="delete-brand-title" className="w-full max-w-[420px] rounded-md bg-white p-5 shadow-xl">
          <header className="mb-4 flex items-center justify-between">
            <h2 id="delete-brand-title" className="text-sm font-semibold text-[#171d2a]">Delete brand</h2>
            <button type="button" aria-label="Close dialog" disabled={isDeletingBrand} onClick={() => setBrandToDelete(null)} className="text-[#8790ad] transition hover:text-[#171d2a] disabled:opacity-50">
              <X aria-hidden="true" className="size-4" />
            </button>
          </header>
          <p className="text-xs text-[#68728d]">Are you sure you want to delete {brandToDelete.brandName}?</p>
          <footer className="mt-5 flex justify-end gap-2">
            <button type="button" disabled={isDeletingBrand} onClick={() => setBrandToDelete(null)} className="h-9 min-w-[92px] rounded border border-[#e1e5ee] bg-white px-4 text-xs text-[#2860ed] transition hover:bg-[#f7f8fa] disabled:opacity-60">
              Cancel
            </button>
            <button type="button" disabled={isDeletingBrand} onClick={handleDeleteBrand} className="h-9 min-w-[92px] rounded bg-red-500 px-4 text-xs font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60">
              {isDeletingBrand ? 'Deleting...' : 'Delete'}
            </button>
          </footer>
        </div>
      </div>
    )}
    </>
  )
}
