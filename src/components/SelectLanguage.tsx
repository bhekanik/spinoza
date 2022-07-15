import { useEffect, useState } from "react";

export const SelectLanguage = () => {
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/voices");
      const data = await res.json();
      setLanguages(data.data.values.map((v: any) => v.voiceName));
    })();
  }, []);

  return (
    <div className="flex justify-end mb-8">
      <div className="relative inline-flex self-center">
        <svg
          className="absolute top-0 right-0 p-2 m-2 text-white bg-indigo-500 rounded pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="40px"
          height="40px"
          viewBox="0 0 38 22"
          version="1.1"
        >
          <title>F09B337F-81F6-41AC-8924-EC55BA135736</title>
          <g
            id="ZahnhelferDE—Design"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
          >
            <g
              id="ZahnhelferDE–Icon&amp;Asset-Download"
              transform="translate(-539.000000, -199.000000)"
              fill="#ffffff"
              fillRule="nonzero"
            >
              <g
                id="Icon-/-ArrowRight-Copy-2"
                transform="translate(538.000000, 183.521208)"
              >
                <polygon
                  id="Path-Copy"
                  transform="translate(20.000000, 18.384776) rotate(135.000000) translate(-20.000000, -18.384776) "
                  points="33 5.38477631 33 31.3847763 29 31.3847763 28.999 9.38379168 7 9.38477631 7 5.38477631"
                />
              </g>
            </g>
          </g>
        </svg>
        <select
          id="voice"
          name="voice"
          className="w-40 pl-5 pr-10 font-bold text-gray-600 bg-white border-2 border-indigo-500 rounded appearance-none h-14 hover:border-gray-400 focus:outline-none"
        >
          {languages.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
      </div>
    </div>
  );
};
