import { z } from "zod";
// import axios from "axios";
import { procedure, router } from "../trpc";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client
const prisma = new PrismaClient();

export const aRouter = router({
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
});

// Export type definition of the API
export type EmployeeRouter = typeof aRouter;
