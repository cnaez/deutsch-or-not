import { z } from "zod";
// import axios from "axios";
import { procedure, router } from "../trpc";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client
const prisma = new PrismaClient();

export const gameRouter = router({
  getChoices: procedure.query(async ({ ctx }) => {
    // Fetch all words
    const allWords = await prisma.word.findMany();
    if (allWords.length < 4) return [];

    // Pick one real word randomly
    const realWord = allWords
      .filter((word) => word.isReal)
      .sort(() => Math.random() - 0.5)[0];
    if (!realWord) return [];

    // Pick 3 fake words randomly
    const fakeWords = allWords
      .filter((word) => !word.isReal)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const choices = [realWord, ...fakeWords].sort(() => Math.random() - 0.5);

    return choices;
  }),
  checkAnswer: procedure
    .input(z.object({ word: z.string() }))
    .mutation(async ({ input }) => {
      const result = await prisma.word.findFirst({
        where: { word: input.word },
      });
      return result?.isReal;
    }),
  submitWord: procedure
    .input(z.object({ word: z.string(), isReal: z.boolean() }))
    .mutation(async ({ input }) => {
      const submission = await prisma.userSubmission.create({
        data: { word: input.word, isReal: input.isReal },
      });
      return submission;
    }),
  createUser: procedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await prisma.user.create({
        data: {
          name: input.name,
        },
      });
    }),
  getLeaderboard: procedure.query(async ({ ctx }) => {
    return await prisma.user.findMany({
      orderBy: {
        score: "desc",
      },
      take: 10, // Top 10 users
    });
  }),
  updateUserScore: procedure
    .input(
      z.object({
        userId: z.number(),
        score: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, score } = input;
      await prisma.user.update({
        where: { id: userId },
        data: { score },
      });
    }),
});

// Export type definition of the API
export type GameRouter = typeof gameRouter;
