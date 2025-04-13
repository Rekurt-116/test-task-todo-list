import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, MatCheckboxModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private http = inject(HttpClient);
  public todos: Todo[] = [];
  public todo!: Todo;

  constructor() {
    this.http.get<Todo[]>('/todo.json').subscribe((data) => {
      const saved = localStorage.getItem('todo-completed');
      const savedCompleted: Record<number, boolean> = saved
        ? JSON.parse(saved)
        : {};

      this.todos = data.map((todo) => ({
        ...todo,
        completed: savedCompleted[todo.id] ?? todo.completed,
      }));
    });
  }

  onToggleCompleted(todo: Todo) {
    const saved = localStorage.getItem('todo-completed');
    const savedCompleted: Record<number, boolean> = saved
      ? JSON.parse(saved)
      : {};

    savedCompleted[todo.id] = todo.completed;
    localStorage.setItem('todo-completed', JSON.stringify(savedCompleted));
  }
}
