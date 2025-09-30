import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from "next/image";
import { Mail } from 'lucide-react'
import { LockIcon } from 'lucide-react';


import Link from 'next/link'
import React from 'react'

const Login = () => {
  return (
    <form className='cadastro-form !p-10 rounded-lg '>
      <header>
        <Image src='/logo.png' alt="logo" width={144} height={30} />
      </header>

      <div className='flex'>
        <span >Não tem uma conta?</span >
        <Link href={'/usuario/registro'} className='underline text-blue-500'>Faça o registro</Link>
      </div>

      <div className="flex items-center border-2 rounded-xl px-3 py-2 gap-2">
        <Mail size={20} className="text-gray-500" />
        <Input
          id="email"
          name="email"
          placeholder="Endereço de Email"
          className="!border-0 !ring-0 !outline-none flex-1 bg-transparent"
        />
      </div>

      <div className="flex items-center border-2 rounded-xl px-3 py-2 gap-2">
        <LockIcon className="text-gray-500" />
        <Input
          id="senha"
          name="senha"
          placeholder="Senha"
          type="password"
          className="!border-0 !ring-0 !outline-none flex-1 bg-transparent"
        />
      </div>

      <Button type='submit' className='w-full'>Login</Button>
    </form>
  )
}

export default Login