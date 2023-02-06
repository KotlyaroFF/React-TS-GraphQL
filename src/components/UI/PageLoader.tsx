const PageLoader = () => (
  <div className="flex w-full items-center justify-center h-screen -mt-20">
    <div className="lds-grid inline-block relative w-20 h-20">
      <div
        className="absolute w-5 h-5 rounded-full bg-indigo-400 top-2 left-2 animate-loader"
        style={{
          animationDelay: "0ms",
        }}
      />
      <div
        className="absolute w-5 h-5 rounded-full bg-indigo-400 top-2 left-8 animate-loader"
        style={{
          animationDelay: "400ms",
        }}
      />
      <div
        className="absolute w-5 h-5 rounded-full bg-indigo-400 top-2 left-14 animate-loader"
        style={{
          animationDelay: "800ms",
        }}
      />
      <div
        className="absolute w-5 h-5 rounded-full bg-indigo-400 top-8 left-2 animate-loader"
        style={{
          animationDelay: "400ms",
        }}
      />
      <div
        className="absolute w-5 h-5 rounded-full bg-indigo-400 top-8 left-8 animate-loader"
        style={{
          animationDelay: "800ms",
        }}
      />
      <div
        className="absolute w-5 h-5 rounded-full bg-indigo-400 top-8 left-14 animate-loader"
        style={{
          animationDelay: "1200ms",
        }}
      />
      <div
        className="absolute w-5 h-5 rounded-full bg-indigo-400 top-14 left-2 animate-loader"
        style={{
          animationDelay: "800ms",
        }}
      />
      <div
        className="absolute w-5 h-5 rounded-full bg-indigo-400 top-14 left-8 animate-loader"
        style={{
          animationDelay: "1200ms",
        }}
      />
      <div
        className="absolute w-5 h-5 rounded-full bg-indigo-400 top-14 left-14 animate-loader"
        style={{
          animationDelay: "1600ms",
        }}
      />
    </div>
  </div>
);

export default PageLoader;
