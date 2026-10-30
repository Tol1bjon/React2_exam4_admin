import { X } from 'lucide-react'
import axios from 'axios'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { getProduct } from '../Store/Redux'
import type { AppDispatch } from '../Store/Store'
import { axiosRequest } from '../lib/Token'

type DeleteProductProps = {
  products: { id: number; productName: string }[]
  onClose: () => void
  onDeleted: (deletedIds: number[]) => void
}

export default function DeleteProduct({ products, onClose, onDeleted }: DeleteProductProps) {
  const dispatch = useDispatch<AppDispatch>()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')

  if (products.length === 0) return null

  const handleDelete = async () => {
    setIsDeleting(true)
    setError('')
    try {
      await Promise.all(products.map(({ id }) =>
        axiosRequest.delete(`/Product/delete-product?id=${id}`)
      ))
      const deletedIds = products.map(({ id }) => id)
      await dispatch(getProduct())
      onDeleted(deletedIds)
      onClose()
    } catch (deleteError) {
      const message = axios.isAxiosError(deleteError)
        ? deleteError.response?.data?.message ?? deleteError.message
        : deleteError instanceof Error
          ? deleteError.message
          : 'Could not delete the product(s). Please try again.'
      setError(message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isDeleting) onClose()
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-product-title"
        className="w-full max-w-[640px] rounded-md bg-white p-6 shadow-xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="delete-product-title" className="text-2xl font-bold text-[#171d2a]">
            Delete product
          </h2>
          <button
            type="button"
            aria-label="Close dialog"
            disabled={isDeleting}
            onClick={onClose}
            className="text-[#8790ad] transition hover:text-[#171d2a] disabled:opacity-50"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        <p className="mt-5 text-base text-[#171d2a]">
          Are you sure you want to delete {products.length === 1 ? 'this product?' : `these ${products.length} products?`}
        </p>
        {products.length === 1 && <p className="mt-1 truncate text-sm text-[#68728d]">{products[0].productName}</p>}
        {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-8 flex justify-end gap-4">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="h-[52px] w-[156px] rounded-md bg-[#2860ed] text-base font-medium text-white transition hover:bg-[#1f52d4] disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={handleDelete}
            className="h-[52px] w-[156px] rounded-md border border-red-500 bg-white text-base font-medium text-red-500 transition hover:bg-red-50 disabled:opacity-60"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </section>
    </div>
  )
}
