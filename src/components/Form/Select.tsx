import { Select as ChakraSelect, SelectProps } from "@chakra-ui/react";

interface Props {
  data: { label: string; value: string }[];
  name: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  defaultValue?: string;
}

export const Select = ({
  data,
  name,
  value,
  onChange,
  defaultValue,
  ...rest
}: Props & SelectProps) => {
  return (
    <ChakraSelect
      {...rest}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      defaultValue={defaultValue}
    >
      {data.map((d) => (
        <option key={d.value} value={d.value}>
          {d.label}
        </option>
      ))}
    </ChakraSelect>
  );
};
