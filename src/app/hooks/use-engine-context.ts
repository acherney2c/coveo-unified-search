import { useContext } from "react";
import { EngineContext } from "../context/engine-context";

export const useEngineContext = () => {
  const context = useContext(EngineContext);
  if (!context) {
    throw new Error("useEngineContext must be used within an EngineProvider");
  }
  return context;
};