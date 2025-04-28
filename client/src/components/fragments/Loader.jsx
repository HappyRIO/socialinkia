export default function Loader() {
  return (
    <div className="w-full h-screen flex justify-center items-center bg-[rgba(0,0,0,0.71)]">
      <div className="w-full h-full flex gap-4 flex-col justify-center items-center text-center">
        <div className="w-20 h-20 border-4 border-transparent text-accent text-4xl animate-spin flex items-center justify-center border-t-accent rounded-full">
          <div className="w-16 h-16 border-4 border-transparent text-primary text-2xl animate-spin flex items-center justify-center border-t-primary rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
