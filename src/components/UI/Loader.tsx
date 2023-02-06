import { FC } from "react";

const Loader: FC<{ className?: string }> = ({ className }) => (
  <div className={className ?? "w-10 h-10 flex justify-center items-center"}>
    <div
      className="box-border block absolute  w-8 h-8 m-2 border-4 border-solid
    border-b-indigo-600  rounded-full animate-spin"
      style={{
        borderColor: "#fff transparent transparent transparent",
      }}
    />
    <div
      className="box-border block absolute w-8 h-8 m-2 border-4 border-solid
    border-b-indigo-600 rounded-full animate-spin"
      style={{
        borderColor: "#fff transparent transparent transparent",
        animationDelay: "-0.45s",
      }}
    />
    <div
      className="box-border block absolute w-8 h-8 m-2 border-4 border-solid
    border-b-indigo-600 rounded-full animate-spin"
      style={{
        borderColor: "#fff transparent transparent transparent",
        animationDelay: "-0.3s",
      }}
    />
    <div
      className="box-border block absolute w-8 h-8 m-2 border-4 border-solid
    border-b-indigo-600 rounded-full animate-spin"
      style={{
        borderColor: "#fff transparent transparent transparent",
        animationDelay: "-0.15s",
      }}
    />
  </div>
);

export default Loader;
