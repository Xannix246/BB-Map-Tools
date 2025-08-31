import clsx from "clsx";;

interface Input extends React.InputHTMLAttributes<HTMLInputElement> {
    placeholder: string;
    icon?: React.ReactNode;
    className?: string;
    value?: string;
    setValue?: (value: string) => void;
}

const Input = ({
    placeholder, 
    icon, 
    className, 
    value, 
    setValue,
    ...props
}: Input) => {
    return (
        <div className={clsx("flex place-items-center", className)}>
            <div>{icon}</div>
            <input 
                placeholder={placeholder} 
                value={value} 
                onChange={(event) => setValue && setValue(event.target.value)} 
                {...props}
                tabIndex={0}
                className="w-full outline-0 p-2 bg-black/50"
            />
        </div>
    );
}

export default Input;