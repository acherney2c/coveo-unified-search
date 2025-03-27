import React, { useEffect, useState } from "react";
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

  const showSuggestions = () => {
    // Show product suggestions
    commerceSearchBoxController.showSuggestions();
    
    // Select "All" tab before showing all content suggestions
    allTabController.select();
    allSearchBoxController.showSuggestions();
    
    // Select "articles" tab before showing article suggestions
    articlesTabController.select();
    articlesSearchBoxController.showSuggestions();
    
    // Revert to "All" tab as default
    allTabController.select();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    commerceSearchBoxController.updateText(newValue);
    allSearchBoxController.updateText(newValue);
    articlesSearchBoxController.updateText(newValue);
    showSuggestions();
  };

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