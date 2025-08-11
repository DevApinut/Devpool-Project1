const ClearData = (props:any) => {
    const handleClear = () => {
        props.setstate([]);
    }
    return (
        <div className='flex justify-between items-center my-2'>
            <div className='ms-1'>total : {props.state.length}</div>
            <button className='btn btn-danger' onClick={handleClear}> Clear all</button>
        </div>
    )
}

export default ClearData;
