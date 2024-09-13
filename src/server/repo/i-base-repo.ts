export interface IBaseRepository<T, U> {
  create(data: U): Promise<T>;
  findOne(id: number): Promise<T | null>;
  findAll(): Promise<T[]>;
  update(id: number, data: Partial<U>): Promise<T>;
  delete(id: number): Promise<T>;
}
