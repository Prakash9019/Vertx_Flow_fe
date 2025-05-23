import { useState } from "react";
import "./style.css";

export default function Input({theme, label, state, setState, dis, password}){
  const [hide, setHide] = useState(true);
    if(password){return (
      <div className="pas">
        <input
          type={hide ? "password": "text"}
          className={`w-full py-3 px-4 rounded-md bg-transparent border border-gray-700 text-white mb-3`}
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder={label}
          disabled={dis}
        />
        <button className="eye" onClick={() => setHide(!hide)}>
          {hide ? (
            <ion-icon name="eye-off-outline"></ion-icon>
            ) : (
            <ion-icon name="eye-outline"></ion-icon>
          )}
        </button>
      </div>
    );}else{
      return (
        <input
          type="text"
          className={`w-full py-3 px-4 rounded-md bg-transparent border border-gray-700 text-white mb-3`}
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder={label}
          disabled={dis}
        />
      );
    }
};