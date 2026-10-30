import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'



const Login = lazy(() => import('./Pages/Auth/Login'))
const Layout = lazy(() => import('../Layout/Layout'))
const Dashboard = lazy(() => import('./Pages/Dushboard/Dashboard'))
const Orders = lazy(() => import('./Pages/Orders/Orders'))
const Products = lazy(() => import('./Pages/Products/Products'))
const Other = lazy(() => import('./Pages/Other/Other'))
const AddProduct = lazy(() => import('./components/AddProduct'))
const EditProduct = lazy(() => import('./components/EditProduct'))





const Loading = () => {
  return (
    <div></div>
  )
}



const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Suspense fallback={<Loading/>}>
        <Login/>
      </Suspense>
    },
    {
      path: '/dashboard',
      element: <Suspense fallback={<Loading/>}>
        <Layout/>
      </Suspense>,
      children: [
        {
          index: true,
          element: <Suspense fallback={<Loading/>}>
            <Dashboard/>
          </Suspense>
        },
        {
          path: 'orders',
          element: <Suspense fallback={<Loading/>}>
            <Orders/>
          </Suspense>
        },
        {
          path: 'products',
          element: <Suspense fallback={<Loading/>}>
            <Products/>
          </Suspense>
        },
        {
          path: 'other',
          element: <Suspense fallback={<Loading/>}>
            <Other/>
          </Suspense>
        },
        {
          path: 'products/add-new-product',
          element: <Suspense fallback={<Loading/>}>
            <AddProduct/>
          </Suspense>
        },
        {
          path: 'products/edit-product/:id',
          element: <Suspense fallback={<Loading/>}>
            <EditProduct/>
          </Suspense>
        }
      ]
    }
  ])

  return <RouterProvider router={router}/>
};

export default App;
