import React from 'react';
import { useSelector } from 'react-redux';
import { NestedSection, selectSectionsClearedCount } from 'modules/list/slice';
import { Entry } from './Entry';

interface Props {
  section: NestedSection
}

export function Section(props: Props) {
  const { section } = props;
  const counts = useSelector(selectSectionsClearedCount);

  return (
    <>
      <h1>{section.name} ({counts[section.id].cleared}/{counts[section.id].all})</h1>
      <table>
        <thead>
          <th colSpan={2}>№</th>
          <th>Источник</th>
          <th>Требования</th>
        </thead>
        <tbody>
          {section.entries.map((entry, index) => (
            <Entry entry={entry} key={entry.id} index={index} />
          ))}
        </tbody>
      </table>
    </>
  );
}
