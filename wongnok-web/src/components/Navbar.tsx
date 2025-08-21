'use client'

import Image from 'next/image'
import { Button } from './ui/button'
import { useSession, signIn, signOut } from 'next-auth/react'

const Navbar = () => {
  const {data: session} = useSession()

  return (
    <div className='flex justify-between'>
      <Image
        src='/wongnok-with-name-logo.png'
        width={182}
        height={49}
        alt='wongnok-logo'
      />
      {session ? (
        <div className='flex flex-col'>
          ชื่อ {session.user?.name}
          <Button onClick={() => signOut()}>SingOut</Button>
        </div>
      ) : (
        <Button
          className='text-primary-a'
          variant='ghost'
          onClick={() => signIn('keycloak')}
        >
          <Image
            color='red'
            src='/icons/person.svg'
            alt='icon person'
            width={24}
            height={24}
          />
          เข้าระบบ
        </Button>
      )}
    </div>
  )
}

export default Navbar
