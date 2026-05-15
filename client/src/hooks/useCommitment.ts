import { useRef, useState } from "react";

export interface Commitment {
  id: string;
  text: string;
  checked: boolean;
}
export const useCommitment = () => {
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [inputText, setInputText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addCommitment = () => {
    const text = inputText.trim();
    if (!text) return;
    setCommitments((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text, checked: false },
    ]);
    setInputText("");
    inputRef.current?.focus();
  };

  const removeCommitment = (id: string) =>
    setCommitments((prev) => prev.filter((c) => c.id !== id));

  const toggleCommitment = (id: string) =>
    setCommitments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, checked: !c.checked } : c)),
    );

  const allChecked =
    commitments.length > 0 && commitments.every((c) => c.checked);
  const checkedCount = commitments.filter((c) => c.checked).length;

  return {
    commitments,
    inputText,
    setInputText,
    inputRef,
    addCommitment,
    removeCommitment,
    toggleCommitment,
    allChecked,
    checkedCount,
  };
};
