import pfpPic from "../assets/pixels/pfp.jpg";
import borderPfp from "../assets/borderPfp.png";
import gun from "../assets/pixels/gun.webp"
import smolBow from "../assets/pixels/smolBow.gif"
import wings from "../assets/pixels/wings.webp"
function Pfp() {
    return (
        <div className="flex justify-center items-center">
            <div className="relative">
                <img
                    src={borderPfp}
                    alt="Border"
                    className="w-25 h-25 md:w-40 md:h-40 absolute inset-0 z-10"
                />
                <img
                    src={pfpPic}
                    alt="Profile"
                    className="w-25 h-25 rounded-full p-2 md:w-40 md:h-40 "
                />
                <div className="absolute left-1/2 bottom-[-10px] transform -translate-x-1/2 z-20"> <img src={smolBow} alt="" /></div>
                <div className="absolute right-[0px] top-[15px] md:right-1 md:top-8 z-20"> <img src={gun} alt="" /></div>
                <div className="absolute left-1/2 top-[-10px] transform -translate-x-1/2 z-20"> <img src={wings} alt="" className="w-10"/></div>
            </div>
        </div>
    );
}

export default Pfp;