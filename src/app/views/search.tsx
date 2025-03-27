import React from 'react';
import { buildSearchBox as buildCommerceSearchBox } from "@coveo/headless/commerce";
import { buildSearchBox, buildTab } from "@coveo/headless";
import { SearchBox } from "../components/SearchBox/searchbox";
import { useEngineContext } from "../hooks/use-engine-context";

export function Search() {
  const { commerceEngine, searchEngine } = useEngineContext();
  
  // Create tab controllers for content search
  const allTabController = buildTab(searchEngine, { 
    options: { id: 'All', expression: '' } 
  });
  
  const articlesTabController = buildTab(searchEngine, { 
    options: { id: 'article', expression: '' } 
  });
  
  // Create search box controllers
  const commerceSearchBoxController = buildCommerceSearchBox(commerceEngine);
  const allSearchBoxController = buildSearchBox(searchEngine);
  const articlesSearchBoxController = buildSearchBox(searchEngine);
  
  return (
    <SearchBox
      commerceSearchBoxController={commerceSearchBoxController}
      allSearchBoxController={allSearchBoxController}
      articlesSearchBoxController={articlesSearchBoxController}
      allTabController={allTabController}
      articlesTabController={articlesTabController}
    />
  );
}