import { useEffect, useState } from "react";
import type { ComboOption } from "../../../../shared/components";
import { estudioServices } from "../../../../services/estudioServices";
import { useAuth } from "../../../auth/context/AuthContext";

const ROL_ADMIN = 20;

export interface filterResponse {
  estudio?: string;
  estado?: string;
}

interface UseFiltrarDocumentoArgs {
  onApply?: (estado?: boolean, estudio?: string) => void;
}

export const useFiltrarDocumento = ({ onApply }: UseFiltrarDocumentoArgs = {}) => {
  const { payload } = useAuth();
  const esAdmin = payload?.rol_ids?.[0] === ROL_ADMIN;
  const [estudioData, setEstudioData] = useState<ComboOption[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [filterSelected, setFilterSelected] = useState<filterResponse>({});

  const getEstudio = async () => {
    const listaEstudio = await estudioServices.listar();
    const estudios = listaEstudio.map((v, i) => ({
      data: v,
      value: String(i),
    }));

    setEstudioData(estudios);
  };

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

  useEffect(() => {
    if (esAdmin) getEstudio();
  }, [esAdmin]);

  return { estudioData, open, abrir, cerrar, limpiar, aplicar, setFilterSelected, filterSelected };
};
