import { SafeUrl } from '@angular/platform-browser';

export interface ElementReportInterface {
  id: string;
  active: boolean;

  type: string;
  description?: string;
  isSelected: boolean;
  isError: boolean;
  zIndex: number;

  // Valor del Elemento
  value?: string | SafeUrl;

  // imamgen base 64
  imageBase64?: string;

  // url de la imagen
  imageUrl?: string;
  imageTemp?: any;
  imageCrop?: any;

  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };

  // Propiedades de la Fuente
  fontProperties?: {
    // Fuente del Elemento
    font?: string;
    // Tamaño de la Fuente
    fontSize?: number;
    // Color del Texto
    color?: string;
    // Alineación del Texto Horizontal
    alignH?: string;
    // Alineación del Texto Vertical
    alignV?: string;
    // Negrita del Texto
    bold?: boolean;
    // Cursiva del Texto
    italic?: boolean;
    // Subrayado del Texto
    underline?: boolean;
    // Tachado del Texto
    strike?: boolean;
    // Interlineado
    lineHeight?: number;
    // Rotación del Texto
    rotate?: number;
  };

  // saber si el elemento tiene borde
  hasEdges?: boolean;

  // Bordes del Elemento
  edges?: {
    // Bordes del Elemento - Izquierdo
    left: number;
    // Color del Borde Izquierdo
    leftColor: string;
    // Bordes del Elemento - Derecho
    right: number;
    // Color del Borde Derecho
    rightColor: string;
    // Bordes del Elemento - Superior
    top: number;
    // Color del Borde Superior
    topColor: string;
    // Bordes del Elemento - Inferior
    bottom: number;
    // Color del Borde Inferior
    bottomColor: string;
  };
}
