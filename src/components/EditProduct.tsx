import { ArrowLeft, Check, ChevronDown, Plus, Upload, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { getBrand, getCategory, getColor, getProduct } from '../Store/Redux'
import type { AppDispatch, RootState } from '../Store/Store'

const fieldClass = 'h-10 w-full rounded border border-[#dedede] bg-white px-3 text-sm text-[#171d2a] outline-none placeholder:text-[#8a8a8a] focus:border-[#2860ed]'

type EditProductForm = {
  productName: string
  code: string
  description: string
  categoryId: number
  subCategoryId: number
  brandId: number
  price: number
  discountPrice: number
  quantity: number
  hasTax: boolean
  hasOptions: boolean
  optionName: string
  optionValues: string
  optionName2: string
  optionValues2: string
  colorId: number
  tagName: string
  images: FileList
}

export default function EditProduct() {
    const { id } = useParams()
    const { products, brands, categorys, colors } = useSelector((state: RootState) => state.auth)
    const product = products?.find((item: { id: number }) => item.id === Number(id))
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const [imagePreviews, setImagePreviews] = useState<{ file: File; url: string }[]>([])
    const imagePreviewsRef = useRef<{ file: File; url: string }[]>([])

     const { register, handleSubmit, reset, setValue, watch, formState: { isSubmitting } } = useForm<EditProductForm>({
        defaultValues: {
          productName: '',
          code: '',
          description: '',
          price: 0,
          discountPrice: 0,
          quantity: 0,
          categoryId: 0,
          subCategoryId: 0,
          brandId: 0,
          colorId: 0,
          hasTax: false,
          hasOptions: false,
          optionName: '',
          optionValues: '',
          optionName2: '',
          optionValues2: '',
          tagName: '',
        }
      })
    const selectedCategoryId = watch('categoryId') || product?.categoryId || 0
    const selectedColorId = watch('colorId')
    const selectedCategory = (categorys ?? []).find((category: { id: number }) => category.id === Number(selectedCategoryId))
    const subCategories = selectedCategory?.subCategories ?? []
    const brandsForCategory = (brands ?? []).filter((brand: { id: number; brandName: string }) =>
      (products ?? []).some((item: { categoryId: number; brand: string }) =>
        Number(item.categoryId) === Number(selectedCategoryId) &&
        item.brand?.trim().toLowerCase() === brand.brandName?.trim().toLowerCase()
      )
    )

      useEffect(() => {
        dispatch(getBrand())
        dispatch(getCategory())
        dispatch(getColor())
        dispatch(getProduct())
      }, [dispatch])

      const Onsubmit = () => {
        dispatch(EditProduct(product.id, product))
        navigate('/dashboard/products')
      }

      useEffect(() => {
        if(product){
            reset({
              ...product,
              brandId: product.brandId ?? brands?.find((brand: { brandName: string }) =>
                brand.brandName?.trim().toLowerCase() === product.brand?.trim().toLowerCase()
              )?.id ?? 0,
              colorId: product.colorId ?? colors?.find((color: { colorName: string }) =>
                color.colorName?.trim().toLowerCase() === product.color?.trim().toLowerCase()
              )?.id ?? 0,
            })
        }
      }, [product, brands, colors, reset])

      useEffect(() => () => {
        imagePreviewsRef.current.forEach(({ url }) => URL.revokeObjectURL(url))
      }, [])

      const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []).filter((file) => file.type.startsWith('image/'))
        const nextPreviews = [
          ...imagePreviewsRef.current,
          ...files.map((file) => ({ file, url: URL.createObjectURL(file) })),
        ]
        imagePreviewsRef.current = nextPreviews
        setImagePreviews(nextPreviews)
        event.target.value = ''
      }

      const removeImagePreview = (previewToRemove: { file: File; url: string }) => {
        URL.revokeObjectURL(previewToRemove.url)
        const nextPreviews = imagePreviewsRef.current.filter((preview) => preview !== previewToRemove)
        imagePreviewsRef.current = nextPreviews
        setImagePreviews(nextPreviews)
      }

      const imageField = register('images')
      const currentImageNames = [
        product?.image,
        ...(product?.images ?? []).map((image: { images?: string }) => image.images),
      ].filter((imageName: unknown): imageName is string => typeof imageName === 'string' && imageName.length > 0)
      const currentImages = [...new Set(currentImageNames)].map((imageName) => ({
        name: imageName,
        url: `https://store-beckend-exam4.onrender.com/images/${imageName}`,
      }))

  return (
    <form onSubmit={handleSubmit(Onsubmit)} className="animate-in fade-in slide-in-from-bottom-3 duration-500 min-w-0 text-[#171d2a]">
      <header className="mb-6 flex items-center justify-between gap-4 border-b border-[#e1e5ee] pb-4">
        <div className="flex min-w-0 items-center gap-2 text-sm sm:text-base">
          <ArrowLeft aria-hidden="true" className="size-4 shrink-0 text-[#68728d]" />
          <span className="truncate text-[#68728d]">Products</span>
          <span className="text-[#68728d]">/</span>
          <h1 className="truncate font-semibold">Edit product</h1>
        </div>
        <div className="flex shrink-0 gap-2">
          <button type="button" className="h-9 rounded border border-[#e1e5ee] bg-white px-4 text-sm text-[#2860ed]">
            Cancel
          </button>
          <button type="button" className="h-9 rounded bg-[#2860ed] px-5 text-sm font-medium text-white transition hover:bg-[#1f52d4]">
            Save changes
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.9fr)]">
        <div className="min-w-0 space-y-6">
          <section>
            <h2 className="mb-3 text-sm font-semibold">Information</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_140px]">
              <input {...register('productName')} aria-label="Product name" placeholder="Product name" className={fieldClass} />
              <input {...register('code')} aria-label="Product code" placeholder="Code" className={fieldClass} />
            </div>
            <div className="mt-3 overflow-hidden rounded border border-[#dedede] bg-white">
              <div className="flex h-10 items-center gap-4 border-b border-[#e7e7e7] px-3 text-xs font-medium text-[#555]">
                <span>Normal</span>
                <button type="button" aria-label="Bold" className="font-bold">B</button>
                <button type="button" aria-label="Italic" className="italic">I</button>
                <button type="button" aria-label="Underline" className="underline">U</button>
                <span aria-hidden="true" className="text-[#9aa0ad]">•</span>
                <span aria-hidden="true" className="text-sm">☷</span>
                <span aria-hidden="true" className="text-sm">≡</span>
              </div>
              <textarea {...register('description')} aria-label="Description" placeholder="Description" className="min-h-32 w-full resize-y p-3 text-sm outline-none placeholder:text-[#8a8a8a]" />
            </div>
          </section>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="relative">
              <span className="sr-only">Category</span>
              <select {...register('categoryId', { valueAsNumber: true, onChange: () => {
                setValue('brandId', 0)
                setValue('subCategoryId', 0)
              } })} className={`${fieldClass} appearance-none pr-9`}>
                <option value={0} disabled>Select category</option>
                {(categorys ?? []).map((category: { id: number; categoryName: string }) => (
                  <option key={category.id} value={category.id}>{category.categoryName}</option>
                ))}
              </select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#777]" />
            </label>
            <label className="relative">
              <span className="sr-only">Subcategory</span>
              <select {...register('subCategoryId', { valueAsNumber: true })} className={`${fieldClass} appearance-none pr-9`} disabled={!selectedCategoryId}>
                <option value={0} disabled>Select subcategory</option>
                {subCategories.map((subCategory: { id: number; subCategoryName?: string; name?: string }) => (
                  <option key={subCategory.id} value={subCategory.id}>
                    {subCategory.subCategoryName ?? subCategory.name ?? `Subcategory ${subCategory.id}`}
                  </option>
                ))}
              </select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#777]" />
            </label>
            <label className="relative">
              <span className="sr-only">Brand</span>
              <select {...register('brandId', { valueAsNumber: true })} className={`${fieldClass} appearance-none pr-9`} disabled={!selectedCategoryId}>
                <option value={0} disabled>Select brand</option>
                {brandsForCategory.map((brand: { id: number; brandName: string }) => (
                  <option key={brand.id} value={brand.id}>{brand.brandName}</option>
                ))}
              </select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#777]" />
            </label>
          </div>

          <section>
            <h2 className="mb-3 text-sm font-semibold">Price</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input {...register('price', { valueAsNumber: true })} aria-label="Product price" type="number" placeholder="Product price" className={fieldClass} />
              <input {...register('discountPrice', { valueAsNumber: true })} aria-label="Discount" type="number" placeholder="Discount" className={fieldClass} />
              <input {...register('quantity', { valueAsNumber: true })} aria-label="Quantity" type="number" placeholder="Count" className={fieldClass} />
            </div>
            <label className="mt-3 inline-flex items-center gap-2 text-xs">
              <input {...register('hasTax')} type="checkbox" className="size-4 accent-[#2860ed]" />
              Add tax for this product
            </label>
          </section>

          <section className="rounded border border-[#e1e5ee] bg-white p-3">
            <label className="flex cursor-pointer items-center justify-between gap-3">
              <span>
                <span className="block text-sm font-semibold">Different options</span>
                <span className="text-xs text-[#777]">This product has multiple options</span>
              </span>
              <input {...register('hasOptions')} type="checkbox" className="size-4 accent-[#2860ed]" />
            </label>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold">Options</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input {...register('optionName')} aria-label="Option name" placeholder="Option name (e.g. Size)" className={fieldClass} />
              <input {...register('optionValues')} aria-label="Option values" placeholder="Values (e.g. S, M, L)" className={fieldClass} />
              <input {...register('optionName2')} aria-label="Option name 2" placeholder="Option name" className={fieldClass} />
              <input {...register('optionValues2')} aria-label="Option values 2" placeholder="Values" className={fieldClass} />
            </div>
            <button type="button" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#2860ed]">
              <Plus aria-hidden="true" className="size-3" />
              Add more
            </button>
          </section>
        </div>

        <div className="min-w-0 space-y-5">
          <section className="rounded border border-[#e1e5ee] bg-white p-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold">Colour</h2>
              <button type="button" className="inline-flex items-center gap-1 text-xs text-[#2860ed]">
                <Plus aria-hidden="true" className="size-3" />
                Create new
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <input type="hidden" {...register('colorId', { valueAsNumber: true })} />
              {(colors ?? []).map((color: { id: number; colorName: string; colorCode?: string }) => (
                <button key={color.id} type="button" aria-label={`Select ${color.colorName}`} aria-pressed={selectedColorId === color.id} title={color.colorName} onClick={() => setValue('colorId', color.id)} className={`size-6 rounded-full ring-1 ring-offset-2 ${selectedColorId === color.id ? 'ring-[#2860ed]' : 'ring-[#e1e5ee]'}`} style={{ backgroundColor: color.colorCode || color.colorName }} />
              ))}
            </div>
            {selectedColorId > 0 && (
              <p className="mt-3 text-xs text-[#68728d]">
                {(colors ?? []).find((color: { id: number }) => color.id === selectedColorId)?.colorName}
              </p>
            )}
          </section>

          <section className="rounded border border-[#e1e5ee] bg-white p-3">
            <h2 className="text-sm font-semibold">Tags</h2>
            <div className="mt-3 flex gap-2">
              <input {...register('tagName')} aria-label="Tag name" placeholder="Tags name" className={`${fieldClass} min-w-0`} />
              <button type="button" aria-label="Add tag" className="grid size-10 shrink-0 place-items-center rounded border border-[#2860ed] text-[#2860ed]">
                <Check aria-hidden="true" className="size-5" />
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {['T-Shirt', 'Men Clothes', 'Summer Collection'].map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 rounded bg-[#edf0f8] px-2 py-1 text-[10px] text-[#68728d]">
                  {tag}
                  <X aria-hidden="true" className="size-3" />
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold">Images</h2>
            <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded border border-dashed border-[#b8c2db] bg-white px-4 py-4 text-center transition hover:border-[#2860ed]">
              <input {...imageField} type="file" accept="image/*" multiple onChange={(event) => {
                imageField.onChange(event)
                handleImageChange(event)
              }} className="sr-only" />
              <span className="mb-2 grid size-8 place-items-center rounded-full bg-[#f0f2f7]">
                <Upload aria-hidden="true" className="size-4" />
              </span>
              <span className="text-xs font-medium underline">Click to upload or drag and drop</span>
              <span className="mt-1 text-[10px] text-[#8a8a8a]">SVG, JPG, PNG or GIF (maximum 400 × 400)</span>
            </label>
          </section>

          <div className="overflow-hidden rounded border border-[#e1e5ee] bg-white">
            <div className="grid grid-cols-[1fr_1.5fr_auto] gap-2 border-b border-[#e1e5ee] px-3 py-2 text-[10px] text-[#68728d]">
              <span>Image</span>
              <span>File name</span>
              <span>Action</span>
            </div>
            {currentImages.length === 0 && imagePreviews.length === 0 ? (
              <p className="px-3 py-5 text-center text-xs text-[#8a8a8a]">Product images will appear here</p>
            ) : (
              <ul>
                {currentImages.map((image) => (
                  <li key={image.url} className="grid grid-cols-[1fr_1.5fr_auto] items-center gap-2 border-b border-[#e1e5ee] px-3 py-2 last:border-b-0">
                    <img src={image.url} alt={image.name} className="size-12 rounded object-cover" />
                    <span className="truncate text-xs">{image.name}</span>
                    <span className="text-xs text-[#68728d]">Current</span>
                  </li>
                ))}
                {imagePreviews.map((preview) => (
                  <li key={preview.url} className="grid grid-cols-[1fr_1.5fr_auto] items-center gap-2 border-b border-[#e1e5ee] px-3 py-2 last:border-b-0">
                    <img src={preview.url} alt={preview.file.name} className="size-12 rounded object-cover" />
                    <span className="truncate text-xs">{preview.file.name}</span>
                    <button type="button" onClick={() => removeImagePreview(preview)} aria-label={`Remove ${preview.file.name}`} className="text-xs text-red-600">
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}
