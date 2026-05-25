import { useEffect, useState } from "react";
import { documentoServices } from "../../../../services/documentoServices";

export const useDescargarDocumento = () => { 

    const descargar = async (asesorNombre: string, tablaNombre: string) => {
        try{
            await documentoServices.descargar(asesorNombre, tablaNombre);
        } catch (error) {
            console.error("Error al descargar el documento:", error);
        }   
    }
    return { descargar,  };
}