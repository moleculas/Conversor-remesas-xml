import { CLIENTES } from '../constantes';

// Función para normalizar nombres de clientes - ahora exportada
export const normalizeClientName = (name) => {
  return name
    .toUpperCase()                       // Convertir a mayúsculas
    .replace(/Ñ/g, 'N')                  // Reemplazar Ñ por N
    .replace(/[,\.;:]/g, ' ')            // Reemplazar puntuación por espacios
    .replace(/[\`\'\´]/g, '')            // Eliminar comillas y acentos invertidos (O`FELAN → OFELAN)
    .replace(/[ªº]/g, '')                // Eliminar superíndices (Mª → M)
    .replace(/\s+/g, ' ')                // Reemplazar múltiples espacios por uno solo
    .replace(/[ÁÀÄÂÃ]/g, 'A')            // Normalizar caracteres acentuados
    .replace(/[ÉÈËÊ]/g, 'E')
    .replace(/[ÍÌÏÎ]/g, 'I')
    .replace(/[ÓÒÖÔ]/g, 'O')
    .replace(/[ÚÙÜÛ]/g, 'U')
    .replace(/\d+$/, '')                 // Eliminar números al final del string (como "294")
    .trim();                             // Eliminar espacios al inicio y final
};


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
        
        // Normalizar el nombre del cliente eliminando caracteres no alfanuméricos
        // excepto los separadores como / y convirtiendo a mayúsculas
        const clientNameNormalized = normalizeClientName(clientName);
        
        const clientExists = CLIENTES.some(cliente => {
          const nombreClienteNormalizado = normalizeClientName(cliente.Dbtr);
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