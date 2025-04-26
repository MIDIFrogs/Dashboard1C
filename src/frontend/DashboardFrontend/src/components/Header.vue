<template>
  <header class="header">
    <div class="header-content">
      <div class="logo">Dashboard 1C</div>
      <div class="nav-buttons">
        <button @click="synchronizeData" title="Synchronize Data">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 12c0-4.4 3.6-8 8-8 3.4 0 6.3 2.1 7.4 5M22 12c0 4.4-3.6 8-8 8-3.4 0-6.3-2.1-7.4-5"/>
          </svg>
        </button>
        <button @click="openReportPopup" title="Generate Report">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <line x1="10" y1="9" x2="8" y2="9"/>
          </svg>
        </button>
        <button @click="openFilterPopup" title="Filter">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
        </button>
        <button @click="showUploadModal" title="Upload Excel">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </button>
        <button @click="openTableView" title="Open Table View">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="3" y1="9" x2="21" y2="9"/>
            <line x1="3" y1="15" x2="21" y2="15"/>
            <line x1="9" y1="3" x2="9" y2="21"/>
            <line x1="15" y1="3" x2="15" y2="21"/>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Upload Modal -->
    <Teleport to="body">
      <transition name="modal">
        <div v-if="isUploadModalVisible" class="modal-overlay" @click="hideUploadModal">
          <div class="modal-content" @click.stop>
            <div class="modal-header">
              <h2>Upload Excel File</h2>
              <button class="close-button" @click="hideUploadModal">×</button>
            </div>
            <div class="modal-body">
              <div 
                class="upload-area"
                @dragover.prevent="handleDragOver"
                @dragleave.prevent="handleDragLeave"
                @drop.prevent="handleDrop"
                :class="{ 'dragging': isDragging }"
              >
                <div v-if="!selectedFile">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <p>Drag and drop your Excel file here or</p>
                  <input
                    type="file"
                    ref="fileInput"
                    accept=".xlsx,.xls"
                    class="file-input"
                    @change="handleFileSelect"
                  />
                  <button class="browse-button" @click="triggerFileInput">Browse Files</button>
                </div>
                <div v-else class="selected-file">
                  <span>{{ selectedFile.name }}</span>
                  <button class="remove-file" @click="removeFile">×</button>
                </div>
              </div>
              <div class="upload-progress" v-if="uploadProgress > 0 && uploadProgress < 100">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: `${uploadProgress}%` }"></div>
                </div>
                <div class="progress-text">{{ uploadProgress }}%</div>
              </div>
              <div class="upload-actions">
                <button 
                  class="upload-button" 
                  :disabled="!selectedFile || isUploading"
                  @click="uploadFile"
                >
                  {{ isUploading ? 'Uploading...' : 'Upload' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { uploadService } from '@/api/services/uploadService';

const router = useRouter();
const isUploadModalVisible = ref(false);
const isDragging = ref(false);
const selectedFile = ref(null);
const isUploading = ref(false);
const fileInput = ref(null);
const uploadProgress = ref(0);

const synchronizeData = () => {
  // Logic for data synchronization
}

const openReportPopup = () => {
  // Logic to open report generation popup
}

const openFilterPopup = () => {
  // Emit a global event to open the filter popup
  window.dispatchEvent(new CustomEvent('open-filter-popup'));
}

const showUploadModal = () => {
  isUploadModalVisible.value = true;
};

const hideUploadModal = () => {
  isUploadModalVisible.value = false;
  selectedFile.value = null;
  isDragging.value = false;
  isUploading.value = false;
  uploadProgress.value = 0;
};

const handleDragOver = (event) => {
  isDragging.value = true;
  event.dataTransfer.dropEffect = 'copy';
};

const handleDragLeave = () => {
  isDragging.value = false;
};

const handleDrop = (event) => {
  isDragging.value = false;
  const files = event.dataTransfer?.files;
  if (files?.length) {
    handleFile(files[0]);
  }
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = (event) => {
  const files = event.target.files;
  if (files?.length) {
    handleFile(files[0]);
  }
};

const handleFile = (file) => {
  if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel' ||
      file.name.endsWith('.xlsx') || 
      file.name.endsWith('.xls')) {
    selectedFile.value = file;
  } else {
    alert('Please select an Excel file (.xlsx or .xls)');
  }
};

const removeFile = () => {
  selectedFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const uploadFile = async () => {
  if (!selectedFile.value) return;

  isUploading.value = true;
  uploadProgress.value = 0;

  try {
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10;
      }
    }, 300);

    await uploadService.uploadExcelFile(selectedFile.value);
    
    clearInterval(progressInterval);
    uploadProgress.value = 100;
    
    setTimeout(() => {
      hideUploadModal();
      // Emit event to refresh data
      window.dispatchEvent(new CustomEvent('data-updated'));
    }, 500);
    
  } catch (error) {
    console.error('Upload error:', error);
    alert('Failed to upload file. Please try again.');
  } finally {
    isUploading.value = false;
  }
};

