function read7BitEncodedInt(buf: Buffer, start: number): [number, number] {
	let count = 0;
	let shift = 0;
	let offset = start;
	let b: number;

	do {
		if (offset >= buf.length) throw new RangeError("read7BitEncodedInt overflow");
		b = buf.readUInt8(offset++);
		count |= (b & 0x7f) << shift;
		shift += 7;
	} while (b & 0x80);

	return [count, offset];
}

function readDotNetString(buf: Buffer, start: number): [string, number] {
	const [byteLen, off1] = read7BitEncodedInt(buf, start);
	const off2 = off1 + byteLen;
	if (off2 > buf.length) throw new RangeError("String exceeds buffer length");
	return [buf.toString("utf8", off1, off2), off2];
}

function need(buf: Buffer, offset: number, bytes: number) {
	if (offset + bytes > buf.length) {
		throw new RangeError(`Need ${bytes} bytes at ${offset}, buf.len=${buf.length}`);
	}
}



export function deserializeMap(buf: Buffer<ArrayBuffer>): MapData {
	let offset = 0;

	need(buf, offset, 1);
	const version = buf.readUInt8(offset);
	offset += 1;
	need(buf, offset, 1);
	const verified = buf.readUInt8(offset) !== 0;
	offset += 1;

	let name: string;
	[name, offset] = readDotNetString(buf, offset);
	need(buf, offset, 8);
	const creatorID = buf.readBigUInt64LE(offset);
	offset += 8;
	need(buf, offset, 4);
	const bestTime = buf.readFloatLE(offset);
	offset += 4;

	let usesDLC1Map = false;
	if (version >= 3) {
		need(buf, offset, 1);
		usesDLC1Map = buf.readUInt8(offset) !== 0;
		offset += 1;
	}

	offset = 128;

	need(buf, offset, 4);
	const blockCount = buf.readInt32LE(offset);
	offset += 4;
	const blocks: Block[] = [];

	for (let i = 0; i < blockCount; i++) {
		need(buf, offset, 4);
		const blockID = buf.readUInt32LE(offset);
		offset += 4;

		let instanceID: string;
		[instanceID, offset] = readDotNetString(buf, offset);
		need(buf, offset, 1);
		const color = buf.readUInt8(offset);
		offset += 1;

		need(buf, offset, 12);
		const position = {
			x: buf.readFloatLE(offset),
			y: buf.readFloatLE(offset + 4),
			z: buf.readFloatLE(offset + 8),
		};
		offset += 12;

		need(buf, offset, 16);
		const rotation = {
			x: buf.readFloatLE(offset),
			y: buf.readFloatLE(offset + 4),
			z: buf.readFloatLE(offset + 8),
			w: buf.readFloatLE(offset + 12),
		};
		offset += 16;

		let scale = 1;
		if (version >= 2) {
			need(buf, offset, 4);
			scale = buf.readFloatLE(offset);
			offset += 4;
		}

		let customColor: Color | undefined;
		if (version >= 4 && color === 8) {
			need(buf, offset, 16);
			customColor = {
				r: buf.readFloatLE(offset),
				g: buf.readFloatLE(offset + 4),
				b: buf.readFloatLE(offset + 8),
				a: buf.readFloatLE(offset + 12),
			};
			offset += 16;
		}

		blocks.push({
			blockID,
			instanceID,
			color,
			position,
			rotation,
			scale,
			customColor,
		});
	}

	const modifiedScenery: Record<string, { color: number; customColor?: Color }> = {};

	if (version >= 3) {
		need(buf, offset, 4);
		const cnt = buf.readInt32LE(offset);
		offset += 4;
		for (let i = 0; i < cnt; i++) {
		let key: string;
		[key, offset] = readDotNetString(buf, offset);
		need(buf, offset, 1);
		const color = buf.readUInt8(offset);
		offset += 1;
		let customColor: Color | undefined;
		if (version >= 5 && color === 8) {
			need(buf, offset, 16);
			customColor = {
				r: buf.readFloatLE(offset),
				g: buf.readFloatLE(offset + 4),
				b: buf.readFloatLE(offset + 8),
				a: buf.readFloatLE(offset + 12),
			};
			offset += 16;
		}
		modifiedScenery[key] = { color, customColor };
		}
	}

	const customColorSwatches: Color[] = [];
	if (version >= 4) {
		need(buf, offset, 4);
		const n = buf.readInt32LE(offset);
		offset += 4;
		customColorSwatches.length = n;
		for (let k = n - 1; k >= 0; k--) {
			need(buf, offset, 16);
			customColorSwatches[k] = {
				r: buf.readFloatLE(offset),
				g: buf.readFloatLE(offset + 4),
				b: buf.readFloatLE(offset + 8),
				a: buf.readFloatLE(offset + 12),
			};
			offset += 16;
		}
	}

	return {
		version,
		verified,
		name,
		creatorID,
		bestTime,
		usesDLC1Map,
		blocks,
		modifiedScenery,
		customColorSwatches,
	};
}
