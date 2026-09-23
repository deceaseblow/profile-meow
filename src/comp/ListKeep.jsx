import { useAppData } from "../context/AppDataContext";


function ListKeep() {
    const { data, loading } = useAppData();

    if (loading) return <p className="text-center mt-4">Loading list...</p>;

    return (
        <div>
            <h2 className="text-center text-black font-bold tracking-wider text-[25px] md:text-start">
                LIST OF THINGS TO KEEP IN MIND
            </h2>
            <div>
                {data?.listKeep && data.listKeep.length > 0 ? (
                    <ul className="list-disc list-inside space-y-2 pl-5 text-[16px] md:text-[18px] tracking-wide text-gray-800 mt-2">
                        {data.listKeep.map((item, index) => (
                            <li
                                key={index}
                                className="hover:text-black hover:translate-x-1 transition-all duration-200 text-[20px]"
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400 text-center italic mt-2 md:text-start">
                        No list available yet.
                    </p>
                )}
            </div>
        </div>
    );
}
export default ListKeep;