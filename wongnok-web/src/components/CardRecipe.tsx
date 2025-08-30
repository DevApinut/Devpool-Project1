import { CardRecipeProps } from "@/app/page";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent, CardFooter } from "./ui/card";
import Image from 'next/image'

const CardRecipe = ({
  name,
  imageUrl,
  description,
  difficulty,
  cookingDuration,
  user,
}: CardRecipeProps) => (
  <Card className='w-[276px] h-[390px]'>
    <div>
      <div className='h-[158px] relative rounded-t-lg pb-4'>
        <Image src={imageUrl} alt={`${name} image`} fill objectFit='cover' />
      </div>
      <div>
        <CardContent>
          <div className="flex justify-between"> 
            <h1 className='font-bold'>{name}</h1>
            <Image src='icons/notfav.svg' width={20} height={20} alt='not fav'/>
          </div>         
          <p className='text-secondary line-clamp-3'>{description}</p>
        </CardContent>
      </div>
    </div>

    <div>
      <CardFooter>
        <div className='flex w-full item-center'>
          <div className='flex p-1 grow'>
            <Image src='/icons/level.svg' alt='av timer' width={14} height={14}/>
            <p>{difficulty.name}</p>
          </div>
          <div className='flex p-1 grow'>
            <Image src='/icons/av_timer.svg' alt='level' width={14} height={14}/>
            <p>{cookingDuration.name}</p>
          </div>
        </div>
        <div>
          <Avatar>
            <AvatarImage src='https://github.com/shadcn.png' />
            <AvatarFallback>{user.firstName}</AvatarFallback>
            <div>test</div>
          </Avatar>
        </div>
      </CardFooter>
    </div>
  </Card>
)

export default CardRecipe