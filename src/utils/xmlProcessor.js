import { CLIENTES } from '../constantes';

// Función para procesar el XML de remesas
export const processRemesaXML = (xmlContent, numRemesa, diaRemesa) => {
  try {
    // 0. Reemplazar el tag Document y sus atributos
    let processedXml = xmlContent.replace(
      /<Document[^>]*>/,
      `<Document xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="urn:iso:std:iso:20022:tech:xsd:pain.008.001.02">`
    );

    // Obtener el año actual con 4 dígitos
    const currentYear = new Date().getFullYear();

    // Obtener el mes actual con 2 dígitos (01-12)
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');

    // Crear el nuevo MsgId combinando el año y el número de remesa
    const newMsgId = `${currentYear}${numRemesa}`;

    // 1. Reemplazar el valor del tag MsgId en el XML
    processedXml = processedXml.replace(
      /<MsgId>.*?<\/MsgId>/,
      `<MsgId>${newMsgId}</MsgId>`
    );

    // 2. Reemplazar el valor del tag Nm dentro de InitgPty en el XML
    processedXml = processedXml.replace(
      /<InitgPty>[\s\S]*?<Nm>.*?<\/Nm>[\s\S]*?<\/InitgPty>/,
      (match) => {
        return match.replace(/<Nm>.*?<\/Nm>/, `<Nm>48013643</Nm>`);
      }
    );

    // 3. Reemplazar el valor del tag PmtInfId con el formato numeroRemesa-001
    processedXml = processedXml.replace(
      /<PmtInfId>.*?<\/PmtInfId>/,
      `<PmtInfId>${numRemesa}-001</PmtInfId>`
    );

    // 4. Eliminar el tag BtchBookg y su contenido, incluyendo espacios en blanco y saltos de línea
    processedXml = processedXml.replace(
      /(\r?\n|\r|\s)*<BtchBookg>.*?<\/BtchBookg>(\r?\n|\r|\s)*/g,
      ""
    );

    // 5. Añadir el tag CtgyPurp después de SeqTp
    processedXml = processedXml.replace(
      /(<SeqTp>RCUR<\/SeqTp>)(\r?\n|\r)(\s*)/g,
      (match, p1, p2, p3) => {
        // p1 es el tag SeqTp completo
        // p2 es el salto de línea
        // p3 es la indentación

        // Calculamos la indentación para CtgyPurp basándonos en la indentación actual
        const indentation = p3 || '\t\t\t\t';

        return p1 + p2 +
          indentation + '<CtgyPurp>' + p2 +
          indentation + '\t<Cd>CASH</Cd>' + p2 +
          indentation + '</CtgyPurp>';
      }
    );

    // 6. Reemplazar el valor del tag Nm dentro de Cdtr en el XML
    processedXml = processedXml.replace(
      /<Cdtr>[\s\S]*?<Nm>.*?<\/Nm>[\s\S]*?<\/Cdtr>/,
      (match) => {
        return match.replace(/<Nm>.*?<\/Nm>/, `<Nm>48013643</Nm>`);
      }
    );

    // 7. Eliminar el tag ChrgBr y su contenido, incluyendo espacios en blanco y saltos de línea
    processedXml = processedXml.replace(
      /(\r?\n|\r|\s)*<ChrgBr>.*?<\/ChrgBr>(\r?\n|\r|\s)*/g,
      ""
    );

    // 8. Procesar cada elemento DrctDbtTxInf
    const regex = /<DrctDbtTxInf>([\s\S]*?)<\/DrctDbtTxInf>/g;
    let match;
    let index = 1;
    const matches = [];

    // Extraer todos los bloques DrctDbtTxInf
    while ((match = regex.exec(processedXml)) !== null) {
      matches.push(match[0]);
    }

    // Procesar cada bloque individualmente
    for (let i = 0; i < matches.length; i++) {
      const originalBlock = matches[i];
      let modifiedBlock = originalBlock;

      // Formatear el número de índice con tres dígitos (001, 002, etc.)
      const formattedIndex = String(index).padStart(3, '0');

      // Cambiar el tag PmtId para incluir InstrId y EndToEndId con el formato especificado
      modifiedBlock = modifiedBlock.replace(
        /<PmtId>[\s\S]*?<\/PmtId>/,
        (pmtIdMatch) => {
          // Extraer la indentación actual
          const indentMatch = pmtIdMatch.match(/^(\s*)<PmtId>/);
          const indent = indentMatch ? indentMatch[1] : '\t\t\t\t';
          const indentInner = indent + '\t';

          // Crear el nuevo tag PmtId con InstrId y EndToEndId
          return `${indent}<PmtId>\n` +
            `${indentInner}<InstrId>${numRemesa}-${formattedIndex}</InstrId>\n` +
            `${indentInner}<EndToEndId>${numRemesa}-${formattedIndex}</EndToEndId>\n` +
            `${indent}</PmtId>`;
        }
      );

      // Extraer el nombre del deudor (Dbtr->Nm) del bloque actual
      const dbtrNmRegex = /<Dbtr>[\s\S]*?<Nm>(.*?)<\/Nm>[\s\S]*?<\/Dbtr>/;
      const dbtrNmMatch = modifiedBlock.match(dbtrNmRegex);

      if (dbtrNmMatch && dbtrNmMatch[1]) {
        // Normalizar el nombre del deudor: eliminar comas y normalizar espacios
        const deudorNombre = dbtrNmMatch[1].trim();
        const deudorNormalizado = deudorNombre.replace(/,/g, '').trim();

        // Buscar el cliente correspondiente en la constante CLIENTES
        const clienteEncontrado = CLIENTES.find(cliente => {
          // Normalizar el nombre del cliente de la misma manera
          const nombreClienteNormalizado = cliente.Dbtr.replace(/,/g, '').trim();
          return nombreClienteNormalizado === deudorNormalizado;
        });

        if (clienteEncontrado) {
          // Reemplazar el MndtRltdInf con los datos del cliente encontrado
          modifiedBlock = modifiedBlock.replace(
            /<MndtRltdInf>[\s\S]*?<\/MndtRltdInf>/,
            (mndtMatch) => {
              // Extraer la indentación actual
              const indentMatch = mndtMatch.match(/^(\s*)<MndtRltdInf>/);
              const indent = indentMatch ? indentMatch[1] : '\t\t\t\t';
              const indentInner = indent + '\t';

              // Crear el nuevo tag MndtRltdInf con los datos del cliente
              return `${indent}<MndtRltdInf>\n` +
                `${indentInner}<MndtId>${clienteEncontrado.MndtRltdInf.MndtId}</MndtId>\n` +
                `${indentInner}<DtOfSgntr>${clienteEncontrado.MndtRltdInf.DtOfSgntr}</DtOfSgntr>\n` +
                `${indent}</MndtRltdInf>`;
            }
          );
        } else {
          console.warn(`No se encontró cliente para el deudor: ${deudorNombre}`);
        }
      }

      // Modificar el tag Ustrd con el formato especificado
      modifiedBlock = modifiedBlock.replace(
        /<Ustrd>(.*?)<\/Ustrd>/,
        (ustrdMatch, originalContent) => {
          // Formatear la fecha: diaRemesa/mesActual/añoActual
          const formattedDate = `${diaRemesa}/${currentMonth}/${currentYear}`;

          // Crear el nuevo contenido
          return `<Ustrd>COMINVA,S.L. Factura: ${originalContent.trim()} de: ${formattedDate}</Ustrd>`;
        }
      );

      // Reemplazar el bloque original con el bloque modificado en el XML
      processedXml = processedXml.replace(originalBlock, modifiedBlock);

      index++;
    }

    return processedXml;
  } catch (error) {
    console.error("Error al procesar el XML:", error);
    throw new Error("Error al procesar el XML: " + error.message);
  }
};