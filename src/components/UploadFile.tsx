import React, { useState } from "react";

export const UploadFile = () => {
  const [selectedFile, setSelectedFile] = useState<File>();

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  return (
    <div className="relative flex mb-4 space-x-3 ">
      <input
        type="file"
        name="file"
        className="w-full max-w-md px-3 py-1 text-base leading-8 text-gray-700 transition-colors duration-200 ease-in-out bg-white border border-gray-300 rounded outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        onChange={changeHandler}
      />
    </div>
  );
};
