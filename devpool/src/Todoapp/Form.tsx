import { useState } from 'react'
const FormData = (props:any) => {
   const [data , setdata] = useState("")

   const handlerClick = () => {
      props.setstate([...props.state, data])
     setdata("")
   }

    return (
         <div className='flex justify-between items-center'>
          <div className='h-full flex justify-center items-center'>
            <input className="rounded-lg h-8 text-center border" type="text" onChange={(e) => setdata(e.target.value)} value={data} />
          </div>
          <button className='btn btn-success ms-2' onClick={() => handlerClick()}>ADD</button>
        </div>
    )


}

export default FormData;