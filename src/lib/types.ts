// BookNook-এর বইয়ের category। Backend-এও একই নাম ব্যবহার হয়।
export const CATEGORIES: string[] = ["Fiction", "Science", "History", "Kids", "Others"];

// Backend থেকে আসা একটা বইয়ের তথ্য
export interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  imageUrl: string;
  totalCopies: number;
  availableCopies: number;
  addedByName: string;
  addedByEmail: string;
  createdAt: string;
}

// Backend থেকে আসা একটা borrow-এর তথ্য
export interface Borrow {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userEmail: string;
  userName: string;
  borrowDate: string;
  returnDate: string;
}

// আগের কোডে এই নামগুলো ব্যবহার হয়েছে, তাই একই জিনিসের দুটো নাম রাখা হলো
export type IBook = Book;
export type IBorrow = Borrow;
