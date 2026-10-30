import * as z from 'zod'

export const LoginSchema = z.object({
    userName: z.string().min(2, "Enter your username or email"),
    password: z.string().min(6, "The password must be at least 6 characters long.")
})

export type LoginForm = z.infer<typeof LoginSchema>




export const SchemaProducts = z.object({
    id: z.number(),
    productName: z.string(),
    image: z.string(),
    images: z.array(z.object({
        id: z.number(),
        images: z.string(),
        productId: z.number()
    })),
    color: z.string(),
    brand: z.string(),
    price: z.coerce.number(),
    hasDiscount: z.boolean(),
    discountPrice: z.coerce.number(),
    quantity: z.coerce.number(),
    categoryId: z.coerce.number(),
    categoryName: z.string(),
    subCategoryId: z.any()
})

export type ProductForm = z.infer<typeof SchemaProducts>



export const SchemaCategory = z.object({
    id: z.number(),
    categoryName: z.string(),
    categoryImage: z.string()
})

export type CategoryForm = z.infer<typeof SchemaCategory>