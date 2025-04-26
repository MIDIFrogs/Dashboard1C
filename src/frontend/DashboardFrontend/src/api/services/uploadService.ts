import { apiClient } from './apiClient';

interface TableData {
  columns: Array<{
    id: string;
    name: string;
    width?: number;
  }>;
  data: Array<Record<string, any>>;
}

class UploadService {
  /**
   * Upload an Excel file to the server
   * @param file The Excel file to upload
   * @returns Promise with the response data
   */
  async uploadExcelFile(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * Get table data from the server
   * @returns Promise with table data
   */
  async getTableData(): Promise<TableData> {
    const response = await apiClient.get('/api/table-data');
    return response.data;
  }

  /**
   * Save table data to the server
   * @param data The table data to save
   * @returns Promise with the response data
   */
  async saveTableData(data: TableData): Promise<any> {
    const response = await apiClient.post('/api/table-data', data);
    return response.data;
  }

  /**
   * Export table data as Excel file
   * @param data The table data to export
   * @returns Promise with blob data for the Excel file
   */
  async exportToExcel(data: TableData): Promise<Blob> {
    const response = await apiClient.post('/api/export-excel', data, {
      responseType: 'blob'
    });
    return response.data;
  }
}

// Create and export a singleton instance
export const uploadService = new UploadService(); 