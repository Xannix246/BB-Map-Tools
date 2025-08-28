import { getMap } from "@/store";
import clsx from "clsx";
import { useEffect } from "react";

type Props = {
    activeId: number | undefined;
    setActiveId: (value: number) => void;
}

const List = ({ activeId, setActiveId }: Props) => {
    const map = getMap();

    useEffect(() => {

    }, [map]);

    return (
        <div className="w-full h-full bg-black/70 flex flex-col overflow-auto">
            {map?.parts?.map((_, index) => (
                <div 
                    className={clsx("text-xl pl-4", index === activeId && "bg-white/20")}
                    key={index}
                    onClick={() => setActiveId(index)}
                >Part {index}</div>
            ))}

            {map?.parts?.length === 0 || !map?.parts &&
                <div
                    className="w-full h-full text-xl flex place-content-center place-items-center"
                >No parts found</div>
            }
        </div>
    );
}

export default List;