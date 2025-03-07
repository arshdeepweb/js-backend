import { sql } from "drizzle-orm/sql";
import {
  boolean,
  float,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  serial,
  timestamp,
  unique,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

export const usersTable = mysqlTable(
  "users",
  {
    id: int("id").notNull().primaryKey().autoincrement(),
    name: varchar("name", { length: 255 }).notNull(),
    age: int("age").notNull(),
    gender: mysqlEnum('gender', ["MALE", "FEMALE"]).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    role: mysqlEnum("userRole", ["ADMIN", "USER"]).default("USER").notNull(),
  },
  (table) => {
    return [
      uniqueIndex("emailIndex").on(table.email),
      unique("uniqueNameAndAge").on(table.name, table.age),
    ];
  }
);

export const UserPreferences = mysqlTable("userPreferences", {
  id: int("id").primaryKey().autoincrement(),
  emailUpdates: boolean("emailUpdates").notNull().default(false),
  userId: int("userid")
    .references(() => usersTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
});

export const postTable = mysqlTable("posts", {
  id: int().primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  averageRating: float("averageRating").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  authorId: int("authorId")
    .references(() => usersTable.id)
    .notNull(),
});

export const CategoryTable = mysqlTable("category", {
  id: int().primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
});

export const PostCategory = mysqlTable("postCategory",{
    postId: int("postId").references(() => postTable.id),
    categoryId: int("categoryId").references(() => CategoryTable.id),
  },
  (table) => [primaryKey({ columns: [table.postId, table.categoryId] })]
);



// Relationships


export const usersTableRelatios = relations(usersTable, ({one, many}) => {
  return {
    preferences: one(UserPreferences),
    posts : many(postTable)
  }
})

export const userPreferencesRelations = relations(UserPreferences, ({one}) => {
  return{
    user : one(usersTable, {
      fields: [UserPreferences.userId],
      references: [usersTable.id]
    })
  }
})

export const postTableRelations = relations('postTable',({one, many})=>{
  return{
    authorId : one(usersTable, {
      fields: [ postTable.authorId ],
      references: [usersTable.id]
    }),
    PostCategory: many(PostCategory)
  }
})

export const CategoryTableRelations = relations('PostCategory',({one, many})=>{
  return{
    PostCategory: many(PostCategory)
  }
})

export const PostCategoryRelations = relations("PostCategory", ({one}) => {
  return{
    post : one(postTable, {
      fields: [PostCategory.postId],
      references: [postTable.id]
    }),
    category: one(CategoryTable, {
      fields: [PostCategory.categoryId],
      references: [CategoryTable.id]
    })
  }
})