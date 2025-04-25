<template>
  <div class="table-view">
    <div class="table-header">
      <div class="header-left">
        <button class="back-button" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back
        </button>
        <div class="table-actions">
          <button class="action-button" @click="addColumn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Add Column
          </button>
          <button class="action-button" @click="addRow">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Add Row
          </button>
          <button class="action-button" @click="saveChanges">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
            Save Changes
          </button>
          <button class="action-button" @click="exportToExcel">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export Excel
          </button>
        </div>
      </div>
      <div class="search-bar">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search..."
          @input="handleSearch"
        >
      </div>
    </div>

    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
      <p>Loading data...</p>
    </div>

    <div class="table-container" ref="tableContainer" v-else>
      <table class="data-table">
        <thead>
          <tr>
            <th class="row-header"></th>
            <th 
              v-for="(column, index) in columns" 
              :key="column.id"
              class="column-header"
              :class="{ 'selected': selectedColumn === index }"
              @click="selectColumn(index)"
              :style="{ width: column.width ? `${column.width}px` : '150px' }"
            >
              <div class="column-content">
                <input 
                  v-if="editingColumn === index"
                  v-model="column.name"
                  @blur="finishEditingColumn"
                  @keyup.enter="finishEditingColumn"
                  ref="columnInput"
                  class="column-input"
                />
                <span v-else @dblclick="startEditingColumn(index)">
                  {{ column.name }}
                </span>
                <div class="column-actions">
                  <button @click.stop="deleteColumn(index)" class="delete-button">×</button>
                </div>
              </div>
              <div 
                class="resize-handle"
                @mousedown="startResizing(index, $event)"
              ></div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in filteredData" :key="row.id">
            <td class="row-header">
              {{ rowIndex + 1 }}
              <button @click="deleteRow(rowIndex)" class="delete-row">×</button>
            </td>
            <td 
              v-for="(column, colIndex) in columns" 
              :key="column.id"
              :class="{ 'selected': isSelected(rowIndex, colIndex) }"
              @click="selectCell(rowIndex, colIndex)"
              @dblclick="startEditing(rowIndex, colIndex)"
            >
              <div class="cell-content">
                <input 
                  v-if="isEditing(rowIndex, colIndex)"
                  v-model="row[column.id]"
                  @blur="finishEditing"
                  @keyup.enter="finishEditing"
                  ref="cellInput"
                  class="cell-input"
                />
                <span v-else>{{ formatCellValue(row[column.id]) }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isSaving" class="save-overlay">
      <div class="spinner"></div>
      <p>Saving changes...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import { uploadService } from '@/api/services/uploadService';

const router = useRouter();
const tableContainer = ref<HTMLElement | null>(null);
const searchQuery = ref('');
const selectedColumn = ref<number | null>(null);
const editingColumn = ref<number | null>(null);
const columnInput = ref<HTMLInputElement | null>(null);
const cellInput = ref<HTMLInputElement | null>(null);
const isLoading = ref(true);
const isSaving = ref(false);
const hasChanges = ref(false);

interface Column {
  id: string;
  name: string;
  width?: number;
}

interface TableRow {
  id: number;
  [key: string]: any;
}

const columns = ref<Column[]>([
  { id: 'name', name: 'Name' },
  { id: 'category', name: 'Category' },
  { id: 'sales', name: 'Sales' },
  { id: 'target', name: 'Target' },
  { id: 'completion', name: 'Completion' }
]);

const data = ref<TableRow[]>([]);

// Editing state
const editingCell = ref<{ row: number; col: number } | null>(null);
const selectedCell = ref<{ row: number; col: number } | null>(null);

// Track data changes
watch([columns, data], () => {
  hasChanges.value = true;
}, { deep: true });

// Search functionality
const filteredData = computed(() => {
  if (!searchQuery.value) return data.value;
  
  const query = searchQuery.value.toLowerCase();
  return data.value.filter(row => 
    Object.values(row).some(value => 
      String(value).toLowerCase().includes(query)
    )
  );
});

// Format cell value for display
const formatCellValue = (value: any): string => {
  if (value === null || value === undefined) return '';
  
  if (typeof value === 'number') {
    // Check if it might be a currency value
    if (value > 100) {
      return value.toLocaleString('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
    }
    // Check if it might be a percentage
    else if (value <= 1 && value >= 0) {
      return (value * 100).toFixed(1) + '%';
    }
    return value.toString();
  }
  
  return String(value);
};

// Column actions
const addColumn = () => {
  const id = `col${columns.value.length + 1}`;
  columns.value.push({
    id,
    name: `Column ${columns.value.length + 1}`
  });
  // Add empty value for this column to all existing rows
  data.value.forEach(row => {
    row[id] = '';
  });
};

const deleteColumn = (index: number) => {
  const column = columns.value[index];
  if (confirm(`Are you sure you want to delete the column "${column.name}"?`)) {
    columns.value.splice(index, 1);
    // Remove column data from all rows
    data.value.forEach(row => {
      delete row[column.id];
    });
  }
};

const startEditingColumn = (index: number) => {
  editingColumn.value = index;
  nextTick(() => {
    if (columnInput.value) {
      columnInput.value.focus();
    }
  });
};

const finishEditingColumn = () => {
  editingColumn.value = null;
};

// Row actions
const addRow = () => {
  const newRow: TableRow = {
    id: data.value.length + 1
  };
  columns.value.forEach(column => {
    newRow[column.id] = '';
  });
  data.value.push(newRow);
};

const deleteRow = (index: number) => {
  if (confirm('Are you sure you want to delete this row?')) {
    data.value.splice(index, 1);
  }
};

// Cell editing
const startEditing = (row: number, col: number) => {
  editingCell.value = { row, col };
  nextTick(() => {
    if (cellInput.value) {
      cellInput.value.focus();
    }
  });
};

const finishEditing = () => {
  editingCell.value = null;
};

const isEditing = (row: number, col: number) => {
  return editingCell.value?.row === row && editingCell.value?.col === col;
};

// Cell selection
const selectCell = (row: number, col: number) => {
  selectedCell.value = { row, col };
};

const isSelected = (row: number, col: number) => {
  return selectedCell.value?.row === row && selectedCell.value?.col === col;
};

const selectColumn = (index: number) => {
  selectedColumn.value = selectedColumn.value === index ? null : index;
};

// Column resizing
const startResizing = (index: number, event: MouseEvent) => {
  const startX = event.pageX;
  const startWidth = columns.value[index].width || 150;

  const handleMouseMove = (e: MouseEvent) => {
    const diff = e.pageX - startX;
    columns.value[index].width = Math.max(50, startWidth + diff);
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
};

// Navigation
const goBack = () => {
  if (hasChanges.value) {
    if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
      router.back();
    }
  } else {
    router.back();
  }
};

// Save changes
const saveChanges = async () => {
  try {
    isSaving.value = true;
    await uploadService.saveTableData({
      columns: columns.value,
      data: data.value
    });
    isSaving.value = false;
    hasChanges.value = false;
    alert('Changes saved successfully!');
  } catch (error) {
    console.error('Failed to save changes:', error);
    alert('Failed to save changes. Please try again.');
    isSaving.value = false;
  }
};

// Export to Excel
const exportToExcel = async () => {
  try {
    isSaving.value = true;
    const blob = await uploadService.exportToExcel({
      columns: columns.value,
      data: data.value
    });
    
    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `table-data-${new Date().toISOString().slice(0, 10)}.xlsx`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    isSaving.value = false;
  } catch (error) {
    console.error('Failed to export to Excel:', error);
    alert('Failed to export data. Please try again.');
    isSaving.value = false;
  }
};

// Search handler
const handleSearch = () => {
  // The computed property filteredData will automatically update
};

// Load data
onMounted(async () => {
  try {
    isLoading.value = true;
    const tableData = await uploadService.getTableData();
    
    if (tableData.columns && tableData.columns.length > 0) {
      columns.value = tableData.columns;
    }
    
    if (tableData.data && tableData.data.length > 0) {
      data.value = tableData.data;
    }
    
    hasChanges.value = false;
  } catch (error) {
    console.error('Failed to load data:', error);
    // Use default data if API call fails
    data.value = [
      { id: 1, name: 'Product 1', category: 'Tech', sales: 100000, target: 120000, completion: 83 },
      { id: 2, name: 'Product 2', category: 'Tech', sales: 80000, target: 100000, completion: 80 },
      { id: 3, name: 'Product 3', category: 'Finance', sales: 150000, target: 130000, completion: 115 },
      { id: 4, name: 'Product 4', category: 'Healthcare', sales: 75000, target: 90000, completion: 83 },
      { id: 5, name: 'Product 5', category: 'Retail', sales: 200000, target: 180000, completion: 111 },
    ];
  } finally {
    isLoading.value = false;
  }
  
  // Set up beforeunload event to warn about unsaved changes
  window.addEventListener('beforeunload', (e) => {
    if (hasChanges.value) {
      e.preventDefault();
      e.returnValue = '';
      return '';
    }
  });
});
</script>

<style scoped>
.table-view {
  background: linear-gradient(135deg, var(--background-dark), var(--background-light));
  color: var(--text-primary);
  min-height: 100vh;
  padding: 20px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 0 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 32px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.table-actions {
  display: flex;
  gap: 12px;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-button:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.search-bar input {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 10px 16px;
  width: 300px;
  transition: all 0.3s;
}

.search-bar input::placeholder {
  color: var(--text-secondary);
}

.search-bar input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(0, 242, 254, 0.2);
}

.table-container {
  width: 100%;
  overflow-x: auto;
  background: var(--card-background);
  border: var(--card-border);
  border-radius: 12px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.data-table th, .data-table td {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 16px;
  position: relative;
}

.data-table th:last-child, .data-table td:last-child {
  border-right: none;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.column-header {
  background: rgba(0, 0, 0, 0.2);
  color: var(--text-primary);
  text-align: left;
  position: sticky;
  top: 0;
  z-index: 10;
  transition: background-color 0.2s;
  user-select: none;
}

.column-header.selected {
  background: rgba(0, 242, 254, 0.15);
}

.column-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.row-header {
  width: 60px;
  text-align: center;
  background: rgba(0, 0, 0, 0.2);
  color: var(--text-secondary);
  position: sticky;
  left: 0;
  z-index: 5;
}

.column-input, .cell-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
}

.column-input:focus, .cell-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--primary-color);
}

.column-actions {
  display: none;
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
}

.column-header:hover .column-actions {
  display: flex;
}

.delete-button, .delete-row {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 18px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  transition: all 0.2s;
}

.delete-button:hover, .delete-row:hover {
  color: var(--error-color);
  background: rgba(255, 71, 87, 0.1);
}

.delete-row {
  visibility: hidden;
  margin-left: 8px;
}

tr:hover .delete-row {
  visibility: visible;
}

.resize-handle {
  position: absolute;
  top: 0;
  right: 0;
  width: 6px;
  height: 100%;
  cursor: col-resize;
  background: transparent;
  transition: background 0.2s;
}

.resize-handle:hover {
  background: var(--primary-color);
}

td.selected, td:has(.cell-input) {
  background: rgba(0, 242, 254, 0.15);
}

.loading-overlay, .save-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  color: var(--text-primary);
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-left-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style> 