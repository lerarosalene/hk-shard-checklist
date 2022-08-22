import React from "react";
import { useSelector } from "react-redux";

import { selectListData, selectLoaded, selectSectionsClearedCount } from "modules/list/slice";
import { Section } from "./Section";

export function App() {
  const sections = useSelector(selectListData);
  const loaded = useSelector(selectLoaded);
  const counts = useSelector(selectSectionsClearedCount);

  return (
    <>
      {loaded && sections.map(section => (
        <Section
          counts={counts[section.id]}
          section={section}
          key={section.id}
        />
      ))}
    </>
  );
}
