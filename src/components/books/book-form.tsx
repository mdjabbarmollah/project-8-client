"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { uploadImage } from "@/lib/imgbb";
import { CATEGORIES, type IBook } from "@/lib/types";
import { brandButton, cn } from "@/lib/utils";

export interface BookPayload {
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  description: string;
  imageUrl: string;
}

interface BookFormProps {
  book?: IBook;
  user: { name: string; email: string };
  submitLabel: string;
  onSubmit: (payload: BookPayload) => Promise<void>;
  onCancel?: () => void;
}

const fieldInput = "h-10 rounded-md";

export function BookForm({
  book,
  user,
  submitLabel,
  onSubmit,
  onCancel,
}: BookFormProps) {
  const [category, setCategory] = useState(book?.category ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    if (!category) {
      toast.error("Please choose a category.");
      return;
    }
    if (!book && !file) {
      toast.error("Please choose a cover image for the book.");
      return;
    }

    setLoading(true);
    try {
      const imageUrl = file
        ? await uploadImage(file)
        : (book as IBook).imageUrl;
      await onSubmit({
        title: String(form.get("title")).trim(),
        author: String(form.get("author")).trim(),
        category,
        totalCopies: Number(form.get("totalCopies")),
        description: String(form.get("description")).trim(),
        imageUrl,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="title">Book Title</Label>
          <Input
            id="title"
            name="title"
            defaultValue={book?.title}
            placeholder="The Midnight Library"
            className={fieldInput}
            required
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="author">Author Name</Label>
          <Input
            id="author"
            name="author"
            defaultValue={book?.author}
            placeholder="Matt Haig"
            className={fieldInput}
            required
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label>Category</Label>
          <Select
            value={category}
            onValueChange={(value) => setCategory(value ?? "")}
          >
            <SelectTrigger className={cn(fieldInput, "w-full")}>
              <SelectValue placeholder="Fiction" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="totalCopies">Total Copies</Label>
          <Input
            id="totalCopies"
            name="totalCopies"
            type="number"
            min={1}
            step={1}
            defaultValue={book?.totalCopies ?? 1}
            className={fieldInput}
            required
          />
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="image">
          Book Image
          {book && (
            <span className="font-normal text-muted-foreground">
              (leave empty to keep the current one)
            </span>
          )}
        </Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          className={cn(fieldInput, "file:mr-3 file:cursor-pointer")}
          onChange={(e) => {
            const picked = e.target.files?.[0] ?? null;
            if (picked && picked.size > 5 * 1024 * 1024) {
              toast.error("The image must be smaller than 5 MB.");
              e.target.value = "";
              setFile(null);
              return;
            }
            setFile(picked);
          }}
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="description">Short Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={book?.description}
          className="min-h-28 rounded-md"
          placeholder="What is this book about?"
          required
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="userName">User Name</Label>
          <Input
            id="userName"
            value={user.name}
            readOnly
            className={cn(fieldInput, "bg-muted/60 text-muted-foreground")}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="userEmail">User Email</Label>
          <Input
            id="userEmail"
            value={user.email}
            readOnly
            className={cn(fieldInput, "bg-muted/60 text-muted-foreground")}
          />
        </div>
      </div>

      <div className={cn("mt-1 flex gap-3", onCancel ? "justify-end" : "")}>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={loading}
          className={cn(
            brandButton,
            "h-10 px-5 text-sm",
            !onCancel && "w-full",
          )}
        >
          {loading ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
