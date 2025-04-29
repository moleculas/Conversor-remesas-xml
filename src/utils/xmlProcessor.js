import { CLIENTES } from '../constantes';
import { normalizeClientName } from './xmlValidator';

export const processRemesaXML = (xmlContent, numRemesa, diaRemesa) => {
  try {
    // 0. Reemplazar el tag Document y sus atributos
    let processedXml = xmlContent.replace(
      /<Document[^>]*>/,
      `<Document xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="urn:iso:std:iso:20022:tech:xsd:pain.008.001.02">`
    );

    const currentYear = new Date().getFullYear();
    // Extraer el mes del campo ReqdColltnDt (formato YYYY-MM-DD)    
    const reqdColltnDtMatch = xmlContent.match(/<ReqdColltnDt>(\d{4}-\d{2}-\d{2})<\/ReqdColltnDt>/);
    if (!reqdColltnDtMatch || !reqdColltnDtMatch[1]) {
      throw new Error("No se ha encontrado el registro ReqdColltnDt necesario para configurar la fecha de las facturas");
    }
    // Extraer solo la parte del mes (posiciones 5 y 6 en el formato YYYY-MM-DD)
    const collectionMonth = reqdColltnDtMatch[1].substring(5, 7);

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

    while ((match = regex.exec(processedXml)) !== null) {
      matches.push(match[0]);
    }

    for (let i = 0; i < matches.length; i++) {
      const originalBlock = matches[i];
      let modifiedBlock = originalBlock;
      const formattedIndex = String(index).padStart(3, '0');

      // Modificar PmtId con el formato numRemesa-formattedIndex
      modifiedBlock = modifiedBlock.replace(
        /<PmtId>[\s\S]*?<\/PmtId>/,
        (pmtIdMatch) => {
          const indentMatch = pmtIdMatch.match(/^(\s*)<PmtId>/);
          const indent = indentMatch ? indentMatch[1] : '\t\t\t\t';
          const indentInner = indent + '\t';

          return `${indent}<PmtId>\n` +
            `${indentInner}<InstrId>${numRemesa}-${formattedIndex}</InstrId>\n` +
            `${indentInner}<EndToEndId>${numRemesa}-${formattedIndex}</EndToEndId>\n` +
            `${indent}</PmtId>`;
        }
      );

      // Extraer y normalizar el nombre del deudor
      const dbtrNmRegex = /<Dbtr>[\s\S]*?<Nm>(.*?)<\/Nm>[\s\S]*?<\/Dbtr>/;
      const dbtrNmMatch = modifiedBlock.match(dbtrNmRegex);

      if (dbtrNmMatch && dbtrNmMatch[1]) {
        const deudorNombre = dbtrNmMatch[1].trim();
        const deudorNormalizado = normalizeClientName(deudorNombre);

        // Buscar cliente en la lista con la función de normalización importada
        const clienteEncontrado = CLIENTES.find(cliente => {
          const nombreClienteNormalizado = normalizeClientName(cliente.Dbtr);
          return nombreClienteNormalizado === deudorNormalizado;
        });

        if (clienteEncontrado) {
          // Reemplazar el nombre del cliente con el nombre exacto de la constante
          modifiedBlock = modifiedBlock.replace(
            /<Dbtr>[\s\S]*?<Nm>.*?<\/Nm>[\s\S]*?<\/Dbtr>/,
            (dbtrMatch) => {
              // Preservar la estructura completa del bloque Dbtr reemplazando solo el Nm
              return dbtrMatch.replace(
                /<Nm>.*?<\/Nm>/,
                `<Nm>${clienteEncontrado.Dbtr}</Nm>`
              );
            }
          );

          // Reemplazar MndtRltdInf con la información del cliente encontrado
          modifiedBlock = modifiedBlock.replace(
            /<MndtRltdInf>[\s\S]*?<\/MndtRltdInf>/,
            (mndtMatch) => {
              const indentMatch = mndtMatch.match(/^(\s*)<MndtRltdInf>/);
              const indent = indentMatch ? indentMatch[1] : '\t\t\t\t';
              const indentInner = indent + '\t';

              return `${indent}<MndtRltdInf>\n` +
                `${indentInner}<MndtId>${clienteEncontrado.MndtRltdInf.MndtId}</MndtId>\n` +
                `${indentInner}<DtOfSgntr>${clienteEncontrado.MndtRltdInf.DtOfSgntr}</DtOfSgntr>\n` +
                `${indentInner}<AmdmntInd>false</AmdmntInd>\n` +
                `${indent}</MndtRltdInf>`;
            }
          );
        }
      }

      // Modificar Ustrd con el texto y la fecha formateados
      modifiedBlock = modifiedBlock.replace(
        /<Ustrd>(.*?)<\/Ustrd>/,
        (ustrdMatch, originalContent) => {
          const formattedDate = `${diaRemesa}/${collectionMonth}/${currentYear}`;
          return `<Ustrd>COMINVA,S.L. Factura: ${originalContent.trim()} de: ${formattedDate}</Ustrd>`;
        }
      );

      // Añadir el tag Purp después de DbtrAcct
      modifiedBlock = modifiedBlock.replace(
        /(<\/DbtrAcct>)(\r?\n|\r)(\s*)/g,
        (match, p1, p2, p3) => {
          const indentation = p3 || '\t\t\t\t';
          return p1 + p2 +
            indentation + '<Purp>' + p2 +
            indentation + '\t<Cd>CASH</Cd>' + p2 +
            indentation + '</Purp>';
        }
      );

      // Reemplazar el bloque original con el modificado
      processedXml = processedXml.replace(originalBlock, modifiedBlock);
      index++;
    }

    return processedXml;
  } catch (error) {
    console.error("Error al procesar el XML:", error);
    throw new Error("Error al procesar el XML: " + error.message);
  }
};