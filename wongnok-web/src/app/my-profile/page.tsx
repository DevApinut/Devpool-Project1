'use client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import { getUser, User } from '@/services/recipe.service'

const MyProfile = () => {

  const { data, isLoading, isError } = useQuery<User>({
    queryKey: ['recipeDetail'],
    queryFn: () => getUser(),
  })
  const form = useForm()
  if (isLoading || status === 'loading') return <div>Loading...</div>
  if (isError) return <div>Error</div>

  console.log(data)
  return (
    <div className=' flex flex-col'>
      <div className='flex justify-between items-center py-8'>
        <h1 className='font-bold text-4xl'>โปรไฟล์ของฉัน</h1>
        <Link href={'/edit-myprofile'}>
          <Button className='border text-primary-500' variant='ghost'>
            <Image
              src='icons/Edit.svg'
              width={12}
              height={12}
              alt='edit logo'
            />
            แก้ไขโปรไฟล์
          </Button>
        </Link>
      </div>
      <div className='flex-1 flex justify-center my-10'>
        <div className='flex flex-col justify-center items-center'>
          <div className='bg-slate-200 w-[152px] h-[152px] rounded-full'>
            <Image src={`${data?.imageUrl}`} alt="logo profile" width={152} height={152}/>
          </div>
          <div className='my-5'>{data?.firstName} {data?.lastName}</div>
          <Form {...form}>
            <form className='flex flex-col gap-y-4 w-[584px]'>
              <FormField
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ชื่อเล่น</FormLabel>
                    <FormControl>
                      <Input
                        className='rounded-[20px]'
                        placeholder='ชื่อเล่นของฉัน'
                        {...field}
                        value={data?.nickName}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default MyProfile
