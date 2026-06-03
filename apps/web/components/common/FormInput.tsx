import { Input } from "@workspace/ui/components/input";

const FormInput = ({
  id, name, type, placeholder, required,
}: {
  id: string; name: string; type: string; placeholder: string; required?: boolean;
}) => {
  return (
    <Input id={id} name={name} type={type} placeholder={placeholder} required={required} />
  );
};

export default FormInput;