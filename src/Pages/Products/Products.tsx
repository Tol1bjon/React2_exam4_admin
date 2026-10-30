import { ChevronDown, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProduct } from '../../Store/Redux'
import { NavLink, useNavigate } from 'react-router-dom'
import DeleteProduct from '../../components/DeleteProduct'
import type { AppDispatch } from '../../Store/Store'

type Product = {
  id: number
  productName: string
  image: string
  color: string
  brand: string
  price: number
  hasDiscount: boolean
  discountPrice: number
  quantity: number
  categoryName: string
}

export default function Products() {
    const navigate = useNavigate()
    const products = useSelector((state: any) => state.auth.products) as Product[]
    const dispatch = useDispatch<AppDispatch>()
    const [productsToDelete, setProductsToDelete] = useState<Product[]>([])
    const [search, setSearch] = useState('')
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
    const [selectedIds, setSelectedIds] = useState<number[]>([])

    useEffect(() => {
        dispatch(getProduct())
    }, [dispatch])

    const filteredProducts = (products ?? [])
      .filter((product) => {
        const searchText = search.trim().toLowerCase()
        return [
          product.productName,
          product.brand,
          product.categoryName,
          product.color,
        ].some((value) => value?.toLowerCase().includes(searchText))
      })
      .sort((first, second) =>
        sortOrder === 'newest' ? second.id - first.id : first.id - second.id
      )
    const allVisibleSelected = filteredProducts.length > 0 &&
      filteredProducts.every((product) => selectedIds.includes(product.id))

    const toggleProduct = (productId: number) => {
      setSelectedIds((current) => current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId])
    }

    const toggleVisibleProducts = () => {
      const visibleIds = filteredProducts.map((product) => product.id)
      setSelectedIds((current) => allVisibleSelected
        ? current.filter((id) => !visibleIds.includes(id))
        : [...new Set([...current, ...visibleIds])])
    }

  return (
    <section className="animate-in fade-in slide-in-from-bottom-3 duration-500 min-w-0 text-[#171d2a]">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <NavLink to={'/dashboard/products/add-new-product'}>
            <button type="button"         className="inline-flex h-10 shrink-0 items-center gap-2 rounded-md bg-[#2860ed] px-4 text-sm font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#1f52d4] active:translate-y-0">
              <Plus aria-hidden="true" className="size-4" />
              Add product
            </button>
        </NavLink>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 delay-100 duration-500 mb-6 flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-stretch">
        <div className="flex min-w-0 flex-1 items-center gap-3 max-sm:flex-col max-sm:items-stretch">
          <label className="relative block w-full max-w-[320px] max-sm:max-w-none">
            <span className="sr-only">Search products</span>
            <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search..." className="h-11 w-full rounded border border-[#dedede] bg-white px-3 pr-10 text-sm outline-none placeholder:text-[#777] focus:border-[#2860ed]"/>
            <Search aria-hidden="true" className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#777]" />
          </label>

          <label className="relative block w-full max-w-[160px] max-sm:max-w-none">
            <span className="absolute -top-2 left-2 bg-white px-1 text-[10px] text-[#777]">Filter</span>
            <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value as 'newest' | 'oldest')} className="h-11 w-full appearance-none rounded border border-[#dedede] bg-white px-3 pr-9 text-sm outline-none focus:border-[#2860ed]">
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
            <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#777]" />
          </label>
        </div>

        <div className="flex shrink-0 gap-2 max-sm:justify-end">
          <button type="button" aria-label="Edit selected products" className="grid size-10 place-items-center rounded border border-[#e1e5ee] bg-white text-[#2860ed]">
            <Pencil aria-hidden="true" className="size-4" />
          </button>
          <button type="button" aria-label="Delete selected products" disabled={selectedIds.length === 0} onClick={() => setProductsToDelete((products ?? []).filter((product) => selectedIds.includes(product.id)))} className="grid size-10 place-items-center rounded border border-[#e1e5ee] bg-white text-red-500 disabled:cursor-not-allowed disabled:opacity-40">
            <Trash2 aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 delay-200 duration-500 overflow-hidden rounded-md border border-[#e1e5ee] bg-white">
        <div className="grid grid-cols-[minmax(190px,2fr)_minmax(110px,1fr)_minmax(100px,1fr)_minmax(80px,0.8fr)_minmax(90px,0.8fr)] items-center gap-3 border-b border-[#e1e5ee] px-4 py-4 text-xs font-medium text-[#68728d] max-md:hidden">
          <label className="flex items-center gap-3">
            <input type="checkbox" aria-label="Select all products" checked={allVisibleSelected} onChange={toggleVisibleProducts} className="size-4 accent-[#2860ed]" />
            <span>Product</span>
          </label>
          <span>Inventory</span>
          <span>Category</span>
          <span>Price</span>
          <span>Action</span>
        </div>

        {filteredProducts.length > 0 ? filteredProducts.map((product) => {
          const imageUrl = `https://store-beckend-exam4.onrender.com/images/${product.image}`
          const price = product.hasDiscount ? product.discountPrice : product.price

          return (
            <article key={product.id} className="border-b border-[#e1e5ee] bg-[#fafafa] last:border-b-0">
              <div className="hidden grid-cols-[minmax(190px,2fr)_minmax(110px,1fr)_minmax(100px,1fr)_minmax(80px,0.8fr)_minmax(90px,0.8fr)] items-center gap-3 px-4 py-3 text-sm text-[#171d2a] md:grid">
                <div className="flex min-w-0 items-center gap-3">
                  <input type="checkbox" checked={selectedIds.includes(product.id)} onChange={() => toggleProduct(product.id)} aria-label={`Select ${product.productName}`} className="size-4 shrink-0 accent-[#2860ed]" />
                  <img src={imageUrl} alt={product.productName} className="size-12 shrink-0 rounded object-cover" />
                  <div className="min-w-0">
                    <p className="truncate font-medium">{product.productName}</p>
                    <p className="truncate text-xs text-[#68728d]">{product.brand} · {product.color}</p>
                  </div>
                </div>
                <span>{product.quantity} in stock</span>
                <span className="truncate">{product.categoryName}</span>
                <span className="font-medium">${price.toFixed(2)}</span>
                <div className="flex items-center gap-4">
                  <button onClick={() => navigate(`/dashboard/products/edit-product/${product.id}`)} type="button" aria-label={`Edit ${product.productName}`} className="text-[#2860ed]">
                    <Pencil aria-hidden="true" className="size-4" />
                  </button>
                  <button onClick={() => setProductsToDelete([product])} type="button" aria-label={`Delete ${product.productName}`} className="text-red-500">
                    <Trash2 aria-hidden="true" className="size-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 p-3 md:hidden">
                <input type="checkbox" checked={selectedIds.includes(product.id)} onChange={() => toggleProduct(product.id)} aria-label={`Select ${product.productName}`} className="mt-1 size-4 shrink-0 accent-[#2860ed]" />
                <img src={imageUrl} alt={product.productName} className="size-20 shrink-0 rounded-md object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-medium">{product.productName}</h2>
                    <div className="flex shrink-0 gap-3">
                      <button onClick={() => navigate(`/dashboard/products/edit-product/${product.id}`)} type="button" aria-label={`Edit ${product.productName}`} className="text-[#2860ed]">
                        <Pencil aria-hidden="true" className="size-4" />
                      </button>
                      <button onClick={() => setProductsToDelete([product])} type="button" aria-label={`Delete ${product.productName}`} className="text-red-500">
                        <Trash2 aria-hidden="true" className="size-4" />
                      </button>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-[#68728d]">{product.brand} · {product.color}</p>
                  <p className="mt-2 text-xs text-[#68728d]">{product.categoryName} · {product.quantity} in stock</p>
                  <p className="mt-1 font-semibold">${price.toFixed(2)}</p>
                </div>
              </div>
            </article>
          )
        }) : (
          <div className="grid min-h-24 place-items-center px-4 py-8 text-sm text-[#68728d] bg-[#f7f8fa]">
            No products to display
          </div>
        )}
      </div>
      <DeleteProduct
        products={productsToDelete}
        onClose={() => setProductsToDelete([])}
        onDeleted={(deletedIds) => {
          setSelectedIds((current) => current.filter((id) => !deletedIds.includes(id)))
          setProductsToDelete((current) => current.filter((product) => !deletedIds.includes(product.id)))
        }}
      />
    </section>
  )
}
