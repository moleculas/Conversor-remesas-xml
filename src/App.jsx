import { useState } from 'react';
import FileUploader from './components/FileUploader';
import XmlPreview from './components/XmlPreview';
import ProcessingResult from './components/ProcessingResult';
import { useRemesa } from './context/RemesaContext';
import toast from 'react-hot-toast';
import { processRemesaXML } from './utils/xmlProcessor';
import { validateClientsInXml } from './utils/xmlValidator';

function App() {
  const [xmlFile, setXmlFile] = useState(null);
  const [xmlContent, setXmlContent] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedData, setConvertedData] = useState(null);
  const [isFileValid, setIsFileValid] = useState(true);
  const [missingClients, setMissingClients] = useState([]);
  const [resetUploader, setResetUploader] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);

  const { numRemesa, setRemesaFromFileName, diaRemesa, setDiaRemesa } = useRemesa();

  const handleFileUpload = (file, content) => {
    // No permitir la carga de archivos si no se ha seleccionado un día
    if (!diaRemesa) {
      toast.error("Error: Debes seleccionar un día (1 o 4) antes de cargar un archivo", {
        duration: 4000,
        style: {
          border: '1px solid #e53e3e',
          padding: '16px',
        },
      });
      return;
    }

    const extractedNumRemesa = setRemesaFromFileName(file.name);

    if (!extractedNumRemesa) {
      toast.error("Error: El formato del archivo debe ser 'Remesa_R000000.xml'", {
        duration: 4000,
        style: {
          border: '1px solid #e53e3e',
          padding: '16px',
        },
      });

      setIsFileValid(false);
      setXmlFile(file);
      setXmlContent(null);
      setConvertedData(null);
      return;
    }

    // Segunda validación: verificar que todos los clientes estén registrados
    const clientValidation = validateClientsInXml(content);
    if (!clientValidation.valid) {
      setMissingClients(clientValidation.missingClients);
      
      const clientesNoRegistrados = clientValidation.missingClients.join(", ");
      toast.error(`Error: Hay clientes no registrados en la aplicación: ${clientesNoRegistrados}`, {
        duration: 6000,
        style: {
          border: '1px solid #e53e3e',
          padding: '16px',
        },
      });

      setIsFileValid(false);
      setXmlFile(file);
      setXmlContent(null);
      setConvertedData(null);
      return;
    }

    // Si pasó todas las validaciones
    setIsFileValid(true);
    setMissingClients([]);
    setXmlFile(file);
    setXmlContent(content);
    setConvertedData(null);
    setIsProcessed(false);

    toast.success(`Número de remesa detectado: ${extractedNumRemesa}`, {
      duration: 3000,
      style: {
        border: '1px solid #61d345',
        padding: '16px',
      },
    });
  };

  const processXML = () => {
    if (!xmlContent || !numRemesa || !diaRemesa) return;

    setIsProcessing(true);

    try {
      // Procesar el XML utilizando la función de procesamiento (ahora pasando también el día)
      const processedXml = processRemesaXML(xmlContent, numRemesa, diaRemesa);

      setTimeout(() => {
        setConvertedData({
          sample: processedXml
        });
        setIsProcessing(false);
        setIsProcessed(true);

        toast.success(`XML procesado correctamente. Número de remesa: ${numRemesa}, Día: ${diaRemesa}`, {
          duration: 3000,
          style: {
            border: '1px solid #61d345',
            padding: '16px',
          },
        });
      }, 1000);
    } catch (error) {
      setIsProcessing(false);
      toast.error(`Error al procesar el XML: ${error.message}`, {
        duration: 4000,
        style: {
          border: '1px solid #e53e3e',
          padding: '16px',
        },
      });
    }
  };

  const handleDiaChange = (dia) => {
    if (isProcessed) return;
    
    setDiaRemesa(dia);
    toast.success(`Día seleccionado: ${dia}`, {
      duration: 2000,
      style: {
        border: '1px solid #61d345',
        padding: '16px',
      },
    });

    // Resetear el estado si se cambia el día después de haber cargado un archivo
    if (xmlContent) {
      setXmlFile(null);
      setXmlContent(null);
      setConvertedData(null);
      setIsFileValid(true);
      setMissingClients([]);
      
      // Activar el reset del componente FileUploader
      setResetUploader(true);
      // Desactivarlo después de un breve tiempo para evitar reseteos continuos
      setTimeout(() => {
        setResetUploader(false);
      }, 100);
    }
  };
  
  // Función para reiniciar toda la aplicación
  const handleReset = () => {
    setXmlFile(null);
    setXmlContent(null);
    setConvertedData(null);
    setIsFileValid(true);
    setMissingClients([]);
    setIsProcessed(false);
    setDiaRemesa(null);
    
    // Resetear el componente FileUploader
    setResetUploader(true);
    setTimeout(() => {
      setResetUploader(false);
    }, 100);
    
    toast.success('Aplicación reiniciada correctamente', {
      duration: 2000,
      style: {
        border: '1px solid #61d345',
        padding: '16px',
      },
    });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-primary mb-1">
              Conversor de Remesas XML
            </h1>
            <p className="text-lg text-gray-600">
              Convierte archivos XML de remesas según especificaciones requeridas
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-center md:text-right">
            <button
              className={`px-4 py-2 rounded-md transition-colors ${
                isProcessed
                  ? 'bg-primary text-white hover:bg-primary-dark'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              onClick={handleReset}
              disabled={!isProcessed}
            >
              Reiniciar aplicación
            </button>
          </div>
        </header>

        {/* Organizar los dos bloques principales en una fila */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Selector de día */}
          <div className="bg-background-card rounded-lg shadow-card p-4 flex flex-col justify-between h-[140px]">
            <h2 className="text-lg font-semibold text-text-dark mb-3 text-center">
              Selecciona el día de remesa:
            </h2>
            <div className="flex justify-center space-x-4 mb-2">
              <button
                className={`px-6 py-2 rounded-md transition-colors ${
                  diaRemesa === "01"
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                } ${isProcessed ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handleDiaChange("01")}
                disabled={isProcessed}
              >
                Día 1
              </button>
              <button
                className={`px-6 py-2 rounded-md transition-colors ${
                  diaRemesa === "04"
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                } ${isProcessed ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handleDiaChange("04")}
                disabled={isProcessed}
              >
                Día 4
              </button>
            </div>
            {!diaRemesa && !isProcessed && (
              <p className="text-orange-500 text-sm text-center">
                * Debes seleccionar un día antes de cargar un archivo
              </p>
            )}
            {diaRemesa && !isProcessed && (
              <p className="text-sm text-center invisible">
                Espacio reservado para mantener la altura
              </p>
            )}
            {isProcessed && (
              <p className="text-blue-500 text-sm text-center">
                * Día bloqueado, XML ya procesado
              </p>
            )}
          </div>

          {/* Componente para cargar archivos */}
          <div className="h-[140px]">
            <FileUploader
              onFileUpload={handleFileUpload}
              isFileValid={isFileValid}
              disabled={!diaRemesa || isProcessed}
              resetUploader={resetUploader}
              isProcessed={isProcessed}
            />
          </div>
        </div>

        {/* Mensaje de error de clientes no registrados */}
        {missingClients.length > 0 && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded">
            <h3 className="font-bold mb-1">Clientes no registrados:</h3>
            <ul className="list-disc pl-5">
              {missingClients.map((client, index) => (
                <li key={index}>{client}</li>
              ))}
            </ul>
            <p className="mt-2 text-sm">
              Estos clientes deben ser registrados antes de procesar la remesa.
            </p>
          </div>
        )}

        {/* Contenedor de visualización lado a lado */}
        {xmlContent && (
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-full">
              <XmlPreview
                xmlContent={xmlContent}
                onProcess={processXML}
                isProcessing={isProcessing}
                title="Vista previa del XML"
                disableProcessing={isProcessed}
              />
            </div>

            <div className="h-full">
              {convertedData ? (
                <ProcessingResult
                  data={convertedData}
                  title="Resultado del procesamiento"
                  numRemesa={numRemesa} 
                />
              ) : (
                <div className="bg-background-card rounded-lg shadow-card p-6 flex items-center justify-center h-[563px]">
                  <p className="text-gray-500 italic">El resultado se mostrará aquí después del procesamiento</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;