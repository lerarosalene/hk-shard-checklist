import React from "react";
import { useSelector } from "react-redux";

import { selectListData } from "modules/list/slice";
import { Section } from "./Section";

export function App() {
  const sections = useSelector(selectListData);

  return (
    <>
      {sections.map(section => (
        <Section section={section} key={section.id} />
      ))}
    </>
  );
}
