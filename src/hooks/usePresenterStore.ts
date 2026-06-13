import { useState, useEffect } from 'react';

export interface AppState {
  students: string[];
  secretQueue: string[];
}

const STORAGE_KEY = 'presenter_app_data';

export const usePresenterStore = () => {
  const [state, setState] = useState<AppState>({
    students: [],
    secretQueue: [],
  });

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse storage', e);
      }
    }
  }, []);

  // Save to local storage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addStudent = (name: string) => {
    if (!name.trim() || state.students.includes(name.trim())) return;
    setState(prev => ({ ...prev, students: [...prev.students, name.trim()] }));
  };

  const addStudentsBulk = (namesStr: string) => {
    const names = namesStr.split(/[\n,]+/).map(n => n.trim()).filter(n => n && !state.students.includes(n));
    if (names.length > 0) {
      setState(prev => ({ ...prev, students: [...prev.students, ...names] }));
    }
  };

  const removeStudent = (name: string) => {
    setState(prev => ({
      ...prev,
      students: prev.students.filter(s => s !== name),
      secretQueue: prev.secretQueue.filter(s => s !== name)
    }));
  };

  const clearStudents = () => {
    setState(prev => ({ ...prev, students: [], secretQueue: [] }));
  };

  const setSecretQueue = (queue: string[]) => {
    setState(prev => ({ ...prev, secretQueue: queue }));
  };

  // Logic to pick a presenter, considering the secret queue
  const pickPresenters = (count: number): string[] => {
    const picked: string[] = [];
    const newSecretQueue = [...state.secretQueue];
    const availableStudents = state.students.filter(s => !newSecretQueue.slice(0, count).includes(s));

    // First take from secret queue
    while (picked.length < count && newSecretQueue.length > 0) {
      const secretStudent = newSecretQueue.shift();
      if (secretStudent && state.students.includes(secretStudent)) {
        picked.push(secretStudent);
      }
    }

    // Fill the rest randomly
    const shuffled = [...availableStudents].sort(() => 0.5 - Math.random());
    while (picked.length < count && shuffled.length > 0) {
      picked.push(shuffled.shift()!);
    }

    // Update the secret queue after picking
    setState(prev => ({ ...prev, secretQueue: newSecretQueue }));

    return picked;
  };

  return {
    state,
    addStudent,
    addStudentsBulk,
    removeStudent,
    clearStudents,
    setSecretQueue,
    pickPresenters
  };
};
