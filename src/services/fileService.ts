import { supabase } from "@/integrations/supabase/client";

export interface GlobalFile {
  id: string;
  name: string;
  size: number;
  uploaded_at: string;
  download_url: string;
  type: string;
  path: string;
  category: string;
  uploaded_by?: string;
}

export type FileCategory = 'initial' | 'department' | 'grouped';

const BUCKET_NAME = 'research-files';

export class FileService {
  // Upload a file to Supabase storage
  static async uploadFile(file: File, category: FileCategory = 'initial'): Promise<GlobalFile> {
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

    // Create file record in database
    const { data: dbFile, error: dbError } = await supabase
      .from('files')
      .insert({
        id: fileId,
        name: file.name,
        size: file.size,
        uploaded_at: new Date().toISOString(),
        download_url: data.publicUrl,
        type: file.type,
        path: filePath,
        category: category,
      })
      .select()
      .single();

    if (dbError) {
      // If database insert fails, clean up the uploaded file
      await supabase.storage.from(BUCKET_NAME).remove([filePath]);
      throw new Error(`Database insert failed: ${dbError.message}`);
    }

    return dbFile as GlobalFile;
  }

  // Get all files from database
  static async getAllFiles(): Promise<GlobalFile[]> {
    try {
      const { data: files, error } = await supabase
        .from('files')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch files: ${error.message}`);
      }

      return files as GlobalFile[];
    } catch (error) {
      console.error('Error loading files:', error);
      return [];
    }
  }

  // Get files by category
  static async getFilesByCategory(category: FileCategory): Promise<GlobalFile[]> {
    try {
      const { data: files, error } = await supabase
        .from('files')
        .select('*')
        .eq('category', category)
        .order('uploaded_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch files for category ${category}: ${error.message}`);
      }

      return files as GlobalFile[];
    } catch (error) {
      console.error(`Error loading files for category ${category}:`, error);
      return [];
    }
  }

  // Delete a file
  static async deleteFile(fileId: string): Promise<void> {
    try {
      // Get file info from database
      const { data: file, error: fetchError } = await supabase
        .from('files')
        .select('path')
        .eq('id', fileId)
        .single();

      if (fetchError || !file) {
        throw new Error('File not found in database');
      }

      // Delete from Supabase storage
      const { error: storageError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([file.path]);

      if (storageError) {
        throw new Error(`Storage deletion failed: ${storageError.message}`);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId);

      if (dbError) {
        throw new Error(`Database deletion failed: ${dbError.message}`);
      }

    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  // Get file download URL
  static async getDownloadUrl(fileId: string): Promise<string | null> {
    try {
      const { data: file, error } = await supabase
        .from('files')
        .select('download_url')
        .eq('id', fileId)
        .single();

      if (error || !file) {
        return null;
      }

      return file.download_url;
    } catch (error) {
      console.error('Error getting download URL:', error);
      return null;
    }
  }

  // Clear all files (admin function)
  static async clearAllFiles(): Promise<void> {
    try {
      // Get all files from database
      const { data: files, error: fetchError } = await supabase
        .from('files')
        .select('path');

      if (fetchError) {
        throw new Error(`Failed to fetch files: ${fetchError.message}`);
      }

      // Delete all files from storage
      if (files && files.length > 0) {
        const filePaths = files.map(file => file.path);
        const { error: storageError } = await supabase.storage
          .from(BUCKET_NAME)
          .remove(filePaths);
        
        if (storageError) {
          throw new Error(`Storage deletion failed: ${storageError.message}`);
        }
      }

      // Clear database
      const { error: dbError } = await supabase
        .from('files')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (dbError) {
        throw new Error(`Database deletion failed: ${dbError.message}`);
      }

    } catch (error) {
      console.error('Error clearing files:', error);
      throw error;
    }
  }
}