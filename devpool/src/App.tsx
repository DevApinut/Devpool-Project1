
import './App.css'
import ClearData from './Todoapp/ClearData'
import FormData from './Todoapp/Form'
import ShowData from './Todoapp/Show'
import { useState } from 'react'

function App() {
  const [list, setList] = useState<string[]>([]);

  return (
    <>
      <div className='border rounded-lg p-4'>
        <div className='text-2xl my-4'>
          ToDo app
        </div>
       <FormData state = {list}  setstate ={setList}/>
       {list.length > 0 && <ShowData state = {list} setstate ={setList}/> }
       <ClearData state = {list} setstate ={setList}/>
      </div>
    </>
  )
}

export default App
