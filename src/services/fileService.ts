import { supabase } from "@/integrations/supabase/client";

export interface GlobalFile {
  id: string;
  name: string;
  size: number;
  uploaded_at: string;
  download_url: string;
  type: string;
  uploaded_by?: string;
}

const BUCKET_NAME = 'research-files';

export class FileService {
  // Upload a file to Supabase storage
  static async uploadFile(file: File): Promise<GlobalFile> {
    const fileId = crypto.randomUUID();
    const filePath = `${fileId}-${file.name}`;

    // Upload to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath, { download: true });

    // Create file record
    const globalFile: GlobalFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      uploaded_at: new Date().toISOString(),
      download_url: data.publicUrl,
      type: file.type,
    };

    // Store file metadata in a simple way (using localStorage as a simple database)
    // In a real app, you'd use a proper database table
    const existingFiles = this.getStoredFiles();
    const updatedFiles = [globalFile, ...existingFiles];
    localStorage.setItem('global_files', JSON.stringify(updatedFiles));

    return globalFile;
  }

  // Get all files from storage
  static async getAllFiles(): Promise<GlobalFile[]> {
    try {
      // First try to get from localStorage (our simple storage)
      const storedFiles = this.getStoredFiles();
      
      // Verify files still exist in Supabase storage
      const verifiedFiles = [];
      for (const file of storedFiles) {
        try {
          // Check if file exists in storage
          const fileName = file.download_url.split('/').pop()?.split('?')[0];
          if (fileName) {
            const { data, error } = await supabase.storage
              .from(BUCKET_NAME)
              .list('', {
                search: fileName
              });
            
            if (!error && data && data.length > 0) {
              verifiedFiles.push(file);
            }
          }
        } catch (error) {
          console.warn(`File ${file.name} verification failed:`, error);
        }
      }
      
      // Update localStorage with verified files
      localStorage.setItem('global_files', JSON.stringify(verifiedFiles));
      
      return verifiedFiles;
    } catch (error) {
      console.error('Error loading files:', error);
      return this.getStoredFiles(); // Fallback to localStorage
    }
  }

  // Get files from localStorage
  private static getStoredFiles(): GlobalFile[] {
    try {
      const stored = localStorage.getItem('global_files');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error parsing stored files:', error);
      return [];
    }
  }

  // Delete a file
  static async deleteFile(fileId: string): Promise<void> {
    try {
      // Get file info
      const files = this.getStoredFiles();
      const file = files.find(f => f.id === fileId);
      
      if (!file) {
        throw new Error('File not found');
      }

      // Extract file path from URL
      const filePath = file.download_url.split('/').pop()?.split('?')[0];
      if (filePath) {
        // Delete from Supabase storage
        const { error } = await supabase.storage
          .from(BUCKET_NAME)
          .remove([filePath]);
        
        if (error) {
          console.warn('Error deleting from storage:', error);
        }
      }

      // Remove from localStorage
      const updatedFiles = files.filter(f => f.id !== fileId);
      localStorage.setItem('global_files', JSON.stringify(updatedFiles));
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  // Get file download URL
  static getDownloadUrl(fileId: string): string | null {
    const files = this.getStoredFiles();
    const file = files.find(f => f.id === fileId);
    return file?.download_url || null;
  }

  // Clear all files (admin function)
  static async clearAllFiles(): Promise<void> {
    try {
      const files = this.getStoredFiles();
      
      // Delete all files from storage
      const filePaths = files.map(file => {
        const fileName = file.download_url.split('/').pop()?.split('?')[0];
        return fileName || '';
      }).filter(Boolean);

      if (filePaths.length > 0) {
        const { error } = await supabase.storage
          .from(BUCKET_NAME)
          .remove(filePaths);
        
        if (error) {
          console.warn('Error clearing storage:', error);
        }
      }

      // Clear localStorage
      localStorage.removeItem('global_files');
    } catch (error) {
      console.error('Error clearing files:', error);
      throw error;
    }
  }
}
