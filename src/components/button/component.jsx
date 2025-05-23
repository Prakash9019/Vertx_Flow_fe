import "./style.css";

export default function Button({theme, context, callback, disabled}){
    return(
        <button className={`button ${theme}`} onClick={() => {
            disabled ? null : callback();
        }}>{context}</button>
    )
};