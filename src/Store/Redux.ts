import axios from 'axios'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { axiosRequest, getToken, GetUser, removeToken, saveToken } from '../lib/Token'
import type { LoginForm } from '../Schema/Schema'

export const LoginUser = createAsyncThunk<string, LoginForm, { rejectValue: string }>(
  'Data/LoginUser',
  async (info, { rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.post('/Account/login', info)
      const token = data.data
      saveToken(token)
      return token
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ?? error.message
        : error instanceof Error
          ? error.message
          : 'Login failed'
      return rejectWithValue(message)
    }
  },
)





export const getBrand = createAsyncThunk<{ id: number; brandName: string }[], void>(
  'Data/getBrand',
  async () => {
    try {
      const { data } = await axiosRequest.get('/Brand/get-brands')
      return data.data
    } catch (error) {
        console.log(error)
    }
  },
)

export const addBrand = createAsyncThunk<void, string>('Data/addBrand', async (brandName, { dispatch }) => {
    try {
        await axiosRequest.post('/Brand/add-brand', { BrandName: brandName })
        dispatch(getBrand())
    } catch (error) {
        console.log(error)
    }
  },
)

export const editBrand = createAsyncThunk<void, { id: number; brandName: string }>('Data/editBrand', async ({ id, brandName }, { dispatch }) => {
    try {
        axiosRequest.put(`/Brand/update-brand?Id=${id}`, { BrandName: brandName })
        dispatch(getBrand())
    } catch (error) {
        console.log(error)
    }
  }
)

export const deleteBrand = createAsyncThunk<void, number>('Data/deleteBrand', async (id, { dispatch }) => {
    try {
        axiosRequest.delete(`/Brand/delete-brand?id=${id}`)
        dispatch(getBrand())
    } catch (error) {
        console.log(error)
    }
  }
)


export const getCategory = createAsyncThunk('Data/getCategory', async() => {
    try {
        const {data} = await axiosRequest.get('/Category/get-categories')
        return data.data
    } catch (error) {
        console.log(error)
    }
})

export const getColor = createAsyncThunk('Data/getColor', async() => {
    try {
        const {data} = await axiosRequest.get('/Color/get-colors')
        return data.data
    } catch (error) {
        console.log(error)
        throw error
    }
})


export const getProduct = createAsyncThunk('Data/getProduct', async() => {
    try {
        const {data} = await axiosRequest.get('/Product/get-products')
        return data.data.products
    } catch (error) {
        console.log(error)
    }
})


export const deleteProduct = createAsyncThunk('Data/deleteProduct', async (id, { dispatch }) => {
    try {
      await axiosRequest.delete(`/Product/delete-product?id=${id}`)
      dispatch(getProduct())
      return id
    } catch (error) {
      console.log(error)
    }
})

export const addProduct = createAsyncThunk('Data/addProduct', async (newProduct, { dispatch }) => {
    try {
      await axiosRequest.post('/Product/add-product', newProduct)
      dispatch(getProduct())
    } catch (error) {
        console.log(error)
    }
})


export const EditProduct = createAsyncThunk<void, { id: number; product: unknown }>('Data/EditProduct', async({id, product}, {dispatch}) => {
    try {
        await axiosRequest.put(`/Product/update-product?Id=${id}`, product)
        dispatch(getProduct())
    } catch (error) {
        console.log(error)
    }
})


export const AddCategory = createAsyncThunk<void, FormData>('Data/AddCategory', async (newCategory, { dispatch }) => {
    try {
        await axiosRequest.post('/Category/add-category', newCategory)
        dispatch(getCategory())
    } catch (error) {
        console.log(error)  
    }
})

export const EditCategory = createAsyncThunk<void, FormData>(
  'Data/EditCategory',
  async (updatedCategory, { dispatch }) => {
    try {
        await axiosRequest.put('/Category/update-category', updatedCategory)
        dispatch(getCategory())
    } catch (error) {
        console.log(error)
    }
  },
)





interface AuthState {
  token: string | null
  loading: boolean
  error: string | null
  user: any,
  products: any,
  brands: any,
  categorys: any,
  colors: any
}

const initialState: AuthState = {
  token: getToken(),
  loading: false,
  error: null,
  user: GetUser(),
  products: [],
  brands: [],
  categorys: [],
  colors: []
}

export const Redux = createSlice({
  name: 'Data',
  initialState,
  reducers: {
    Logout: (state) => {
      removeToken()
      state.token = null
      state.loading = false
      state.error = null
      state.user = null
      state.products = null
      state.brands = null
      state.categorys = null
      state.colors = null
    },
  },
  extraReducers: (builder) => {
    builder.addCase(LoginUser.pending, (state) => {
        state.error = null
        state.loading = true
      }).addCase(LoginUser.fulfilled, (state, { payload }) => {
        state.loading = false
        state.token = payload
        state.user = GetUser()
      }).addCase(LoginUser.rejected, (state, { payload }) => {
        state.loading = false
        state.error = payload as string
      })

      builder.addCase(getProduct.pending, (state) => {
        state.loading = true,
        state.error = null
      }).addCase(getProduct.fulfilled, (state, {payload}) => {
        state.loading = false,
        state.products = payload
      }).addCase(getProduct.rejected, (state, {payload}) => {
        state.loading = false
        state.error = payload as string
      })

      builder.addCase(getBrand.pending, (state) => {
        state.loading = true,
        state.error = null
      }).addCase(getBrand.fulfilled, (state, {payload}) => {
        state.loading = false,
        state.brands = payload
      }).addCase(getBrand.rejected, (state, {payload}) => {
        state.loading = false
        state.error = payload as string
      })



      builder.addCase(getColor.pending, (state) => {
        state.loading = true
        state.error = null
      }).addCase(getColor.fulfilled, (state, {payload}) => {
        state.loading = false
        state.colors = payload
      }).addCase(getColor.rejected, (state, {error}) => {
        state.loading = false
        state.error = error.message ?? 'Failed to load colors'
      })

      builder.addCase(getCategory.pending, (state) => {
        state.loading = true,
        state.error = null
      }).addCase(getCategory.fulfilled, (state, {payload}) => {
        state.loading = false,
        state.categorys = payload
      }).addCase(getCategory.rejected, (state, {payload}) => {
        state.loading = false
        state.error = payload as string
      })
  },
})

export const { Logout } = Redux.actions

export default Redux.reducer
