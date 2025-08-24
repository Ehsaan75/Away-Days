import { pgTable, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified"),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const matches = pgTable("matches", {
  id: text("id").primaryKey(),
  homeTeam: text("homeTeam").notNull(),
  awayTeam: text("awayTeam").notNull(),
  homeScore: integer("homeScore"),
  awayScore: integer("awayScore"),
  matchDate: timestamp("matchDate").notNull(),
  competition: text("competition").notNull(),
  venue: text("venue"),
  season: text("season").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const watchingExperiences = pgTable("watchingExperiences", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  matchId: text("matchId")
    .references(() => matches.id, { onDelete: "cascade" }),
  customMatchDescription: text("customMatchDescription"),
  watchingLocation: text("watchingLocation").notNull(),
  locationDetails: text("locationDetails"),
  rating: integer("rating").notNull(),
  review: text("review"),
  watchedAt: timestamp("watchedAt").notNull(),
  isPublic: boolean("isPublic").notNull().default(true),
  aiCategorizedLocation: text("aiCategorizedLocation"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const friendships = pgTable("friendships", {
  id: text("id").primaryKey(),
  requesterId: text("requesterId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  addresseeId: text("addresseeId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  status: text("status", { enum: ["pending", "accepted", "declined", "blocked"] })
    .notNull()
    .default("pending"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const experienceMedia = pgTable("experienceMedia", {
  id: text("id").primaryKey(),
  experienceId: text("experienceId")
    .notNull()
    .references(() => watchingExperiences.id, { onDelete: "cascade" }),
  mediaType: text("mediaType", { enum: ["photo", "video"] }).notNull(),
  mediaUrl: text("mediaUrl").notNull(),
  caption: text("caption"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const likes = pgTable("likes", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  experienceId: text("experienceId")
    .notNull()
    .references(() => watchingExperiences.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const comments = pgTable("comments", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  experienceId: text("experienceId")
    .notNull()
    .references(() => watchingExperiences.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});
