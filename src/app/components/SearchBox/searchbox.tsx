import React, { useEffect, useState, useCallback } from "react";
import debounce from "lodash/debounce";
import { type SearchBox as CommerceSearchBoxController } from "@coveo/headless/commerce";
import { type SearchBox as SearchBoxController, type Tab as TabController } from "@coveo/headless";

export function SearchBox({
  commerceSearchBoxController,
  allSearchBoxController,
  articlesSearchBoxController,
  allTabController,
  articlesTabController,
}: {
  commerceSearchBoxController: CommerceSearchBoxController;
  allSearchBoxController: SearchBoxController;
  articlesSearchBoxController: SearchBoxController;
  allTabController: TabController;
  articlesTabController: TabController;
}) {
  const [commerceSearchBoxState, setCommerceSearchBoxState] = useState(
    commerceSearchBoxController.state
  );
  const [allSearchBoxState, setAllSearchBoxState] = useState(
    allSearchBoxController.state
  );
  const [articlesSearchBoxState, setArticlesSearchBoxState] = useState(
    articlesSearchBoxController.state
  );



  useEffect(() => {
    commerceSearchBoxController.subscribe(() =>
      setCommerceSearchBoxState({ ...commerceSearchBoxController.state })
    );
  }, [commerceSearchBoxController]);

  useEffect(() => {
    allSearchBoxController.subscribe(() =>
      setAllSearchBoxState({ ...allSearchBoxController.state })
    );
  }, [allSearchBoxController]);

  useEffect(() => {
    articlesSearchBoxController.subscribe(() =>
      setArticlesSearchBoxState({ ...articlesSearchBoxController.state })
    );
  }, [articlesSearchBoxController]);

  const [inputValue, setInputValue] = useState(commerceSearchBoxState.value);

  // Debounced function to update search controllers and show suggestions
  const updateSearchAndShowSuggestions = async (value: string) => {
    // Update commerce search first
    commerceSearchBoxController.updateText(value);
    await commerceSearchBoxController.showSuggestions();

    // Switch to "All" tab and update
    allTabController.select();
    allSearchBoxController.updateText(value);
    await allSearchBoxController.showSuggestions();

    // Switch to "Articles" tab and update
    articlesTabController.select();
    articlesSearchBoxController.updateText(value);
    await articlesSearchBoxController.showSuggestions();

    // Return to "All" tab as default
    allTabController.select();
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      updateSearchAndShowSuggestions(value);
    }, 300),
    [commerceSearchBoxController, allSearchBoxController, articlesSearchBoxController, allTabController, articlesTabController]
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    debouncedSearch(newValue);
  };

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      // Use the commerce search box for submitting searches
      commerceSearchBoxController.submit();
    }
  };

  const handleSuggestionClick = (
    value: string,
    type: "products" | "all" | "articles",
  ) => {
    setInputValue(value);
    // Update text in all controllers to keep them in sync
    commerceSearchBoxController.updateText(value);
    allSearchBoxController.updateText(value);
    articlesSearchBoxController.updateText(value);

    // Handle selection based on type
    switch(type) {
      case "products":
        commerceSearchBoxController.selectSuggestion(value);
        break;
      case "all":
        allTabController.select();
        allSearchBoxController.selectSuggestion(value);
        break;
      case "articles":
        articlesTabController.select();
        articlesSearchBoxController.selectSuggestion(value);
        break;
    }
  };

  return (
    <div>
      <div>
        <input
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder="Search"
          type="search"
          value={inputValue}
        />
      </div>
      <div>
        {commerceSearchBoxState.suggestions.length > 0 && (
          <div>
            <label htmlFor="product-suggestions">
              <b>Products</b>
            </label>
            <ul id="product-suggestions">
              {commerceSearchBoxState.suggestions.map((suggestion) => (
                <li key={suggestion.rawValue}>
                  <button
                    onClick={() =>
                      handleSuggestionClick(suggestion.rawValue, "products")
                    }
                  >
                    {suggestion.rawValue}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {allSearchBoxState.suggestions.length > 0 && (
          <div>
            <label htmlFor="all-suggestions">
              <b>All</b>
            </label>
            <ul id="all-suggestions">
              {allSearchBoxState.suggestions.map((suggestion) => (
                <li key={suggestion.rawValue}>
                  <button
                    onClick={() =>
                      handleSuggestionClick(suggestion.rawValue, "all")
                    }
                  >
                    {suggestion.rawValue}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {articlesSearchBoxState.suggestions.length > 0 && (
          <div>
            <label htmlFor="articles-suggestions">
              <b>Articles</b>
            </label>
            <ul id="articles-suggestions">
              {articlesSearchBoxState.suggestions.map((suggestion) => (
                <li key={suggestion.rawValue}>
                  <button
                    onClick={() =>
                      handleSuggestionClick(suggestion.rawValue, "articles")
                    }
                  >
                    {suggestion.rawValue}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}