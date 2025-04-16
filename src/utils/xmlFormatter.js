// src/utils/xmlFormatter.js
export function formatXML(xml) {
    // Asegurémonos de que el XML esté limpio
    xml = xml.trim();
    
    // Usar una biblioteca más robusta o un enfoque más sofisticado
    // Esta es una implementación simplificada
    let formatted = '';
    let indent = '';
    let lastOpenTag = '';
    let inTag = false;
    let inContent = false;
    
    // Recorrer caracter por caracter
    for (let i = 0; i < xml.length; i++) {
      const char = xml.charAt(i);
      
      if (char === '<' && xml.charAt(i+1) !== '/') {
        // Etiqueta de apertura
        if (inContent) {
          formatted += '\n';
          inContent = false;
        }
        if (!inTag) {
          formatted += indent;
          inTag = true;
        }
        formatted += char;
        lastOpenTag = '';
      } 
      else if (char === '<' && xml.charAt(i+1) === '/') {
        // Etiqueta de cierre
        if (inContent) {
          formatted += '\n' + indent;
          inContent = false;
        } else if (lastOpenTag) {
          // No añadir nueva línea si es cierre inmediato de una etiqueta abierta
        } else {
          indent = indent.substring(2); // Reducir indentación
          formatted += '\n' + indent;
        }
        formatted += char;
        inTag = true;
      }
      else if (char === '>') {
        // Fin de etiqueta
        formatted += char;
        if (xml.charAt(i-1) === '/') {
          // Etiqueta autocerrada
          formatted += '\n';
        } else if (xml.charAt(i+1) && xml.charAt(i+1) !== '<') {
          // Hay contenido después de la etiqueta
          inContent = true;
        } else {
          formatted += '\n';
          // Aumentar indentación después de etiqueta de apertura
          if (xml.charAt(i-1) !== '/' && xml.charAt(i+1) !== '<' && xml.charAt(i+1) !== '/') {
            indent += '  ';
          }
        }
        inTag = false;
        lastOpenTag = '>';
      }
      else {
        // Otros caracteres
        formatted += char;
      }
    }
    
    return formatted;
  }