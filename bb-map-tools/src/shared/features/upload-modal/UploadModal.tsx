import Button from "@/base/button/Button";
import Input from "@/base/input/Input";
import Modal from "@/base/modal/Modal";
import { getId, setId } from "@/store";
import { openUrl } from "@tauri-apps/plugin-opener";
import { useEffect, useState } from "react";
import { startUpdate, startUpload } from "./upload-utils";

type Props = {
    open: boolean;
    setOpen: (value: boolean) => void;
}

const UploadModal = ({ open, setOpen }: Props) => {
    const id = getId();
    const [localId, setLocalId] = useState("");

    useEffect(() => {
        setLocalId(id as string);
    }, [open]);

    return (
        <Modal open={open} onClose={() => setOpen(false)}>
            <div className="flex flex-col place-items-center px-6">
                <h1 className="text-4xl font-semibold pt-6 pb-3">{id && id.length > 0 ? "Update" : "Upload"} map</h1>
                {id && id.length > 0 ?
                    <div className="text-center text-xl flex flex-col gap-1">
                        <div className="flex gap-1 justify-center">
                            <h1>This map was found in</h1>
                            <a
                                className="text-blue hover:underline"
                                onClick={async () => await openUrl(`https://steamcommunity.com/sharedfiles/filedetails/?id=${id}`)}
                            >Steam Workshop.</a>
                        </div>
                        <h1>If you want to update the map, please ensure that the ID below is correct.</h1>
                        <h1>Otherwise, enter the ID you need yourself.</h1>
                    </div>
                    :
                    <div className="text-center text-xl">
                        <h1>Please note that initially, the map will only be visible to you.</h1>
                        <h1>You can change it later in Workshop.</h1>
                    </div>
                }
                {id && <Input 
                    className="text-xl w-full" 
                    placeholder="id" 
                    value={localId} 
                    onChange={(e) => setLocalId(e.target.value)}
                />}
                <div className="flex w-full justify-between gap-4 pt-6 pb-3">
                    <Button
                        onClick={() => setOpen(false)}
                        className="bg-white/10"
                    ><h4 className="text-xl font-semibold">Cancel</h4></Button>
                    <Button
                        onClick={() => {
                            setId(localId);
                            startUpload();
                            setOpen(false);
                        }}
                        className="bg-green/20"
                    ><h4 className="text-xl font-semibold">Upload</h4></Button>
                    {id && id.length > 0 && <Button
                        onClick={() => {
                            setId(localId);
                            startUpdate();
                            setOpen(false);
                        }}
                        className="bg-red/20"
                    ><h4 className="text-xl font-semibold">Update</h4></Button>}
                </div>
            </div>
        </Modal>
    );
}

export default UploadModal;