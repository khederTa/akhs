/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";

interface RowIdState {
  selectedRowsIds: number[];
  backup: number[];
  setSelectedRowsIds: (value: number[]) => void;
  setBackup: (value: number[]) => void;
}

const useRowStore = create<RowIdState>((set) => ({
  selectedRowsIds: [],
  backup: [],
  setSelectedRowsIds: (value) =>
    set((_state) => ({
      selectedRowsIds: [...value], // Ensure state immutability
    })),
  setBackup: (value) =>
    set((_state) => ({
      backup: [...value], // Maintain a clean backup state
    })),
}));

export { useRowStore };
