import React, { useCallback } from 'react';
import cn from 'classnames';
import { useDispatch } from 'react-redux';

import { Entry as IEntry, setDone } from "modules/list/slice";

interface Props {
  entry: IEntry;
  index: number;
}

export function Entry(props: Props) {
  const { entry, index } = props;
  const { id } = entry;
  const dispatch = useDispatch();

  const handleRowClick = useCallback(() => {
    dispatch(setDone({ id }));
  }, [dispatch, id]);
  
  const handleCheckboxChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setDone({ id, done: evt.target.checked }));
    evt.stopPropagation();
  }, [dispatch, id]);

  return (
    <tr className={cn(entry.done && "row-cleared")} onClick={handleRowClick}>
      <td>
        <input type="checkbox" checked={entry.done} onChange={handleCheckboxChange} />
      </td>
      <td>{index + 1}</td>
      <td colSpan={entry.requirements ? undefined : 2}>{entry.name}</td>
      {entry.requirements ? <td>{entry.requirements}</td> : null}
    </tr>
  );
}