const openTableView = () => {
  router.push('/table-view');
};
</script>

<style scoped>
.header {
  width: 100%;
  background: linear-gradient(to right, var(--background-dark), var(--background-light));
  color: var(--text-primary);
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32px;
  width: 100%;
  height: 70px;
  box-sizing: border-box;
  margin: 0 auto;
}

.logo {
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.nav-buttons {
  display: flex;
  gap: 20px;
}

button {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
}

button:hover {
  background-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.2);
}

button svg {
  width: 22px;
  height: 22px;
  transition: transform 0.3s ease;
}

button:hover svg {
  transform: scale(1.1);
}

/* Tooltip styles */
button {
  position: relative;
}

button:hover::after {
  content: attr(title);
  position: absolute;
  bottom: -35px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--background-dark);
  border: var(--card-border);
  color: var(--text-primary);
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: var(--card-border);
}

.modal-header h2 {
  margin: 0;
  color: var(--text-primary);
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-primary);
  transition: color 0.2s;
}

.close-button:hover {
  color: var(--primary-color);
}

.modal-body {
  padding: 1rem;
}

.upload-area {
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.05);
}

.upload-area.dragging {
  border-color: var(--primary-color);
  background: rgba(0, 242, 254, 0.1);
}

.upload-area svg {
  margin-bottom: 1rem;
  color: var(--text-secondary);
}

.upload-area p {
  margin-bottom: 1rem;
  color: var(--text-secondary);
}

.file-input {
  display: none;
}

.browse-button {
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  color: var(--text-primary);
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.browse-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 242, 254, 0.3);
}

.selected-file {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.75rem 1rem;
  border-radius: 4px;
  margin-top: 1rem;
}

.selected-file span {
  word-break: break-all;
  color: var(--text-primary);
}

.remove-file {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0 0.5rem;
  margin-left: 0.5rem;
}

.remove-file:hover {
  color: var(--error-color);
}

.upload-progress {
  margin: 1rem 0;
}

.progress-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  transition: width 0.3s ease;
}

.progress-text {
  text-align: right;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  color: var(--text-secondary);
}

.upload-actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
}

.upload-button {
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  color: var(--text-primary);
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.upload-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 242, 254, 0.3);
}

.upload-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Modal animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Mobile Responsive Styles */
@media (max-width: 768px) {
  .header-content {
    padding: 0 16px;
    height: 60px;
  }

  .nav-buttons {
    gap: 12px;
  }

  button {
    padding: 8px;
    transform: scale(0.9);
  }

  button svg {
    width: 20px;
    height: 20px;
  }

  .logo {
    font-size: 1.4rem;
  }
}

@media (max-width: 480px) {
  .header-content {
    padding: 0 12px;
    height: 50px;
  }

  .nav-buttons {
    gap: 8px;
  }

  button {
    padding: 6px;
    transform: scale(0.85);
  }

  button svg {
    width: 18px;
    height: 18px;
  }

  .logo {
    font-size: 1.2rem;
  }
}
</style> 