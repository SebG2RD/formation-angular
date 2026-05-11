import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';

const STORAGE_KEY = 'todoapp-tasks';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasks: Task[] = [
    { id: 1, title: 'Apprendre Angular', done: false, createdAt: new Date() },
    { id: 2, title: 'Construire la TodoList', done: false, createdAt: new Date() },
  ];

  private tasksSubject = new BehaviorSubject<Task[]>(this.tasks);

  constructor() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        this.tasks = JSON.parse(saved).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
        }));
        this.tasksSubject.next(this.tasks);
      } catch {
        this.save();
      }
    }
  }

  getTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  addTask(title: string): void {
    if (!title.trim()) return;
    const newTask: Task = {
      id: Date.now(),
      title: title.trim(),
      done: false,
      createdAt: new Date(),
    };
    this.tasks = [...this.tasks, newTask];
    this.save();
    this.tasksSubject.next(this.tasks);
  }

  toggleTask(id: number): void {
    this.tasks = this.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    this.save();
    this.tasksSubject.next(this.tasks);
  }

  deleteTask(id: number): void {
    this.tasks = this.tasks.filter((t) => t.id !== id);
    this.save();
    this.tasksSubject.next(this.tasks);
  }

  clearCompleted(): void {
    this.tasks = this.tasks.filter((t) => !t.done);
    this.save();
    this.tasksSubject.next(this.tasks);
  }

  private save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks));
  }
}
