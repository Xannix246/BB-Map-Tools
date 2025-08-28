import Button from "@/base/button/Button";
import Input from "@/base/input/Input";
import { getMap } from "@/store";

type Props = {
    id: number;
}

const PropContainer = ({ id }: Props) => {
    const map = getMap();
    return (
        <div className="w-full h-fit bg-black/70 flex flex-col gap-2 text-xl p-2">
            {map?.parts && <div className="flex flex-col gap-2">
                <div className="flex gap-2 place-items-center">
                    <h1>X:</h1>
                    <Input
                        placeholder="Type cord"
                        className="w-full"
                        value={map?.parts[id][0]?.position.x.toString() || ""}
                    />
                </div>
                <div className="flex gap-2 place-items-center">
                    <h1>Y:</h1>
                    <Input
                        placeholder="Type cord"
                        className="w-full"
                        value={map?.parts[id][0]?.position.y.toString() || ""}
                    />
                </div>
                <div className="flex gap-2 place-items-center">
                    <h1>Z:</h1>
                    <Input
                        placeholder="Type cord"
                        className="w-full"
                        value={map?.parts[id][0]?.position.z.toString() || ""}
                    />
                </div>
            </div>}
            <div className="flex gap-2 justify-between">
                <Button className="w-full">Update UUID's</Button>
                <Button className="w-full bg-red/30">Delete part</Button>
            </div>
        </div>
    );
}

export default PropContainer