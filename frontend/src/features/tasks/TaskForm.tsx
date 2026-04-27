import { FormEvent, useState } from "react";
import type { CreateTaskInput } from "../../api/tasksApi";

type TaskFormProps = {
  disabled?: boolean;
  onSubmit: (input: CreateTaskInput) => Promise<void>;
};

export function TaskForm({ disabled = false, onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !description.trim()) {
      setValidationError("Title and description are required.");
      return;
    }

    setValidationError("");
    await onSubmit({
      title: title.trim(),
      description: description.trim(),
    });
    setTitle("");
    setDescription("");
  };

  return (
    <form
      className="space-y-3 rounded border border-slate-200 bg-white p-4"
      onSubmit={handleSubmit}
    >
      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={disabled}
        />
      </div>

      <div>
        <label
          className="block text-sm font-medium text-slate-700"
          htmlFor="description"
        >
          Description
        </label>
        <textarea
          id="description"
          className="mt-1 min-h-24 w-full rounded border border-slate-300 px-3 py-2 text-sm"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          disabled={disabled}
        />
      </div>

      {validationError ? (
        <p className="text-sm text-red-700" role="alert">
          {validationError}
        </p>
      ) : null}

      <button
        className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-400"
        disabled={disabled}
        type="submit"
      >
        Create task
      </button>
    </form>
  );
}
