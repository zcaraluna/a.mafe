import sharp from 'sharp'

// Tipos de archivo permitidos
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp'
]

export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
]

// Tamaños máximos (en bytes)
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
export const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024 // 10MB

// Dimensiones máximas de imagen
export const MAX_IMAGE_DIMENSIONS = {
  width: 1920,
  height: 1920
}

// Interfaz para el resultado de validación
export interface ValidationResult {
  isValid: boolean
  error?: string
  processedBuffer?: Buffer
  metadata?: {
    width?: number
    height?: number
    format?: string
    size?: number
  }
}

/**
 * Valida y procesa una imagen de manera segura
 */
export async function validateAndProcessImage(file: File): Promise<ValidationResult> {
  try {
    // Validar tipo de archivo
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: 'Tipo de archivo no permitido. Solo se permiten imágenes JPEG, PNG y WebP.'
      }
    }

    // Validar tamaño
    if (file.size > MAX_IMAGE_SIZE) {
      return {
        isValid: false,
        error: `El archivo es demasiado grande. Tamaño máximo: ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`
      }
    }

    // Convertir a buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Validar contenido real del archivo usando Sharp
    let metadata
    try {
      metadata = await sharp(buffer).metadata()
    } catch (error) {
      return {
        isValid: false,
        error: 'El archivo no es una imagen válida o está corrupto.'
      }
    }

    // Validar dimensiones
    if (!metadata.width || !metadata.height) {
      return {
        isValid: false,
        error: 'No se pudieron obtener las dimensiones de la imagen.'
      }
    }

    if (metadata.width > MAX_IMAGE_DIMENSIONS.width || metadata.height > MAX_IMAGE_DIMENSIONS.height) {
      return {
        isValid: false,
        error: `Las dimensiones de la imagen son demasiado grandes. Máximo: ${MAX_IMAGE_DIMENSIONS.width}x${MAX_IMAGE_DIMENSIONS.height}px`
      }
    }

    // Procesar y optimizar la imagen
    const processedBuffer = await sharp(buffer)
      .resize(MAX_IMAGE_DIMENSIONS.width, MAX_IMAGE_DIMENSIONS.height, { 
        fit: 'inside', 
        withoutEnlargement: true 
      })
      .jpeg({ 
        quality: 85,
        progressive: true,
        mozjpeg: true
      })
      .toBuffer()

    return {
      isValid: true,
      processedBuffer,
      metadata: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: processedBuffer.length
      }
    }

  } catch (error) {
    return {
      isValid: false,
      error: 'Error al procesar la imagen. Intente con otro archivo.'
    }
  }
}

/**
 * Valida un documento de manera segura
 */
export function validateDocument(file: File): ValidationResult {
  // Validar tipo de archivo
  if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'Tipo de documento no permitido. Solo se permiten PDF, Word y archivos de texto.'
    }
  }

  // Validar tamaño
  if (file.size > MAX_DOCUMENT_SIZE) {
    return {
      isValid: false,
      error: `El documento es demasiado grande. Tamaño máximo: ${MAX_DOCUMENT_SIZE / (1024 * 1024)}MB`
    }
  }

  return {
    isValid: true,
    metadata: {
      size: file.size
    }
  }
}

/**
 * Genera un nombre de archivo seguro
 */
export function generateSafeFileName(originalName: string, prefix: string = ''): string {
  const timestamp = Date.now()
  const randomSuffix = Math.random().toString(36).substring(2, 8)
  const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg'
  
  // Limpiar el nombre original de caracteres peligrosos
  const cleanName = originalName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .substring(0, 50) // Limitar longitud
  
  return `${prefix}${timestamp}_${randomSuffix}_${cleanName}.${extension}`
}

/**
 * Valida la extensión del archivo
 */
export function validateFileExtension(filename: string, allowedExtensions: string[]): boolean {
  const extension = filename.split('.').pop()?.toLowerCase()
  return extension ? allowedExtensions.includes(extension) : false
}

/**
 * Obtiene la extensión de un archivo
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || ''
}

/**
 * Verifica si un archivo es una imagen basándose en su extensión
 */
export function isImageFile(filename: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif']
  return validateFileExtension(filename, imageExtensions)
}

/**
 * Verifica si un archivo es un documento basándose en su extensión
 */
export function isDocumentFile(filename: string): boolean {
  const documentExtensions = ['pdf', 'doc', 'docx', 'txt']
  return validateFileExtension(filename, documentExtensions)
} 