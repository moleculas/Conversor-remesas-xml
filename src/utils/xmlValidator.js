import { CLIENTES } from '../constantes';

export const validateClientsInXml = (xmlContent) => {
  try {
    const result = {
      valid: true,
      missingClients: []
    };

    const regex = /<Dbtr>[\s\S]*?<Nm>(.*?)<\/Nm>[\s\S]*?<\/Dbtr>/g;
    let match;

    while ((match = regex.exec(xmlContent)) !== null) {
      if (match[1]) {
        const clientName = match[1].trim();
        const clientNameNormalized = clientName.replace(/,/g, '').trim();

        const clientExists = CLIENTES.some(cliente => {
          const nombreClienteNormalizado = cliente.Dbtr.replace(/,/g, '').trim();
          return nombreClienteNormalizado === clientNameNormalized;
        });

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