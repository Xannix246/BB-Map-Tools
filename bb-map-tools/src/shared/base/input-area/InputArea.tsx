import clsx from "clsx";

interface InputArea extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    placeholder: string;
    icon?: React.ReactNode;
    className?: string;
    value?: string;
    setValue?: (value: string) => void;
}

const InputArea = ({
    placeholder, 
    icon, 
    className, 
    value, 
    setValue,
    ...props
}: InputArea) => {
    return (
        <div className={clsx("flex items-center w-full h-full", className)}>
            {icon && <div className="mr-2">{icon}</div>}
            <textarea 
                placeholder={placeholder} 
                value={value} 
                onChange={(event) => setValue && setValue(event.target.value)} 
                {...props} 
                className="flex-1 w-full h-full outline-0 p-2 bg-black/50 resize-none overflow-auto"
            />
        </div>
    );
}

export default InputArea;
