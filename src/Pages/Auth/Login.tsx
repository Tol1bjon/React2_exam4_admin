import { useState } from 'react'
import logo from '../../assets/Group 1116606595 (1).png'
import { Eye, EyeOff } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form' 
import { LoginSchema, type LoginForm } from '../../Schema/Schema'
import { zodResolver } from '@hookform/resolvers/zod' 
import { LoginUser } from '../../Store/Redux'
import { useNavigate } from 'react-router-dom'
import type { AppDispatch, RootState } from '../../Store/Store'

export default function Login() {
  const [IsPassworld, setIsPassworld] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const authError = useSelector((state: RootState) => state.auth.error)
  const navigate = useNavigate()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema)
  })

  const Onsubmit = async (data: LoginForm) => {
    const res = await dispatch(LoginUser(data))

    if(LoginUser.fulfilled.match(res)){
        navigate('/dashboard')
        reset()
    }
  }

  return (
    <main className="flex min-h-screen bg-white">
        <section className="animate-in fade-in slide-in-from-left-6 duration-700 relative hidden min-h-screen w-[53%] items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#193640_0%,#1d2639_72%)] px-12 md:flex">
            <div className="flex w-full max-w-[600px] flex-col items-start">
                <p className="animate-in fade-in slide-in-from-bottom-3 delay-150 duration-700 mb-8 text-4xl font-medium text-white sm:text-5xl">Welcome to admin panel</p>
                <img src={logo} alt="Fastcart" className="animate-in fade-in slide-in-from-bottom-3 delay-300 duration-700 h-auto w-full max-w-[500px] object-contain object-left"/>
            </div>
        </section>

        <section className="animate-in fade-in slide-in-from-right-6 duration-700 flex min-h-screen flex-1 items-center justify-center px-6 py-12 sm:px-12">
            <div className="w-full max-w-[440px]">
                <h1 className="mb-4 text-[22px] font-bold leading-7 text-[#171d2a]">Log in</h1>
                <form onSubmit={handleSubmit(Onsubmit)} className="space-y-4">
                    <label className="sr-only" htmlFor="login-name">Name</label>
                    <input {...register('userName')} id="login-name" type="text" placeholder="Name" autoComplete="username" aria-invalid={Boolean(errors.userName)} className="h-12 w-full rounded-[4px] border border-[#dedede] bg-white px-3 text-sm text-[#171d2a] outline-none transition placeholder:text-[#777] focus:border-[#2860ed] focus:ring-2 focus:ring-[#2860ed]/15"/>
                    {errors.userName && <p role="alert" className="text-sm text-red-600">{errors.userName.message}</p>}
                    <div className="relative">
                        <label className="sr-only" htmlFor="login-password">Password</label>
                        <input {...register('password')} id="login-password" type={IsPassworld ? 'text' : 'password'} placeholder="Password" autoComplete="current-password" aria-invalid={Boolean(errors.password)} className="h-12 w-full rounded-[4px] border border-[#dedede] bg-white px-3 pr-11 text-sm text-[#171d2a] outline-none transition placeholder:text-[#777] focus:border-[#2860ed] focus:ring-2 focus:ring-[#2860ed]/15"/>
                        <button type="button" aria-label={IsPassworld ? 'Hide password' : 'Show password'} aria-pressed={IsPassworld} onClick={() => setIsPassworld((eye) => !eye)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2860ed]">
                            {IsPassworld ? <EyeOff aria-hidden="true" className="size-5"/> : <Eye aria-hidden="true" className="size-5"/>}
                        </button>
                    </div>
                    {errors.password && <p role="alert" className="text-sm text-red-600">{errors.password.message}</p>}
                    {authError && <p role="alert" className="text-sm text-red-600">{authError}</p>}
                    <div className="flex justify-end pt-1">
                        <button type="button" className="text-sm font-medium text-[#2860ed] hover:underline">Forgot password?</button>
                    </div>
                    <button type="submit" className="h-11 w-full rounded-[4px] bg-[#2860ed] text-sm font-medium text-white transition hover:bg-[#1f52d4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2860ed] focus-visible:ring-offset-2">Log in</button>
                </form>
            </div>
      </section>
    </main>
  )
}
