import { Assignment, Submission } from '../types';
import { store } from './storeService';

export const assignmentService = {
  listAssignments(classId?: string): Assignment[] {
    return store.getAssignments(classId);
  },

  listAssignmentsByClass(classId: string): Assignment[] {
    return this.listAssignments(classId);
  },

  createAssignment(data: Omit<Assignment, 'id' | 'createdAt' | 'submissionsCount'>): Assignment {
    const item: Assignment = {
      ...data,
      id: 'assign_' + Date.now(),
      submissionsCount: 0,
      createdAt: new Date().toISOString(),
    };
    store.saveAssignment(item);
    return item;
  },

  updateAssignment(id: string, data: Partial<Assignment>): Assignment {
    const all = store.getAssignments();
    const existing = all.find((a) => a.id === id);
    if (!existing) throw new Error('تکلیف یافت نشد');
    const updated = { ...existing, ...data };
    store.saveAssignment(updated);
    return updated;
  },

  deleteAssignment(id: string): void {
    store.deleteAssignment(id);
  },

  listSubmissions(assignmentId: string): Submission[] {
    return store.getSubmissions(assignmentId);
  },

  gradeSubmission(id: string, score: number, feedback: string): void {
    store.gradeSubmission(id, score, feedback);
  },

  submitAssignment(data: Omit<Submission, 'id' | 'submittedAt'>): Submission {
    const submission: Submission = {
      ...data,
      id: 'sub_' + Date.now(),
      submittedAt: new Date().toISOString(),
    };
    // update submissions
    const all = store.getSubmissions(data.assignmentId);
    all.push(submission);
    // increment assignment count
    const assignment = store.getAssignments().find((a) => a.id === data.assignmentId);
    if (assignment) {
      assignment.submissionsCount += 1;
      store.saveAssignment(assignment);
    }
    return submission;
  },
};
