import { useAppData } from "../context/AppDataContext";
import { FaGithub, FaPinterest } from "react-icons/fa";
import { SiCarrd } from "react-icons/si";
const fontStyle = {
  fontFamily: "'antsValley', sans-serif"
};
const iconMap = {
  FaGithub: <FaGithub className="text-2xl hover:text-purple-800 transition" />,
  FaPinterest: <FaPinterest className="text-2xl hover:text-red-600 transition" />,
  FaCarrd: <SiCarrd className="text-2xl hover:text-blue-500 transition" />,
};
function Socials() {
     const { data, loading } = useAppData();
    
      if (loading) return <p className="text-center mt-4">Loading list...</p>;
    
    return (
        <div>
            <div>
                <h1 className="text-[24px] font-semibold">Socials</h1>
            </div>
            <div className="flex gap-6 flex-wrap justify-center md:justify-start">
                {data?.socials && data.socials.length > 0 ? (
                    data.socials.map((social, index) => (
                        <div className="flex flex-col items-center">
                            <a
                                key={index}
                                href={social.link.startsWith("http") ? social.link : `https://${social.link}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2"
                            >
                                <span className="text-xl">{iconMap[social.icon]}</span>
                            </a>
                            <span className="text-lg font-medium">{social.platform}</span>
                        </div>

                    ))
                ) : (
                    <p className="text-gray-400 italic">No socials available.</p>
                )}
            </div></div>
    );
}
export default Socials;