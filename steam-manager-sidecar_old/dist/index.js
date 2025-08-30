"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SteamManager_1 = require("./managers/SteamManager");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const port = process.env.PORT || process.argv[2] || 2173;
const steam = new SteamManager_1.SteamManager();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: true }));
app.get("/get-map", async (req, res) => {
    const name = req.query.name?.toString();
    if (!name)
        return res.status(400).send("Bad request");
    ;
    const result = await steam.search(name);
    res.status(200).send(result);
});
app.post("/create", async (req, res) => {
    const title = req.body.title;
    const description = req.body.description || "No description";
    const previewPath = req.body.previewPath;
    const contentPath = req.body.contentPath;
    const changeNote = req.body.changeNote;
    if (title == "" || previewPath == "" || contentPath == "")
        return res.status(400).send("Bad request");
    ;
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
    const title = req.body.title;
    const description = req.body.description || "No description";
    const previewPath = req.body.previewPath;
    const contentPath = req.body.contentPath;
    const changeNote = req.body.changeNote;
    const itemId = BigInt(req.body.itemId);
    if (title == "" || previewPath == "" || contentPath == "" || !itemId)
        return res.status(400).send("Bad request");
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
//# sourceMappingURL=index.js.map