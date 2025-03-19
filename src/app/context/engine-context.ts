import type { SearchEngine } from "@coveo/headless";
import type { CommerceEngine } from "@coveo/headless/commerce";
import { createContext } from "react";

export const EngineContext = createContext<
  { commerceEngine: CommerceEngine; searchEngine: SearchEngine } | undefined
>(undefined);