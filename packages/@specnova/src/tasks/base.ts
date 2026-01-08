import { createTranslation, I18nTranslations, Translator } from '@/translator';

import { confirm, input as promptInput, select } from '@inquirer/prompts';

/* Extact types */
type TasksTranslations = I18nTranslations<'tasks'>;
type TasksTranslationsKeys = keyof TasksTranslations;

/* @internal */
type TasksTranslator<TK extends TasksTranslationsKeys> = Translator<'tasks', TK>;

type TaskOptionsEvent<T> = {
  onDone?: (value: T) => void;
  onExit?: () => void;
  onError?: (error: Error) => void;
};

type TaskOptionsBase<T> = {
  name: string;
  clearPromptOnDone?: boolean;
} & TaskOptionsEvent<T>;

type TaskOptionsWithInput<T, I> = TaskOptionsBase<T> & {
  input: I;
};

class Tasks {
  constructor() {}
  //# EVENTS
  private handleExit<T>(options?: TaskOptionsEvent<T>) {
    if (options?.onExit) {
      options.onExit();
    }
  }
  private handleDone<T>(v: T, options?: TaskOptionsEvent<T>): T {
    if (options?.onDone) {
      options.onDone(v);
    }
    return v;
  }
  private handleError<T>(_e: Error, options?: TaskOptionsEvent<T>) {
    if (options?.onError) {
      options.onError(_e);
    } else {
      throw _e;
    }
  }
  private doCatch<T>(error: unknown, v: T, options?: TaskOptionsEvent<T>) {
    if (options?.onExit && error instanceof Error && error.name === 'ExitPromptError') {
      this.handleExit(options);
    } else if (options?.onError && error instanceof Error) {
      this.handleError(error, options);
    } else {
      throw error;
    }
    return v;
  }
  //# TASKS
  async allow(formatter: TasksTranslator<'allow'>, options: TaskOptionsBase<boolean>) {
    const { translations } = createTranslation('tasks', 'allow');
    try {
      const res = await confirm(
        {
          message: formatter(translations),
        },
        {
          clearPromptOnDone: options?.clearPromptOnDone,
        },
      );
      return this.handleDone(res, options);
    } catch (error) {
      return this.doCatch(error, false, options);
    }
  }
  async input(formatter: TasksTranslator<'input'>, options: TaskOptionsBase<string>) {
    const { translations } = createTranslation('tasks', 'input');
    try {
      const res = await promptInput({
        message: formatter(translations),
      });
      return this.handleDone(res, options);
    } catch (error) {
      return this.doCatch(error, '', options);
    }
  }
  async select(
    formatter: TasksTranslator<'select'>,
    options: TaskOptionsWithInput<string, string[]>,
  ) {
    const { translations } = createTranslation('tasks', 'select');
    try {
      const res = await select({
        message: formatter(translations),
        choices: options.input,
      });
      return this.handleDone(res, options);
    } catch (error) {
      this.doCatch(error, '', options);
      return '';
    }
  }
}

export const tasks = new Tasks();
export default tasks;
