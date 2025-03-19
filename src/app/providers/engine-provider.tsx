import React, { useState } from "react";
import {
  buildCommerceEngine,
  getSampleCommerceEngineConfiguration,
} from "@coveo/headless/commerce";
import {
  buildSearchEngine,
  getSampleSearchEngineConfiguration,
} from "@coveo/headless";
import { EngineContext } from "../context/engine-context";

export const EngineProvider = ({ children }: { children: any }) => {
  const [commerceEngine] = useState(
    buildCommerceEngine({
      configuration: getSampleCommerceEngineConfiguration(),
    })
  );

  const [searchEngine] = useState(
    buildSearchEngine({ configuration: getSampleSearchEngineConfiguration() })
  );
  const value = {
    commerceEngine,
    searchEngine,
  };

  return (
    <EngineContext.Provider value={value}>{children}</EngineContext.Provider>
  );
};