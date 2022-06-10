export type ID = number;

export interface Identifiable {
  id: ID;
}

export interface EntityTimestamps {
  createdAt?: Date | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}
