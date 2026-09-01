export interface ExcelPreviewRequest {
  blob: Blob
}

export type ExcelPreviewResponse =
  | {
      type: 'success'
      html: string
      truncado: boolean
    }
  | {
      type: 'error'
      message: string
    }
