export default function Error() {
  return (
    <div className="w-full h-screen flex justify-center items-center p-2">
      <div className="w-fit">
        <div className="img w-full">
          <img className="w-full max-w-[300px]" src="/images/nav.png" alt="" />
        </div>
        <div className="w-full text-center flex flex-col justify-center items-center">
          <p>kindly get back to the main page</p>
          <button className="bg-accent rounded-lg p-2 px-3">
            click to get back
          </button>
        </div>
      </div>
    </div>
  );
}
