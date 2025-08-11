const ShowData = (props: any) => {

    const handlerDelete = (index: number) => {
        const newList = [...props.state];
        newList.splice(index, 1);
        props.setstate(newList);    
    }
    

    return (
        props.state.map((item: string,index :number) => (
            <div className=' border flex justify-between items-center my-1 p-2 rounded-lg'>
            <div>{item}</div>
            <button className='btn btn-danger' onClick={() => {handlerDelete(index)}} >X</button>
        </div>
        ))
        
    )

}

export default ShowData;