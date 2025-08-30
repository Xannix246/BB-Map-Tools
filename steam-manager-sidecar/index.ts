import { SteamManager } from "./managers/SteamManager";
import express from "express";

const port = process.env.PORT || process.argv[2] || 2173;
const steam = new SteamManager();
const app = express();
app.use(express.json());

app.get("/get-map/:name", async (req, res) => {
    const name = req.params.name;

    if (!name) return res.status(400).send("Bad request");;

    const result = await steam.search(name);
    res.status(200).send(result);
});

app.post("/create", async (req, res) => {
    const title: string = req.body.title;
    const description: string = req.body.description || "No description";
    const previewPath: string = req.body.previewPath;
    const contentPath: string = req.body.contentPath;
    const changeNote: string | undefined = req.body.changeNote;

    if (!title || !previewPath || !contentPath) return res.status(400).send("Bad request");;

    const result = await steam.upload({
        title,
        description,
        previewPath,
        contentPath,
        changeNote: changeNote || "Some changeNote"
    });
    res.status(200).send(result);
});

app.post("/update", async (req, res) => {
    const title: string = req.body.title;
    const description: string = req.body.description || "No description";
    const previewPath: string = req.body.previewPath;
    const contentPath: string = req.body.contentPath;
    const changeNote: string | undefined = req.body.changeNote;
    const itemId: bigint = BigInt(req.body.itemId);

    if (!title || !previewPath || !contentPath || !itemId) return res.status(400).send("Bad request");;

    const result = await steam.upload({
        title,
        description,
        previewPath,
        contentPath,
        changeNote: changeNote || "Some changeNote",
        itemId
    });
    res.status(200).send(result);
});

app.listen(Number(port), () => console.log(`Server running on: ${port}`));
