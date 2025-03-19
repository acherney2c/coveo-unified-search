import React from 'react';
import { buildSearchBox as buildCommerceSearchBox } from "@coveo/headless/commerce";
import { buildSearchBox as buildSearchBox } from "@coveo/headless";
import { SearchBox } from "../components/SearchBox/searchbox";
import { useEngineContext } from "../hooks/use-engine-context";

export function Search() {
  const { commerceEngine, searchEngine } = useEngineContext();
  const commerceSearchBoxController = buildCommerceSearchBox(commerceEngine);
  const searchBoxController = buildSearchBox(searchEngine);
  return (
    <SearchBox
      commerceSearchBoxController={commerceSearchBoxController}
      searchBoxController={searchBoxController}
    />
  );
}