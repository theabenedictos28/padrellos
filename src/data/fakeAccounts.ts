// src/data/fakeAccounts.ts
export interface User {
  id: number;
  role: "operations" | "admin" | "accounting" | "purchasing";
  name: string;
  email: string;
  password: string;
}

export const fakeUsers: User[] = [
  {
    id: 1,
    role: "operations",
    name: "John Doe",
    email: "operations@example.com",
    password: "op1234",
  },
  {
    id: 2,
    role: "admin",
    name: "Jane Smith",
    email: "admin@example.com",
    password: "admin123",
  },
  {
    id: 3,
    role: "accounting",
    name: "Mark Taylor",
    email: "accounting@example.com",
    password: "acc456",
  },
  {
    id: 4,
    role: "purchasing",
    name: "Lucy Brown",
    email: "purchasing@example.com",
    password: "pur789",
  },
];