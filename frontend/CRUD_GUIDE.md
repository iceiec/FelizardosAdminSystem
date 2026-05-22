# Facility Management System - CRUD Features Guide

## Overview
The facility management system now includes complete CRUD (Create, Read, Update, Delete) functionality for all four modules: Pavilion, Pool, Court, and Maintenance Management.

## Features

### 1. Enhanced Typography
- **Font Family**: Poppins (body text) - Modern, friendly, and highly readable
- **Monospace Font**: Fira Code - For code and technical information
- **Improved Readability**: Better line-height, letter-spacing, and font weights for better user experience

### 2. Reusable Components

#### FormField Component
```tsx
<FormField
  label="Field Name"
  name="fieldName"
  value={formData.fieldName}
  onChange={handleChange}
  placeholder="Enter value..."
  error={errors.fieldName}
  required
/>
```
- Text inputs and textarea support
- Validation error display
- Hints and helper text
- Required field indicators

#### FormSelect Component
```tsx
<FormSelect
  label="Status"
  name="status"
  value={formData.status}
  onChange={handleChange}
  options={[
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ]}
  required
/>
```
- Dropdown selection
- Custom options mapping
- Error handling

#### Modal Components
Each management page has a dedicated modal for Create/Edit operations:
- **PavillionModal**: Add/Edit pavilions
- **PoolModal**: Add/Edit pools
- **CourtModal**: Add/Edit courts
- **MaintenanceModal**: Add/Edit maintenance tasks

#### ConfirmDialog Component
Confirmation dialog for destructive actions with:
- Clear warning messages
- Danger/normal state styling
- Cancel and confirm actions

### 3. Management Pages - CRUD Operations

#### Pavilion Management
- **Create**: Click "Add Pavilion" to open form modal
  - Fields: Name, Capacity, Location, Status
  - Validation: All fields required, capacity must be numeric
  
- **Read**: View pavilion cards with key information
  - Capacity and event statistics
  - Status badge (Active/Maintenance/Inactive)
  - Location display
  
- **Update**: Click "Edit" on any pavilion card
  - Modal pre-fills with existing data
  - Same validation as Create
  
- **Delete**: Click trash icon to delete
  - Confirmation dialog appears
  - Action is irreversible

#### Pool Management
- **Create**: Click "Add Pool" to open form modal
  - Fields: Name, Size, Depth, Capacity, Temperature, Status
  - Validation: All fields required, numeric fields validated
  
- **Read**: View pool cards with:
  - Pool dimensions
  - Current temperature
  - Capacity information
  - Status (Operational/Maintenance/Closed)
  
- **Update**: Click "Edit" to modify pool details
- **Delete**: Confirm deletion of pool record

#### Court Management
- **Create**: Click "Add Court" to open form modal
  - Fields: Name, Surface Type, Status, Next Booking
  - Surface options: Clay, Hard Court, Grass, Synthetic
  
- **Read**: View court cards with:
  - Next booking information
  - Surface type
  - Current status (Available/Booked/Maintenance)
  
- **Update**: Click "Edit" to modify court details
- **Delete**: Confirm deletion with safety dialog

#### Maintenance Management
- **Create**: Click "New Task" to open form modal
  - Fields: Title, Location, Priority, Status, Assignee, Due Date, Description
  - Priority levels: Low, Medium, High
  - Status options: Pending, In Progress, Completed
  
- **Read**: View maintenance tasks with:
  - Priority and status badges
  - Assigned personnel
  - Due date tracking
  - Task statistics dashboard
  
- **Update**: Click "Edit" to modify task details
- **Delete**: Confirm deletion of task

### 4. User Experience Enhancements

#### Search Functionality
- Real-time search filtering across all modules
- Search by name, location, surface type, etc.
- Instant results update

#### Status Filtering (Maintenance)
- Filter tasks by: All, Pending, In Progress, Completed
- Quick status toggle buttons

#### Statistics Dashboard
- Maintenance module shows real-time counts:
  - Total Tasks
  - Pending Tasks
  - In Progress Tasks
  - Completed Tasks

#### Visual Feedback
- Green accent color (#22c55e) throughout
- Hover effects on cards and buttons
- Status badges with appropriate colors
- Loading states during operations
- Toast notifications for all actions

#### Form Validation
- Real-time error display
- Field-level validation
- Clear error messages
- Required field indicators

#### Modal Features
- Smooth slide-in animations
- Backdrop blur effect
- Responsive sizing
- Close button and escape key support
- Loading state during submission

## CSS Classes

### Button Variants
- `.btn-primary`: Green primary button
- `.btn-secondary`: Outlined secondary button
- `.btn-danger`: Red danger button for destructive actions

### Form Elements
- `.form-input`: Styled text input
- `.form-textarea`: Styled textarea
- `.form-select`: Styled dropdown
- `.form-group`: Form field container
- `.form-label`: Field label
- `.form-error`: Error message styling
- `.form-hint`: Helper text styling

### Badge Styling
- `.badge-success`: Green badge
- `.badge-warning`: Yellow badge
- `.badge-danger`: Red badge
- `.badge-info`: Blue badge

## Workflow Examples

### Adding a Pavilion
1. Click "Add Pavilion" button
2. Fill in the form fields
3. Click "Add" to save
4. See toast notification confirming success
5. Pavilion appears in the grid

### Editing a Pool
1. Click "Edit" on the pool card
2. Modal opens with pre-filled data
3. Update desired fields
4. Click "Update"
5. Changes saved immediately

### Deleting a Court
1. Click trash icon on court card
2. Confirmation dialog appears
3. Verify you want to delete
4. Click "Delete" to confirm
5. Court removed from list

## Error Handling
- Form validation prevents invalid submissions
- Clear error messages for each field
- Toast notifications for all operations (success/error)
- Loading states prevent double submissions

## Data Persistence
Note: Current implementation uses in-memory state. For production, integrate with:
- Backend API for data persistence
- Database for long-term storage
- Authentication for user-specific data
