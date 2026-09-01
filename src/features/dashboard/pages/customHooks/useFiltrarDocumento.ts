import { useState } from "react";

export interface filterResponse {
  estudio?: string;
  estado?: string;
}

interface UseFiltrarDocumentoArgs {
  onApply?: (estado?: boolean, estudio?: string) => void;
}

export const useFiltrarDocumento = ({ onApply }: UseFiltrarDocumentoArgs = {}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [filterSelected, setFilterSelected] = useState<filterResponse>({});

  const abrir = () => {
    setOpen(true);
  };

  const cerrar = () => {
    setOpen(false);
  };

  const limpiar = () => {
    setFilterSelected({});
  };

  const aplicar = () => {
    const estado =
      filterSelected.estado !== undefined ? filterSelected.estado === "true" : undefined;
    onApply?.(estado, filterSelected.estudio);
    cerrar();
  };

  return { open, abrir, cerrar, limpiar, aplicar, setFilterSelected, filterSelected };
};
