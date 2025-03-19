import React from 'react';
import type { Route } from "./+types/home";
import { EngineProvider } from "../providers/engine-provider";
import { Search } from "../views/search";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Multi Use Case SearchBox" },
    { name: "description", content: "Headless + React Multi Use Case SearchBox Sample" },
  ];
}

export default function Home() {
  return (
    <EngineProvider>
      <Search />
    </EngineProvider>
  );
}