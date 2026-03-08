"use client"

/*css*/
import css from "./NoteForm.module.css";

/*form*/
import * as Yup from "yup";

/*hooks*/
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateNoteStore } from "@/lib/store/noteStore";

/*services*/
import { createNote } from "@/lib/api";

/*types*/
import type { CreateNoteProps } from "@/lib/api";

interface NoteFormProps {
  onClose: () => void;
};

export default function NoteForm({ onClose }: NoteFormProps) {
  const { draft, setDraft, clearDraft } = useCreateNoteStore();
  const fieldId = useId();
  const queryClient = useQueryClient();
  const router = useRouter();

  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof CreateNoteProps, string>>
  >({});
  const [formError, setFormError] = useState("");

  type variesOfInputs =
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement;

  const clearFieldError = (field: keyof CreateNoteProps) => {
    setFieldErrors(prev => {
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  };

  const handleChange = (event: React.ChangeEvent<variesOfInputs>) => {
    const { name, value } = event.target;

    if (formError) setFormError("");

    if (name === "tag") {
      setDraft({ tag: value as CreateNoteProps["tag"] });
      clearFieldError("tag");
      return;
    }

    if (name === "title" || name === "content") {
      setDraft({ [name]: value });
      clearFieldError(name);
    }
  };

  const mutation = useMutation({
    mutationFn: (data: CreateNoteProps) => createNote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      onClose();
    },
    onError: error => {
      if (error instanceof Error) setFormError(error.message);
      else setFormError("Something went wrong");
    },
  });

  const Schema = Yup.object().shape({
    title: Yup.string()
      .min(3, "Title must be at least 3 characters")
      .max(50, "Title is too long")
      .required("Title is required!"),
    content: Yup.string().max(500, "Content is too long"),
    tag: Yup.string()
      .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"], "Invalid tag")
      .required("Tag is required"),
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    setFieldErrors({});

    try {
      await Schema.validate(draft, { abortEarly: false });
      await mutation.mutateAsync(draft);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errorsMap: Partial<Record<keyof CreateNoteProps, string>> = {};
        err.inner.forEach(e => {
          if (e.path) {
            errorsMap[e.path as keyof CreateNoteProps] = e.message;
          }
        });
        setFieldErrors(errorsMap);
      } else if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError("Something went wrong");
      }
    }
  };

  const cancelForm = () => {
    onClose();
    router.back();
  };

  return (
    <form className={css.form} name="createForm" onSubmit={handleSubmit} noValidate>
      {formError && <div className={css.formError}>{formError}</div>}

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-title`}>Title</label>
        <input
          value={draft.title}
          onChange={handleChange}
          id={`${fieldId}-title`}
          name="title"
          type="text"
          className={css.input}
        />
        {fieldErrors.title && (
          <span id={`${fieldId}-title-error`} className={css.error}>
            {fieldErrors.title}
          </span>
        )}
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-content`}>Content</label>
        <textarea
          value={draft.content}
          onChange={handleChange}
          id={`${fieldId}-content`}
          name="content"
          rows={8}
          className={css.textarea}
        />
        {fieldErrors.content && (
          <span id={`${fieldId}-content-error`} className={css.error}>
            {fieldErrors.content}
          </span>
        )}
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-tag`}>Tag</label>
        <select
          value={draft.tag}
          onChange={handleChange}
          id={`${fieldId}-tag`}
          name="tag"
          className={css.select}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        {fieldErrors.tag && (
          <span id={`${fieldId}-tag-error`} className={css.error}>
            {fieldErrors.tag}
          </span>
        )}
      </div>

      <div className={css.actions}>
        <button type="button" onClick={cancelForm} className={css.cancelButton}>
          Cancel
        </button>
        <button type="submit" className={css.submitButton}>
          Create note
        </button>
      </div>
    </form>
  );
}