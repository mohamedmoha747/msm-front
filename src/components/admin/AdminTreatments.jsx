import React, { useEffect, useState } from 'react';
import axios from 'axios';

const initialForm = { title: '', description: '', imageUrl: '' };

const AdminTreatments = () => {
  const [treatments, setTreatments] = useState([]);
  const [formValues, setFormValues] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTreatments = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/treatments');
      setTreatments(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Fetch treatments failed:', error);
      setFeedback('Unable to load treatments.');
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormValues(initialForm);
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormValues({ title: item.title, description: item.description, imageUrl: item.imageUrl || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this treatment?')) return;
    try {
      await axios.delete(`/api/treatments/${id}`);
      setFeedback('Treatment deleted successfully.');
      fetchTreatments();
    } catch (error) {
      console.error('Delete treatment failed:', error);
      setFeedback('Unable to delete treatment.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formValues.title.trim() || !formValues.description.trim()) {
      setFeedback('Please fill title and description before saving.');
      return;
    }

    try {
      if (editingId) {
        await axios.put(`/api/treatments/${editingId}`, formValues);
        setFeedback('Treatment updated successfully.');
      } else {
        await axios.post('/api/treatments', formValues);
        setFeedback('New treatment added successfully.');
      }

      resetForm();
      fetchTreatments();
    } catch (error) {
      console.error('Save treatment failed:', error);
      setFeedback('Unable to save treatment.');
    }
  };

  useEffect(() => {
    fetchTreatments();
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/20">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Treatments</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Add or edit services</h1>
          <p className="mt-2 text-slate-400">Create new treatments with title, description, and image URL. Edit existing entries quickly.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-200">Title</label>
            <input
              type="text"
              value={formValues.title}
              onChange={(event) => setFormValues({ ...formValues, title: event.target.value })}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500"
              placeholder="Service title"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-200">Description</label>
            <textarea
              value={formValues.description}
              onChange={(event) => setFormValues({ ...formValues, description: event.target.value })}
              rows="5"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500"
              placeholder="Rich service description"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-200">Image URL</label>
            <input
              type="url"
              value={formValues.imageUrl}
              onChange={(event) => setFormValues({ ...formValues, imageUrl: event.target.value })}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {feedback && <div className="rounded-2xl bg-slate-950 px-4 py-3 text-sm text-slate-200">{feedback}</div>}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="inline-flex justify-center rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
            >
              {editingId ? 'Save changes' : 'Add treatment'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex justify-center rounded-2xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Treatment list</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Existing services</h2>
            </div>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-400">{loading ? 'Refreshing...' : `${treatments.length} total`}</span>
          </div>
        </div>

        <div className="space-y-4">
          {treatments.length === 0 && !loading && (
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-slate-400">No treatments have been added yet.</div>
          )}

          {treatments.map((item) => (
            <article key={item._id} className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/20">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-3xl bg-slate-800 flex items-center justify-center text-sky-400 text-lg font-bold">
                      {item.title?.charAt(0)?.toUpperCase() || 'T'}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                      <p className="text-sm text-slate-400">{item.description.slice(0, 120)}{item.description.length > 120 ? '...' : ''}</p>
                    </div>
                  </div>
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.title} className="h-48 w-full rounded-3xl object-cover border border-slate-800" />
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="rounded-2xl bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-700"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item._id)}
                    className="rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminTreatments;
