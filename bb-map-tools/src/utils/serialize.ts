import { Buffer } from "buffer";

function write7BitEncodedInt(value: number): Buffer {
    const chunks: number[] = [];
    let v = value >>> 0;
    while (v >= 0x80) {
        chunks.push((v & 0x7f) | 0x80);
        v >>>= 7;
    }
    chunks.push(v);
    return Buffer.from(chunks);
}

function writeDotNetString(str: string): Buffer {
    const strBuf = Buffer.from(str, "utf8");
    const lenBuf = write7BitEncodedInt(strBuf.length);
    return Buffer.concat([lenBuf, strBuf]);
}

function writeVector3(v: Vector3): Buffer {
    const buf = Buffer.alloc(12);
    buf.writeFloatLE(v.x, 0);
    buf.writeFloatLE(v.y, 4);
    buf.writeFloatLE(v.z, 8);
    return buf;
}

function writeQuaternion(q: Quaternion): Buffer {
    const buf = Buffer.alloc(16);
    buf.writeFloatLE(q.x, 0);
    buf.writeFloatLE(q.y, 4);
    buf.writeFloatLE(q.z, 8);
    buf.writeFloatLE(q.w, 12);
    return buf;
}

function writeUInt64LE(value: string | number | bigint): Buffer {
    const buf = Buffer.alloc(8);
    const big = typeof value === "bigint" ? value : BigInt(value);
    buf.writeBigUInt64LE(big);
    return buf;
}

function writeColor(c: Color): Buffer {
    const buf = Buffer.alloc(16);
    buf.writeFloatLE(c.r, 0);
    buf.writeFloatLE(c.g, 4);
    buf.writeFloatLE(c.b, 8);
    buf.writeFloatLE(c.a, 12);
    return buf;
}



export function serializeMap(data: MapData): Buffer<ArrayBuffer> {
    const parts: Buffer[] = [];

    const header = Buffer.alloc(1 + 1);
    header.writeUInt8(data.version, 0);
    header.writeUInt8(data.verified ? 1 : 0, 1);
    parts.push(header);

    parts.push(writeDotNetString(data.name));
    parts.push(writeUInt64LE(BigInt(data.creatorID)));
    const bestTimeBuf = Buffer.alloc(4);
    bestTimeBuf.writeFloatLE(data.bestTime, 0);
    parts.push(bestTimeBuf);

    if (data.version >= 3) {
        const dlcBuf = Buffer.alloc(1);
        dlcBuf.writeUInt8(data.usesDLC1Map ? 1 : 0, 0);
        parts.push(dlcBuf);
    }

    const headerBuf = Buffer.concat(parts);
    const padLen = 128 - headerBuf.length;
    if (padLen < 0) throw new RangeError("Header > 128 bytes!");
    parts.push(Buffer.alloc(padLen));

    const blockCountBuf = Buffer.alloc(4);
    blockCountBuf.writeInt32LE(data.blocks.length, 0);
    parts.push(blockCountBuf);

    for (const b of data.blocks) {
        const bparts: Buffer[] = [];
        const idBuf = Buffer.alloc(4);
        idBuf.writeUInt32LE(b.blockID, 0);
        bparts.push(idBuf);

        bparts.push(writeDotNetString(b.instanceID));

        const colorBuf = Buffer.alloc(1);
        colorBuf.writeUInt8(b.color, 0);
        bparts.push(colorBuf);

        bparts.push(writeVector3(b.position));
        bparts.push(writeQuaternion(b.rotation));

        if (data.version >= 2) {
            const scaleBuf = Buffer.alloc(4);
            scaleBuf.writeFloatLE(b.scale, 0);
            bparts.push(scaleBuf);
        }

        if (data.version >= 4 && b.color === 8 && b.customColor) {
            bparts.push(writeColor(b.customColor));
        }

        parts.push(Buffer.concat(bparts));
    }

    if (data.version >= 3) {
        const countBuf = Buffer.alloc(4);
        countBuf.writeInt32LE(Object.keys(data.modifiedScenery).length, 0);
        parts.push(countBuf);

        for (const [key, val] of Object.entries(data.modifiedScenery)) {
            const sparts: Buffer[] = [];
            sparts.push(writeDotNetString(key));
            const cbuf = Buffer.alloc(1);
            cbuf.writeUInt8(val.color, 0);
            sparts.push(cbuf);

            if (data.version >= 5 && val.color === 8 && val.customColor) {
                sparts.push(writeColor(val.customColor));
            }
            parts.push(Buffer.concat(sparts));
        }
    }

    if (data.version >= 4) {
        const countBuf = Buffer.alloc(4);
        countBuf.writeInt32LE(data.customColorSwatches.length, 0);
        parts.push(countBuf);

        for (const c of data.customColorSwatches) {
            parts.push(writeColor(c));
        }
    }

    // fs.writeFileSync(path, Buffer.concat(parts));
    return Buffer.concat(parts);
}