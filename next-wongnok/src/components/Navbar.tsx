import Image from "next/image"
const Navbar = () =>{
    return(
        <div className="flex justify-between mx-[220px]">
            <Image src="/wongnok-with-name-logo.png"  width={182} height={49} alt="logo-navbar"/>
            <div className="flex justify-center items-center">
                <Image src="/vector.png" width={24} height={24} color="black" alt="logo-login"/>
                <div className="ms-2 ">
                    เข้าระบบ
                </div>
            </div>
        </div>
    )


}

export default Navbar 