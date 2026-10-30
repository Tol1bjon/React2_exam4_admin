import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { editBrand as editBrandThunk } from '../Store/Redux'
import type { AppDispatch } from '../Store/Store'

type Brand = {
  id: number
  brandName: string
}

type EditBrandProps = {
  open: boolean
  onClose: () => void
  brand: Brand | null
}

type EditBrandForm = {
  brandName: string
}

export default function EditBrand({ open, onClose, brand }: EditBrandProps) {
  const dispatch = useDispatch<AppDispatch>()
  const [submitError, setSubmitError] = useState<{ brandId: number; message: string } | null>(null)
  const { register, reset, handleSubmit, formState: { isSubmitting, errors } } = useForm<EditBrandForm>({
    defaultValues: {
      brandName: '',
    },
  })

  useEffect(() => {
    if (brand) {
      reset({ brandName: brand.brandName })
    }
  }, [brand, reset])

  const onSubmit = async (values: EditBrandForm) => {
    if (!brand) return

    setSubmitError(null)
    try {
      await dispatch(editBrandThunk({ id: brand.id, brandName: values.brandName.trim() })).unwrap()
      reset()
      onClose()
    } catch (error) {
      setSubmitError({
        brandId: brand.id,
        message: typeof error === 'string' ? error : 'Could not update brand. Please try again.',
      })
    }
  }

  if (!open || !brand) return null

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
        aria-labelledby="edit-brand-title"
        className="w-full max-w-[560px] rounded-md bg-white p-5 shadow-xl"
      >
        <header className="mb-5 flex items-center justify-between">
          <h2 id="edit-brand-title" className="text-sm font-semibold text-[#171d2a]">
            Edit brand
          </h2>
          <button type="button" aria-label="Close dialog" disabled={isSubmitting} onClick={onClose} className="text-[#8790ad] transition hover:text-[#171d2a] disabled:opacity-50">
            <X aria-hidden="true" className="size-4" />
          </button>
        </header>

        <input
          {...register('brandName', {
            validate: (value) => value.trim().length > 0 || 'Brand name is required',
          })}
          aria-label="Brand name"
          placeholder="Brand name"
          className="h-10 w-full rounded border border-[#dedede] bg-white px-3 text-xs text-[#171d2a] outline-none placeholder:text-[#8a8a8a] focus:border-[#2860ed]"
        />
        {errors.brandName && <p role="alert" className="mt-1 text-xs text-red-600">{errors.brandName.message}</p>}
        {submitError?.brandId === brand.id && <p role="alert" className="mt-3 text-xs text-red-600">{submitError.message}</p>}

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
