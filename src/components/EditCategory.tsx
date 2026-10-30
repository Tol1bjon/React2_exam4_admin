import { Upload, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { EditCategory as editCategoryThunk } from '../Store/Redux'
import type { AppDispatch } from '../Store/Store'

type EditCategoryProps = {
  open: boolean
  onClose: () => void
  category: {
    id: number
    categoryName: string
    categoryImage?: string
  } | null
}

type EditCategoryForm = {
  categoryName: string
  categoryImage: FileList
}

export default function EditCategory({ open, onClose, category }: EditCategoryProps) {
  const dispatch = useDispatch<AppDispatch>()
  const [submitError, setSubmitError] = useState('')
  const { register, reset, handleSubmit, watch, formState: { isSubmitting, errors } } = useForm<EditCategoryForm>({
    defaultValues: {
      categoryName: '',
    },
  })
  const selectedImage = watch('categoryImage')?.[0]

  useEffect(() => {
    if (category) {
      reset({ categoryName: category.categoryName })
      setSubmitError('')
    }
  }, [category, reset])

  const onSubmit = async (values: EditCategoryForm) => {
    if (!category) return

    setSubmitError('')
    const formData = new FormData()
    formData.append('Id', String(category.id))
    formData.append('CategoryName', values.categoryName)
    if (values.categoryImage?.[0]) {
      formData.append('CategoryImage', values.categoryImage[0])
    }

    try {
      await dispatch(editCategoryThunk(formData)).unwrap()
      reset()
      onClose()
    } catch (error) {
      setSubmitError(typeof error === 'string' ? error : 'Could not update category. Please try again.')
    }
  }

  if (!open || !category) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) onClose()
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-category-title"
        className="w-full max-w-[560px] rounded-md bg-white p-5 shadow-xl"
      >
        <header className="mb-5 flex items-center justify-between">
          <h2 id="edit-category-title" className="text-sm font-semibold text-[#171d2a]">
            Edit category
          </h2>
          <button type="button" aria-label="Close dialog" disabled={isSubmitting} onClick={onClose} className="text-[#8790ad] transition hover:text-[#171d2a] disabled:opacity-50">
            <X aria-hidden="true" className="size-4" />
          </button>
        </header>

        <input
          {...register('categoryName', { required: 'Category name is required' })}
          aria-label="Category name"
          placeholder="Category name"
          className="h-10 w-full rounded border border-[#dedede] bg-white px-3 text-xs text-[#171d2a] outline-none placeholder:text-[#8a8a8a] focus:border-[#2860ed]"
        />
        {errors.categoryName && <p role="alert" className="mt-1 text-xs text-red-600">{errors.categoryName.message}</p>}

        <label className="mt-3 flex min-h-[148px] cursor-pointer flex-col items-center justify-center rounded border border-dashed border-[#cbd4e4] bg-white px-4 py-4 text-center transition hover:border-[#2860ed]">
          <input {...register('categoryImage')} type="file" accept="image/*" className="sr-only" />
          <span className="mb-2 grid size-8 place-items-center rounded-full bg-[#f0f2f7]">
            <Upload aria-hidden="true" className="size-4 text-[#171d2a]" />
          </span>
          <span className="text-xs font-medium text-[#171d2a]">
            {selectedImage?.name ?? (category.categoryImage ? 'Click to replace category image' : 'Click to upload or drag and drop')}
          </span>
          <span className="mt-1 text-[10px] text-[#8a8a8a]">
            (SVG, JPG, PNG, or GIF, maximum 900 × 400)
          </span>
        </label>
        {submitError && <p role="alert" className="mt-3 text-xs text-red-600">{submitError}</p>}

        <footer className="mt-4 flex justify-end gap-2">
          <button type="button" disabled={isSubmitting} onClick={onClose} className="h-9 min-w-[92px] rounded border border-[#e1e5ee] bg-white px-4 text-xs text-[#2860ed] transition hover:bg-[#f7f8fa] disabled:opacity-60">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="h-9 min-w-[92px] rounded bg-[#2860ed] px-4 text-xs font-medium text-white transition hover:bg-[#1f52d4] disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </footer>
      </form>
    </div>
  )
}
