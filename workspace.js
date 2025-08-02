const recieve=(a,b) => {
  let string = ""
  b.map((data, index) => {
    string = string.concat(a[data])
  })

  return string
}

console.log(recieve('abcd',[0,3,2,1]))


