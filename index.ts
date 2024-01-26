import express from "express";
import { PrismaClient } from "@prisma/client";
import path from "path";
import multer from "multer";
import fs from "fs/promises";

const app : express.Application = express();
const prisma : PrismaClient = new PrismaClient();

const portti : number = Number(process.env.PORT) || 3102;

app.listen(portti, () => {

    console.log(`Palvelin käynnistyi osoitteeseen : http://localhost:${portti}`);

});