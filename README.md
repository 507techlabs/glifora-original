# Glifora — Editor de letras (versión rediseñada)

Editor web gratuito para diseñar textos con tipografías de distintos estilos, contorno, sombra y exportación PNG/JPG.

## Cómo abrirlo

1. Descomprime el ZIP.
2. Abre `index.html` en Chrome, Edge o Firefox. También puedes abrir la carpeta en Visual Studio Code y usar Live Server.
3. Para descargar fuentes nuevas desde Google Fonts necesitas conexión a internet. La aplicación no requiere cuenta ni suscripción.

## Funciones implementadas

- Página de inicio y tablero de edición rediseñados para escritorio y móvil.
- Biblioteca de 60 familias de fuentes con búsqueda y filtros por estilo.
- Vista previa del texto; selección de fuente, negrita, cursiva, tamaño y espaciado.
- Color de relleno, contorno independiente y sombra independiente con color, opacidad, posición horizontal/vertical y desenfoque.
- PNG con canal alfa (fondo transparente) y JPG con fondo sólido seleccionable.
- Tres escalas de exportación y cuatro plantillas editables.
- Paleta rápida de colores.

## Fuentes y licencias

El prototipo carga las familias desde Google Fonts, por lo que la primera carga de una tipografía requiere internet. Las familias del catálogo de Google Fonts suelen publicarse bajo licencias abiertas como SIL Open Font License (OFL) o Apache, pero **la licencia debe comprobarse por familia antes de redistribuir archivos de fuentes o publicar una versión comercial**. Este prototipo no empaqueta archivos de fuentes: las carga desde Google Fonts.

## Limitaciones conocidas

- Se requiere internet para descargar las familias tipográficas. Los controles y la exportación se ejecutan en el navegador; no se usa una API de pago.
- El comportamiento de negrita/cursiva depende de las variantes disponibles y del navegador; algunas familias pueden usar síntesis tipográfica.
- Los saltos de línea se respetan; el espaciado se aplica carácter por carácter y puede no ser ideal para todas las escrituras.
- Antes de publicar una versión final, conviene probarla en varios móviles, verificar licencias de cada fuente y revisar exportaciones con acentos, textos largos y diferentes navegadores.


## Glifora original (versión de prueba)

Esta entrega conserva la estructura del editor y aplica la apariencia visual aprobada: cabecera violeta/fucsia degradada, banda negra, fondo morado pastel, panel de herramientas morado y vista previa blanca. Se añadió la firma discreta “507 Tesla” al pie.

### Probar en computadora
1. Descomprime el ZIP.
2. Abre `glifora-prototipo/index.html` en un navegador moderno.
3. Se requiere internet para descargar las fuentes desde Google Fonts.

### Probar en un teléfono
El archivo local en la computadora no se abre automáticamente en el móvil. Para probarlo desde el teléfono, publica la carpeta en un alojamiento estático gratuito (por ejemplo GitHub Pages) o sírvela desde la computadora y abre la dirección local desde el mismo Wi-Fi. No se necesita un servicio de pago para probarlo de estas maneras.

La exportación PNG/JPG se genera en el navegador. Comprueba en tu dispositivo la descarga y la transparencia PNG antes de usar el archivo en producción.
