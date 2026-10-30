import { Upload, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { AddCategory as addCategoryThunk } from '../Store/Redux'
import type { AppDispatch } from '../Store/Store'
import { useState } from 'react'

type AddCategoryProps = {
  open: boolean
  onClose: () => void
}

type AddCategoryForm = {
  categoryName: string
  categoryImage: FileList
}

export default function AddCategory({ open, onClose }: AddCategoryProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { register, reset, handleSubmit, formState: { isSubmitting, errors } } = useForm<AddCategoryForm>({
    defaultValues: {
      categoryName: '',
    }
  })

  const onSubmit = async (data: AddCategoryForm) => {
  const formData = new FormData()
  formData.append('CategoryName', data.categoryName)

  const image = data.categoryImage?.[0]
  if (image) {
    formData.append('CategoryImage', image)
  }

  await dispatch(addCategoryThunk(formData)).unwrap()
  reset()
  onClose()
}

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} role="dialog" aria-modal="true" aria-labelledby="add-category-title" className="w-full max-w-[560px] rounded-md bg-white p-5 shadow-xl">
        <header className="mb-5 flex items-center justify-between">
          <h2 id="add-category-title" className="text-sm font-semibold text-[#171d2a]">
            Add category
          </h2>
          <button type="button" aria-label="Close dialog" onClick={onClose} className="text-[#8790ad] transition hover:text-[#171d2a]">
            <X aria-hidden="true" className="size-4" />
          </button>
        </header>

        <input {...register('categoryName')} aria-label="Category name" placeholder="Category name" className="h-10 w-full rounded border border-[#dedede] bg-white px-3 text-xs text-[#171d2a] outline-none placeholder:text-[#8a8a8a] focus:border-[#2860ed]"/>
        {errors.categoryName && <p role="alert" className="mt-1 text-xs text-red-600">{errors.categoryName.message}</p>}

        <label className="mt-3 flex min-h-[148px] cursor-pointer flex-col items-center justify-center rounded border border-dashed border-[#cbd4e4] bg-white px-4 py-4 text-center transition hover:border-[#2860ed]">
          <input {...register('categoryImage')} type="file" accept="image/*" className="sr-only" />
          <span className="mb-2 grid size-8 place-items-center rounded-full bg-[#f0f2f7]">
            <Upload aria-hidden="true" className="size-4 text-[#171d2a]" />
          </span>
          <span className="text-xs font-medium text-[#171d2a]">
            Click to upload or drag and drop
          </span>
          <span className="mt-1 text-[10px] text-[#8a8a8a]">
            (SVG, JPG, PNG, or GIF, maximum 900 × 400)
          </span>
        </label>

        <footer className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="h-9 min-w-[92px] rounded border border-[#e1e5ee] bg-white px-4 text-xs text-[#2860ed] transition hover:bg-[#f7f8fa]">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="h-9 min-w-[92px] rounded bg-[#2860ed] px-4 text-xs font-medium text-white transition hover:bg-[#1f52d4] disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? 'Creating...' : 'Create'}
          </button>
        </footer>
      </form>
    </div>
  )
}
