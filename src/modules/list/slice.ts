import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "store";

export interface Entry {
  id: string;
  name: string;
  done: boolean;
  requirements?: string;
}

interface Section {
  id: string;
  entryIds: string[];
  name: string;
}

export type NestedSection = Omit<Section, "entryIds"> & {
  entries: Entry[];
};

interface List {
  sectionIds: string[];
  sections: Record<string, Section>;
  entries: Record<string, Entry>;
}

interface NestedList {
  sections: Array<NestedSection>;
}

type ListState = List & {
  loaded: boolean;
}

const initialState: ListState = {
  loaded: false,
  sectionIds: [],
  sections: {},
  entries: {},
};

interface SetDoneBatch {
  entries: string[];
}

interface SetDone {
  id: string;
  done?: boolean;
}

export type JsonData = Array<
  Omit<NestedSection, "entries"> & {
    entries: Array<Omit<Entry, "done">>
  }
>;

const list = createSlice({
  name: "list",
  initialState,
  reducers: {
    setContents(draft, action: PayloadAction<JsonData>) {
      draft.sectionIds = [];
      draft.sections   = {};
      draft.entries    = {};

      for (const nestedSection of action.payload) {
        const section: Section = {
          entryIds: nestedSection.entries.map(entry => entry.id),
          name: nestedSection.name,
          id: nestedSection.id
        };

        draft.sectionIds.push(section.id);
        draft.sections[section.id] = section;

        for (const nestedEntry of nestedSection.entries) {
          const entry: Entry = {
            id: nestedEntry.id,
            name: nestedEntry.name,
            requirements: nestedEntry.requirements,
            done: false
          };

          draft.entries[entry.id] = entry;
        }
      }
    },

    setDoneBatch(draft, action: PayloadAction<SetDoneBatch>) {
      for (const id of action.payload.entries) {
        const entry = draft.entries[id];
        if (!entry) {
          continue;
        }
        entry.done = true;
      }
    },

    setLoaded(draft, action: PayloadAction<boolean>) {
      draft.loaded = action.payload;
    },

    setDone(draft, action: PayloadAction<SetDone>) {
      const entry = draft.entries[action.payload.id];
      if (!entry) {
        return;
      }

      entry.done = action.payload.done !== undefined
        ? action.payload.done
        : !entry.done;
    },
  }
});

const reducer = list.reducer;
export { reducer as list };
export const { setContents, setDoneBatch, setLoaded, setDone } = list.actions;

export const selectListData = createSelector(
  (root: RootState) => root.list.sectionIds,
  (root: RootState) => root.list.entries,
  (root: RootState) => root.list.sections,

  (sectionIds, entries, sections) => {
    return sectionIds.map(id => {
      const section: NestedSection = {
        id,
        name: sections[id].name,
        entries: sections[id].entryIds.map(id => {
          const entry: Entry = {
            id,
            name: entries[id].name,
            done: entries[id].done,
            requirements: entries[id].requirements,
          };

          return entry;
        })
      };

      return section;
    });
  }
);

export const LOAD_DATA = "list/loadData";
export const loadData = () => ({
  type: LOAD_DATA
} as const);

export const selectSectionsClearedCount = createSelector(
  (root: RootState) => root.list.sectionIds,
  (root: RootState) => root.list.sections,
  (root: RootState) => root.list.entries,

  (sectionIds, sections, entries) => {
    return sectionIds.reduce((acc, sectionId) => {
      const section = sections[sectionId];
      const currentEntries = section.entryIds.map(id => entries[id]);

      acc[sectionId] = {
        cleared: currentEntries.reduce((acc, value) => acc + (value.done ? 1 : 0), 0),
        all: currentEntries.length,
      };

      return acc;
    }, {} as Record<string, { cleared: number; all: number }>);
  }
);

export const selectClearedEntries = createSelector(
  (root: RootState) => root.list.sectionIds,
  (root: RootState) => root.list.sections,
  (root: RootState) => root.list.entries,

  (sectionIds, sections, entries) => {
    let result = [];
    for (let id of sectionIds) {
      let section = sections[id];
      for (let entryId of section.entryIds) {
        let entry = entries[entryId];
        if (entry.done) {
          result.push(entry.id);
        }
      }
    }

    return result;
  }
);

export const selectLoaded = (root: RootState) => root.list.loaded;
