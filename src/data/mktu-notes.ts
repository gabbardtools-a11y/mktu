export interface MktuNotes {
  explanation: string;
  includes: string[];
  excludes: string[];
}

// Notes data is loaded from mktu-notes.json
import notesData from "./mktu-notes.json";

export const mktuNotes: Record<string, MktuNotes> = notesData as Record<string, MktuNotes>;

export function getNotes(classId: number): MktuNotes | null {
  return mktuNotes[String(classId)] ?? null;
}
