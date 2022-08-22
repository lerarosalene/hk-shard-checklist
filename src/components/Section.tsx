import React from 'react';
import { useSelector } from 'react-redux';
import { NestedSection, selectSectionsClearedCount } from 'modules/list/slice';
import { Entry } from './Entry';

interface Props {
  section: NestedSection;
  counts: {
    cleared: number;
    all: number;
  }
}

export function Section(props: Props) {
  const { section, counts } = props;

  return (
    <>
      <h1>{section.name} ({counts.cleared}/{counts.all})</h1>
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
