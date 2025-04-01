import PocketBase from "pocketbase";
import type { Todo, TodoFilter, TodoSortOption, User } from './types/types';
import { useRuntimeConfig } from 'nuxt/app';

/**
 * Custom error class for API-related errors
 * Extends the standard Error class with a statusCode property
 */
class ApiError extends Error {
  statusCode: string;

  /**
   * Creates a new ApiError instance
   * @param message - Error message
   * @param statusCode - HTTP status code of the error
   */
  constructor(message: string, statusCode: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

/**
 * Service class for handling todo records with PocketBase
 * Provides methods for CRUD operations on todos
 */
export class RecordService {
  private pb: PocketBase;
  private CONFIG: {
    POCKETBASE_URL: string;
    COLLECTION_NAME: string;
    PAGE_SIZE: number;
  };

  constructor() {
    // Get runtime config from Nuxt
    const runtimeConfig = useRuntimeConfig();

    this.CONFIG = {
      POCKETBASE_URL: runtimeConfig.public.pocketbaseUrl as string,
      COLLECTION_NAME: 'todos',
      PAGE_SIZE: 100
    };

    console.log(`LOG: Initializing with PocketBase URL: ${this.CONFIG.POCKETBASE_URL}`);

    // Initialize PocketBase client
    this.pb = new PocketBase(this.CONFIG.POCKETBASE_URL);
  }

  /**
   * Fetches todos based on filter and sort options
   * @param filter - Filter to apply to todos (default: 'all')
   * @param sort - Sort option to apply (default: 'date-desc')
   * @returns Promise with array of todos or null on error
   */
  async fetchTodos(filter: TodoFilter = 'all', sort: TodoSortOption = 'date-desc'): Promise<Todo[] | null> {
    console.log(`LOG: Fetching todos with filter='${filter}' and sort='${sort}'`);

    try {
      const records = await this.pb.collection(this.CONFIG.COLLECTION_NAME).getList(1, this.CONFIG.PAGE_SIZE, {
        filter: this.getFilterQuery(filter),
        sort: this.getSortQuery(sort),
      });

      console.log(`LOG: Successfully fetched ${records.items.length} todos`);
      // Map the items to Todo objects
      return records.items.map(item => item as unknown as Todo);
    } catch (error) {
      this.handleError('fetchTodos', error);
      return null;
    }
  }

  /**
   * Fetches a single todo by ID
   * @param id - ID of the todo to fetch
   * @returns Promise with the todo or null on error
   */
  async fetchTodo(id: string): Promise<Todo | null> {
    console.log(`LOG: Fetching todo with id='${id}'`);

    try {
      const record = await this.pb.collection(this.CONFIG.COLLECTION_NAME).getOne(id, {
        expand: 'sharedWith',
      });

      console.log(`LOG: Successfully fetched todo with id='${id}'`);
      return record as unknown as Todo;
    } catch (error) {
      this.handleError('fetchTodo', error);
      return null;
    }
  }

  /**
   * Creates a new todo
   * @param todo - Todo data without system fields
   * @returns Promise with the created todo or null on error
   */
  async createTodo(todo: { title: string; [key: string]: unknown }): Promise<Todo | null> {
    console.log(`LOG: Creating new todo with title='${todo.title}'`);

    try {
      const record = await this.pb.collection(this.CONFIG.COLLECTION_NAME).create(todo);

      console.log(`LOG: Successfully created todo with id='${record.id}'`);
      return record as unknown as Todo;
    } catch (error) {
      this.handleError('createTodo', error);
      return null;
    }
  }

  /**
   * Updates an existing todo
   * @param id - ID of the todo to update
   * @param todo - Partial todo data to update
   * @returns Promise with the updated todo or null on error
   */
  async updateTodo(id: string, todo: Record<string, unknown>): Promise<Todo | null> {
    console.log(`LOG: Updating todo with id='${id}'`);

    try {
      const record = await this.pb.collection(this.CONFIG.COLLECTION_NAME).update(id, todo);

      console.log(`LOG: Successfully updated todo with id='${id}'`);
      return record as unknown as Todo;
    } catch (error) {
      this.handleError('updateTodo', error);
      return null;
    }
  }

  /**
   * Deletes a todo by ID
   * @param id - ID of the todo to delete
   * @returns Promise with boolean indicating success or failure
   */
  async deleteTodo(id: string): Promise<boolean> {
    console.log(`LOG: Deleting todo with id='${id}'`);

    try {
      await this.pb.collection(this.CONFIG.COLLECTION_NAME).delete(id);

      console.log(`LOG: Successfully deleted todo with id='${id}'`);
      return true;
    } catch (error) {
      this.handleError('deleteTodo', error);
      return false;
    }
  }

  /**
   * Gets the currently authenticated user
   * @returns Promise with the user or null if not authenticated or on error
   */
  async getCurrentUser(): Promise<User | null> {
    console.log('LOG: Getting current authenticated user');

    try {
      if (!this.pb.authStore.isValid) {
        console.log('LOG: No valid authentication found');
        return null;
      }

      // Get the model ID with null check
      const modelId = this.pb.authStore.model?.id;
      if (!modelId) {
        console.log('LOG: No user ID found in auth store');
        return null;
      }

      const user = await this.pb.collection('users').getOne(modelId);

      console.log(`LOG: Successfully retrieved current user with id='${user.id}'`);
      return user as unknown as User;
    } catch (error) {
      this.handleError('getCurrentUser', error);
      return null;
    }
  }

  /**
   * Gets the ID of the first todo in the list
   * Useful for demonstration purposes or default selection
   * @returns Promise with the ID or null if no todos exist or on error
   */
  async getTodoId(): Promise<string | null> {
    console.log('LOG: Getting first todo ID');

    try {
      const todos = await this.fetchTodos();

      if (todos && todos.length > 0) {
        console.log(`LOG: Found first todo with id='${todos[0].id}'`);
        return todos[0].id;
      }

      console.log('LOG: No todos found');
      return null;
    } catch (error) {
      this.handleError('getTodoId', error);
      return null;
    }
  }

  /**
   * Builds a filter query string based on the filter type
   * @param filter - Type of filter to apply
   * @returns Filter query string for PocketBase
   */
  private getFilterQuery(filter: TodoFilter): string {
    console.log(`LOG: Building filter query for '${filter}'`);

    switch (filter) {
      case 'all':
        return '';
      case 'active':
        return 'completed = false';
      case 'completed':
        return 'completed = true';
      case 'today': {
        const today = new Date().toISOString().split('T')[0];
        return `dueDate = '${today}'`;
      }
      default: {
        const exhaustiveCheck: never = filter;
        throw new Error(`Invalid filter: ${exhaustiveCheck}`);
      }
    }
  }

  /**
   * Builds a sort query string based on the sort option
   * @param sort - Type of sort to apply
   * @returns Sort query string for PocketBase
   */
  private getSortQuery(sort: TodoSortOption): string {
    console.log(`LOG: Building sort query for '${sort}'`);

    switch (sort) {
      case 'date-desc':
        return 'created DESC';
      case 'date-asc':
        return 'created ASC';
      case 'priority-desc':
        return 'priority DESC';
      case 'priority-asc':
        return 'priority ASC';
      default: {
        const exhaustiveCheck: never = sort;
        throw new Error(`Invalid sort: ${exhaustiveCheck}`);
      }
    }
  }

  /**
   * Standard error handler for all service methods
   * Provides consistent error logging across the service
   * @param method - Name of the method where the error occurred
   * @param error - The error that was caught
   */
  private handleError(method: string, error: unknown): void {
    if (error instanceof ApiError) {
      console.error(`LOG: API Error in ${method} - ${error.statusCode}: ${error.message}`);
    } else if (error instanceof Error) {
      console.error(`LOG: Error in ${method} - ${error.message}`);
    } else {
      console.error(`LOG: Unknown error in ${method}:`, error);
    }
  }
}

/**
 * Composable function to use the RecordService throughout the application
 * @returns A new instance of the RecordService
 */
export function useRecordService(): RecordService {
  return new RecordService();
}
