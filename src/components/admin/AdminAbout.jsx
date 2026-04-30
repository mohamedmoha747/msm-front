import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminAbout = () => {
  const [about, setAbout] = useState({ title: '', description: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAbout = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/about');
      setAbout({
        title: response.data.title || '',
        description: response.data.description || '',
      });
    } catch (error) {
      console.error('Fetch about failed:', error);
      setMessage('Unable to load about page content.');
    }
    setLoading(false);
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!about.title.trim() || !about.description.trim()) {
      setMessage('Please add both a title and description before saving.');
      return;
    }

    try {
      await axios.put('/api/about', about);
      setMessage('About page content saved successfully.');
    } catch (error) {
      console.error('Save about failed:', error);
      setMessage('Unable to save about page content.');
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-lg shadow-black/20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-400">About page</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Update your core story</h1>
          </div>
          <button
            type="button"
            onClick={fetchAbout}
            className="rounded-2xl bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-700"
          >
            Reload content
          </button>
        </div>
      </div>

      {message && (
        <div className="rounded-3xl border border-sky-500/20 bg-slate-950/80 p-4 text-sky-200">{message}</div>
      )}

      <form onSubmit={handleSave} className="grid gap-6 md:grid-cols-[1fr_360px]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/20">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">Page title</label>
              <input
                type="text"
                value={about.title}
                onChange={(event) => setAbout({ ...about, title: event.target.value })}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500"
                placeholder="Enter about page title"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">Description</label>
              <textarea
                rows="8"
                value={about.description}
                onChange={(event) => setAbout({ ...about, description: event.target.value })}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500"
                placeholder="Write the about page content here"
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Saving...' : 'Save changes'}
              </button>
              <button
                type="button"
                onClick={fetchAbout}
                disabled={loading}
                className="inline-flex justify-center rounded-2xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Loading...' : 'Reset'}
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/20">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Current preview</p>
          <div className="mt-6 space-y-4 rounded-3xl bg-slate-950 p-5">
            <h2 className="text-2xl font-semibold text-white">{about.title || 'Your about title'}</h2>
            <p className="text-slate-400 leading-7">{about.description || 'Your about description will appear here once you save it.'}</p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminAbout;
