import { boolean, serial, text, timestamp } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(), // Auto-increment primary key
    email: text("email").unique(), // Unique text column for email
    password: text("password"), // Text column for password
    createdAt: timestamp("created_at").defaultNow(), // Timestamp column with default as now
    twoFactorSecret: text("2fa_secret"), // Text column for 2FA secret
    twoFactorActivated: boolean("2fa_activated").default(false) // Boolean column for 2FA activation, default false
});
