import PuffLoader from "react-spinners/PuffLoader";

export const PuffLoaderComponent = ()=>{
    return (
        <div className="flex justify-center">
            <div className="bg-black text-white p-5 rounded-lg shadow-lg w-96 h-96 flex flex-col justify-center items-center">
              <p className="text-lg font-semibold mb-2 text-center">
                Searching for nearby drivers
              </p>
              <PuffLoader size={90} color="#FFFFFF" />
            </div>
        </div>
    )
}