import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (process.env.DEMO_MODE) {
    return
  }

  const { entryId, html, streak, powerMode } = req.body;

  const missingParams = Object.entries({
    entryId, html
  })
    .filter(([_, value]) => !value)
    .map(([key]) => `'${key}'`);

  if (missingParams.length) {
    res.send({
      status: 400,
      error: `${missingParams.join(", ")} must be provided`,
    });
  }

  await prisma.entry.update({
    where: {
      id: entryId,
    },
    data: {
      html,
      powerMode,
      score: streak || 0,
    },
  });

  prisma.$disconnect();

  res.send(200);
};

export default handler;
