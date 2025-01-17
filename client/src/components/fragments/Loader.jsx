export default function Loader() {
  return (
    <div className="w-full h-screen flex justify-center items-center bg-[rgba(0,0,0,0.71)]">
      <div className="w-full h-full flex gap-4 flex-col justify-center items-center text-center">
        {/* <p>LOADING.....</p> */}
        <div className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
          <div className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
