import { AppInput } from "./AppInput";

type TeamSearchInputProps = {
  value: string;
  onChangeText: (value: string) => void;
};

export function TeamSearchInput({ value, onChangeText }: TeamSearchInputProps) {
  return (
    <AppInput
      autoCapitalize="words"
      autoCorrect={false}
      label="Pesquisar seleção"
      onChangeText={onChangeText}
      placeholder="Pesquisar seleção. Ex.: Brasil, Argentina, França"
      value={value}
    />
  );
}
