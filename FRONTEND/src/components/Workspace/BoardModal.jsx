import { useState, useEffect } from "react";

const BoardModal = ({ isOpen, onClose, onSubmit, initialData, title }) => {
  const [formData, setFormData] = useState({ name: "", description: "", color: "#6366f1" });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        color: initialData.color || "#6366f1"
      });
    } else {
      setFormData({ name: "", description: "", color: "#6366f1" });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="workspaces-modal-backdrop">
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="workspaces-modal-form">
        <h3>{title}</h3>
        <div className="workspaces-form-group">
          <label>Project Name</label>
          <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
        </div>
        <div className="workspaces-form-group">
          <label>Description</label>
          <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        </div>
        <div className="workspaces-form-group">
          <label>Identification Color</label>
          <div className="workspaces-color-picker-row">
            <input type="color" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="workspaces-color-input" />
            <span className="workspaces-color-hex">{formData.color.toUpperCase()}</span>
          </div>
        </div>
        <div className="workspaces-modal-actions">
          <button type="submit" className="workspaces-btn-submit">Save</button>
          <button type="button" onClick={onClose} className="workspaces-btn-cancel">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default BoardModal;