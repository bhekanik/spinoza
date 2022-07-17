import { Input } from "@chakra-ui/react";

export const FileUploader = () => {
  return (
    <Input
      type="file"
      name="file"
      w="full"
      className="flex-1 text-base leading-8 text-gray-700 transition-colors duration-200 ease-in-out bg-white border border-gray-300 rounded outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
    />
  );
};
