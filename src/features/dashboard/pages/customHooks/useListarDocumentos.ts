import { useEffect, useState } from "react"
import type { DocumentoListResponse } from "../../../../services/interfaces"
import { documentoServices } from "../../../../services/documentoServices";

export const useListarDocumentos = () => { 
    const [estudioDocs, setEstudioDocs] = useState<DocumentoListResponse[]>([]);

    const getDocumentos = async () => {
        try{
            const data = await documentoServices.listar(null);
            setEstudioDocs(data);
        } catch (error) {
            console.error("Error al listar documentos:", error);
        }
    }

    useEffect(() => {
        getDocumentos();
    }, []);

    return { estudioDocs };
}