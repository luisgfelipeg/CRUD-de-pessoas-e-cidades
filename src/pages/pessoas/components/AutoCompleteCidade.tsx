import { useState, useEffect, useMemo } from "react";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";

import { useField } from "@unform/core";
import { useDebounce } from "../../../shared/hooks";
import { CidadesService } from "../../../shared/services/api/cidades/CidadesService";

type TAutoCompleteOption = {
  id: number;
  label: string;
};

interface IAutoCompleteCidadeProps {
  isExternalLoading?: boolean;
  children?: React.ReactNode;
}

export const AutoCompleteCidade: React.FC<IAutoCompleteCidadeProps> = ({
  isExternalLoading = false,
}) => {
  const { fieldName, registerField, defaultValue, error, clearError } =
    useField("cidadeId");
  const { debounce } = useDebounce();

  const [selectedId, setSelectedId] = useState<Number | undefined>(
    defaultValue
  );
  const [opcoes, setOpcoes] = useState<TAutoCompleteOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => selectedId,
      setValue: (_, newSelectedId) => setSelectedId(newSelectedId),
    });
  }, [registerField, selectedId, fieldName]);

  useEffect(() => {
    setIsLoading(true);

    debounce(() => {
      CidadesService.getAll(1, busca).then((result) => {
        setIsLoading(false);

        if (result instanceof Error) {
          //alert(result.message);
        } else {
          console.log(result);
          setOpcoes(
            result.data.map((cidade) => ({ id: cidade.id, label: cidade.nome }))
          );
        }
      });
    });
  }, [busca]);

  const autoCompleteSelectedOption = useMemo(() => {
    if (!selectedId) return null;

    const selectedOption = opcoes.find((opcao) => opcao.id === selectedId);
    if (!selectedOption) return null;
    return selectedOption;
  }, [selectedId, opcoes]);

  return (
    <Autocomplete
      disablePortal
      clearText="Limpar"
      openText="Abrir"
      closeText="Fechar"
      loadingText="Carregando..."
      noOptionsText="Sem opções"
      options={opcoes}
      loading={isLoading}
      disabled={isExternalLoading}
      value={autoCompleteSelectedOption}
      onInputChange={(_, newValue) => setBusca(newValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Cidade"
          error={!!error}
          helperText={error}
        />
      )}
      popupIcon={
        isExternalLoading || isLoading ? (
          <CircularProgress size={28} />
        ) : undefined
      }
      onChange={(_, newValue) => {
        setSelectedId(newValue?.id);
        setBusca("");
        clearError();
      }}
    />
  );
};
