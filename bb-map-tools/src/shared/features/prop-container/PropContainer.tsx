import Button from "@/base/button/Button";
import Input from "@/base/input/Input";
import { changeCords, deletePart, generateUuid } from "@/pages/part-list/part-utils";
import { getMap } from "@/store";

type Props = {
    id: number;
}

const PropContainer = ({ id }: Props) => {
    const map = getMap();
    return (
        map?.parts && map?.parts[id] && <div className="w-full h-fit bg-black/70 flex flex-col gap-2 text-xl p-2">
            <div className="flex flex-col gap-2">
                <div className="flex gap-2 place-items-center">
                    <h1>X:</h1>
                    <Input
                        placeholder="Type cord"
                        className="w-full"
                        value={map?.parts[id][0]?.position.x.toString() || ""}
                        onChange={(e) =>
                            changeCords(id, {
                                x: parseFloat(e.target.value) || 0,
                                y: map.parts![id][0].position.y,
                                z: map.parts![id][0].position.z,
                            })
                        }
                    />
                </div>
                <div className="flex gap-2 place-items-center">
                    <h1>Y:</h1>
                    <Input
                        placeholder="Type cord"
                        className="w-full"
                        value={map?.parts[id][0]?.position.y.toString() || ""}
                        onChange={(e) =>
                            changeCords(id, {
                                x: map.parts![id][0].position.x,
                                y: parseFloat(e.target.value) || 0,
                                z: map.parts![id][0].position.z,
                            })
                        }

                    />
                </div>
                <div className="flex gap-2 place-items-center">
                    <h1>Z:</h1>
                    <Input
                        placeholder="Type cord"
                        className="w-full"
                        value={map?.parts[id][0]?.position.z.toString() || ""}
                        onChange={(e) =>
                            changeCords(id, {
                                x: map.parts![id][0].position.x,
                                y: map.parts![id][0].position.y,
                                z: parseFloat(e.target.value) || 0,
                            })
                        }
                    />
                </div>
            </div>
            <div className="flex gap-2 justify-between">
                <Button
                    className="w-full"
                    onClick={() => generateUuid(id)}
                >Update UUID's</Button>
                <Button
                    className="w-full bg-red/30"
                    onClick={() => {
                        deletePart(id);
                    }}
                >Delete part</Button>
            </div>
        </div>
    );
}

export default PropContainer