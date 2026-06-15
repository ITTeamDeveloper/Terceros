import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { SharedPanel, SharedSelect, type ComboOption } from "../../../../shared/components";
import { useFiltrarDocumento } from "../customHooks/useFiltrarDocumento";

interface DashboardFilterProps {
  controller: ReturnType<typeof useFiltrarDocumento>
}

const estadoOptions: ComboOption[] = [
    {
        data: 'Nuevo',
        value: 'false'
    },
    {
        data: 'Aprobado',
        value: 'true'
    }
]
export const DashboardFilter = ({controller}: DashboardFilterProps) => {
    const {open, cerrar, estudioData, aplicar, setFilterSelected, filterSelected} = controller
    return (
        <SharedPanel
            open={open}
            onClose={cerrar}
            onSave={aplicar}
            title="Filtrar documentos"
            saveLabel="Aplicar"
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box>
                    <Typography
                        sx={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: '#1D1D1D',
                            fontFamily: 'Inter, sans-serif',
                            mb: 0.75,
                        }}
                    >
                        Estudio
                    </Typography>
                    <Box>
                        <SharedSelect
                            options={estudioData}
                            value={estudioData.find((o) => o.data === filterSelected?.estudio) ?? null}
                            onChange={(v) => setFilterSelected({...filterSelected, estudio: v?.data})}
                        />
                    </Box>
                </Box>
                <Box>
                    <Typography
                        sx={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: '#1D1D1D',
                            fontFamily: 'Inter, sans-serif',
                            mb: 0.75,
                        }}
                    >
                        Estado de documento
                    </Typography>
                    <Box>
                        <SharedSelect
                            options={estadoOptions}
                            value={estadoOptions.find((o) => o.value === filterSelected?.estado) ?? null}
                            onChange={(v) => setFilterSelected({...filterSelected, estado: v?.value})}
                        />
                    </Box>
                </Box>
            </Box>
        </SharedPanel>
    );
};
