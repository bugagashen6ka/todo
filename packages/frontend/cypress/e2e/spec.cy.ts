import { Title } from '@angular/platform-browser';
import { environment } from '../../src/environments/environment';

describe('Todos', () => {
  const subTask = {
    title: 'first subTask',
    id: '111',
  };

  const addedSubTask = {
    title: 'second subTask',
    id: '222',
  };

  const tasks = [
    {
      id: '123',
      title: 'First Todo',
      description: 'First Todo Description',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subTasks: [],
    },
    {
      id: '456',
      title: 'Second Todo',
      description: 'Second Todo Description',
      completed: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subTasks: [subTask],
    },
  ];

  const addedTask = {
    id: '333',
    title: 'Third Todo',
    description: 'Third Todo Description',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subTasks: [],
  };

  const updatedTitle = 'Updated Title';
  const updatedDescription = 'Updated Description';
  beforeEach(() => {
    cy.intercept(
      {
        method: 'GET',
        url: environment.apiUrl + '/tasks',
      },
      {
        body: tasks,
      },
    )
      .intercept(
        {
          method: 'POST',
          url: environment.apiUrl + '/tasks',
        },
        {
          body: addedTask,
        },
      )
      .intercept(
        {
          method: 'PUT',
          url: environment.apiUrl + '/tasks',
        },
        {
          body: {
            ...tasks[0],
            title: updatedTitle,
            description: updatedDescription,
            completed: !tasks[0].completed,
          },
        },
      )
      .intercept(
        {
          method: 'DELETE',
          url: `${environment.apiUrl}/tasks/${addedTask.id}`,
        },
        {
          body: { deleted: 1 },
        },
      )
      .intercept(
        {
          method: 'PATCH',
          url: `${environment.apiUrl}/tasks/${tasks[1].id}/subtask`,
        },
        {
          body: [subTask, addedSubTask],
        },
      )
      .intercept(
        {
          method: 'DELETE',
          url: `${environment.apiUrl}/tasks/subtask`,
        },
        {
          body: { deleted: 1 },
        },
      );
    //Start each test from home page
    cy.visit('/');
  });
  it('Visits the initial project page', () => {
    cy.contains('Lean Todos');
  });

  it('renders all todo tasks', () => {
    cy.get('[data-cy="tasks"]').should('have.length', tasks.length);
  });

  it('renders title correctly', () => {
    cy.get('[data-cy="taskTitle"]').eq(0).should('contain.text', tasks[0].title);
    cy.get('[data-cy="taskTitle"]').eq(1).should('contain.text', tasks[1].title);
  });

  it('renders description correctly', () => {
    cy.get('[data-cy="taskDescription"]').eq(0).should('contain.text', tasks[0].description);
    cy.get('[data-cy="taskDescription"]').eq(1).should('contain.text', tasks[1].description);
  });

  it('renders completed state correctly', () => {
    cy.get('[data-cy="toggle"]').eq(0).should('not.be.checked');
    cy.get('[data-cy="toggle"]').eq(1).should('be.checked');
  });

  it('adds new task', () => {
    cy.get('[data-cy="newTaskTitle"]').type(`${addedTask.title}`);
    cy.get('[data-cy="newDescription"]').type(`${addedTask.description}{enter}`);
    cy.get('[data-cy="tasks"]').should('have.length', tasks.length + 1);
    cy.get('[data-cy="tasks"]').eq(0).should('contain.text', tasks[0].title);
    cy.get('[data-cy="tasks"]').eq(1).should('contain.text', tasks[1].title);
    cy.get('[data-cy="tasks"]').eq(2).should('contain.text', addedTask.title);
  });

  it('chahges title of a task ', () => {
    cy.get('[data-cy="tasks"]').eq(0).should('contain.text', tasks[0].title);
    cy.get('[data-cy="taskTitle"]').eq(0).click();

    cy.get('[data-cy="editTitle"]').eq(0).type(`${updatedTitle}{enter}`);

    cy.get('[data-cy="tasks"]').eq(0).should('contain.text', updatedTitle);
  });

  it('chahges description of a task ', () => {
    cy.get('[data-cy="tasks"]').eq(0).should('contain.text', tasks[0].description);
    cy.get('[data-cy="taskDescription"]').eq(0).click();

    cy.get('[data-cy="editDescription"]').eq(0).type(`${updatedDescription}{enter}`);

    cy.get('[data-cy="tasks"]').eq(0).should('contain.text', updatedDescription);
  });

  it('toggles completeion state of a task', () => {
    cy.get('[data-cy="toggle"]').eq(0).should('not.be.checked');
    cy.get('[data-cy="toggle"]').eq(0).check();
    cy.get('[data-cy="toggle"]').eq(0).should('be.checked');
  });

  it('deletes a task', () => {
    cy.get('[data-cy="newTaskTitle"]').type(`${addedTask.title}`);
    cy.get('[data-cy="newDescription"]').type(`${addedTask.description}{enter}`);
    cy.get('[data-cy="tasks"]').should('have.length', 3);
    cy.get('[data-cy="deleteTaskButton"]').eq(2).click();

    cy.get('[data-cy="tasks"]').should('have.length', 2);
  });

  it('renders subTasks', () => {
    cy.get('[data-cy="subtasks"]').eq(1).click();
    cy.get('[data-cy="showTitle"]').eq(0).should('contain.text', tasks[1].subTasks[0].title);
  });

  it('adds new subTask', () => {
    cy.get('[data-cy="subtasks"]').eq(1).click();
    cy.get('[data-cy="newTitle"]').type('foo{enter}');
    cy.get('[data-cy="subTasks"]').should('have.length', tasks[1].subTasks.length + 1);
    cy.get('[data-cy="subTasks"]').eq(0).should('contain.text', tasks[1].subTasks[0].title);
    cy.get('[data-cy="subTasks"]').eq(1).should('contain.text', addedSubTask.title);
  });

  it('deletes a subTask', () => {
    cy.get('[data-cy="subtasks"]').eq(1).click();
    cy.get('[data-cy="deleteButton"]').eq(0).click();
    cy.get('[data-cy="subTasks"]').should('have.length', 1);
  });
});
