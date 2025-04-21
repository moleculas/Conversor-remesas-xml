import { CLIENTES } from '../constantes';

export const validateClientsInXml = (xmlContent) => {
  try {
    // Resultado de la validación
    const result = {
      valid: true,
      missingClients: []
    };

    // Expresión regular para encontrar todos los elementos Dbtr->Nm en el XML
    const regex = /<Dbtr>[\s\S]*?<Nm>(.*?)<\/Nm>[\s\S]*?<\/Dbtr>/g;
    let match;
    
    // Buscar todos los clientes en el XML
    while ((match = regex.exec(xmlContent)) !== null) {
      if (match[1]) {
        const clientName = match[1].trim();
        const clientNameNormalized = clientName.replace(/,/g, '').trim();
        
        // Verificar si el cliente existe en la lista CLIENTES
        const clientExists = CLIENTES.some(cliente => {
          const nombreClienteNormalizado = cliente.Dbtr.replace(/,/g, '').trim();
          return nombreClienteNormalizado === clientNameNormalized;
        });

        // Si el cliente no existe, marcarlo como no válido y añadirlo a la lista
        if (!clientExists) {
          result.valid = false;
          result.missingClients.push(clientName);
        }
      }
    }

    return result;
  } catch (error) {
    console.error("Error al validar clientes en XML:", error);
    return { valid: false, missingClients: [], error: error.message };
  }
};