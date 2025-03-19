import React, { useEffect, useState } from "react";
import { type SearchBox as CommerceSearchBoxController } from "@coveo/headless/commerce";
import { type SearchBox as SearchBoxController } from "@coveo/headless";

type Scope = "products" | "knowledge";

export function SearchBox({
  commerceSearchBoxController,
  searchBoxController,
}: {
  commerceSearchBoxController: CommerceSearchBoxController;
  searchBoxController: SearchBoxController;
}) {
  const [commerceSearchBoxState, setCommerceSearchBoxState] = useState(
    commerceSearchBoxController.state
  );
  const [searchBoxState, setSearchBoxState] = useState(
    searchBoxController.state
  );

  const [scope, setScope] = useState<Scope>("products");

  useEffect(() => {
    commerceSearchBoxController.subscribe(() =>
      setCommerceSearchBoxState({ ...commerceSearchBoxController.state })
    );
  }, [commerceSearchBoxController]);

  useEffect(() => {
    searchBoxController.subscribe(() =>
      setSearchBoxState({ ...searchBoxController.state })
    );
  }, [searchBoxController]);

  const [inputValue, setInputValue] = useState(commerceSearchBoxState.value);

  const showSuggestions = () => {
    commerceSearchBoxController.showSuggestions();
    searchBoxController.showSuggestions();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    commerceSearchBoxController.updateText(newValue);
    searchBoxController.updateText(newValue);
    showSuggestions();
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "Enter":
        scope === "products"
          ? commerceSearchBoxController.submit()
          : searchBoxController.submit();
        break;
      default:
        break;
    }
  };

  const handleSuggestionClick = (
    value: string,
    type: Scope,
  ) => {
    setInputValue(value);
    commerceSearchBoxController.updateText(value);
    searchBoxController.updateText(value);

    type === "products"
      ? commerceSearchBoxController.selectSuggestion(value)
      : searchBoxController.selectSuggestion(value);
  };

  return (
    <div>
      <div>
        <select
          name="scope"
          onChange={(e) => setScope(e.target.value as Scope)}
        >
          <optgroup label="Search scope">
            <option value={"products" as Scope}>Products</option>
            <option value={"knowledge" as Scope}>Knowledge</option>
          </optgroup>
        </select>
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
              <b>Product suggestions</b>
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
        {searchBoxState.suggestions.length > 0 && (
          <div>
            <label htmlFor="knowledge-suggestions">
              <b>Knowledge suggestions</b>
            </label>
            <ul id="knowledge-suggestions">
              {searchBoxState.suggestions.map((suggestion) => (
                <li key={suggestion.rawValue}>
                  <button
                    onClick={() =>
                      handleSuggestionClick(suggestion.rawValue, "knowledge")
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