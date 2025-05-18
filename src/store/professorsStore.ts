import { createStore } from "@/store/store";
import { Professor } from "@/types/user";

interface ProfessorsState {
  professors: Professor[] | null;
  selectedProfessor: Professor | null;
  setProfessors: (professors: Professor[] | null) => void;
  setSelectedProfessor: (professor: Professor | null) => void;
  clearProfessors: () => void;
  clearSelectedProfessor: () => void;
}

/**
 * 교수 목록 관리 스토어
 */
export const useProfessorsStore = createStore<ProfessorsState>(set => ({
  professors: null,
  selectedProfessor: null,
  setProfessors: (professors: Professor[] | null) => set({ professors }),
  setSelectedProfessor: (professor: Professor | null) => set({ selectedProfessor: professor }),
  clearProfessors: () => set({ professors: null }),
  clearSelectedProfessor: () => set({ selectedProfessor: null }),
}));
