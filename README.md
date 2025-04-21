# Conversor de Remesas XML

Esta aplicación web está diseñada para procesar, validar y convertir archivos XML relacionados con remesas bancarias. Construida con React y Vite, ofrece una interfaz moderna y eficiente para gestionar archivos XML, asegurando que cumplan con los estándares requeridos.

## Características principales

- **Carga de archivos XML**: Permite a los usuarios cargar archivos XML mediante arrastrar y soltar o seleccionándolos desde su dispositivo.
- **Validación de XML**: Verifica que los archivos cargados cumplan con los formatos y esquemas esperados.
- **Procesamiento de remesas**: Modifica y procesa los archivos XML para adaptarlos a los requisitos específicos de remesas bancarias.
- **Vista previa del XML**: Muestra el contenido del archivo XML de manera formateada y resaltada para facilitar su lectura.
- **Descarga de resultados**: Permite descargar los archivos XML procesados directamente desde la aplicación.

## Tecnologías utilizadas

- **Framework**: [React](https://reactjs.org/) - Biblioteca de JavaScript para construir interfaces de usuario.
- **Empaquetador**: [Vite](https://vitejs.dev/) - Herramienta de desarrollo rápida y ligera.
- **Librerías adicionales**:
  - [Prettify-XML](https://www.npmjs.com/package/prettify-xml): Para formatear el contenido XML.
  - [PrismJS](https://prismjs.com/): Para resaltar la sintaxis del XML en la vista previa.
  - [Tailwind CSS](https://tailwindcss.com/): Para estilos rápidos y consistentes.

## Estructura del proyecto

El proyecto está organizado de la siguiente manera:

```
src/
├── App.jsx                # Componente principal de la aplicación
├── index.css              # Estilos globales
├── main.jsx               # Punto de entrada de la aplicación
├── assets/                # Recursos estáticos como imágenes
├── components/            # Componentes reutilizables
│   ├── FileUploader.jsx   # Componente para cargar archivos XML
│   ├── ProcessingResult.jsx # Componente para mostrar resultados procesados
│   └── XmlPreview.jsx     # Componente para vista previa del XML
├── constantes/            # Constantes globales
├── context/               # Contexto para manejar el estado global
│   └── RemesaContext.jsx  # Contexto específico para remesas
├── utils/                 # Utilidades y funciones auxiliares
│   ├── xmlFormatter.js    # Formateo de XML
│   ├── xmlProcessor.js    # Procesamiento de XML
│   └── xmlValidator.js    # Validación de XML
```

## Componentes principales

### FileUploader
Permite a los usuarios cargar archivos XML mediante arrastrar y soltar o seleccionándolos desde su dispositivo. Valida el tipo de archivo antes de procesarlo.

### XmlPreview
Muestra el contenido del archivo XML cargado de manera formateada y resaltada, utilizando PrismJS para el resaltado de sintaxis.

### ProcessingResult
Muestra el resultado del procesamiento del archivo XML, permitiendo al usuario descargar el archivo procesado.

## Instalación y configuración

1. Clona este repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   ```

2. Navega al directorio del proyecto:
   ```bash
   cd conversor-remesas-xml
   ```

3. Instala las dependencias:
   ```bash
   npm install
   ```

4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

5. Abre la aplicación en tu navegador en `http://localhost:5173`.

## Scripts disponibles

- `npm run dev`: Inicia el servidor de desarrollo.
- `npm run build`: Genera una versión optimizada para producción.
- `npm run preview`: Previsualiza la versión de producción.

## Contribuciones

Las contribuciones son bienvenidas. Si encuentras un problema o tienes una idea para mejorar la aplicación, por favor abre un issue o envía un pull request.

## Licencia

Este proyecto está licenciado bajo la [MIT License](https://opensource.org/licenses/MIT).
