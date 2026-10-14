import {sqliteTable,text,integer,index} from 'drizzle-orm/sqlite-core';
export const sandboxes=sqliteTable('pivot_sandboxes',{id:text('id').primaryKey(),csrf:text('csrf').notNull(),revision:integer('revision').notNull().default(1),createdAt:integer('created_at').notNull(),expiresAt:integer('expires_at').notNull(),payload:text('payload').notNull()},table=>[index('pivot_expiry').on(table.expiresAt)]);
export const limits=sqliteTable('pivot_limits',{id:text('id').primaryKey(),count:integer('count').notNull(),expiresAt:integer('expires_at').notNull()});
